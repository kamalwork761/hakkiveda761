import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import compression from 'compression';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { getDb, getStoreValue, setStoreValue, getAllStoreData, getPublicStoreData, PUBLIC_STORE_ALLOWLIST } from './src/server/db';
import {
  isShiprocketConfigured,
  checkServiceability,
  estimateShippingRate,
  createShiprocketOrder,
  generateAwb,
  schedulePickup,
  trackShipment,
  downloadLabel,
  downloadInvoice,
} from './src/server/shiprocketService';
import { INITIAL_HERO_SLIDES, INITIAL_PRODUCTS, INITIAL_CURRENCIES } from './src/data/initialData';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';

dotenv.config();

// Ensure persistent uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB file limit for high-resolution images & hero videos
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'application/pdf',
    ];

    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      allowedMimeTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Unsupported file format. Allowed formats: images (JPG, PNG, WEBP, GIF), videos (MP4, WEBM, OGG, MOV), and PDF.'
        )
      );
    }
  },
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Initialize SQLite Database at startup
  await getDb();

  // Enable HTTP response compression (gzip/deflate)
  app.use(compression());

  // Security Headers Middleware
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use(cookieParser());
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // ==========================================
  // ADMIN AUTHENTICATION & SECURITY MIDDLEWARE
  // ==========================================
  function resolveAdminSessionSecret(): string {
    const isProduction = process.env.NODE_ENV === 'production';
    const providedSecret = process.env.ADMIN_SESSION_SECRET?.trim();

    if (isProduction) {
      if (!providedSecret) {
        throw new Error(
          '[Security Configuration Error] ADMIN_SESSION_SECRET environment variable must be configured in production.'
        );
      }
      if (providedSecret.length < 32) {
        throw new Error(
          '[Security Configuration Error] ADMIN_SESSION_SECRET in production must be at least 32 characters long (prefer a 64-character hex string).'
        );
      }
      // Check for trivially weak repeated strings
      const isWeakRepeated = /^(.)\1+$/.test(providedSecret);
      const isTriviallySimple = [
        '12345678901234567890123456789012',
        'abcdefghijklmnopqrstuvwxyz123456',
        '00000000000000000000000000000000',
      ].includes(providedSecret.toLowerCase());
      if (isWeakRepeated || isTriviallySimple) {
        throw new Error(
          '[Security Configuration Error] ADMIN_SESSION_SECRET is too weak. Please provide a high-entropy secret.'
        );
      }
      return providedSecret;
    }

    // Development mode
    if (providedSecret && providedSecret.length >= 16) {
      return providedSecret;
    }

    console.warn('[Security] ADMIN_SESSION_SECRET not set. Using temporary development admin session secret. Sessions will reset after server restart.');
    return crypto.randomBytes(32).toString('hex');
  }

  const ADMIN_SESSION_SECRET = resolveAdminSessionSecret();
  const ADMIN_TOKEN_COOKIE = 'hakkiveda_admin_token';
  const ADMIN_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  interface AdminTokenPayload {
    email: string;
    role: 'admin';
    iat: number;
    exp: number;
  }

  function createAdminToken(email: string): string {
    const now = Date.now();
    const payload: AdminTokenPayload = {
      email: email.toLowerCase(),
      role: 'admin',
      iat: now,
      exp: now + ADMIN_TOKEN_EXPIRY_MS,
    };
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(payloadB64).digest('base64url');
    return `${payloadB64}.${signature}`;
  }

  function verifyAdminToken(token: string): AdminTokenPayload | null {
    try {
      if (!token || typeof token !== 'string') return null;
      const parts = token.split('.');
      if (parts.length !== 2) return null;
      const [payloadB64, signature] = parts;
      const expectedSignature = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(payloadB64).digest('base64url');

      if (
        signature.length !== expectedSignature.length ||
        !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
      ) {
        return null;
      }

      const payload: AdminTokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      if (!payload || payload.role !== 'admin' || !payload.exp || Date.now() > payload.exp) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }

  function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    let token = req.cookies?.[ADMIN_TOKEN_COOKIE];
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
      }
    }
    if (!token && typeof req.headers['x-admin-token'] === 'string') {
      token = req.headers['x-admin-token'];
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Admin session required.' });
    }

    const payload = verifyAdminToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired admin session.' });
    }

    (req as any).admin = payload;
    next();
  }

  function requireAdminForPrivateKey(req: express.Request, res: express.Response, next: express.NextFunction) {
    const key = req.params.key;
    if (PUBLIC_STORE_ALLOWLIST.includes(key)) {
      return next();
    }
    return requireAdmin(req, res, next);
  }

  // ==========================================
  // CUSTOMER AUTHENTICATION & SECURITY
  // ==========================================
  function resolveCustomerSessionSecret(): string {
    const isProduction = process.env.NODE_ENV === 'production';
    const providedSecret = process.env.CUSTOMER_SESSION_SECRET?.trim();

    if (isProduction) {
      if (!providedSecret) {
        throw new Error(
          '[Security Configuration Error] CUSTOMER_SESSION_SECRET environment variable must be configured in production.'
        );
      }
      if (providedSecret.length < 32) {
        throw new Error(
          '[Security Configuration Error] CUSTOMER_SESSION_SECRET in production must be at least 32 characters long (prefer a 64-character hex string).'
        );
      }
      const trivialSecrets = [
        'default',
        'secret',
        'password',
        '12345678',
        'customer_session_secret',
        'replace_this_with_a_secure_secret',
        'hakkiveda_customer_secret_key_2026',
      ];
      if (trivialSecrets.includes(providedSecret.toLowerCase())) {
        throw new Error(
          '[Security Configuration Error] CUSTOMER_SESSION_SECRET is using a known trivial/insecure placeholder. Provide a high-entropy secret in production.'
        );
      }
      return providedSecret;
    }

    if (providedSecret && providedSecret.length >= 16) {
      return providedSecret;
    }

    const ephemeralDevSecret = crypto.randomBytes(32).toString('hex');
    console.warn(
      '[Security] CUSTOMER_SESSION_SECRET not set. Using temporary development customer session secret. Sessions will reset after server restart.'
    );
    return ephemeralDevSecret;
  }

  const CUSTOMER_SESSION_SECRET = resolveCustomerSessionSecret();
  const CUSTOMER_TOKEN_COOKIE = 'hakkiveda_customer_token';
  const CUSTOMER_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days validity

  interface CustomerTokenPayload {
    id: string;
    email: string;
    role: 'customer';
    iat: number;
    exp: number;
  }

  function createCustomerToken(customerId: string, email: string): string {
    const now = Date.now();
    const payload: CustomerTokenPayload = {
      id: customerId,
      email: email.toLowerCase().trim(),
      role: 'customer',
      iat: now,
      exp: now + CUSTOMER_TOKEN_EXPIRY_MS,
    };

    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', CUSTOMER_SESSION_SECRET)
      .update(payloadB64)
      .digest('base64url');

    return `${payloadB64}.${signature}`;
  }

  function verifyCustomerToken(token: string): CustomerTokenPayload | null {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    if (!payloadB64 || !signature) return null;

    try {
      const expectedSignature = crypto
        .createHmac('sha256', CUSTOMER_SESSION_SECRET)
        .update(payloadB64)
        .digest('base64url');

      const expectedBuf = Buffer.from(expectedSignature);
      const actualBuf = Buffer.from(signature);

      if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
        return null;
      }

      const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
      const payload: CustomerTokenPayload = JSON.parse(payloadJson);

      if (payload.role !== 'customer' || typeof payload.id !== 'string' || typeof payload.email !== 'string') {
        return null;
      }

      if (Date.now() > payload.exp) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  function generateSecureTempPassword(): string {
    const bytes = crypto.randomBytes(8);
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 32 unambiguous characters
    let result = 'HKV-';
    for (let i = 0; i < 8; i++) {
      result += chars[bytes[i] % chars.length];
      if (i === 3) result += '-';
    }
    return result;
  }

  function sanitizeCustomer(customer: any) {
    if (!customer) return null;
    const { passwordBcrypt, ...safe } = customer;
    return {
      id: safe.id,
      name: safe.name || '',
      email: safe.email || '',
      phone: safe.phone || '',
      avatar: safe.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      addresses: Array.isArray(safe.addresses) ? safe.addresses : [],
      savedPayments: Array.isArray(safe.savedPayments) ? safe.savedPayments : [],
      isAdmin: false,
      status: safe.status || 'ACTIVE',
      createdAt: safe.createdAt || new Date().toISOString().split('T')[0],
      lastLogin: safe.lastLogin || '',
      loyaltyPoints: typeof safe.loyaltyPoints === 'number' ? safe.loyaltyPoints : 100,
      referralCode: safe.referralCode || `HAKKI-${(safe.name || 'USER').split(' ')[0].toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`,
      mustChangePassword: Boolean(safe.mustChangePassword),
      preferences: safe.preferences || {
        country: 'India',
        currency: 'INR',
        language: 'English',
        emailOrders: true,
        whatsappUpdates: true,
        promotional: true,
      },
    };
  }

  async function requireCustomer(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    let token = req.cookies?.[CUSTOMER_TOKEN_COOKIE];

    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Customer session required.' });
    }

    const payload = verifyCustomerToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired customer session.' });
    }

    const customers = (await getStoreValue<any[]>('customer_accounts')) || [];
    const customer = customers.find(
      (c) => (c.id && c.id === payload.id) || (c.email && c.email.toLowerCase() === payload.email.toLowerCase())
    );

    if (!customer) {
      return res.status(401).json({ success: false, error: 'Customer account not found.' });
    }

    if (customer.status === 'BLOCKED') {
      return res.status(403).json({
        success: false,
        error: 'Your account has been restricted by administration. Please contact support@hakkiveda.com',
      });
    }

    (req as any).customer = customer;
    (req as any).customerPayload = payload;
    next();
  }

  // Rate limit tracking for customer login/register
  const failedCustomerLoginAttempts = new Map<string, LoginAttemptRecord>();
  const customerRegisterAttempts = new Map<string, { count: number; resetTime: number }>();

  function checkCustomerLoginRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
    const now = Date.now();
    const record = failedCustomerLoginAttempts.get(ip);
    if (!record) return { allowed: true };

    if (record.blockedUntil > now) {
      const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
      return { allowed: false, remainingSeconds };
    }

    if (record.blockedUntil > 0 && record.blockedUntil <= now) {
      failedCustomerLoginAttempts.delete(ip);
    }

    return { allowed: true };
  }

  function recordFailedCustomerLogin(ip: string) {
    const now = Date.now();
    const record = failedCustomerLoginAttempts.get(ip) || { failedAttempts: 0, blockedUntil: 0 };
    record.failedAttempts += 1;

    if (record.failedAttempts >= 10) {
      record.blockedUntil = now + 15 * 60 * 1000; // 15-minute lockout after 10 failed attempts
    }
    failedCustomerLoginAttempts.set(ip, record);
  }

  function recordSuccessfulCustomerLogin(ip: string) {
    failedCustomerLoginAttempts.delete(ip);
  }

  function checkCustomerRegisterRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = customerRegisterAttempts.get(ip);
    if (!record || now > record.resetTime) {
      customerRegisterAttempts.set(ip, { count: 1, resetTime: now + 3600 * 1000 });
      return true;
    }
    if (record.count >= 15) {
      return false; // max 15 registrations per hour per IP
    }
    record.count += 1;
    return true;
  }

  // Failed login attempt tracking for IP-based rate limiting
  interface LoginAttemptRecord {
    failedAttempts: number;
    blockedUntil: number;
  }

  const failedLoginAttempts = new Map<string, LoginAttemptRecord>();

  function checkAdminLoginRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
    const now = Date.now();
    const record = failedLoginAttempts.get(ip);
    if (!record) return { allowed: true };

    if (record.blockedUntil > now) {
      const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
      return { allowed: false, remainingSeconds };
    }

    if (record.blockedUntil > 0 && record.blockedUntil <= now) {
      failedLoginAttempts.delete(ip);
    }

    return { allowed: true };
  }

  function recordFailedAdminLogin(ip: string) {
    const now = Date.now();
    const record = failedLoginAttempts.get(ip) || { failedAttempts: 0, blockedUntil: 0 };
    record.failedAttempts += 1;

    if (record.failedAttempts >= 5) {
      record.blockedUntil = now + 15 * 60 * 1000; // 15-minute lockout
    }
    failedLoginAttempts.set(ip, record);
  }

  function recordSuccessfulAdminLogin(ip: string) {
    failedLoginAttempts.delete(ip);
  }

  // Secure admin account credentials helper (Preserves existing owner account)
  async function getAdminAccountFromDb(): Promise<{ email: string; passwordBcrypt: string }> {
    const existing = await getStoreValue<any>('admin_account');
    const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'hakkiveda@gmail.com').toLowerCase();

    // If already set up in DB with bcrypt hash
    if (existing && existing.passwordBcrypt && typeof existing.passwordBcrypt === 'string') {
      return {
        email: (existing.email || defaultAdminEmail).toLowerCase(),
        passwordBcrypt: existing.passwordBcrypt,
      };
    }

    // If ADMIN_PASSWORD_HASH env var is provided
    if (process.env.ADMIN_PASSWORD_HASH) {
      const account = {
        email: defaultAdminEmail,
        passwordBcrypt: process.env.ADMIN_PASSWORD_HASH,
      };
      await setStoreValue('admin_account', account);
      return account;
    }

    // Initial seed with bcrypt hash of default initial master password
    const initialPlainPassword = process.env.ADMIN_PASSWORD || 'Kamal@2026';
    const bcryptHash = await bcrypt.hash(initialPlainPassword, 10);
    const account = {
      email: defaultAdminEmail,
      passwordBcrypt: bcryptHash,
    };
    await setStoreValue('admin_account', account);
    return account;
  }

  // Static serving for persistent uploaded media with caching
  app.use('/uploads', express.static(uploadDir, { maxAge: '30d' }));

  // Dynamic Robots.txt Route
  app.get('/robots.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(`User-agent: *
Allow: /

Disallow: /admin
Disallow: /api/private
Disallow: /temp
Disallow: /uploads/private

Sitemap: https://hakkiveda.store/sitemap.xml`);
  });

  // Dynamic Sitemap.xml Route
  app.get('/sitemap.xml', async (_req, res) => {
    try {
      const siteUrl = 'https://hakkiveda.store';
      const products = (await getStoreValue<any[]>('products')) || [];
      const categories = (await getStoreValue<any[]>('categories')) || [];
      const blogs = (await getStoreValue<any[]>('blogs')) || [];

      const slugify = (str: string) =>
        str
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/^-+|-+$/g, '');

      interface SitemapItem {
        url: string;
        priority: string;
        changefreq: string;
        lastmod?: string;
      }

      const staticPages: SitemapItem[] = [
        { url: siteUrl, priority: '1.0', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] },
        { url: `${siteUrl}/collections`, priority: '0.9', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
        { url: `${siteUrl}/quiz`, priority: '0.8', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
        { url: `${siteUrl}/b2b`, priority: '0.8', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
        { url: `${siteUrl}/gallery`, priority: '0.7', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
        { url: `${siteUrl}/testimonials`, priority: '0.7', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
      ];

      const productUrls: SitemapItem[] = products.map((p) => ({
        url: `${siteUrl}/products/${slugify(p.name || p.id)}`,
        priority: '0.9',
        changefreq: 'weekly',
        lastmod: new Date().toISOString().split('T')[0],
      }));

      const categoryUrls: SitemapItem[] = categories.map((c) => ({
        url: `${siteUrl}/categories/${c.slug || slugify(c.name || c.id)}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: new Date().toISOString().split('T')[0],
      }));

      const blogUrls: SitemapItem[] = blogs.map((b) => ({
        url: `${siteUrl}/journal/${slugify(b.title || b.id)}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      }));

      const allUrls = [...staticPages, ...productUrls, ...categoryUrls, ...blogUrls];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      for (const item of allUrls) {
        xml += `  <url>\n`;
        xml += `    <loc>${item.url}</loc>\n`;
        if (item.lastmod) {
          xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
        }
        xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
        xml += `    <priority>${item.priority}</priority>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.send(xml);
    } catch (err: any) {
      console.error('Sitemap error:', err);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Health Check Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // ==========================================
  // ADMIN AUTHENTICATION API ROUTES
  // ==========================================

  // Admin Login Endpoint
  app.post('/api/admin/login', async (req, res) => {
    try {
      const clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.ip ||
        'unknown-ip';

      const rateCheck = checkAdminLoginRateLimit(clientIp);
      if (!rateCheck.allowed) {
        return res.status(429).json({
          success: false,
          error: `Too many failed login attempts. Please try again in ${Math.ceil(
            (rateCheck.remainingSeconds || 900) / 60
          )} minutes.`,
        });
      }

      const { email, password } = req.body;
      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid email or password.' });
      }

      const adminAccount = await getAdminAccountFromDb();
      const isEmailMatch = email.trim().toLowerCase() === adminAccount.email.toLowerCase();

      let isPasswordMatch = false;
      if (isEmailMatch) {
        isPasswordMatch = await bcrypt.compare(password, adminAccount.passwordBcrypt);
      }

      if (!isEmailMatch || !isPasswordMatch) {
        recordFailedAdminLogin(clientIp);
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      recordSuccessfulAdminLogin(clientIp);
      const token = createAdminToken(adminAccount.email);

      res.cookie(ADMIN_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ADMIN_TOKEN_EXPIRY_MS,
        path: '/',
      });

      res.json({
        success: true,
        message: 'Admin authentication successful.',
        admin: { email: adminAccount.email, role: 'admin' },
        token,
      });
    } catch (err: any) {
      console.error('[Admin Login Error]:', err.message);
      res.status(500).json({ success: false, error: 'Failed to process admin login.' });
    }
  });

  // Admin Me / Session Status Check
  app.get('/api/admin/me', requireAdmin, (req, res) => {
    const admin = (req as any).admin;
    res.json({
      success: true,
      admin: {
        email: admin.email,
        role: 'admin',
      },
    });
  });

  // Admin Logout Endpoint
  app.post('/api/admin/logout', (req, res) => {
    res.clearCookie(ADMIN_TOKEN_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Admin Change Password Endpoint
  app.post('/api/admin/change-password', requireAdmin, async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword || typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
        return res.status(400).json({ success: false, error: 'Both current and new passwords are required.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
      }

      const adminAccount = await getAdminAccountFromDb();
      const isCurrentMatch = await bcrypt.compare(oldPassword, adminAccount.passwordBcrypt);
      if (!isCurrentMatch) {
        return res.status(401).json({ success: false, error: 'Current password does not match.' });
      }

      const newBcryptHash = await bcrypt.hash(newPassword, 10);
      const updatedAccount = {
        email: adminAccount.email,
        passwordBcrypt: newBcryptHash,
      };
      await setStoreValue('admin_account', updatedAccount);

      res.json({ success: true, message: 'Master password updated successfully.' });
    } catch (err: any) {
      console.error('[Admin Change Password Error]:', err.message);
      res.status(500).json({ success: false, error: 'Failed to update master password.' });
    }
  });

  // ==========================================
  // CUSTOMER AUTHENTICATION API ROUTES
  // ==========================================

  // Customer Register Endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      const clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.ip ||
        'unknown-ip';

      if (!checkCustomerRegisterRateLimit(clientIp)) {
        return res.status(429).json({
          success: false,
          error: 'Too many account creation attempts. Please try again in an hour.',
        });
      }

      const { name, firstName, lastName, email, phone, password } = req.body;
      const computedName = (name || `${firstName || ''} ${lastName || ''}`).trim();

      if (!computedName) {
        return res.status(400).json({ success: false, error: 'Full name is required.' });
      }

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: 'Valid email address is required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ success: false, error: 'Please enter a valid email format.' });
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
      }

      const customers = (await getStoreValue<any[]>('customer_accounts')) || [];
      const existing = customers.find((c: any) => c.email && c.email.toLowerCase() === normalizedEmail);

      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email already exists. Please Sign In.',
        });
      }

      const passwordBcrypt = await bcrypt.hash(password, 10);
      const customerId = `usr-${Date.now()}`;
      const nameParts = computedName.split(' ');
      const referralCode = `HAKKI-${(nameParts[0] || 'USER').toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`;

      const newCustomer = {
        id: customerId,
        name: computedName,
        email: normalizedEmail,
        phone: (phone || '').trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        passwordBcrypt,
        addresses: [],
        savedPayments: [],
        isAdmin: false,
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toLocaleString() + ' IST',
        loyaltyPoints: 100,
        referralCode,
        preferences: {
          country: 'India',
          currency: 'INR',
          language: 'English',
          emailOrders: true,
          whatsappUpdates: true,
          promotional: true,
        },
        loginHistory: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleString() + ' IST',
            ipLocation: 'Web Session',
            device: 'Web Browser',
          },
        ],
      };

      const updatedCustomers = [newCustomer, ...customers];
      await setStoreValue('customer_accounts', updatedCustomers);

      const token = createCustomerToken(customerId, normalizedEmail);
      res.cookie(CUSTOMER_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: CUSTOMER_TOKEN_EXPIRY_MS,
        path: '/',
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully! 100 Welcome Points awarded.',
        customer: sanitizeCustomer(newCustomer),
        token,
      });
    } catch (err: any) {
      console.error('[Customer Register Error]:', err.message);
      res.status(500).json({ success: false, error: 'Failed to create customer account.' });
    }
  });

  // Customer Login Endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.ip ||
        'unknown-ip';

      const rateCheck = checkCustomerLoginRateLimit(clientIp);
      if (!rateCheck.allowed) {
        return res.status(429).json({
          success: false,
          error: `Too many failed login attempts. Please try again in ${Math.ceil(
            (rateCheck.remainingSeconds || 900) / 60
          )} minutes.`,
        });
      }

      const { email, password } = req.body;
      if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const customers = (await getStoreValue<any[]>('customer_accounts')) || [];
      const customerIndex = customers.findIndex(
        (c: any) => c.email && c.email.toLowerCase() === normalizedEmail
      );

      if (customerIndex === -1) {
        recordFailedCustomerLogin(clientIp);
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const customer = customers[customerIndex];

      if (customer.status === 'BLOCKED') {
        return res.status(403).json({
          success: false,
          error: 'Your account has been restricted by administration. Please contact support@hakkiveda.com',
        });
      }

      // Legacy customer migration check: Account exists without password hash
      if (!customer.passwordBcrypt) {
        return res.status(403).json({
          success: false,
          error: 'Your account requires password setup. Please contact HAKKIVEDA support to secure your account.',
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, customer.passwordBcrypt);
      if (!isPasswordMatch) {
        recordFailedCustomerLogin(clientIp);
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      recordSuccessfulCustomerLogin(clientIp);

      // Update login telemetry
      customer.lastLogin = new Date().toLocaleString() + ' IST';
      customer.loginHistory = [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString() + ' IST',
          ipLocation: 'Web Session',
          device: req.headers['user-agent']?.slice(0, 80) || 'Web Browser',
        },
        ...(Array.isArray(customer.loginHistory) ? customer.loginHistory.slice(0, 19) : []),
      ];

      customers[customerIndex] = customer;
      await setStoreValue('customer_accounts', customers);

      const token = createCustomerToken(customer.id, customer.email);
      res.cookie(CUSTOMER_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: CUSTOMER_TOKEN_EXPIRY_MS,
        path: '/',
      });

      res.json({
        success: true,
        message: `Welcome back, ${customer.name}!`,
        customer: sanitizeCustomer(customer),
        token,
      });
    } catch (err: any) {
      console.error('[Customer Login Error]:', err.message);
      res.status(500).json({ success: false, error: 'Failed to process login.' });
    }
  });

  // Customer Me / Active Session Check Endpoint
  app.get('/api/auth/me', requireCustomer, (req, res) => {
    const customer = (req as any).customer;
    res.json({
      success: true,
      customer: sanitizeCustomer(customer),
    });
  });

  // Customer Logout Endpoint
  app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie(CUSTOMER_TOKEN_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Admin-Assisted Customer Password Setup / Reset Endpoint (Protected under requireAdmin)
  app.post('/api/admin/customers/:id/set-password', requireAdmin, async (req, res) => {
    try {
      const customerId = req.params.id;
      const { newPassword, generateRandom } = req.body;

      let passwordToSet = typeof newPassword === 'string' ? newPassword.trim() : '';

      if (generateRandom || !passwordToSet) {
        // Generate high-entropy CSPRNG temporary password (crypto.randomBytes)
        passwordToSet = generateSecureTempPassword();
      }

      if (passwordToSet.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
      }

      const customers = (await getStoreValue<any[]>('customer_accounts')) || [];
      const customerIndex = customers.findIndex((c: any) => c.id === customerId);

      if (customerIndex === -1) {
        return res.status(404).json({ success: false, error: 'Customer account not found.' });
      }

      const customer = customers[customerIndex];
      const passwordBcrypt = await bcrypt.hash(passwordToSet, 10);
      customer.passwordBcrypt = passwordBcrypt;
      // Any admin-assisted credential reset forces password change upon next login
      customer.mustChangePassword = true;
      customer.lastPasswordReset = new Date().toLocaleString() + ' IST';

      customers[customerIndex] = customer;
      await setStoreValue('customer_accounts', customers);

      res.json({
        success: true,
        message: `Secure temporary password established for customer ${customer.name}.`,
        temporaryPassword: passwordToSet,
      });
    } catch (err: any) {
      console.error('[Admin Customer Password Reset Error]:', err.message);
      res.status(500).json({ success: false, error: 'Failed to establish customer password.' });
    }
  });

  // Customer Password Recovery Request Endpoint
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: 'Email address is required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const customers = (await getStoreValue<any[]>('customer_accounts')) || [];
      const customer = customers.find((c: any) => c.email && c.email.toLowerCase() === normalizedEmail);

      if (customer) {
        console.log(`[Security] Password reset requested for registered customer: ${normalizedEmail}`);
      }

      // Always return a positive message to avoid email enumeration
      res.json({
        success: true,
        message: `If an account exists for ${normalizedEmail}, our customer care concierge has been notified and will assist you with access recovery.`,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to process request.' });
    }
  });

  // ==========================================
  // CUSTOMER PRIVATE DATA & PROFILE API ROUTES
  // ==========================================

  // Customer Profile Get Endpoint
  app.get('/api/customer/profile', requireCustomer, (req, res) => {
    const customer = (req as any).customer;
    res.json({
      success: true,
      customer: sanitizeCustomer(customer),
    });
  });

  // Customer Profile Update Endpoint
  app.put('/api/customer/profile', requireCustomer, async (req, res) => {
    try {
      const currentCustomer = (req as any).customer;
      const customers = (await getStoreValue<any[]>('customer_accounts')) || [];
      const customerIndex = customers.findIndex((c: any) => c.id === currentCustomer.id);

      if (customerIndex === -1) {
        return res.status(404).json({ success: false, error: 'Customer account not found.' });
      }

      const { name, phone, avatar, addresses, preferences, savedPayments } = req.body;
      const customer = customers[customerIndex];

      if (name && typeof name === 'string') customer.name = name.trim();
      if (phone !== undefined) customer.phone = String(phone).trim();
      if (avatar && typeof avatar === 'string') customer.avatar = avatar;
      if (Array.isArray(addresses)) customer.addresses = addresses;
      if (Array.isArray(savedPayments)) customer.savedPayments = savedPayments;
      if (preferences && typeof preferences === 'object') {
        customer.preferences = { ...customer.preferences, ...preferences };
      }

      customers[customerIndex] = customer;
      await setStoreValue('customer_accounts', customers);

      res.json({
        success: true,
        message: 'Profile updated successfully.',
        customer: sanitizeCustomer(customer),
      });
    } catch (err: any) {
      console.error('[Customer Profile Update Error]:', err.message);
      res.status(500).json({ success: false, error: 'Failed to update profile.' });
    }
  });

  // Customer Change Password Endpoint
  app.post('/api/customer/change-password', requireCustomer, async (req, res) => {
    try {
      const currentCustomer = (req as any).customer;
      const { oldPassword, currentPassword, newPassword } = req.body;
      const passToVerify = currentPassword || oldPassword;

      if (!passToVerify || !newPassword || typeof newPassword !== 'string') {
        return res.status(400).json({ success: false, error: 'Current password and new password are required.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
      }

      const customers = (await getStoreValue<any[]>('customer_accounts')) || [];
      const customerIndex = customers.findIndex((c: any) => c.id === currentCustomer.id);

      if (customerIndex === -1) {
        return res.status(404).json({ success: false, error: 'Customer not found.' });
      }

      const customer = customers[customerIndex];
      if (customer.passwordBcrypt) {
        const isMatch = await bcrypt.compare(passToVerify, customer.passwordBcrypt);
        if (!isMatch) {
          return res.status(400).json({ success: false, error: 'Current password is incorrect.' });
        }
      }

      customer.passwordBcrypt = await bcrypt.hash(newPassword, 10);
      customer.mustChangePassword = false;
      customer.lastPasswordReset = new Date().toLocaleString() + ' IST';
      customers[customerIndex] = customer;
      await setStoreValue('customer_accounts', customers);

      res.json({
        success: true,
        message: 'Password updated successfully.',
        customer: sanitizeCustomer(customer),
      });
    } catch (err: any) {
      console.error('[Customer Change Password Error]:', err.message);
      res.status(500).json({ success: false, error: 'Failed to update password.' });
    }
  });

  // Customer Private Orders List Endpoint (Authenticated Customer Only)
  app.get('/api/customer/orders', requireCustomer, async (req, res) => {
    try {
      const customer = (req as any).customer;
      const customerEmail = customer.email.toLowerCase().trim();
      const customerId = customer.id;

      const orders = (await getStoreValue<any[]>('orders')) || [];
      const customerOrders = orders.filter((o: any) => {
        const orderEmail = (o.customer?.email || '').toLowerCase().trim();
        const orderCustomerId = o.customerId;
        return orderEmail === customerEmail || (customerId && orderCustomerId === customerId);
      });

      res.json({
        success: true,
        orders: customerOrders,
      });
    } catch (err: any) {
      console.error('[Customer Orders Error]:', err.message);
      res.status(500).json({ success: false, error: 'Failed to retrieve orders.' });
    }
  });

  // Customer Single Order Details Endpoint (Protected with IDOR Verification)
  app.get('/api/customer/orders/:id', requireCustomer, async (req, res) => {
    try {
      const customer = (req as any).customer;
      const customerEmail = customer.email.toLowerCase().trim();
      const customerId = customer.id;
      const orderId = req.params.id;

      const orders = (await getStoreValue<any[]>('orders')) || [];
      const order = orders.find(
        (o: any) => String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId)
      );

      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found.' });
      }

      const orderEmail = (order.customer?.email || '').toLowerCase().trim();
      const orderCustomerId = order.customerId;

      // Strict IDOR check: Order MUST belong to the authenticated customer
      if (orderEmail !== customerEmail && (!customerId || orderCustomerId !== customerId)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: You can only view orders placed by your account.',
        });
      }

      res.json({
        success: true,
        order,
      });
    } catch (err: any) {
      console.error('[Customer Order Details Error]:', err.message);
      res.status(500).json({ success: false, error: 'Failed to retrieve order details.' });
    }
  });

  // Public Store Persistence API Route (Fast, cached, no admin data)
  app.get('/api/store/public', async (_req, res) => {
    try {
      const data = await getPublicStoreData();
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to fetch public store data' });
    }
  });

  // Full Store Persistence API Routes (Admin data included - Protected)
  app.get('/api/store', requireAdmin, async (_req, res) => {
    try {
      const data = await getAllStoreData();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to fetch store data' });
    }
  });

  app.get('/api/store/:key', requireAdminForPrivateKey, async (req, res) => {
    try {
      const key = req.params.key;
      const data = await getStoreValue(key);
      res.json({ success: true, key, data, value: data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  const handleStoreKeySave = async (req: express.Request, res: express.Response) => {
    try {
      const key = req.params.key;
      const value = req.body.value !== undefined ? req.body.value : (req.body.data !== undefined ? req.body.data : req.body);
      await setStoreValue(key, value);
      res.json({
        success: true,
        message: `Key '${key}' saved successfully.`,
        key,
        data: value,
        value: value,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  app.put('/api/store/:key', requireAdmin, handleStoreKeySave);
  app.post('/api/store/:key', requireAdmin, handleStoreKeySave);

  app.post('/api/store-bulk', requireAdmin, async (req, res) => {
    try {
      const payload = req.body.value !== undefined ? req.body.value : (req.body.data !== undefined ? req.body.data : req.body);
      if (typeof payload === 'object' && payload !== null) {
        for (const [k, v] of Object.entries(payload)) {
          await setStoreValue(k, v);
        }
      }
      res.json({ success: true, message: 'Bulk store data saved.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Helper to update an order with Shiprocket details in DB
  const updateOrderShiprocketData = async (orderId: string, updates: Record<string, any>) => {
    const orders = (await getStoreValue<any[]>('orders')) || [];
    const idx = orders.findIndex((o: any) => String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId));
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], ...updates };
      await setStoreValue('orders', orders);
      return orders[idx];
    }
    return null;
  };

  // ==========================================
  // SHIPROCKET REST API INTEGRATION ROUTES
  // ==========================================

  // 1. Status Check
  app.get('/api/shiprocket/status', requireAdmin, (_req, res) => {
    res.json({
      success: true,
      configured: isShiprocketConfigured(),
      message: isShiprocketConfigured()
        ? 'Shiprocket API credentials are configured.'
        : 'Shiprocket is running in Simulation Mode (add SHIPROCKET_EMAIL & SHIPROCKET_PASSWORD to .env to enable live API).',
    });
  });

  // 2. Check Serviceability & India Pincode Lookup API
  app.get('/api/shipping/address-lookup', async (req, res) => {
    try {
      const countryRaw = (req.query.country || req.query.countryCode || '').toString().trim();
      const postalCodeRaw = (req.query.postalCode || req.query.pincode || req.query.zip || '').toString().trim();

      if (!postalCodeRaw) {
        return res.status(400).json({
          success: false,
          error: 'Postal code is required.',
        });
      }

      // Standardize Country Code
      let countryCode = countryRaw.toUpperCase();
      if (countryCode === 'UNITED STATES' || countryCode === 'USA' || countryCode === 'US') countryCode = 'US';
      else if (countryCode === 'UNITED KINGDOM' || countryCode === 'UK' || countryCode === 'GB') countryCode = 'GB';
      else if (countryCode === 'INDIA' || countryCode === 'IN') countryCode = 'IN';
      else if (countryCode === 'SINGAPORE' || countryCode === 'SG') countryCode = 'SG';
      else if (countryCode === 'MALAYSIA' || countryCode === 'MY') countryCode = 'MY';
      else if (countryCode === 'CANADA' || countryCode === 'CA') countryCode = 'CA';
      else if (countryCode === 'UNITED ARAB EMIRATES' || countryCode === 'UAE' || countryCode === 'AE') countryCode = 'AE';
      else if (countryCode === 'FIJI' || countryCode === 'FJ') countryCode = 'FJ';
      else if (countryCode === 'MAURITIUS' || countryCode === 'MU') countryCode = 'MU';
      else if (countryCode === 'NEPAL' || countryCode === 'NP') countryCode = 'NP';

      let city = '';
      let state = '';

      // United States Lookup
      if (countryCode === 'US') {
        const cleanZip = postalCodeRaw.split('-')[0].replace(/\D/g, '').slice(0, 5);
        if (cleanZip.length === 5) {
          try {
            const zipRes = await fetch(`https://api.zippopotam.us/us/${cleanZip}`, {
              signal: AbortSignal.timeout(3000),
            });
            if (zipRes.ok) {
              const zipData = await zipRes.json();
              if (zipData.places && zipData.places.length > 0) {
                city = zipData.places[0]['place name'] || '';
                state = zipData.places[0]['state'] || '';
              }
            }
          } catch (e: any) {
            console.warn(`[US ZIP Lookup API Warning for ${cleanZip}]:`, e.message);
          }

          if (!city || !state) {
            const knownUsZips: Record<string, { city: string; state: string }> = {
              '10282': { city: 'New York', state: 'New York' },
              '10001': { city: 'New York', state: 'New York' },
              '90210': { city: 'Beverly Hills', state: 'California' },
              '94102': { city: 'San Francisco', state: 'California' },
              '60601': { city: 'Chicago', state: 'Illinois' },
              '33101': { city: 'Miami', state: 'Florida' },
              '98101': { city: 'Seattle', state: 'Washington' },
              '75001': { city: 'Dallas', state: 'Texas' },
            };
            if (knownUsZips[cleanZip]) {
              city = knownUsZips[cleanZip].city;
              state = knownUsZips[cleanZip].state;
            }
          }
        }
      }
      // United Kingdom Lookup
      else if (countryCode === 'GB') {
        const cleanPostcode = postalCodeRaw.trim();
        try {
          const pcRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`, {
            signal: AbortSignal.timeout(3000),
          });
          if (pcRes.ok) {
            const pcData = await pcRes.json();
            if (pcData.status === 200 && pcData.result) {
              city = pcData.result.admin_district || pcData.result.parish || pcData.result.parliamentary_constituency || 'London';
              state = pcData.result.region || pcData.result.country || 'England';
            }
          }
        } catch (e: any) {
          console.warn(`[UK Postcode Lookup API Warning for ${cleanPostcode}]:`, e.message);
        }

        if (!city || !state) {
          const formattedPc = cleanPostcode.replace(/\s+/g, '').toUpperCase();
          const knownUkPcs: Record<string, { city: string; state: string }> = {
            'SW1A1AA': { city: 'London', state: 'England' },
            'EC1A1BB': { city: 'London', state: 'England' },
            'M11AE': { city: 'Manchester', state: 'England' },
            'B11AA': { city: 'Birmingham', state: 'England' },
          };
          if (knownUkPcs[formattedPc]) {
            city = knownUkPcs[formattedPc].city;
            state = knownUkPcs[formattedPc].state;
          }
        }
      }
      // Singapore Lookup
      else if (countryCode === 'SG') {
        const cleanSg = postalCodeRaw.replace(/\D/g, '');
        if (cleanSg.length === 6) {
          city = 'Singapore';
          state = 'Singapore';
        }
      }
      // Malaysia Lookup
      else if (countryCode === 'MY') {
        const cleanMy = postalCodeRaw.replace(/\D/g, '');
        if (cleanMy.length === 5) {
          const knownMy: Record<string, { city: string; state: string }> = {
            '50450': { city: 'Kuala Lumpur', state: 'Kuala Lumpur' },
            '10000': { city: 'George Town', state: 'Penang' },
            '80000': { city: 'Johor Bahru', state: 'Johor' },
          };
          if (knownMy[cleanMy]) {
            city = knownMy[cleanMy].city;
            state = knownMy[cleanMy].state;
          } else {
            city = 'Kuala Lumpur';
            state = 'Malaysia';
          }
        }
      }
      // Canada Lookup
      else if (countryCode === 'CA') {
        const cleanCa = postalCodeRaw.replace(/\s+/g, '').toUpperCase();
        if (cleanCa.length >= 3) {
          const f3 = cleanCa.slice(0, 3);
          try {
            const caRes = await fetch(`https://api.zippopotam.us/ca/${f3}`, {
              signal: AbortSignal.timeout(3000),
            });
            if (caRes.ok) {
              const caData = await caRes.json();
              if (caData.places && caData.places.length > 0) {
                city = caData.places[0]['place name'] || '';
                state = caData.places[0]['state'] || '';
              }
            }
          } catch (e: any) {
            console.warn(`[CA Postal Lookup Warning for ${cleanCa}]:`, e.message);
          }
          if (!city || !state) {
            if (cleanCa.startsWith('M5V') || cleanCa.startsWith('M')) {
              city = 'Toronto';
              state = 'Ontario';
            } else if (cleanCa.startsWith('V6B') || cleanCa.startsWith('V')) {
              city = 'Vancouver';
              state = 'British Columbia';
            }
          }
        }
      }
      // India Lookup
      else if (countryCode === 'IN') {
        const cleanIn = postalCodeRaw.replace(/\D/g, '');
        if (cleanIn.length === 6) {
          try {
            const postalRes = await fetch(`https://api.postalpincode.in/pincode/${cleanIn}`, {
              signal: AbortSignal.timeout(3000),
            });
            if (postalRes.ok) {
              const postalData = await postalRes.json();
              if (Array.isArray(postalData) && postalData[0]?.Status === 'Success' && postalData[0]?.PostOffice?.length > 0) {
                const po = postalData[0].PostOffice[0];
                city = po.District || po.Block || po.Circle || po.Name || '';
                state = po.State || '';
              }
            }
          } catch (err: any) {
            console.warn(`[India Post Lookup Warning for ${cleanIn}]:`, err.message);
          }

          if (!city || !state) {
            const knownPincodes: Record<string, { city: string; state: string }> = {
              '141008': { city: 'Ludhiana', state: 'Punjab' },
              '110001': { city: 'New Delhi', state: 'Delhi' },
              '400001': { city: 'Mumbai', state: 'Maharashtra' },
              '700001': { city: 'Kolkata', state: 'West Bengal' },
              '600001': { city: 'Chennai', state: 'Tamil Nadu' },
              '560001': { city: 'Bengaluru', state: 'Karnataka' },
            };
            if (knownPincodes[cleanIn]) {
              city = knownPincodes[cleanIn].city;
              state = knownPincodes[cleanIn].state;
            }
          }
        }
      }

      if (city && state) {
        return res.json({
          success: true,
          countryCode,
          postalCode: postalCodeRaw,
          city,
          state,
        });
      }

      return res.status(404).json({
        success: false,
        error: 'Automatic address lookup is not available for this country. Please enter city and region manually.',
      });
    } catch (error: any) {
      console.error('[API /api/shipping/address-lookup Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Automatic address lookup failed. Please enter city and region manually.',
      });
    }
  });

  app.get('/api/shipping/india-pincode/:pincode', async (req, res) => {
    try {
      const pincode = req.params.pincode ? req.params.pincode.trim() : '';

      if (!/^\d{6}$/.test(pincode)) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid Indian pincode.',
        });
      }

      let city = '';
      let state = '';

      // 1. Primary Lookup via India Post Postal API
      try {
        const postalRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
          signal: AbortSignal.timeout(4000),
        });
        if (postalRes.ok) {
          const postalData = await postalRes.json();
          if (Array.isArray(postalData) && postalData[0]?.Status === 'Success' && postalData[0]?.PostOffice?.length > 0) {
            const po = postalData[0].PostOffice[0];
            city = po.District || po.Block || po.Circle || po.Name || '';
            state = po.State || '';
          }
        }
      } catch (err: any) {
        console.warn(`[India Post Pincode Lookup Warning for ${pincode}]:`, err.message);
      }

      // 2. Secondary Lookup via Shiprocket Serviceability if configured
      if ((!city || !state) && isShiprocketConfigured()) {
        try {
          const srRes: any = await checkServiceability({ deliveryPincode: pincode });
          if (srRes.success && srRes.data) {
            if (srRes.data.city) city = srRes.data.city;
            if (srRes.data.state) state = srRes.data.state;
          }
        } catch (srErr: any) {
          console.warn(`[Shiprocket Pincode Check Warning for ${pincode}]:`, srErr.message);
        }
      }

      // 3. Fallback Database for common Indian regional hub pincodes
      if (!city || !state) {
        const knownPincodes: Record<string, { city: string; state: string }> = {
          '141008': { city: 'Ludhiana', state: 'Punjab' },
          '110001': { city: 'New Delhi', state: 'Delhi' },
          '400001': { city: 'Mumbai', state: 'Maharashtra' },
          '700001': { city: 'Kolkata', state: 'West Bengal' },
          '600001': { city: 'Chennai', state: 'Tamil Nadu' },
          '560001': { city: 'Bengaluru', state: 'Karnataka' },
          '500001': { city: 'Hyderabad', state: 'Telangana' },
          '380001': { city: 'Ahmedabad', state: 'Gujarat' },
          '302001': { city: 'Jaipur', state: 'Rajasthan' },
          '570001': { city: 'Mysore', state: 'Karnataka' },
          '571105': { city: 'Hunsur', state: 'Karnataka' },
          '201301': { city: 'Noida', state: 'Uttar Pradesh' },
          '122001': { city: 'Gurugram', state: 'Haryana' },
          '160017': { city: 'Chandigarh', state: 'Chandigarh' },
          '411001': { city: 'Pune', state: 'Maharashtra' },
          '682001': { city: 'Kochi', state: 'Kerala' },
        };
        if (knownPincodes[pincode]) {
          city = knownPincodes[pincode].city;
          state = knownPincodes[pincode].state;
        }
      }

      if (!city || !state) {
        return res.status(404).json({
          success: false,
          error: 'Please enter a valid Indian pincode.',
        });
      }

      return res.json({
        success: true,
        pincode,
        city,
        state,
        serviceable: true,
      });
    } catch (error: any) {
      console.error('[API /api/shipping/india-pincode Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to look up pincode details. Please retry.',
      });
    }
  });

  app.post('/api/shiprocket/serviceability', async (req, res) => {
    try {
      const { deliveryPincode, pickupPincode, weightInKg, cod } = req.body;
      if (!deliveryPincode) {
        return res.status(400).json({ success: false, error: 'deliveryPincode is required' });
      }
      const result = await checkServiceability({ deliveryPincode, pickupPincode, weightInKg, cod });
      res.json(result);
    } catch (err: any) {
      console.error('[API /shiprocket/serviceability Error]:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to check serviceability' });
    }
  });

  app.get('/api/shiprocket/serviceability', async (req, res) => {
    try {
      const deliveryPincode = (req.query.pincode || req.query.deliveryPincode) as string;
      if (!deliveryPincode) {
        return res.status(400).json({ success: false, error: 'pincode query param is required' });
      }
      const result = await checkServiceability({ deliveryPincode });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Shipping Rate Estimation & Business Rules (India vs International COD rules)
  app.post('/api/shiprocket/estimate-rate', async (req, res) => {
    try {
      const { deliveryPincode, country, weightInKg, cod } = req.body;
      const isInternational = Boolean(
        country && country.trim().toUpperCase() !== 'INDIA' && country.trim().toUpperCase() !== 'IN'
      );

      const result = await estimateShippingRate({
        deliveryPincode: deliveryPincode || '110001',
        weightInKg: weightInKg || 0.5,
        cod: isInternational ? false : Boolean(cod),
        isInternational,
      });

      res.json(result);
    } catch (err: any) {
      console.error('[API /shiprocket/estimate-rate Error]:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to estimate rate' });
    }
  });

  // 4. Create Shipment / Order on Shiprocket
  app.post('/api/shiprocket/create-order', requireAdmin, async (req, res) => {
    try {
      const { orderId, orderData } = req.body;
      let targetOrder = orderData;

      if (!targetOrder && orderId) {
        const orders = (await getStoreValue<any[]>('orders')) || [];
        targetOrder = orders.find((o: any) => String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId));
      }

      if (!targetOrder) {
        return res.status(400).json({ success: false, error: 'Order not found or not provided' });
      }

      const result = await createShiprocketOrder(targetOrder);

      // Save Shiprocket order details with order in DB
      if (result.success) {
        const updates = {
          shiprocketOrderId: result.shiprocketOrderId,
          shipmentId: result.shipmentId,
          awbCode: result.awbCode || targetOrder.awbCode,
          courierName: result.courierName || targetOrder.courierName,
          trackingUrl: result.trackingUrl || targetOrder.trackingUrl,
          shipmentStatus: result.shipmentStatus || 'MANIFESTED',
          trackingStatus: 'PROCESSING',
        };
        await updateOrderShiprocketData(targetOrder.id || orderId, updates);
      }

      res.json(result);
    } catch (err: any) {
      console.error('[API /shiprocket/create-order Error]:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to create Shiprocket shipment' });
    }
  });

  // 5. Generate AWB
  app.post('/api/shiprocket/generate-awb', requireAdmin, async (req, res) => {
    try {
      const { orderId, shipmentId, courierId } = req.body;
      let targetShipmentId = shipmentId;
      let targetOrderId = orderId;

      if (!targetShipmentId && targetOrderId) {
        const orders = (await getStoreValue<any[]>('orders')) || [];
        const ord = orders.find((o: any) => String(o.id) === String(targetOrderId) || String(o.orderNumber) === String(targetOrderId));
        if (ord) targetShipmentId = ord.shipmentId;
      }

      if (!targetShipmentId) {
        return res.status(400).json({ success: false, error: 'shipmentId is required' });
      }

      const result = await generateAwb(targetShipmentId, courierId);

      if (result.success && targetOrderId) {
        await updateOrderShiprocketData(targetOrderId, {
          awbCode: result.awbCode,
          courierName: result.courierName,
          trackingUrl: result.trackingUrl,
          shipmentStatus: 'AWB_GENERATED',
          trackingNumber: result.awbCode,
          trackingStatus: 'DISPATCHED',
        });
      }

      res.json(result);
    } catch (err: any) {
      console.error('[API /shiprocket/generate-awb Error]:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to generate AWB' });
    }
  });

  // 6. Schedule Pickup
  app.post('/api/shiprocket/schedule-pickup', requireAdmin, async (req, res) => {
    try {
      const { orderId, shipmentId } = req.body;
      let targetShipmentId = shipmentId;
      let targetOrderId = orderId;

      if (!targetShipmentId && targetOrderId) {
        const orders = (await getStoreValue<any[]>('orders')) || [];
        const ord = orders.find((o: any) => String(o.id) === String(targetOrderId) || String(o.orderNumber) === String(targetOrderId));
        if (ord) targetShipmentId = ord.shipmentId;
      }

      if (!targetShipmentId) {
        return res.status(400).json({ success: false, error: 'shipmentId is required' });
      }

      const result = await schedulePickup(targetShipmentId);

      if (result.success && targetOrderId) {
        await updateOrderShiprocketData(targetOrderId, {
          pickupScheduledDate: result.pickupScheduledDate,
          shipmentStatus: 'PICKUP_SCHEDULED',
          trackingStatus: 'DISPATCHED',
        });
      }

      res.json(result);
    } catch (err: any) {
      console.error('[API /shiprocket/schedule-pickup Error]:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to schedule pickup' });
    }
  });

  // 7. Track Shipment
  app.get('/api/shiprocket/track/:identifier', async (req, res) => {
    try {
      const identifier = req.params.identifier;
      const result = await trackShipment(identifier);

      // If an order exists with this AWB or ID, update tracking status
      const orders = (await getStoreValue<any[]>('orders')) || [];
      const ord = orders.find((o: any) =>
        String(o.awbCode) === String(identifier) ||
        String(o.shipmentId) === String(identifier) ||
        String(o.id) === String(identifier) ||
        String(o.orderNumber) === String(identifier)
      );

      if (ord) {
        await updateOrderShiprocketData(ord.id, {
          shipmentStatus: result.shipmentStatus,
          courierName: result.courierName || ord.courierName,
        });
      }

      res.json(result);
    } catch (err: any) {
      console.error('[API /shiprocket/track Error]:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to track shipment' });
    }
  });

  // 8. Download Shipping Label
  app.post('/api/shiprocket/generate-label', requireAdmin, async (req, res) => {
    try {
      const { orderId, shipmentId } = req.body;
      let targetShipmentId = shipmentId;
      let targetOrderId = orderId;

      if (!targetShipmentId && targetOrderId) {
        const orders = (await getStoreValue<any[]>('orders')) || [];
        const ord = orders.find((o: any) => String(o.id) === String(targetOrderId) || String(o.orderNumber) === String(targetOrderId));
        if (ord) targetShipmentId = ord.shipmentId;
      }

      if (!targetShipmentId) {
        return res.status(400).json({ success: false, error: 'shipmentId is required' });
      }

      const result = await downloadLabel(targetShipmentId);

      if (result.success && result.labelUrl && targetOrderId) {
        await updateOrderShiprocketData(targetOrderId, { labelUrl: result.labelUrl });
      }

      res.json(result);
    } catch (err: any) {
      console.error('[API /shiprocket/generate-label Error]:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to generate shipping label' });
    }
  });

  // 9. Download Invoice
  app.post('/api/shiprocket/generate-invoice', requireAdmin, async (req, res) => {
    try {
      const { orderId, shiprocketOrderId } = req.body;
      let targetShiprocketOrderId = shiprocketOrderId;
      let targetOrderId = orderId;

      if (!targetShiprocketOrderId && targetOrderId) {
        const orders = (await getStoreValue<any[]>('orders')) || [];
        const ord = orders.find((o: any) => String(o.id) === String(targetOrderId) || String(o.orderNumber) === String(targetOrderId));
        if (ord) targetShiprocketOrderId = ord.shiprocketOrderId;
      }

      if (!targetShiprocketOrderId) {
        return res.status(400).json({ success: false, error: 'shiprocketOrderId is required' });
      }

      const result = await downloadInvoice(targetShiprocketOrderId);

      if (result.success && result.invoiceUrl && targetOrderId) {
        await updateOrderShiprocketData(targetOrderId, { invoiceUrl: result.invoiceUrl });
      }

      res.json(result);
    } catch (err: any) {
      console.error('[API /shiprocket/generate-invoice Error]:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to generate invoice' });
    }
  });

  // Explicit REST API Routes requested for Admin entities
  app.get('/api/products', async (_req, res) => {
    const products = (await getStoreValue('products')) || [];
    res.json({ success: true, data: products, value: products });
  });
  app.post('/api/products', requireAdmin, async (req, res) => {
    const products = req.body.value !== undefined ? req.body.value : (req.body.data !== undefined ? req.body.data : req.body);
    await setStoreValue('products', products);
    res.json({ success: true, message: 'Products saved successfully.', data: products, value: products });
  });

  app.get('/api/categories', async (_req, res) => {
    const categories = (await getStoreValue('categories')) || [];
    res.json({ success: true, data: categories, value: categories });
  });
  app.post('/api/categories', requireAdmin, async (req, res) => {
    const categories = req.body.value !== undefined ? req.body.value : (req.body.data !== undefined ? req.body.data : req.body);
    await setStoreValue('categories', categories);
    res.json({ success: true, message: 'Categories saved successfully.', data: categories, value: categories });
  });

  app.get('/api/hero-slides', async (_req, res) => {
    const slides = await getStoreValue('hero_slides');
    if (slides === null || slides === undefined) {
      await setStoreValue('hero_slides', INITIAL_HERO_SLIDES);
      res.json({ success: true, data: INITIAL_HERO_SLIDES, value: INITIAL_HERO_SLIDES });
    } else {
      res.json({ success: true, data: slides, value: slides });
    }
  });
  const handleHeroSlidesSave = async (req: express.Request, res: express.Response) => {
    try {
      const slides = req.body.value !== undefined ? req.body.value : (req.body.data !== undefined ? req.body.data : req.body);
      await setStoreValue('hero_slides', slides);
      res.json({ success: true, message: 'Hero slides saved successfully.', data: slides, value: slides });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
  app.put('/api/hero-slides', requireAdmin, handleHeroSlidesSave);
  app.post('/api/hero-slides', requireAdmin, handleHeroSlidesSave);

  app.get('/api/announcements', async (_req, res) => {
    const settings = (await getStoreValue('site_settings')) || {};
    res.json({ success: true, data: settings.announcementText || '' });
  });
  app.post('/api/announcements', requireAdmin, async (req, res) => {
    const text = req.body.announcementText || req.body.data;
    const settings = (await getStoreValue('site_settings')) || {};
    settings.announcementText = text;
    await setStoreValue('site_settings', settings);
    res.json({ success: true, message: 'Announcement saved successfully.' });
  });

  app.get('/api/navigation-menu', async (_req, res) => {
    const navLinks = (await getStoreValue('nav_links')) || [];
    res.json({ success: true, data: navLinks });
  });
  app.post('/api/navigation-menu', requireAdmin, async (req, res) => {
    const navLinks = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('nav_links', navLinks);
    res.json({ success: true, message: 'Navigation menu saved successfully.' });
  });

  app.get('/api/reviews', async (_req, res) => {
    const reviews = (await getStoreValue('reviews')) || [];
    res.json({ success: true, data: reviews });
  });
  app.post('/api/reviews', requireAdmin, async (req, res) => {
    const reviews = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('reviews', reviews);
    res.json({ success: true, message: 'Reviews saved successfully.' });
  });

  app.get('/api/blogs', async (_req, res) => {
    const blogs = (await getStoreValue('blogs')) || [];
    res.json({ success: true, data: blogs });
  });
  app.post('/api/blogs', requireAdmin, async (req, res) => {
    const blogs = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('blogs', blogs);
    res.json({ success: true, message: 'Blogs saved successfully.' });
  });

  app.get('/api/video-testimonials', async (_req, res) => {
    const vids = (await getStoreValue('testimonial_videos')) || [];
    res.json({ success: true, data: vids });
  });
  app.post('/api/video-testimonials', requireAdmin, async (req, res) => {
    const vids = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('testimonial_videos', vids);
    res.json({ success: true, message: 'Video testimonials saved successfully.' });
  });

  app.get('/api/media-gallery', async (_req, res) => {
    const media = (await getStoreValue('media_items')) || [];
    res.json({ success: true, data: media });
  });
  app.post('/api/media-gallery', requireAdmin, async (req, res) => {
    const media = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('media_items', media);
    res.json({ success: true, message: 'Media gallery saved successfully.' });
  });

  app.get('/api/quiz-questions', async (_req, res) => {
    const quiz = (await getStoreValue('quiz_questions')) || [];
    res.json({ success: true, data: quiz });
  });
  app.post('/api/quiz-questions', requireAdmin, async (req, res) => {
    const quiz = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('quiz_questions', quiz);
    res.json({ success: true, message: 'Quiz questions saved successfully.' });
  });

  app.get('/api/inventory', async (_req, res) => {
    const products = (await getStoreValue('products')) || [];
    const inventory = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      sku: p.sku || p.id,
      inStock: p.inStock,
      stockQuantity: p.stockQuantity ?? 100,
    }));
    res.json({ success: true, data: inventory });
  });

  app.get('/api/settings', async (_req, res) => {
    const siteSettings = (await getStoreValue('site_settings')) || {};
    const brandIdentity = (await getStoreValue('brand_identity')) || {};
    const headerLayoutSettings = (await getStoreValue('header_layout_settings')) || {};
    res.json({ success: true, data: { siteSettings, brandIdentity, headerLayoutSettings } });
  });
  app.post('/api/settings', requireAdmin, async (req, res) => {
    const { siteSettings, brandIdentity, headerLayoutSettings } = req.body;
    if (siteSettings) await setStoreValue('site_settings', siteSettings);
    if (brandIdentity) await setStoreValue('brand_identity', brandIdentity);
    if (headerLayoutSettings) await setStoreValue('header_layout_settings', headerLayoutSettings);
    res.json({ success: true, message: 'Website settings saved successfully.' });
  });

  // Production-Ready Media Upload Endpoint supporting high-res images & hero videos
  app.post('/api/upload', requireAdmin, (req, res) => {
    upload.single('file')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File size exceeds the maximum 100 MB limit.',
          });
        }
        return res.status(400).json({
          success: false,
          error: `Upload error: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          error: err.message || 'Unsupported file type or invalid file upload.',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded.',
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      return res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
    });
  });

  // Server-side Gemini AI Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is missing.');
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Endpoint 1: AI Hair Quiz Analysis
  app.post('/api/hair-quiz', async (req, res) => {
    try {
      const { hairType, scalpCondition, primaryConcern, hairLossLevel, hairGoal, lifestyle } = req.body;

      // Determine product recommendation category
      const isBaldness =
        (hairLossLevel && (hairLossLevel.toLowerCase().includes('advanced') || hairLossLevel.toLowerCase().includes('receding') || hairLossLevel.toLowerCase().includes('thinning') || hairLossLevel.toLowerCase().includes('visible'))) ||
        (primaryConcern && (primaryConcern.toLowerCase().includes('bald') || primaryConcern.toLowerCase().includes('severe')));

      const isLongHair =
        (hairGoal && (hairGoal.toLowerCase().includes('growth') || hairGoal.toLowerCase().includes('length') || hairGoal.toLowerCase().includes('long'))) ||
        (primaryConcern && primaryConcern.toLowerCase().includes('regrowth'));

      let recommendationTitle = 'HAKKIVEDA Essential Hair Oil & Shampoo Daily Routine';
      let recommendedProductIds = ['prod-1', 'prod-2'];
      let defaultRoutine = [
        'Apply HAKKIVEDA Herbal Hair Oil 2-3x weekly before sleep for deep root nourishment',
        'Wash with HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo to keep scalp clean without drying',
      ];

      if (isBaldness) {
        recommendationTitle = 'HAKKIVEDA 3-Step Baldness & Intensive Follicle Reactivation Kit';
        recommendedProductIds = ['prod-1', 'prod-4', 'prod-2', 'prod-5'];
        defaultRoutine = [
          'Massage HAKKIVEDA Herbal Hair Oil 3x weekly onto scalp and dormant roots',
          'Apply HAKKIVEDA Herbal Baldness Care Powder paste directly on bald patches & thin areas 2x weekly',
          'Cleanse thoroughly with HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo',
        ];
      } else if (isLongHair) {
        recommendationTitle = 'HAKKIVEDA Long Hair Growth & Root Strength System';
        recommendedProductIds = ['prod-1', 'prod-2'];
        defaultRoutine = [
          'Apply HAKKIVEDA Herbal Hair Oil to scalp and full hair lengths 3x weekly for rapid growth',
          'Cleanse with HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo to prevent breakage and split ends',
        ];
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          success: true,
          summary: isBaldness
            ? `Based on your severe hair loss profile, our Master Vaidya prescribes the 3-Step Intensive System: HAKKIVEDA Herbal Hair Oil + HAKKIVEDA Herbal Baldness Care Powder + HAKKIVEDA Clarifying Shampoo.`
            : isLongHair
            ? `To achieve long, lush hair, HAKKIVEDA Herbal Hair Oil paired with HAKKIVEDA Clarifying Shampoo provides deep follicle stimulation and strand elasticity.`
            : `For your hair profile, the combination of HAKKIVEDA Herbal Hair Oil and HAKKIVEDA Clarifying Shampoo is more than enough to maintain root health and stop hair fall.`,
          doshaType: scalpCondition === 'Dry / Flaky / Itchy' ? 'Vata-Pitta Imbalance' : 'Pitta-Kapha',
          recommendationTitle,
          recommendedProductIds,
          recommendedRoutine: defaultRoutine,
          keyHerbs: ['Wild Amla', 'Bhringraj', 'Gunja Seed Elixir', 'Shikakai', 'Devadaru Tree Resin'],
          estimatedResultsWeeks: isBaldness ? 8 : 6,
        });
      }

      const prompt = `You are the Master Vaidya of HAKKIVEDA, an expert in Hakki-Pikki ancient tribal herbal wisdom and traditional Ayurvedic trichology.
Analyze the following customer hair profile:
- Hair Type: ${hairType}
- Scalp Condition: ${scalpCondition}
- Primary Concern: ${primaryConcern}
- Hair Loss Level: ${hairLossLevel}
- Desired Goal: ${hairGoal}
- Lifestyle / Daily Stress: ${lifestyle}

IMPORTANT PRODUCT RECOMMENDATION RULES:
1. If the user has Baldness / Advanced Thinning / Receding Hairline / Visible Scalp:
   - Prescribe the 3-step baldness care protocol: HAKKIVEDA Herbal Hair Oil + HAKKIVEDA Herbal Baldness Care Powder & Lepa + HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo (or Complete Kit prod-5).
   - Set "recommendationTitle": "HAKKIVEDA 3-Step Baldness & Intensive Follicle Reactivation Kit"
   - Set "recommendedProductIds": ["prod-1", "prod-4", "prod-2", "prod-5"]

2. If the user wants Long Hair / Fast Growth / Length:
   - Prescribe: HAKKIVEDA Herbal Hair Oil + HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo.
   - Set "recommendationTitle": "HAKKIVEDA Long Hair Growth & Root Strength System"
   - Set "recommendedProductIds": ["prod-1", "prod-2"]

3. If the concern is mild or not too serious (normal shedding, general hair fall, dry/frizzy hair):
   - Prescribe: HAKKIVEDA Herbal Hair Oil + HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo (this is more than enough).
   - Set "recommendationTitle": "HAKKIVEDA Essential Hair Oil & Shampoo Routine"
   - Set "recommendedProductIds": ["prod-1", "prod-2"]

Provide a personalized botanical diagnosis in valid JSON format with keys:
- "summary": A warm 2-3 sentence tribal diagnosis explaining the recommended products and root cause.
- "doshaType": Ayurvedic dosha classification (e.g. Vata-Pitta, Pitta-Kapha).
- "recommendationTitle": String title of the recommended routine.
- "recommendedProductIds": Array of product IDs string.
- "recommendedRoutine": Array of 2-3 specific usage instructions.
- "keyHerbs": Array of 5 herbs.
- "estimatedResultsWeeks": Number between 4 and 12.

Return ONLY raw JSON, no markdown code blocks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);

      return res.json({
        success: true,
        recommendationTitle,
        recommendedProductIds,
        ...parsed,
      });
    } catch (error: any) {
      console.error('Hair Quiz API error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate hair quiz analysis',
      });
    }
  });

  // Endpoint 2: AI Botanical Chat Advisor
  app.post('/api/ai-chat', async (req, res) => {
    try {
      const { messages } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          success: true,
          reply: `Greetings from HAKKIVEDA! 🙏 I am your Tribal Botanical Advisor. How may I guide your hair wellness journey today? You can ask about our 42 mountain herb oils, ingredient authenticity, global shipping, or hair care rituals.`,
        });
      }

      const systemInstruction = `You are the AI Tribal Botanical Advisor for HAKKIVEDA, a luxury international Ayurvedic herbal e-commerce brand inspired by the Hakki-Pikki tribe in Karnataka, India.
Company Info:
- Address: Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka, India
- WhatsApp Support: +91 76195 36831 | Email: hakkiveda@gmail.com
- Main Product: Tribal Gold Hair Oil (42 rare herbs slow-cooked in traditional copper cauldrons over woodfire for 21 days).
- Worldwide Express Shipping: India (INR), Singapore (SGD), Malaysia (MYR), Fiji (FJD), Mauritius (MUR), Worldwide (USD).
- Key Benefits: Stops severe hair fall, stimulates dormant follicles, darkens premature graying, removes stubborn dandruff naturally.

Keep responses polite, herbal-expert oriented, concise, and luxurious. Always encourage holistic care and tribal wisdom.`;

      const formattedMessages = messages.map((m: any) => `${m.role === 'user' ? 'Customer' : 'Advisor'}: ${m.content}`).join('\n');
      const prompt = `${systemInstruction}\n\nChat History:\n${formattedMessages}\nAdvisor:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      return res.json({
        success: true,
        reply: response.text || 'Namaste! I am here to assist with all your Hakki-Pikki tribal herbal wellness queries.',
      });
    } catch (error: any) {
      console.error('AI Chat API error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to communicate with AI Botanical Advisor',
      });
    }
  });

  // ====================================================
  // RAZORPAY & COD PAYMENT INTEGRATION ENDPOINTS
  // ====================================================

  const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables.');
    }
    return new Razorpay({
      key_id: key_id || 'rzp_test_placeholder',
      key_secret: key_secret || 'placeholder_secret',
    });
  };

  async function calculateOrderTotalServer(
    items: Array<{ productId?: string; id?: string; quantity: number }>,
    customerCountry: string,
    couponCode?: string
  ) {
    let dbProducts = (await getStoreValue<any[]>('products')) || [];
    if (!dbProducts || dbProducts.length === 0) {
      dbProducts = INITIAL_PRODUCTS;
    }

    let subtotalINR = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const pId = item.productId || item.id;
      const prod = dbProducts.find((p) => p.id === pId);
      if (!prod) continue;
      const qty = Math.max(1, Math.min(100, Number(item.quantity) || 1));
      const itemPrice = Number(prod.priceINR ?? prod.price) || 0;
      subtotalINR += itemPrice * qty;
      validatedItems.push({
        product: prod,
        quantity: qty,
        unitPriceINR: itemPrice,
        totalPriceINR: itemPrice * qty,
      });
    }

    if (validatedItems.length === 0 && items.length > 0) {
      throw new Error('Invalid cart products or unavailable items.');
    }

    let discountINR = 0;
    if (couponCode) {
      const coupons = (await getStoreValue<any[]>('coupons')) || [];
      const validCoupon = coupons.find(
        (c) => c.code?.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive !== false
      );
      if (validCoupon) {
        if (validCoupon.discountType === 'PERCENTAGE' || validCoupon.type === 'PERCENTAGE' || validCoupon.discountType === 'PERCENT') {
          discountINR = Math.round((subtotalINR * (validCoupon.discountValue || validCoupon.value || 0)) / 100);
        } else {
          discountINR = Math.round(validCoupon.discountValue || validCoupon.value || 0);
        }
        discountINR = Math.min(discountINR, subtotalINR);
      }
    }

    const taxableAmount = Math.max(0, subtotalINR - discountINR);
    const taxINR = Math.round(taxableAmount * 0.05);

    const countryNormalized = (customerCountry || '').trim().toLowerCase();
    const isIndia = countryNormalized === 'india' || countryNormalized === 'in';

    let shippingFeeINR = 0;
    if (isIndia) {
      shippingFeeINR = taxableAmount >= 999 ? 0 : 99;
    } else {
      shippingFeeINR = taxableAmount >= 2500 ? 0 : 499;
    }

    const grandTotalINR = Math.max(1, Math.round(taxableAmount + shippingFeeINR));

    return {
      subtotalINR,
      discountINR,
      taxINR,
      shippingFeeINR,
      grandTotalINR,
      validatedItems,
      isIndia,
    };
  }

  // 1. Create Razorpay Order Endpoint
  app.post('/api/payments/razorpay/create-order', async (req, res) => {
    try {
      const { items, customer, couponCode, currencyCode } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Cart items are required.' });
      }
      if (!customer || !customer.email || !customer.name) {
        return res.status(400).json({ success: false, error: 'Customer details (name & email) are required.' });
      }

      const { subtotalINR, discountINR, taxINR, shippingFeeINR, grandTotalINR, validatedItems, isIndia } =
        await calculateOrderTotalServer(items, customer.country || 'India', couponCode);

      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret) {
        console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing from environment variables.');
      }

      const rzp = getRazorpayInstance();

      // Load active currencies from database store or fallback to INITIAL_CURRENCIES
      const dbCurrencies = (await getStoreValue<any[]>('currencies')) || INITIAL_CURRENCIES;

      // Determine requested currency code and exchange rate
      let requestedCurrency = (currencyCode || '').toString().trim().toUpperCase();
      if (!requestedCurrency) {
        requestedCurrency = isIndia ? 'INR' : 'USD';
      }

      const matchedCurrency = dbCurrencies.find((c: any) => c.code === requestedCurrency) ||
        INITIAL_CURRENCIES.find((c: any) => c.code === requestedCurrency);

      const rateToINR = matchedCurrency && matchedCurrency.rateToINR ? Number(matchedCurrency.rateToINR) : (requestedCurrency === 'INR' ? 1 : 83.5);

      // Determine display amount and currency
      const displayCurrency = requestedCurrency;
      let displayAmount = grandTotalINR;
      if (displayCurrency !== 'INR') {
        displayAmount = Math.round((grandTotalINR / rateToINR) * 100) / 100;
      }

      // Validated charge currency must be the requested international/display currency
      const validatedChargeCurrency = displayCurrency;
      const chargeAmount = displayAmount;

      // Subunit calculation according to ISO currency decimal rules
      let chargeAmountSubunit: number;
      const zeroDecimalCurrencies = new Set(['JPY', 'KRW', 'UGX', 'VND', 'CLP', 'PYG', 'RWF']);
      const threeDecimalCurrencies = new Set(['BHD', 'KWD', 'OMR']);

      if (zeroDecimalCurrencies.has(validatedChargeCurrency)) {
        chargeAmountSubunit = Math.round(chargeAmount);
      } else if (threeDecimalCurrencies.has(validatedChargeCurrency)) {
        chargeAmountSubunit = Math.round(chargeAmount * 1000);
      } else {
        chargeAmountSubunit = Math.round(chargeAmount * 100);
      }

      const selectedCountry = customer.country || (isIndia ? 'India' : 'International');

      // 1. SAFE LOGGING BEFORE CREATING RAZORPAY ORDER
      console.log('[Razorpay Order Init] Pre-Create Order Payload:', {
        selectedCountry,
        requestedDisplayCurrency: displayCurrency,
        validatedChargeCurrency,
        chargeAmountMajor: chargeAmount,
        chargeAmountSubunit,
      });

      const receipt = `rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      let razorpayOrder;
      try {
        razorpayOrder = await rzp.orders.create({
          amount: chargeAmountSubunit,
          currency: validatedChargeCurrency,
          receipt,
          notes: {
            customer_email: customer.email,
            customer_name: customer.name,
            customer_phone: customer.phone || '',
            customer_country: selectedCountry,
            display_currency: displayCurrency,
            display_amount: displayAmount,
            charge_currency: validatedChargeCurrency,
            charge_amount: chargeAmount,
          },
        });
      } catch (rzpErr: any) {
        console.error(`[Razorpay Order Creation Error] Failed creating order in ${validatedChargeCurrency}:`, rzpErr?.message || rzpErr);
        return res.status(400).json({
          success: false,
          error: 'This currency cannot currently be charged directly. Please review the alternative charge currency.',
          details: rzpErr?.message || `Razorpay order creation failed for currency ${validatedChargeCurrency}`,
        });
      }

      // SAFE LOGGING AFTER CREATING RAZORPAY ORDER
      console.log('[Razorpay Order Init] Razorpay Order Response:', {
        razorpayOrderId: razorpayOrder.id,
        razorpayCurrency: razorpayOrder.currency,
        razorpayAmount: razorpayOrder.amount,
      });

      const localOrderId = `ord-${Date.now()}`;
      const orderNumber = `HV-ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const optionalCustomerToken = req.cookies?.[CUSTOMER_TOKEN_COOKIE];
      const optionalPayload = optionalCustomerToken ? verifyCustomerToken(optionalCustomerToken) : null;
      const customerId = optionalPayload?.id;

      const localOrder = {
        id: localOrderId,
        orderNumber,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        items: validatedItems,
        customer,
        ...(customerId ? { customerId } : {}),
        subtotalINR,
        taxINR,
        shippingFeeINR,
        discountAmountINR: discountINR,
        totalAmountINR: grandTotalINR,

        // Single Source of Truth Currency Metadata
        displayAmount,
        displayCurrency,
        chargeAmount: razorpayOrder.amount ? (razorpayOrder.amount / 100) : chargeAmount,
        chargeCurrency: razorpayOrder.currency || validatedChargeCurrency,
        exchangeRateUsed: rateToINR,
        currencyCode: displayCurrency,

        paymentMethod: 'RAZORPAY',
        paymentStatus: 'Pending Payment',
        trackingStatus: 'ORDER_PLACED',
        razorpayOrderId: razorpayOrder.id,
        receipt,
        trackingNumber: 'Awaiting Fulfillment',
        courierName: isIndia ? 'Express Surface Courier' : 'DHL International Express',
      };

      const existingOrders = (await getStoreValue<any[]>('orders')) || [];
      await setStoreValue('orders', [localOrder, ...existingOrders]);

      return res.json({
        success: true,
        keyId: keyId || 'rzp_test_placeholder',
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        displayAmount,
        displayCurrency,
        chargeAmount: razorpayOrder.amount ? (razorpayOrder.amount / 100) : chargeAmount,
        chargeCurrency: razorpayOrder.currency || validatedChargeCurrency,
        orderId: localOrder.id,
        orderNumber: localOrder.orderNumber,
        grandTotalINR,
        displayOrder: localOrder,
      });
    } catch (error: any) {
      console.error('[Razorpay Create Order Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to create Razorpay order',
      });
    }
  });

  // 2. Verify Razorpay Payment Endpoint
  app.post('/api/payments/razorpay/verify', async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, localOrderId } = req.body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ success: false, error: 'Missing required Razorpay payment parameters.' });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        console.error('[Razorpay Verify Error] Server configuration error: RAZORPAY_KEY_SECRET is not configured. Failing closed.');
        return res.status(500).json({
          success: false,
          error: 'Payment verification cannot be processed due to missing server configuration.',
        });
      }

      // HMAC SHA256 Verification
      const hmac = crypto.createHmac('sha256', keySecret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpay_signature) {
        console.error('[Razorpay Verify] Invalid signature mismatch!');
        return res.status(400).json({
          success: false,
          error: 'Razorpay payment signature verification failed. Invalid HMAC signature.',
        });
      }

      // Double-check with Razorpay SDK
      try {
        const rzp = getRazorpayInstance();
        const paymentDetails = await rzp.payments.fetch(razorpay_payment_id);
        if (paymentDetails && paymentDetails.status !== 'captured' && paymentDetails.status !== 'authorized') {
          return res.status(400).json({
            success: false,
            error: `Razorpay payment is not confirmed (status: ${paymentDetails.status}).`,
          });
        }
      } catch (fetchErr: any) {
        console.warn('[Razorpay Fetch Payment Warning]:', fetchErr?.message || fetchErr);
      }

      // Update local order in SQLite DB
      const existingOrders = (await getStoreValue<any[]>('orders')) || [];
      const orderIndex = existingOrders.findIndex(
        (o) => o.id === localOrderId || o.razorpayOrderId === razorpay_order_id
      );

      if (orderIndex === -1) {
        return res.status(404).json({ success: false, error: 'Order reference not found on server.' });
      }

      const orderToUpdate = existingOrders[orderIndex];

      // Idempotency guard: if already marked paid, return success directly
      if (orderToUpdate.paymentStatus === 'PAID' || orderToUpdate.paymentStatus === 'Paid') {
        return res.json({
          success: true,
          order: orderToUpdate,
          message: 'Order was already verified and marked paid.',
        });
      }

      const updatedOrder = {
        ...orderToUpdate,
        paymentStatus: 'Paid',
        trackingStatus: 'ORDER_PLACED',
        razorpayPaymentId: razorpay_payment_id,
        paidAt: new Date().toISOString(),
      };

      existingOrders[orderIndex] = updatedOrder;
      await setStoreValue('orders', existingOrders);

      // Stock Deduction
      if (updatedOrder.items && Array.isArray(updatedOrder.items)) {
        const dbProducts = (await getStoreValue<any[]>('products')) || [];
        const updatedProducts = dbProducts.map((prod: any) => {
          const itemMatch = updatedOrder.items.find(
            (i: any) => (i.product && i.product.id === prod.id) || i.productId === prod.id || (i.id === prod.id)
          );
          if (itemMatch) {
            const currentStock = typeof prod.stock === 'number' ? prod.stock : 100;
            const newStock = Math.max(0, currentStock - (itemMatch.quantity || 1));
            return {
              ...prod,
              stock: newStock,
              inStock: newStock > 0,
            };
          }
          return prod;
        });
        await setStoreValue('products', updatedProducts);
      }

      // Add PaymentLog
      const paymentLogs = (await getStoreValue<any[]>('payment_logs')) || [];
      const newLog = {
        id: `log-${Date.now()}`,
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customer.name,
        customerEmail: updatedOrder.customer.email,
        gateway: 'RAZORPAY',
        amount: updatedOrder.totalAmountINR,
        currency: 'INR',
        amountINR: updatedOrder.totalAmountINR,
        status: 'SUCCESSFUL',
        transactionId: razorpay_payment_id,
        paymentMethodDetails: 'Razorpay Secure Checkout',
        createdAt: new Date().toISOString(),
      };
      await setStoreValue('payment_logs', [newLog, ...paymentLogs]);

      // Non-blocking Shiprocket order creation if configured
      if (isShiprocketConfigured()) {
        createShiprocketOrder(updatedOrder).catch((srErr) => {
          console.warn('[Shiprocket Order Creation Error]:', srErr?.message || srErr);
        });
      }

      return res.json({
        success: true,
        order: updatedOrder,
        paymentId: razorpay_payment_id,
      });
    } catch (error: any) {
      console.error('[Razorpay Verify Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Payment verification failed.',
      });
    }
  });

  // 3. Create Cash on Delivery (COD) Order Endpoint
  app.post('/api/payments/cod/create-order', async (req, res) => {
    try {
      const { items, customer, couponCode } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Cart items are required.' });
      }
      if (!customer || !customer.email || !customer.name) {
        return res.status(400).json({ success: false, error: 'Customer details are required.' });
      }

      const countryNormalized = (customer.country || '').trim().toLowerCase();
      const isIndia = countryNormalized === 'india' || countryNormalized === 'in';

      if (!isIndia) {
        return res.status(400).json({
          success: false,
          error: 'Cash on Delivery (COD) is strictly available only for shipments within India.',
        });
      }

      const { subtotalINR, discountINR, taxINR, shippingFeeINR, grandTotalINR, validatedItems } =
        await calculateOrderTotalServer(items, customer.country || 'India', couponCode);

      const localOrderId = `ord-${Date.now()}`;
      const orderNumber = `HV-ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const optionalCustomerToken = req.cookies?.[CUSTOMER_TOKEN_COOKIE];
      const optionalPayload = optionalCustomerToken ? verifyCustomerToken(optionalCustomerToken) : null;
      const customerId = optionalPayload?.id;

      const newOrder = {
        id: localOrderId,
        orderNumber,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        items: validatedItems,
        customer,
        ...(customerId ? { customerId } : {}),
        subtotalINR,
        taxINR,
        shippingFeeINR,
        discountAmountINR: discountINR,
        totalAmountINR: grandTotalINR,
        currencyCode: 'INR',
        paymentMethod: 'COD',
        paymentStatus: 'COD Confirmed',
        trackingStatus: 'Pending Fulfillment',
        trackingNumber: 'Awaiting Fulfillment',
        courierName: 'Express Surface Courier (COD)',
      };

      const existingOrders = (await getStoreValue<any[]>('orders')) || [];
      await setStoreValue('orders', [newOrder, ...existingOrders]);

      // Stock Deduction for COD
      const dbProducts = (await getStoreValue<any[]>('products')) || [];
      const updatedProducts = dbProducts.map((prod: any) => {
        const itemMatch = validatedItems.find((i: any) => (i.product && i.product.id === prod.id) || i.productId === prod.id || i.id === prod.id);
        if (itemMatch) {
          const currentStock = typeof prod.stock === 'number' ? prod.stock : 100;
          const newStock = Math.max(0, currentStock - (itemMatch.quantity || 1));
          return {
            ...prod,
            stock: newStock,
            inStock: newStock > 0,
          };
        }
        return prod;
      });
      await setStoreValue('products', updatedProducts);

      // Add PaymentLog for COD
      const paymentLogs = (await getStoreValue<any[]>('payment_logs')) || [];
      const newLog = {
        id: `log-${Date.now()}`,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customer.name,
        customerEmail: newOrder.customer.email,
        gateway: 'COD',
        amount: grandTotalINR,
        currency: 'INR',
        amountINR: grandTotalINR,
        status: 'PENDING',
        transactionId: `COD_${orderNumber}`,
        paymentMethodDetails: 'Cash on Delivery',
        createdAt: new Date().toISOString(),
      };
      await setStoreValue('payment_logs', [newLog, ...paymentLogs]);

      // Shiprocket Creation for COD
      if (isShiprocketConfigured()) {
        createShiprocketOrder(newOrder).catch((srErr) => {
          console.warn('[Shiprocket COD Order Creation Error]:', srErr?.message || srErr);
        });
      }

      return res.json({
        success: true,
        order: newOrder,
      });
    } catch (error: any) {
      console.error('[COD Create Order Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to create Cash on Delivery order',
      });
    }
  });

  // 4. Razorpay Webhook Endpoint
  app.post('/api/webhooks/razorpay', async (req, res) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      if (webhookSecret) {
        const signature = req.headers['x-razorpay-signature'] as string;
        const shasum = crypto.createHmac('sha256', webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');
        if (digest !== signature) {
          console.error('[Razorpay Webhook] Invalid signature mismatch');
          return res.status(400).json({ status: 'invalid_signature' });
        }
      }

      const event = req.body?.event;
      const payload = req.body?.payload;

      if (event === 'payment.captured' || event === 'order.paid') {
        const paymentEntity = payload?.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id || payload?.order?.entity?.id;
        const razorpayPaymentId = paymentEntity?.id;

        if (razorpayOrderId) {
          const existingOrders = (await getStoreValue<any[]>('orders')) || [];
          const orderIdx = existingOrders.findIndex((o) => o.razorpayOrderId === razorpayOrderId);

          if (orderIdx !== -1 && existingOrders[orderIdx].paymentStatus !== 'Paid') {
            existingOrders[orderIdx] = {
              ...existingOrders[orderIdx],
              paymentStatus: 'Paid',
              trackingStatus: 'ORDER_PLACED',
              razorpayPaymentId: razorpayPaymentId || existingOrders[orderIdx].razorpayPaymentId,
              paidAt: new Date().toISOString(),
            };
            await setStoreValue('orders', existingOrders);

            // Deduct stock
            const targetOrder = existingOrders[orderIdx];
            if (targetOrder.items) {
              const dbProducts = (await getStoreValue<any[]>('products')) || [];
              const updatedProds = dbProducts.map((p) => {
                const itemMatch = targetOrder.items.find(
                  (i: any) => (i.product && i.product.id === p.id) || i.productId === p.id || i.id === p.id
                );
                if (itemMatch) {
                  const stock = typeof p.stock === 'number' ? p.stock : 100;
                  const newStock = Math.max(0, stock - (itemMatch.quantity || 1));
                  return { ...p, stock: newStock, inStock: newStock > 0 };
                }
                return p;
              });
              await setStoreValue('products', updatedProds);
            }
          }
        }
      }

      return res.json({ status: 'ok' });
    } catch (err: any) {
      console.error('[Razorpay Webhook Error]:', err);
      return res.status(500).json({ status: 'error', error: err.message });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Cache hashed static assets immutably for 1 year
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true,
    }));
    app.use(express.static(distPath, {
      maxAge: 0,
      setHeaders: (res, filepath) => {
        if (filepath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    }));
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

