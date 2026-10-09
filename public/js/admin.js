/**
 * UNCommon weaR — Admin Portal Controller
 * Dashboard, Analytics, Design CRUD, Bulk Upload, CSV Tools, and QR Studio
 */

let adminPin = sessionStorage.getItem('uw_admin_pin') || '';

// Admin State
const adminState = {
  designs: [],
  filteredDesigns: [],
  categories: [],
  analytics: null,
  activeTab: 'dashboard',
  selectedBulkFiles: []
};

// DOM References
const elements = {
  pinScreen: document.getElementById('pinScreen'),
  pinForm: document.getElementById('pinForm'),
  pinInput: document.getElementById('pinInput'),
  pinError: document.getElementById('pinError'),
  adminApp: document.getElementById('adminApp'),
  logoutBtn: document.getElementById('logoutBtn'),
  adminTabs: document.getElementById('adminTabs'),
  tabPanes: document.querySelectorAll('.tab-pane'),
  tabCount: document.getElementById('tabCount'),

  // Dashboard Stats
  refreshStatsBtn: document.getElementById('refreshStatsBtn'),
  statCatalogueViews: document.getElementById('statCatalogueViews'),
  statTotalCopies: document.getElementById('statTotalCopies'),
  statTotalDesigns: document.getElementById('statTotalDesigns'),
  statPublished: document.getElementById('statPublished'),
  statHidden: document.getElementById('statHidden'),
  statTopCategory: document.getElementById('statTopCategory'),
  topCopiedList: document.getElementById('topCopiedList'),
  topViewedList: document.getElementById('topViewedList'),
  topSearchesCloud: document.getElementById('topSearchesCloud'),
  categoryBars: document.getElementById('categoryBars'),

  // Designs Management
  adminSearchInput: document.getElementById('adminSearchInput'),
  adminCatFilter: document.getElementById('adminCatFilter'),
  designsTableBody: document.getElementById('designsTableBody'),
  openAddModalBtn: document.getElementById('openAddModalBtn'),

  // Bulk Upload & CSV
  bulkDropzone: document.getElementById('bulkDropzone'),
  bulkFileInput: document.getElementById('bulkFileInput'),
  bulkCategorySelect: document.getElementById('bulkCategorySelect'),
  bulkTagsInput: document.getElementById('bulkTagsInput'),
  startBulkUploadBtn: document.getElementById('startBulkUploadBtn'),
  uploadProgressBox: document.getElementById('uploadProgressBox'),
  uploadProgressFill: document.getElementById('uploadProgressFill'),
  uploadProgressText: document.getElementById('uploadProgressText'),
  csvFileInput: document.getElementById('csvFileInput'),
  downloadSampleCsvBtn: document.getElementById('downloadSampleCsvBtn'),
  exportCsvBtn: document.getElementById('exportCsvBtn'),

  // QR Studio
  qrTargetUrl: document.getElementById('qrTargetUrl'),
  qrStylePreset: document.getElementById('qrStylePreset'),
  qrPreviewImg: document.getElementById('qrPreviewImg'),
  downloadQrSvgBtn: document.getElementById('downloadQrSvgBtn'),
  downloadQrPngBtn: document.getElementById('downloadQrPngBtn'),
  printCounterSignBtn: document.getElementById('printCounterSignBtn'),

  // Categories
  categoryCardsList: document.getElementById('categoryCardsList'),
  addCategoryBtn: document.getElementById('addCategoryBtn'),

  // Add / Edit Modal
  designModalOverlay: document.getElementById('designModalOverlay'),
  designModalTitle: document.getElementById('designModalTitle'),
  designForm: document.getElementById('designForm'),
  editDesignId: document.getElementById('editDesignId'),
  formCode: document.getElementById('formCode'),
  formName: document.getElementById('formName'),
  formCategory: document.getElementById('formCategory'),
  formStyle: document.getElementById('formStyle'),
  formMood: document.getElementById('formMood'),
  formColor: document.getElementById('formColor'),
  formImage: document.getElementById('formImage'),
  formMockup: document.getElementById('formMockup'),
  formTags: document.getElementById('formTags'),
  formDescription: document.getElementById('formDescription'),
  formFeatured: document.getElementById('formFeatured'),
  formPublished: document.getElementById('formPublished'),
  closeDesignModalBtn: document.getElementById('closeDesignModalBtn'),
  cancelDesignModalBtn: document.getElementById('cancelDesignModalBtn'),

  // Toast
  toastContainer: document.getElementById('adminToastContainer')
};

