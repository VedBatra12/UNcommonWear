import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache
let db = {
  designs: [],
  categories: [],
  analytics: {
    catalogueViews: 0,
    searches: {},
    categoryViews: {},
    designViews: {},
    copyActions: {}
  },
  settings: {
    adminPin: '1337',
    brandName: 'UNCommon weaR',
    tagline: 'Created by you. Crafted by us.',
    subline: 'Find something that feels like you.',
    instagramHandle: '@uncommonwear.official',
    instagramUrl: 'https://instagram.com/uncommonwear.official',
    cartQrTargetUrl: '/designs'
  }
};

let isSupabaseOnline = false;

// Load database from Supabase with fallback to local JSON file
export async function loadDatabase() {
  // First load from local file for instant availability
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      const loaded = JSON.parse(content);
      db = {
        ...db,
        ...loaded,
        analytics: { ...db.analytics, ...(loaded.analytics || {}) },
        settings: { ...db.settings, ...(loaded.settings || {}) }
      };
    }
  } catch (err) {
    console.error('Local database read fallback error:', err.message);
  }

  // Then sync from Supabase if reachable
  if (supabase) {
    try {
      const [
        { data: designs, error: desErr },
        { data: categories, error: catErr },
        { data: settings, error: setErr },
        { data: analytics, error: anaErr }
      ] = await Promise.all([
        supabase.from('designs').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('settings').select('*'),
        supabase.from('analytics').select('*').limit(1)
      ]);

      if (!desErr && designs && designs.length > 0) {
        db.designs = designs.map(d => ({
          id: d.id,
          code: d.code,
          name: d.name,
          image: d.image,
          mockupImage: d.mockup_image || d.image,
          category: d.category,
          tags: d.tags || [],
          style: d.style,
          mood: d.mood,
          color: d.color,
          description: d.description,
          featured: Boolean(d.featured),
          status: d.status,
          views: d.views || 0,
          copies: d.copies || 0,
          order: d.order,
          createdAt: d.created_at
        }));
      }

      if (!catErr && categories && categories.length > 0) {
        db.categories = categories;
      }

      if (!setErr && settings && settings.length > 0) {
        const settingsMap = {};
        settings.forEach(s => {
          settingsMap[s.key] = s.value;
        });
        db.settings = { ...db.settings, ...settingsMap };
      }

      if (!anaErr && analytics && analytics.length > 0) {
        const a = analytics[0];
        db.analytics = {
          catalogueViews: a.catalogue_views || 0,
          searches: a.searches || {},
          categoryViews: a.category_views || {},
          designViews: a.design_views || {},
          copyActions: a.copy_actions || {}
        };
      }

      isSupabaseOnline = true;
      console.log('⚡ Synced with Supabase successfully.');
    } catch (err) {
      console.warn('⚠️ Supabase connection failed or tables not ready, using local data:', err.message);
    }
  }

  saveDatabaseLocal();
  return db;
}

// Save local fallback atomically
function saveDatabaseLocal() {
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    } catch (e) {
      console.error('Fatal local database save error:', e.message);
    }
  }
}

export function saveDatabase() {
  saveDatabaseLocal();
}

// Background sync to Supabase
async function syncDesignToSupabase(design) {
  if (!supabase || !isSupabaseOnline) return;
  try {
    await supabase.from('designs').upsert({
      id: design.id,
      code: design.code,
      name: design.name,
      image: design.image,
      mockup_image: design.mockupImage,
      category: design.category,
      tags: design.tags,
      style: design.style,
      mood: design.mood,
      color: design.color,
      description: design.description,
      featured: design.featured,
      status: design.status,
      views: design.views || 0,
      copies: design.copies || 0,
      order: design.order,
      created_at: design.createdAt
    }, { onConflict: 'id' });
  } catch (err) {
    console.error('Supabase sync design error:', err.message);
  }
}

async function deleteDesignFromSupabase(id) {
  if (!supabase || !isSupabaseOnline) return;
  try {
    await supabase.from('designs').delete().eq('id', id);
  } catch (err) {
    console.error('Supabase delete design error:', err.message);
  }
}

