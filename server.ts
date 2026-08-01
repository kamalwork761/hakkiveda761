import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import compression from 'compression';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { getDb, getStoreValue, setStoreValue, getAllStoreData, getPublicStoreData } from './src/server/db';
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
import { INITIAL_HERO_SLIDES } from './src/data/initialData';

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
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

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

  // Full Store Persistence API Routes (Admin data included)
  app.get('/api/store', async (_req, res) => {
    try {
      const data = await getAllStoreData();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to fetch store data' });
    }
  });

  app.get('/api/store/:key', async (req, res) => {
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

  app.put('/api/store/:key', handleStoreKeySave);
  app.post('/api/store/:key', handleStoreKeySave);

  app.post('/api/store-bulk', async (req, res) => {
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
  app.get('/api/shiprocket/status', (_req, res) => {
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
  app.post('/api/shiprocket/create-order', async (req, res) => {
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
  app.post('/api/shiprocket/generate-awb', async (req, res) => {
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
  app.post('/api/shiprocket/schedule-pickup', async (req, res) => {
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
  app.post('/api/shiprocket/generate-label', async (req, res) => {
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
  app.post('/api/shiprocket/generate-invoice', async (req, res) => {
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
  app.post('/api/products', async (req, res) => {
    const products = req.body.value !== undefined ? req.body.value : (req.body.data !== undefined ? req.body.data : req.body);
    await setStoreValue('products', products);
    res.json({ success: true, message: 'Products saved successfully.', data: products, value: products });
  });

  app.get('/api/categories', async (_req, res) => {
    const categories = (await getStoreValue('categories')) || [];
    res.json({ success: true, data: categories, value: categories });
  });
  app.post('/api/categories', async (req, res) => {
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
  app.put('/api/hero-slides', handleHeroSlidesSave);
  app.post('/api/hero-slides', handleHeroSlidesSave);

  app.get('/api/announcements', async (_req, res) => {
    const settings = (await getStoreValue('site_settings')) || {};
    res.json({ success: true, data: settings.announcementText || '' });
  });
  app.post('/api/announcements', async (req, res) => {
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
  app.post('/api/navigation-menu', async (req, res) => {
    const navLinks = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('nav_links', navLinks);
    res.json({ success: true, message: 'Navigation menu saved successfully.' });
  });

  app.get('/api/reviews', async (_req, res) => {
    const reviews = (await getStoreValue('reviews')) || [];
    res.json({ success: true, data: reviews });
  });
  app.post('/api/reviews', async (req, res) => {
    const reviews = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('reviews', reviews);
    res.json({ success: true, message: 'Reviews saved successfully.' });
  });

  app.get('/api/blogs', async (_req, res) => {
    const blogs = (await getStoreValue('blogs')) || [];
    res.json({ success: true, data: blogs });
  });
  app.post('/api/blogs', async (req, res) => {
    const blogs = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('blogs', blogs);
    res.json({ success: true, message: 'Blogs saved successfully.' });
  });

  app.get('/api/video-testimonials', async (_req, res) => {
    const vids = (await getStoreValue('testimonial_videos')) || [];
    res.json({ success: true, data: vids });
  });
  app.post('/api/video-testimonials', async (req, res) => {
    const vids = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('testimonial_videos', vids);
    res.json({ success: true, message: 'Video testimonials saved successfully.' });
  });

  app.get('/api/media-gallery', async (_req, res) => {
    const media = (await getStoreValue('media_items')) || [];
    res.json({ success: true, data: media });
  });
  app.post('/api/media-gallery', async (req, res) => {
    const media = req.body.data !== undefined ? req.body.data : req.body;
    await setStoreValue('media_items', media);
    res.json({ success: true, message: 'Media gallery saved successfully.' });
  });

  app.get('/api/quiz-questions', async (_req, res) => {
    const quiz = (await getStoreValue('quiz_questions')) || [];
    res.json({ success: true, data: quiz });
  });
  app.post('/api/quiz-questions', async (req, res) => {
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
  app.post('/api/settings', async (req, res) => {
    const { siteSettings, brandIdentity, headerLayoutSettings } = req.body;
    if (siteSettings) await setStoreValue('site_settings', siteSettings);
    if (brandIdentity) await setStoreValue('brand_identity', brandIdentity);
    if (headerLayoutSettings) await setStoreValue('header_layout_settings', headerLayoutSettings);
    res.json({ success: true, message: 'Website settings saved successfully.' });
  });

  // Production-Ready Media Upload Endpoint supporting high-res images & hero videos
  app.post('/api/upload', (req, res) => {
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