// ===================================================================
// INITIALIZATION & AUTH
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  setupAuth();
  setupNavigation();
  setupEventListeners();

  if (adminPin) {
    verifyAndUnlock(adminPin);
  }
});

function setupAuth() {
  elements.pinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = elements.pinInput.value.trim();
    if (!pin) return;
    verifyAndUnlock(pin);
  });

  elements.logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('uw_admin_pin');
    adminPin = '';
    elements.adminApp.style.display = 'none';
    elements.pinScreen.style.display = 'flex';
    elements.pinInput.value = '';
    elements.pinError.style.display = 'none';
  });
}

async function verifyAndUnlock(pin) {
  try {
    const res = await fetch('/api/admin/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });

    if (res.ok) {
      adminPin = pin;
      sessionStorage.setItem('uw_admin_pin', pin);
      elements.pinScreen.style.display = 'none';
      elements.adminApp.style.display = 'flex';
      initAdminData();
    } else {
      elements.pinError.style.display = 'block';
      elements.pinInput.value = '';
      elements.pinInput.focus();
    }
  } catch (err) {
    console.error('PIN verification error:', err);
    elements.pinError.textContent = 'Server connection error';
    elements.pinError.style.display = 'block';
  }
}

// Global authorized fetch helper
async function authFetch(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
    'x-admin-pin': adminPin
  };
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    elements.logoutBtn.click();
    throw new Error('Unauthorized');
  }
  return response;
}

// Load Initial Admin Data
async function initAdminData() {
  await Promise.all([
    loadCategories(),
    loadAnalytics(),
    loadDesigns()
  ]);
  setupQrStudio();
}

// ===================================================================
// TAB NAVIGATION
// ===================================================================