async function syncSettingsToSupabase(newSettings) {
  if (!supabase || !isSupabaseOnline) return;
  try {
    const rows = Object.entries(newSettings).map(([key, value]) => ({ key, value }));
    await supabase.from('settings').upsert(rows, { onConflict: 'key' });
  } catch (err) {
    console.error('Supabase sync settings error:', err.message);
  }
}

async function syncCategoriesToSupabase(categories) {
  if (!supabase || !isSupabaseOnline) return;
  try {
    await supabase.from('categories').upsert(categories, { onConflict: 'id' });
  } catch (err) {
    console.error('Supabase sync categories error:', err.message);
  }
}

let analyticsSyncTimeout = null;
function scheduleAnalyticsSync() {
  if (!supabase || !isSupabaseOnline) return;
  if (analyticsSyncTimeout) return;
  analyticsSyncTimeout = setTimeout(async () => {
    analyticsSyncTimeout = null;
    try {
      await supabase.from('analytics').upsert({
        id: 'current',
        catalogue_views: db.analytics.catalogueViews,
        searches: db.analytics.searches,
        category_views: db.analytics.categoryViews,
        design_views: db.analytics.designViews,
        copy_actions: db.analytics.copyActions,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch (e) {
      console.error('Error syncing analytics to Supabase:', e.message);
    }
  }, 5000);
}

// Initial bootstrap
loadDatabase();

// --- Design CRUD Helpers ---

export function getAllDesigns({
  search = '',
  category = '',
  style = '',
  mood = '',
  color = '',
  tag = '',
  sort = 'featured',
  limit = 24,
  offset = 0,
  includeHidden = false
} = {}) {
  let list = db.designs.filter(d => includeHidden || d.status === 'published');

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(d => {
      const codeMatch = d.code.toLowerCase().includes(q);
      const nameMatch = d.name.toLowerCase().includes(q);
      const catMatch = d.category.toLowerCase().includes(q);
      const descMatch = (d.description || '').toLowerCase().includes(q);
      const tagMatch = (d.tags || []).some(t => t.toLowerCase().includes(q));
      const styleMatch = (d.style || '').toLowerCase().includes(q);
      const moodMatch = (d.mood || '').toLowerCase().includes(q);
      return codeMatch || nameMatch || catMatch || descMatch || tagMatch || styleMatch || moodMatch;
    });
  }

  if (category && category !== 'ALL') {
    const catUpper = category.trim().toUpperCase();
    list = list.filter(d => d.category.toUpperCase() === catUpper);
  }

  if (style && style !== 'ALL') {
    list = list.filter(d => d.style && d.style.toLowerCase() === style.toLowerCase());
  }

  if (mood && mood !== 'ALL') {
    list = list.filter(d => d.mood && d.mood.toLowerCase() === mood.toLowerCase());
  }

  if (color && color !== 'ALL') {
    list = list.filter(d => d.color && d.color.toLowerCase() === color.toLowerCase());
  }

  if (tag && tag !== 'ALL') {
    const tagLower = tag.toLowerCase();
    list = list.filter(d => (d.tags || []).some(t => t.toLowerCase() === tagLower));
  }

  switch (sort) {
    case 'featured':
      list.sort((a, b) => {
        if (a.featured !== b.featured) return b.featured ? 1 : -1;
        return (a.order || 0) - (b.order || 0);
      });
      break;
    case 'popular':
      list.sort((a, b) => ((b.views || 0) + (b.copies || 0) * 3) - ((a.views || 0) + (a.copies || 0) * 3));
      break;
    case 'newest':
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      break;
    case 'az':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'code':
      list.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
      break;
    default:
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  const total = list.length;
  const paginated = limit ? list.slice(offset, offset + limit) : list;

  return {
    total,
    offset,
    limit,
    hasMore: offset + paginated.length < total,
    designs: paginated
  };
}

export function getDesignByCode(code, includeHidden = false) {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  return db.designs.find(d => d.code.toUpperCase() === normalized && (includeHidden || d.status === 'published')) || null;
}

export function getDesignById(id) {
  return db.designs.find(d => d.id === id) || null;
}

export function addDesign(designData) {
  let code = designData.code ? designData.code.trim().toUpperCase() : getNextDesignCode();
  
  let suffix = 1;
  const baseCode = code;
  while (db.designs.some(d => d.code.toUpperCase() === code)) {
    code = `${baseCode}-${suffix++}`;
  }

  const newDesign = {
    id: designData.id || `des_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    code,
    name: (designData.name || 'Untitled Design').trim(),
    image: designData.image || '',
    mockupImage: designData.mockupImage || designData.image || '',
    category: (designData.category || 'OTHERS').toUpperCase(),
    tags: Array.isArray(designData.tags) ? designData.tags : (designData.tags ? designData.tags.split(',').map(s => s.trim()).filter(Boolean) : []),
    style: designData.style || 'Modern',
    mood: designData.mood || 'Aesthetic',
    color: designData.color || 'Monochrome',
    description: designData.description || '',
    featured: Boolean(designData.featured),
    status: designData.status === 'hidden' ? 'hidden' : 'published',
    views: 0,
    copies: 0,
    order: db.designs.length + 1,
    createdAt: new Date().toISOString()
  };

  db.designs.push(newDesign);
  saveDatabase();
  syncDesignToSupabase(newDesign);
  return newDesign;
}

export function updateDesign(id, updates) {
  const index = db.designs.findIndex(d => d.id === id || d.code.toUpperCase() === id.toUpperCase());
  if (index === -1) return null;

  const current = db.designs[index];
  
  let tags = current.tags;
  if (updates.tags !== undefined) {
    tags = Array.isArray(updates.tags) ? updates.tags : updates.tags.split(',').map(s => s.trim()).filter(Boolean);
  }

  let code = current.code;
  if (updates.code && updates.code.toUpperCase() !== current.code) {
    const desired = updates.code.trim().toUpperCase();
    if (!db.designs.some((d, idx) => idx !== index && d.code.toUpperCase() === desired)) {
      code = desired;
    }
  }

  db.designs[index] = {
    ...current,
    ...updates,
    code,
    tags,
    category: updates.category ? updates.category.toUpperCase() : current.category,
    featured: updates.featured !== undefined ? Boolean(updates.featured) : current.featured,
    status: updates.status !== undefined ? (updates.status === 'hidden' ? 'hidden' : 'published') : current.status,
    updatedAt: new Date().toISOString()
  };

  saveDatabase();
  syncDesignToSupabase(db.designs[index]);
  return db.designs[index];
}

export function deleteDesign(id) {
  const index = db.designs.findIndex(d => d.id === id || d.code.toUpperCase() === id.toUpperCase());
  if (index === -1) return false;
  const removed = db.designs.splice(index, 1)[0];
  saveDatabase();
  if (removed) {
    deleteDesignFromSupabase(removed.id);
  }
  return true;
}

export function getNextDesignCode() {
  const existingCodes = db.designs.map(d => {
    const m = d.code.match(/^UW-(\d+)$/i);
    return m ? parseInt(m[1], 10) : 0;
  });
  const max = existingCodes.length > 0 ? Math.max(...existingCodes, 0) : 0;
  const nextNum = max + 1;
  return `UW-${String(nextNum).padStart(3, '0')}`;
}

// --- Categories ---

export function getCategories() {
  return db.categories.filter(c => c.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getAllCategories() {
  return db.categories.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function updateCategories(newCategories) {
  db.categories = newCategories;
  saveDatabase();
  syncCategoriesToSupabase(newCategories);
  return db.categories;
}

// --- Filter Metadata ---

export function getFilterMetadata() {
  const styles = new Set();
  const moods = new Set();
  const colors = new Set();
  const tags = new Set();

  db.designs.forEach(d => {
    if (d.status === 'published') {
      if (d.style) styles.add(d.style);
      if (d.mood) moods.add(d.mood);
      if (d.color) colors.add(d.color);
      if (d.tags) d.tags.forEach(t => tags.add(t));
    }
  });

  return {
    categories: getCategories(),
    styles: Array.from(styles).sort(),
    moods: Array.from(moods).sort(),
    colors: Array.from(colors).sort(),
    tags: Array.from(tags).sort()
  };
}

// --- Analytics & Tracking ---

export function recordCatalogueView() {
  db.analytics.catalogueViews = (db.analytics.catalogueViews || 0) + 1;
  saveDatabase();
  scheduleAnalyticsSync();
  return db.analytics.catalogueViews;
}

export function recordDesignView(code) {
  if (!code) return;
  const upper = code.trim().toUpperCase();
  db.analytics.designViews[upper] = (db.analytics.designViews[upper] || 0) + 1;
  
  const design = db.designs.find(d => d.code.toUpperCase() === upper);
  if (design) {
    design.views = (design.views || 0) + 1;
    if (design.category) {
      db.analytics.categoryViews[design.category] = (db.analytics.categoryViews[design.category] || 0) + 1;
    }
    syncDesignToSupabase(design);
  }
  saveDatabase();
  scheduleAnalyticsSync();
}

export function recordSearch(query) {
  if (!query || !query.trim()) return;
  const q = query.trim().toLowerCase();
  if (q.length < 2) return;

  if (!db.analytics.searches[q]) {
    db.analytics.searches[q] = { count: 0, lastAt: null };
  }
  db.analytics.searches[q].count += 1;
  db.analytics.searches[q].lastAt = new Date().toISOString();
  saveDatabase();
  scheduleAnalyticsSync();
}

export function recordCopyAction(code) {
  if (!code) return;
  const upper = code.trim().toUpperCase();
  db.analytics.copyActions[upper] = (db.analytics.copyActions[upper] || 0) + 1;
  
  const design = db.designs.find(d => d.code.toUpperCase() === upper);
  if (design) {
    design.copies = (design.copies || 0) + 1;
    syncDesignToSupabase(design);
  }
  saveDatabase();
  scheduleAnalyticsSync();
}

export function getAnalyticsSummary() {
  const topSearches = Object.entries(db.analytics.searches || {})
    .map(([query, data]) => ({ query, count: typeof data === 'object' ? data.count : data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const topViewedDesigns = [...db.designs]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10)
    .map(d => ({ code: d.code, name: d.name, views: d.views || 0, copies: d.copies || 0 }));

  const topCopiedDesigns = [...db.designs]
    .sort((a, b) => (b.copies || 0) - (a.copies || 0))
    .slice(0, 10)
    .map(d => ({ code: d.code, name: d.name, copies: d.copies || 0, views: d.views || 0 }));

  const categoryCounts = { ...(db.analytics.categoryViews || {}) };
  db.designs.forEach(d => {
    if (d.views && d.category) {
      categoryCounts[d.category] = (categoryCounts[d.category] || 0) + d.views;
    }
  });
  const topCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const totalCopies = Object.values(db.analytics.copyActions || {}).reduce((sum, n) => sum + (typeof n === 'number' ? n : 0), 0);

  return {
    catalogueViews: db.analytics.catalogueViews || 0,
    totalDesigns: db.designs.length,
    publishedDesigns: db.designs.filter(d => d.status === 'published').length,
    hiddenDesigns: db.designs.filter(d => d.status === 'hidden').length,
    totalCopies,
    topSearches,
    topViewedDesigns,
    topCopiedDesigns,
    topCategories
  };
}

export function getSettings() {
  return { ...db.settings };
}

export function verifyAdminPin(pin) {
  if (!pin) return false;
  return String(pin).trim() === String(db.settings.adminPin || '1337');
}

export function updateSettings(newSettings) {
  db.settings = { ...db.settings, ...newSettings };
  saveDatabase();
  syncSettingsToSupabase(db.settings);
  return db.settings;
}

export function replaceAllData(data) {
  db = {
    ...db,
    ...data,
    analytics: { ...db.analytics, ...(data.analytics || {}) },
    settings: { ...db.settings, ...(data.settings || {}) }
  };
  saveDatabase();
  return db;
}
