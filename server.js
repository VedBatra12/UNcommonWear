import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import QRCode from 'qrcode';

import dotenv from 'dotenv';
dotenv.config();

import {
  getAllDesigns,
  getDesignByCode,
  getDesignById,
  addDesign,
  updateDesign,
  deleteDesign,
  getNextDesignCode,
  getCategories,
  getAllCategories,
  updateCategories,
  getFilterMetadata,
  recordCatalogueView,
  recordDesignView,
  recordSearch,
  recordCopyAction,
  getAnalyticsSummary,
  getSettings,
  updateSettings,
  verifyAdminPin,
  loadDatabase
} from './db/store.js';
import { supabase } from './db/supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Setup directories
const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage: Use memory storage so we can upload directly to Supabase Storage & local disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static files
app.use(express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));

// -------------------------------------------------------------------
// PUBLIC CATALOGUE API
// -------------------------------------------------------------------

// List designs with filters, search, sort, and pagination
app.get('/api/designs', (req, res) => {
  try {
    const {
      search,
      category,
      style,
      mood,
      color,
      tag,
      sort,
      limit = '24',
      offset = '0'
    } = req.query;

    if (search) {
      recordSearch(search);
    }

    const result = getAllDesigns({
      search,
      category,
      style,
      mood,
      color,
      tag,
      sort,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      includeHidden: false
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching designs:', err);
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
});

// Get single design by code
app.get('/api/designs/:code', (req, res) => {
  try {
    const { code } = req.params;
    const design = getDesignByCode(code);
    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }
    res.json(design);
  } catch (err) {
    console.error('Error fetching design detail:', err);
    res.status(500).json({ error: 'Failed to fetch design' });
  }
});

// Record design view
app.post('/api/designs/:code/view', (req, res) => {
  const { code } = req.params;
  recordDesignView(code);
  res.json({ ok: true });
});

// Record design code copy (show to cart team)
app.post('/api/designs/:code/copy', (req, res) => {
  const { code } = req.params;
  recordCopyAction(code);
  res.json({ ok: true });
});

// Get categories
app.get('/api/categories', (req, res) => {
  res.json(getCategories());
});

// Get filter metadata (categories, styles, moods, colors, tags)
app.get('/api/filters', (req, res) => {
  res.json(getFilterMetadata());
});

// Record catalogue page impression
app.post('/api/analytics/track', (req, res) => {
  const { type, query, code } = req.body;
  if (type === 'catalogue_view') {
    recordCatalogueView();
  } else if (type === 'search' && query) {
    recordSearch(query);
  } else if (type === 'copy' && code) {
    recordCopyAction(code);
  }
  res.json({ ok: true });
});

// Brand Settings (public read)
app.get('/api/settings', (req, res) => {
  const settings = getSettings();
  // Never expose admin pin
  const { adminPin, ...safeSettings } = settings;
  res.json(safeSettings);
});

// -------------------------------------------------------------------
// DYNAMIC QR CODE GENERATOR
// -------------------------------------------------------------------
app.get('/api/qr', async (req, res) => {
  try {
    const host = req.get('host');
    const protocol = req.protocol;
    const defaultUrl = `${protocol}://${host}/designs`;
    
    const targetUrl = req.query.url || defaultUrl;
    const format = (req.query.format || 'svg').toLowerCase(); // 'svg' or 'png'
    const darkColor = req.query.dark || '#000000';
    const lightColor = req.query.light || '#ffffff';
    const margin = parseInt(req.query.margin || '2', 10);
    const size = parseInt(req.query.size || '1200', 10);
    const download = req.query.download === 'true';

    const qrOptions = {
      errorCorrectionLevel: 'H',
      margin,
      color: {
        dark: darkColor,
        light: lightColor
      }
    };

    if (format === 'svg') {
      const svgString = await QRCode.toString(targetUrl, { ...qrOptions, type: 'svg' });
      if (download) {
        res.setHeader('Content-Disposition', 'attachment; filename="UNCommon-weaR-Cart-QR.svg"');
      }
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(svgString);
    } else {
      const buffer = await QRCode.toBuffer(targetUrl, { ...qrOptions, width: size });
      if (download) {
        res.setHeader('Content-Disposition', 'attachment; filename="UNCommon-weaR-Cart-QR.png"');
      }
      res.setHeader('Content-Type', 'image/png');
      return res.send(buffer);
    }
  } catch (err) {
    console.error('Error generating QR code:', err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// -------------------------------------------------------------------
// ADMIN PORTAL API
// -------------------------------------------------------------------

// Admin PIN check middleware for write operations
function checkAdminAuth(req, res, next) {
  const pin = req.headers['x-admin-pin'] || req.query.pin || req.body.pin;
  if (!verifyAdminPin(pin)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin PIN' });
  }
  next();
}

// Verify PIN endpoint
app.post('/api/admin/verify-pin', (req, res) => {
  const { pin } = req.body;
  if (verifyAdminPin(pin)) {
    res.json({ ok: true, message: 'Authenticated' });
  } else {
    res.status(401).json({ ok: false, error: 'Invalid PIN' });
  }
});

// Get admin designs (including hidden)
app.get('/api/admin/designs', checkAdminAuth, (req, res) => {
  const result = getAllDesigns({
    search: req.query.search,
    category: req.query.category,
    sort: req.query.sort || 'code',
    limit: 1000,
    offset: 0,
    includeHidden: true
  });
  res.json(result);
});

// Add single design
app.post('/api/admin/designs', checkAdminAuth, (req, res) => {
  try {
    const newDesign = addDesign(req.body);
    res.status(201).json(newDesign);
  } catch (err) {
    console.error('Error creating design:', err);
    res.status(500).json({ error: 'Failed to create design' });
  }
});

// Update design
app.put('/api/admin/designs/:id', checkAdminAuth, (req, res) => {
  try {
    const updated = updateDesign(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Design not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating design:', err);
    res.status(500).json({ error: 'Failed to update design' });
  }
});

// Delete design
app.delete('/api/admin/designs/:id', checkAdminAuth, (req, res) => {
  try {
    const deleted = deleteDesign(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Design not found' });
    }
    res.json({ ok: true, message: 'Design deleted' });
  } catch (err) {
    console.error('Error deleting design:', err);
    res.status(500).json({ error: 'Failed to delete design' });
  }
});

// Bulk Image Upload (Drag & Drop multiple artworks)
app.post('/api/admin/bulk-upload', checkAdminAuth, upload.array('artworks', 50), async (req, res) => {
  try {
    const files = req.files || [];
    const defaultCategory = req.body.category || 'GRAPHIC';
    const defaultTags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : ['streetwear', 'new'];

    const created = [];
    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `art_${Date.now()}_${safeName}${ext}`;
      const rawName = path.basename(file.originalname, ext).replace(/[_-]+/g, ' ').toUpperCase();
      const code = getNextDesignCode();
      
      let imagePath = `/uploads/${filename}`;

      // Save local backup file
      try {
        fs.writeFileSync(path.join(UPLOADS_DIR, filename), file.buffer);
      } catch (e) {
        console.warn('Could not write local upload file:', e.message);
      }

      // Upload to Supabase Storage if configured
      if (supabase) {
        try {
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from('artworks')
            .upload(filename, file.buffer, {
              contentType: file.mimetype || 'image/png',
              upsert: true
            });

          if (!uploadErr && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from('artworks')
              .getPublicUrl(filename);
            if (publicUrlData && publicUrlData.publicUrl) {
              imagePath = publicUrlData.publicUrl;
            }
          } else if (uploadErr) {
            console.warn('Supabase storage upload notice:', uploadErr.message);
          }
        } catch (storageErr) {
          console.warn('Supabase storage upload error:', storageErr.message);
        }
      }

      const design = addDesign({
        code,
        name: rawName || `DESIGN ${code}`,
        image: imagePath,
        mockupImage: imagePath,
        category: defaultCategory,
        tags: defaultTags,
        style: 'Modern',
        mood: 'Aesthetic',
        color: 'Monochrome',
        description: `${rawName} artwork ready for custom cart printing.`,
        featured: false,
        status: 'published'
      });
      created.push(design);
    }

    res.json({
      ok: true,
      count: created.length,
      designs: created
    });
  } catch (err) {
    console.error('Error handling bulk upload:', err);
    res.status(500).json({ error: 'Bulk upload failed' });
  }
});

// CSV / JSON Bulk Import
app.post('/api/admin/import-csv', checkAdminAuth, (req, res) => {
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'No valid rows provided for import' });
    }

    const imported = [];
    for (const row of rows) {
      if (!row.name && !row.code) continue;
      const design = addDesign({
        code: row.code,
        name: row.name,
        image: row.image || '/assets/designs/UW-001-art.svg',
        mockupImage: row.mockupImage || row.image || '/assets/mockups/UW-001-mockup.svg',
        category: (row.category || 'OTHERS').toUpperCase(),
        tags: row.tags ? (typeof row.tags === 'string' ? row.tags.split(',') : row.tags) : [],
        style: row.style || 'Modern',
        mood: row.mood || 'Aesthetic',
        color: row.color || 'Monochrome',
        description: row.description || '',
        featured: row.featured === 'true' || row.featured === true,
        status: row.status === 'hidden' ? 'hidden' : 'published'
      });
      imported.push(design);
    }

    res.json({ ok: true, count: imported.length, imported });
  } catch (err) {
    console.error('Error importing CSV/JSON:', err);
    res.status(500).json({ error: 'Import failed' });
  }
});

// Export CSV of all designs
app.get('/api/admin/export-csv', checkAdminAuth, (req, res) => {
  try {
    const result = getAllDesigns({ limit: 5000, offset: 0, includeHidden: true });
    const headers = ['Code', 'Name', 'Category', 'Style', 'Mood', 'Color', 'Tags', 'Featured', 'Status', 'Views', 'Copies', 'Description', 'Image', 'MockupImage'];
    
    const lines = [headers.join(',')];
    for (const d of result.designs) {
      const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      lines.push([
        escape(d.code),
        escape(d.name),
        escape(d.category),
        escape(d.style),
        escape(d.mood),
        escape(d.color),
        escape((d.tags || []).join('; ')),
        escape(d.featured ? 'true' : 'false'),
        escape(d.status),
        escape(d.views || 0),
        escape(d.copies || 0),
        escape(d.description),
        escape(d.image),
        escape(d.mockupImage)
      ].join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="UNCommon-weaR-Designs.csv"');
    res.send(lines.join('\n'));
  } catch (err) {
    console.error('Error exporting CSV:', err);
    res.status(500).json({ error: 'Export failed' });
  }
});

// Category Management
app.get('/api/admin/categories', checkAdminAuth, (req, res) => {
  res.json(getAllCategories());
});

app.post('/api/admin/categories', checkAdminAuth, (req, res) => {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: 'Categories must be an array' });
    }
    const updated = updateCategories(categories);
    res.json(updated);
  } catch (err) {
    console.error('Error updating categories:', err);
    res.status(500).json({ error: 'Failed to update categories' });
  }
});

// Analytics Dashboard
app.get('/api/analytics', (req, res) => {
  res.json(getAnalyticsSummary());
});

// Settings Management
app.post('/api/admin/settings', checkAdminAuth, (req, res) => {
  try {
    const updated = updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// -------------------------------------------------------------------
// HTML5 CLIENT ROUTING FALLBACKS
// -------------------------------------------------------------------

// Admin URL
app.get('/admin', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'admin.html'));
});

// Designs public page
app.get(['/designs', '/designs/*', '/design/:code'], (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Root redirect to /designs
app.get('/', (req, res) => {
  res.redirect('/designs');
});

// Catch-all SPA fallback
app.get('*', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Start Server (only when run directly, not in Vercel serverless function environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`UNCommon weaR Digital Design Catalogue Server`);
    console.log(`Running on: http://localhost:${PORT}/designs`);
    console.log(`Admin Panel: http://localhost:${PORT}/admin (PIN: 1337)`);
    console.log(`Live Cart QR Endpoint: http://localhost:${PORT}/api/qr`);
    console.log(`====================================================`);
  });
}

export default app;