function setupNavigation() {
  elements.adminTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    const tab = btn.dataset.tab;
    adminState.activeTab = tab;

    // Update active tab buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    
    // Update panes
    elements.tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tab}`);
    });

    if (tab === 'dashboard') loadAnalytics();
    if (tab === 'designs') loadDesigns();
    if (tab === 'qr') updateQrPreview();
  });
}

// ===================================================================
// TAB 1: DASHBOARD & ANALYTICS
// ===================================================================

async function loadAnalytics() {
  try {
    const res = await fetch('/api/analytics');
    if (!res.ok) return;
    const data = await res.json();
    adminState.analytics = data;

    // Render Stats
    elements.statCatalogueViews.textContent = (data.catalogueViews || 0).toLocaleString();
    elements.statTotalCopies.textContent = (data.totalCopies || 0).toLocaleString();
    elements.statTotalDesigns.textContent = data.totalDesigns || 0;
    elements.statPublished.textContent = data.publishedDesigns || 0;
    elements.statHidden.textContent = data.hiddenDesigns || 0;

    const topCat = (data.topCategories && data.topCategories[0]) ? data.topCategories[0].category : 'GEN-Z';
    elements.statTopCategory.textContent = topCat;

    // Top Copied (Print Intent)
    elements.topCopiedList.innerHTML = '';
    (data.topCopiedDesigns || []).slice(0, 6).forEach(item => {
      const row = document.createElement('div');
      row.className = 'analytics-item';
      row.innerHTML = `
        <div class="analytics-item-left">
          <span class="analytics-code">${escapeHtml(item.code)}</span>
          <span>${escapeHtml(item.name)}</span>
        </div>
        <span class="analytics-count">${item.copies} prints</span>
      `;
      elements.topCopiedList.appendChild(row);
    });

    // Top Explored (Views)
    elements.topViewedList.innerHTML = '';
    (data.topViewedDesigns || []).slice(0, 6).forEach(item => {
      const row = document.createElement('div');
      row.className = 'analytics-item';
      row.innerHTML = `
        <div class="analytics-item-left">
          <span class="analytics-code">${escapeHtml(item.code)}</span>
          <span>${escapeHtml(item.name)}</span>
        </div>
        <span class="analytics-count">${item.views} views</span>
      `;
      elements.topViewedList.appendChild(row);
    });

    // Search Keywords Cloud
    elements.topSearchesCloud.innerHTML = '';
    if (!data.topSearches || data.topSearches.length === 0) {
      elements.topSearchesCloud.innerHTML = '<span style="color:#71717a; font-size:0.8rem;">No searches recorded yet.</span>';
    } else {
      data.topSearches.forEach(s => {
        const pill = document.createElement('span');
        pill.className = 'keyword-pill';
        pill.innerHTML = `"${escapeHtml(s.query)}" <span class="keyword-count">${s.count}</span>`;
        elements.topSearchesCloud.appendChild(pill);
      });
    }

    // Category Interest Bars
    elements.categoryBars.innerHTML = '';
    const topCats = (data.topCategories || []).slice(0, 7);
    const maxCatViews = Math.max(...topCats.map(c => c.count), 1);
    topCats.forEach(c => {
      const pct = Math.round((c.count / maxCatViews) * 100);
      const row = document.createElement('div');
      row.className = 'category-bar-row';
      row.innerHTML = `
        <div class="category-bar-meta">
          <span>${escapeHtml(c.category)}</span>
          <span>${c.count} views</span>
        </div>
        <div class="category-bar-track">
          <div class="category-bar-fill" style="width: ${pct}%"></div>
        </div>
      `;
      elements.categoryBars.appendChild(row);
    });

  } catch (err) {
    console.error('Failed to load analytics:', err);
  }
}

// ===================================================================
// TAB 2: DESIGN MANAGEMENT (CRUD)
// ===================================================================

async function loadDesigns() {
  try {
    const res = await authFetch('/api/admin/designs');
    const data = await res.json();
    adminState.designs = data.designs || [];
    elements.tabCount.textContent = adminState.designs.length;
    filterAndRenderDesignsTable();
  } catch (err) {
    console.error('Failed to load admin designs:', err);
  }
}

function filterAndRenderDesignsTable() {
  const query = (elements.adminSearchInput.value || '').toLowerCase().trim();
  const cat = elements.adminCatFilter.value;

  adminState.filteredDesigns = adminState.designs.filter(d => {
    const matchesQuery = !query || 
      d.code.toLowerCase().includes(query) || 
      d.name.toLowerCase().includes(query) ||
      (d.tags || []).some(t => t.toLowerCase().includes(query));

    const matchesCat = !cat || d.category === cat;
    return matchesQuery && matchesCat;
  });

  renderDesignsTable();
}

function renderDesignsTable() {
  elements.designsTableBody.innerHTML = '';

  if (adminState.filteredDesigns.length === 0) {
    elements.designsTableBody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center; padding: 40px; color: #71717a;">
          No matching designs found.
        </td>
      </tr>
    `;
    return;
  }

  adminState.filteredDesigns.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <img src="${d.image}" alt="${escapeHtml(d.name)}" class="table-thumb" loading="lazy">
      </td>
      <td>
        <span class="table-code">${escapeHtml(d.code)}</span>
      </td>
      <td>
        <div class="table-name">${escapeHtml(d.name)}</div>
        <div style="font-size:0.7rem; color:#71717a;">${escapeHtml((d.tags || []).slice(0, 3).join(', '))}</div>
      </td>
      <td>
        <span style="font-family:var(--font-mono); font-size:0.75rem;">${escapeHtml(d.category)}</span>
      </td>
      <td>
        <span style="font-size:0.75rem;">${escapeHtml(d.style || '—')} / ${escapeHtml(d.mood || '—')}</span>
      </td>
      <td>${d.views || 0}</td>
      <td><strong>${d.copies || 0}</strong></td>
      <td>
        <button class="featured-toggle ${d.featured ? 'active' : ''}" data-id="${d.id}" title="Toggle Featured">
          ${d.featured ? '★' : '☆'}
        </button>
      </td>
      <td>
        <button class="status-toggle ${d.status === 'published' ? 'active' : ''}" data-id="${d.id}" title="Toggle Visibility">
          ${d.status === 'published' ? '● Public' : '○ Hidden'}
        </button>
      </td>
      <td class="text-right">
        <div class="action-btn-group">
          <button class="btn-icon edit" data-action="edit" data-id="${d.id}" title="Edit design">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="btn-icon delete" data-action="delete" data-id="${d.id}" title="Delete design">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    `;

    // Event listener for toggling featured
    tr.querySelector('.featured-toggle').addEventListener('click', async () => {
      await toggleDesignFeatured(d);
    });

    // Event listener for toggling status
    tr.querySelector('.status-toggle').addEventListener('click', async () => {
      await toggleDesignStatus(d);
    });

    // Edit button
    tr.querySelector('[data-action="edit"]').addEventListener('click', () => {
      openEditDesignModal(d);
    });

    // Delete button
    tr.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      if (confirm(`Are you sure you want to delete design ${d.code} (${d.name})?`)) {
        await deleteDesign(d.id);
      }
    });

    elements.designsTableBody.appendChild(tr);
  });
}

// Toggle Featured Status
async function toggleDesignFeatured(design) {
  try {
    const res = await authFetch(`/api/admin/designs/${design.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !design.featured })
    });
    if (res.ok) {
      design.featured = !design.featured;
      filterAndRenderDesignsTable();
      showToast(`${design.code} featured status updated`);
    }
  } catch (err) {
    console.error('Error toggling featured:', err);
  }
}

