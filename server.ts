import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

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

  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // Static serving for persistent uploaded media
  app.use('/uploads', express.static(uploadDir));

  // Health Check Endpoint for Nginx / Docker / Hostinger VPS monitoring
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

