import { supabase } from './supabaseClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'database.json');

async function migrate() {
  if (!supabase) {
    console.error('Supabase is not configured!');
    process.exit(1);
  }

  console.log('Reading database.json...');
  const rawData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

  // 1. Check if designs table exists
  const { error: testError } = await supabase.from('designs').select('id').limit(1);
  if (testError) {
    console.error('❌ Could not access designs table:', testError.message);
    console.log('👉 Please make sure you have run db/supabase-schema.sql in your Supabase SQL Editor first!');
    process.exit(1);
  }

  // 2. Migrate Categories
  if (rawData.categories && rawData.categories.length > 0) {
    console.log(`Migrating ${rawData.categories.length} categories...`);
    const catsToInsert = rawData.categories.map((c, index) => ({
      id: c.id,
      name: c.name,
      count: c.count || 0,
      color: c.color || '#ffffff',
      accent: c.accent || '#ffffff',
      description: c.description || '',
      icon: c.icon || 'sparkles',
      order: c.order !== undefined ? c.order : index
    }));
    const { error: catErr } = await supabase.from('categories').upsert(catsToInsert, { onConflict: 'id' });
    if (catErr) console.error('Error inserting categories:', catErr);
    else console.log('✅ Categories migrated successfully.');
  }

  // 3. Migrate Settings
  if (rawData.settings) {
    console.log('Migrating settings...');
    const settingsList = Object.entries(rawData.settings).map(([key, value]) => ({
      key,
      value
    }));
    const { error: setErr } = await supabase.from('settings').upsert(settingsList, { onConflict: 'key' });
    if (setErr) console.error('Error inserting settings:', setErr);
    else console.log('✅ Settings migrated successfully.');
  }

  // 4. Migrate Analytics
  if (rawData.analytics) {
    console.log('Migrating analytics...');
    const analyticsRow = {
      id: 'current',
      catalogue_views: rawData.analytics.catalogueViews || 0,
      searches: rawData.analytics.searches || {},
      category_views: rawData.analytics.categoryViews || {},
      design_views: rawData.analytics.designViews || {},
      copy_actions: rawData.analytics.copyActions || {}
    };
    const { error: anaErr } = await supabase.from('analytics').upsert(analyticsRow, { onConflict: 'id' });
    if (anaErr) console.error('Error inserting analytics:', anaErr);
    else console.log('✅ Analytics migrated successfully.');
  }

  // 5. Migrate Designs
  if (rawData.designs && rawData.designs.length > 0) {
    console.log(`Migrating ${rawData.designs.length} designs...`);
    const designsToInsert = rawData.designs.map((d, index) => ({
      id: d.id || `des_${index}`,
      code: d.code,
      name: d.name,
      image: d.image,
      mockup_image: d.mockupImage || d.image,
      category: d.category || 'GRAPHIC',
      tags: d.tags || [],
      style: d.style || 'Modern',
      mood: d.mood || 'Aesthetic',
      color: d.color || 'Monochrome',
      description: d.description || '',
      featured: Boolean(d.featured),
      status: d.status || 'published',
      views: d.views || 0,
      copies: d.copies || 0,
      order: d.order !== undefined ? d.order : index,
      created_at: d.createdAt || new Date().toISOString()
    }));

    // Chunk insert in batches of 50
    const chunkSize = 50;
    for (let i = 0; i < designsToInsert.length; i += chunkSize) {
      const chunk = designsToInsert.slice(i, i + chunkSize);
      const { error: desErr } = await supabase.from('designs').upsert(chunk, { onConflict: 'id' });
      if (desErr) {
        console.error(`Error inserting design chunk ${i}-${i + chunkSize}:`, desErr);
      } else {
        console.log(`Uploaded designs ${i + 1} to ${Math.min(i + chunkSize, designsToInsert.length)}...`);
      }
    }
    console.log('✅ All designs migrated successfully!');
  }

  console.log('🎉 Migration completed successfully!');
}

migrate().catch(console.error);