// Toggle Public / Hidden Status
async function toggleDesignStatus(design) {
  const newStatus = design.status === 'published' ? 'hidden' : 'published';
  try {
    const res = await authFetch(`/api/admin/designs/${design.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      design.status = newStatus;
      filterAndRenderDesignsTable();
      showToast(`${design.code} is now ${newStatus}`);
    }
  } catch (err) {
    console.error('Error toggling status:', err);
  }
}

// Delete Design
async function deleteDesign(id) {
  try {
    const res = await authFetch(`/api/admin/designs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      adminState.designs = adminState.designs.filter(d => d.id !== id);
      filterAndRenderDesignsTable();
      showToast('Design deleted');
    }
  } catch (err) {
    console.error('Error deleting design:', err);
  }
}

// Open Add Design Modal
function openAddDesignModal() {
  elements.designModalTitle.textContent = 'Add Single Design';
  elements.editDesignId.value = '';
  elements.designForm.reset();

  // Suggest next code
  const existingCodes = adminState.designs.map(d => {
    const m = d.code.match(/^UW-(\d+)$/i);
    return m ? parseInt(m[1], 10) : 0;
  });
  const max = Math.max(...existingCodes, 0);
  elements.formCode.value = `UW-${String(max + 1).padStart(3, '0')}`;
  elements.formCategory.value = 'GRAPHIC';
  elements.formPublished.checked = true;

  elements.designModalOverlay.classList.add('open');
}

// Open Edit Design Modal
function openEditDesignModal(d) {
  elements.designModalTitle.textContent = `Edit Design: ${d.code}`;
  elements.editDesignId.value = d.id;
  elements.formCode.value = d.code;
  elements.formName.value = d.name;
  elements.formCategory.value = d.category;
  elements.formStyle.value = d.style || '';
  elements.formMood.value = d.mood || '';
  elements.formColor.value = d.color || '';
  elements.formImage.value = d.image || '';
  elements.formMockup.value = d.mockupImage || '';
  elements.formTags.value = (d.tags || []).join(', ');
  elements.formDescription.value = d.description || '';
  elements.formFeatured.checked = Boolean(d.featured);
  elements.formPublished.checked = d.status !== 'hidden';

  elements.designModalOverlay.classList.add('open');
}

function closeDesignModal() {
  elements.designModalOverlay.classList.remove('open');
}

// Handle Add / Edit Form Submit
async function handleDesignFormSubmit(e) {
  e.preventDefault();
  const id = elements.editDesignId.value;

  const payload = {
    code: elements.formCode.value.trim().toUpperCase(),
    name: elements.formName.value.trim(),
    category: elements.formCategory.value,
    style: elements.formStyle.value.trim() || 'Modern',
    mood: elements.formMood.value.trim() || 'Aesthetic',
    color: elements.formColor.value.trim() || 'Monochrome',
    image: elements.formImage.value.trim(),
    mockupImage: elements.formMockup.value.trim() || elements.formImage.value.trim(),
    tags: elements.formTags.value.split(',').map(s => s.trim()).filter(Boolean),
    description: elements.formDescription.value.trim(),
    featured: elements.formFeatured.checked,
    status: elements.formPublished.checked ? 'published' : 'hidden'
  };

  try {
    if (id) {
      // Update
      const res = await authFetch(`/api/admin/designs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(`Design ${payload.code} updated successfully`);
        closeDesignModal();
        loadDesigns();
      }
    } else {
      // Create
      const res = await authFetch('/api/admin/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(`Design ${payload.code} created successfully`);
        closeDesignModal();
        loadDesigns();
      }
    }
  } catch (err) {
    console.error('Error saving design:', err);
    showToast('Failed to save design');
  }
}

// ===================================================================
// TAB 3: BULK UPLOAD & CSV IMPORT/EXPORT
// ===================================================================

function setupBulkUpload() {
  // Dropzone drag-and-drop
  elements.bulkDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.bulkDropzone.classList.add('dragover');
  });

  elements.bulkDropzone.addEventListener('dragleave', () => {
    elements.bulkDropzone.classList.remove('dragover');
  });

  elements.bulkDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.bulkDropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleBulkFilesSelected(e.dataTransfer.files);
    }
  });

  elements.bulkFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleBulkFilesSelected(e.target.files);
    }
  });

  elements.startBulkUploadBtn.addEventListener('click', startBulkUpload);

  // CSV Import
  elements.csvFileInput.addEventListener('change', handleCsvFileSelect);
  elements.downloadSampleCsvBtn.addEventListener('click', downloadSampleCsv);
  elements.exportCsvBtn.addEventListener('click', exportCatalogueCsv);
}

function handleBulkFilesSelected(files) {
  adminState.selectedBulkFiles = Array.from(files);
  const count = adminState.selectedBulkFiles.length;
  elements.bulkDropzone.querySelector('.dropzone-text').textContent = `${count} files selected for upload`;
  elements.bulkDropzone.querySelector('.dropzone-hint').textContent = adminState.selectedBulkFiles.map(f => f.name).slice(0, 5).join(', ') + (count > 5 ? `... and ${count - 5} more` : '');
  elements.startBulkUploadBtn.disabled = false;
}

async function startBulkUpload() {
  if (adminState.selectedBulkFiles.length === 0) return;

  const formData = new FormData();
  adminState.selectedBulkFiles.forEach(file => {
    formData.append('artworks', file);
  });
  formData.append('category', elements.bulkCategorySelect.value);
  formData.append('tags', elements.bulkTagsInput.value);

  elements.uploadProgressBox.style.display = 'flex';
  elements.uploadProgressFill.style.width = '60%';
  elements.uploadProgressText.textContent = `Uploading ${adminState.selectedBulkFiles.length} designs...`;
  elements.startBulkUploadBtn.disabled = true;

  try {
    const res = await authFetch('/api/admin/bulk-upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    elements.uploadProgressFill.style.width = '100%';
    elements.uploadProgressText.textContent = `Successfully created ${data.count} new designs!`;
    showToast(`${data.count} designs created via bulk upload!`);

    setTimeout(() => {
      elements.uploadProgressBox.style.display = 'none';
      elements.bulkFileInput.value = '';
      adminState.selectedBulkFiles = [];
      elements.startBulkUploadBtn.disabled = true;
      elements.bulkDropzone.querySelector('.dropzone-text').textContent = 'Drag & drop multiple design images here';
      loadDesigns();
    }, 2000);

  } catch (err) {
    console.error('Bulk upload failed:', err);
    showToast('Bulk upload failed. Check file types.');
    elements.uploadProgressBox.style.display = 'none';
    elements.startBulkUploadBtn.disabled = false;
  }
}

// Download Sample CSV
function downloadSampleCsv() {
  const csvContent = `Code,Name,Category,Tags,Style,Mood,Color,Description
UW-201,ACID TRIPPY,AESTHETIC,"rave, acid, 90s, vintage",Retro,Chaotic,Neon,"Psychedelic 90s smiley print."
UW-202,QUIET CONFIDENCE,MINIMAL,"minimal, clean, text",Minimal,Confident,Monochrome,"Small front chest statement."
UW-203,STUDENT DEBT CHAMPION,COLLEGE,"campus, exam, funny",Vintage,Sarcastic,Pastel,"Collegiate typography varsity crest."`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'UNCommon-weaR-Sample-Import.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Export Catalogue CSV
function exportCatalogueCsv() {
  window.location.href = `/api/admin/export-csv?pin=${encodeURIComponent(adminPin)}`;
}

// Handle CSV File Import
function handleCsvFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (evt) => {
    const text = evt.target.result;
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length <= 1) {
      showToast('CSV file is empty');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = parseCsvLine(lines[i]);
      if (parts.length < 2) continue;

      const row = {};
      headers.forEach((h, idx) => {
        row[h] = parts[idx] || '';
      });
      rows.push(row);
    }

    if (rows.length === 0) {
      showToast('No valid rows found in CSV');
      return;
    }

    try {
      const res = await authFetch('/api/admin/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows })
      });
      const data = await res.json();
      showToast(`Imported ${data.count} designs from CSV!`);
      loadDesigns();
    } catch (err) {
      console.error('CSV import failed:', err);
      showToast('CSV import failed');
    }
  };
  reader.readAsText(file);
}

// Simple CSV line parser supporting quoted values
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// ===================================================================
// TAB 4: CART QR CODE STUDIO
// ===================================================================

function setupQrStudio() {
  const host = window.location.host;
  const protocol = window.location.protocol;
  const targetUrl = `${protocol}//${host}/designs`;
  elements.qrTargetUrl.value = targetUrl;

  elements.qrStylePreset.addEventListener('change', updateQrPreview);

  elements.downloadQrSvgBtn.addEventListener('click', () => {
    const url = getQrEndpoint('svg', true);
    window.location.href = url;
  });

  elements.downloadQrPngBtn.addEventListener('click', () => {
    const url = getQrEndpoint('png', true);
    window.location.href = url;
  });

  elements.printCounterSignBtn.addEventListener('click', openPrintableCounterSign);

  updateQrPreview();
}

function getQrEndpoint(format = 'svg', download = false) {
  const targetUrl = elements.qrTargetUrl.value;
  const preset = elements.qrStylePreset.value;

  let dark = '#000000';
  let light = '#ffffff';

  if (preset === 'lime-on-black') {
    dark = '#d4ff00';
    light = '#09090b';
  } else if (preset === 'white-on-black') {
    dark = '#ffffff';
    light = '#09090b';
  }

  const params = new URLSearchParams({
    url: targetUrl,
    format,
    dark,
    light,
    margin: '2',
    size: '2000',
    download: download ? 'true' : 'false'
  });

  return `/api/qr?${params.toString()}`;
}

function updateQrPreview() {
  const previewUrl = getQrEndpoint('svg', false);
  elements.qrPreviewImg.src = previewUrl;

  const preset = elements.qrStylePreset.value;
  const container = elements.qrPreviewImg.parentElement;
  if (preset === 'lime-on-black' || preset === 'white-on-black') {
    container.style.background = '#09090b';
  } else {
    container.style.background = '#ffffff';
  }
}

// Generate Print-Ready 4x6 / A5 Cart Counter Stand Flyer
function openPrintableCounterSign() {
  const targetUrl = elements.qrTargetUrl.value;
  const qrSvgUrl = `/api/qr?url=${encodeURIComponent(targetUrl)}&format=svg&dark=%23000000&light=%23ffffff&margin=2`;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>UNCommon weaR — Cart Counter QR Display</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;900&family=Syne:wght@800;900&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
      <style>
        @page { size: A5 portrait; margin: 10mm; }
        body {
          margin: 0;
          padding: 24px;
          background: #ffffff;
          color: #09090b;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border: 4px solid #09090b;
          min-height: 90vh;
          box-sizing: border-box;
        }
        .brand {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -1px;
          margin-top: 10px;
          text-transform: uppercase;
        }
        .tagline {
          font-size: 14px;
          font-weight: 700;
          color: #52525b;
          margin-top: 4px;
        }
        .main-callout {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 900;
          background: #09090b;
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 8px;
          margin: 24px 0 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .qr-box {
          width: 250px;
          height: 250px;
          border: 3px solid #09090b;
          border-radius: 16px;
          padding: 14px;
          margin: 10px 0;
        }
        .qr-box img {
          width: 100%;
          height: 100%;
        }
        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 20px 0;
          width: 100%;
          max-width: 320px;
          text-align: left;
        }
        .step-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          font-weight: 700;
        }
        .step-num {
          width: 26px;
          height: 26px;
          background: #09090b;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          flex-shrink: 0;
        }
        .footer-note {
          margin-top: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #71717a;
          letter-spacing: 1px;
        }
      </style>
    </head>
    <body>
      <div class="brand">UNCommon weaR</div>
      <div class="tagline">“Created by you. Crafted by us.”</div>

      <div class="main-callout">SCAN TO BROWSE 100+ DESIGNS</div>

      <div class="qr-box">
        <img src="${qrSvgUrl}" alt="Scan QR">
      </div>

      <div class="steps-container">
        <div class="step-row">
          <span class="step-num">1</span>
          <span>Scan the QR code with your phone camera</span>
        </div>
        <div class="step-row">
          <span class="step-num">2</span>
          <span>Browse our digital gallery & tap your design</span>
        </div>
        <div class="step-row">
          <span class="step-num">3</span>
          <span>Show the code (e.g. UW-047) to our printing team!</span>
        </div>
      </div>

      <div class="footer-note">PHYSICAL CART PRINTING COMPANION // ${targetUrl}</div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// ===================================================================
// TAB 5: CATEGORIES MANAGEMENT
// ===================================================================

async function loadCategories() {
  try {
    const res = await fetch('/api/categories');
    const categories = await res.json();
    adminState.categories = categories;

    // Populate category dropdowns in admin
    elements.adminCatFilter.innerHTML = '<option value="">All Categories</option>';
    elements.bulkCategorySelect.innerHTML = '';
    elements.formCategory.innerHTML = '';

    categories.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.slug;
      opt.textContent = c.name;
      elements.adminCatFilter.appendChild(opt.cloneNode(true));
      elements.bulkCategorySelect.appendChild(opt.cloneNode(true));
      elements.formCategory.appendChild(opt.cloneNode(true));
    });

    renderCategoryCards();
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

function renderCategoryCards() {
  elements.categoryCardsList.innerHTML = '';
  adminState.categories.forEach(c => {
    const card = document.createElement('div');
    card.className = 'category-card-item';
    card.innerHTML = `
      <div>
        <span class="cat-name-tag">${escapeHtml(c.name)}</span>
        <span style="font-size:0.75rem; color:#71717a; margin-left:10px;">Slug: ${escapeHtml(c.slug)}</span>
      </div>
      <div>
        <span style="font-size:0.75rem; color:#a1a1aa;">Order: ${c.order}</span>
      </div>
    `;
    elements.categoryCardsList.appendChild(card);
  });
}

// ===================================================================
// EVENT LISTENERS & MODAL BINDINGS
// ===================================================================

function setupEventListeners() {
  elements.refreshStatsBtn.addEventListener('click', loadAnalytics);

  elements.adminSearchInput.addEventListener('input', filterAndRenderDesignsTable);
  elements.adminCatFilter.addEventListener('change', filterAndRenderDesignsTable);

  elements.openAddModalBtn.addEventListener('click', openAddDesignModal);
  elements.closeDesignModalBtn.addEventListener('click', closeDesignModal);
  elements.cancelDesignModalBtn.addEventListener('click', closeDesignModal);
  elements.designModalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.designModalOverlay) closeDesignModal();
  });

  elements.designForm.addEventListener('submit', handleDesignFormSubmit);

  setupBulkUpload();

  // Add category button
  elements.addCategoryBtn.addEventListener('click', () => {
    const name = prompt('Enter new category name:');
    if (!name || !name.trim()) return;
    const slug = name.trim().toUpperCase();
    if (adminState.categories.some(c => c.slug === slug)) {
      alert('Category already exists');
      return;
    }
    const newCat = {
      id: `cat_${Date.now()}`,
      name: slug,
      slug,
      order: adminState.categories.length + 1,
      active: true
    };
    adminState.categories.push(newCat);
    authFetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: adminState.categories })
    }).then(() => {
      showToast(`Category ${slug} added!`);
      loadCategories();
    });
  });
}

// ===================================================================
// TOAST NOTIFICATION
// ===================================================================

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
