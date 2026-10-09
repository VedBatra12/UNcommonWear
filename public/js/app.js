/**
 * UNCommon weaR — Digital Design Catalogue Application
 * Public Customer Flow & Interactive Gallery Controller
 */

// Application State
const state = {
  search: '',
  category: 'ALL',
  style: '',
  mood: '',
  color: '',
  tag: '',
  sort: 'featured',
  offset: 0,
  limit: 24,
  hasMore: true,
  isLoading: false,
  designs: [],
  totalDesigns: 0,
  currentDesign: null,
  currentViewMode: 'artwork', // 'artwork' or 'mockup'
  filtersMeta: null
};

// DOM Element References
const elements = {
  // Search & Header
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  filterTriggerBtn: document.getElementById('filterTriggerBtn'),
  activeFilterBadge: document.getElementById('activeFilterBadge'),
  categoriesTrack: document.getElementById('categoriesTrack'),

  // Gallery & Status
  designsGrid: document.getElementById('designsGrid'),
  resultsCount: document.getElementById('resultsCount'),
  activeChipsContainer: document.getElementById('activeChipsContainer'),
  sortSelect: document.getElementById('sortSelect'),
  gridLoader: document.getElementById('gridLoader'),
  emptyState: document.getElementById('emptyState'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  sentinel: document.getElementById('infiniteScrollSentinel'),

  // Filter Drawer
  filterDrawerOverlay: document.getElementById('filterDrawerOverlay'),
  filterDrawer: document.getElementById('filterDrawer'),
  closeDrawerBtn: document.getElementById('closeDrawerBtn'),
  styleOptions: document.getElementById('styleOptions'),
  moodOptions: document.getElementById('moodOptions'),
  colorOptions: document.getElementById('colorOptions'),
  tagOptions: document.getElementById('tagOptions'),
  clearAllFiltersBtn: document.getElementById('clearAllFiltersBtn'),
  applyFiltersBtn: document.getElementById('applyFiltersBtn'),

  // Detail Modal
  detailModalOverlay: document.getElementById('detailModalOverlay'),
  detailModal: document.getElementById('detailModal'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  prevDesignBtn: document.getElementById('prevDesignBtn'),
  nextDesignBtn: document.getElementById('nextDesignBtn'),
  shareDesignBtn: document.getElementById('shareDesignBtn'),
  modalImage: document.getElementById('modalImage'),
  viewArtworkBtn: document.getElementById('viewArtworkBtn'),
  viewMockupBtn: document.getElementById('viewMockupBtn'),
  modalCategory: document.getElementById('modalCategory'),
  modalStyle: document.getElementById('modalStyle'),
  modalMood: document.getElementById('modalMood'),
  modalName: document.getElementById('modalName'),
  modalCode: document.getElementById('modalCode'),
  copyCodeBigBtn: document.getElementById('copyCodeBigBtn'),
  copyBtnLabel: document.getElementById('copyBtnLabel'),
  modalDescription: document.getElementById('modalDescription'),
  modalTagsList: document.getElementById('modalTagsList'),

  // Toast
  toastContainer: document.getElementById('toastContainer')
};

// ===================================================================
// INITIALIZATION
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCatalogue();
  setupEventListeners();
  setupIntersectionObserver();
  handleInitialRoute();
  trackPageView();
});

// Initialize Catalogue Data
async function initCatalogue() {
  await Promise.all([
    fetchFiltersMetadata(),
    fetchDesigns(true)
  ]);
}

// Track Catalogue Impression
function trackPageView() {
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'catalogue_view' })
  }).catch(() => {});
}

// ===================================================================
// DATA FETCHING & RENDERING
// ===================================================================

// Fetch filter options (styles, moods, colors, tags)
async function fetchFiltersMetadata() {
  try {
    const res = await fetch('/api/filters');
    if (!res.ok) return;
    state.filtersMeta = await res.json();
    renderFilterDrawerOptions();
  } catch (err) {
    console.error('Failed to load filter metadata:', err);
  }
}

// Fetch designs with query filters
async function fetchDesigns(reset = false) {
  if (state.isLoading) return;
  if (!reset && !state.hasMore) return;

  state.isLoading = true;
  elements.gridLoader.style.display = 'flex';
  if (reset) {
    state.offset = 0;
    state.designs = [];
    elements.emptyState.style.display = 'none';
  }

  try {
    const params = new URLSearchParams({
      search: state.search,
      category: state.category,
      style: state.style,
      mood: state.mood,
      color: state.color,
      tag: state.tag,
      sort: state.sort,
      limit: state.limit.toString(),
      offset: state.offset.toString()
    });

    const res = await fetch(`/api/designs?${params.toString()}`);
    const data = await res.json();

    state.totalDesigns = data.total;
    state.hasMore = data.hasMore;
    state.offset += data.designs.length;

    if (reset) {
      state.designs = data.designs;
    } else {
      state.designs = [...state.designs, ...data.designs];
    }

    renderGrid(reset);
    updateStatusBar();
  } catch (err) {
    console.error('Failed to fetch designs:', err);
    showToast('Network error loading catalogue');
  } finally {
    state.isLoading = false;
    elements.gridLoader.style.display = 'none';
  }
}

// Render the Editorial Card Grid
function renderGrid(reset = false) {
  if (reset) {
    elements.designsGrid.innerHTML = '';
  }

  if (state.designs.length === 0) {
    elements.emptyState.style.display = 'flex';
    return;
  }

  elements.emptyState.style.display = 'none';

  // Determine which designs need rendering
  const startIndex = reset ? 0 : elements.designsGrid.children.length;
  const newItems = state.designs.slice(startIndex);

  const fragment = document.createDocumentFragment();

  newItems.forEach(design => {
    const card = createDesignCard(design);
    fragment.appendChild(card);
  });

  elements.designsGrid.appendChild(fragment);
}

// Create Single Design Card Element
function createDesignCard(design) {
  const card = document.createElement('article');
  card.className = 'design-card';
  card.dataset.code = design.code;

  card.innerHTML = `
    <div class="card-media-wrapper">
      <img 
        src="${design.image}" 
        alt="${escapeHtml(design.name)}" 
        class="card-img" 
        loading="lazy"
      >
      <div class="card-top-badges">
        <span class="code-pill">${escapeHtml(design.code)}</span>
        ${design.featured ? '<span class="featured-pill">FEATURED</span>' : ''}
      </div>
      <button class="quick-copy-badge" data-action="quick-copy" data-code="${design.code}" title="Quick copy code">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
        </svg>
        <span>COPY</span>
      </button>
    </div>

    <div class="card-content">
      <h3 class="card-title">${escapeHtml(design.name)}</h3>
      <div class="card-meta-row">
        <span class="card-category">${escapeHtml(design.category)}</span>
        <span class="card-print-hint">TAP TO VIEW</span>
      </div>
    </div>
  `;

  // Click handler to open detail modal or quick copy
  card.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-action="quick-copy"]');
    if (copyBtn) {
      e.stopPropagation();
      copyCodeToClipboard(design.code);
      return;
    }
    openDesignDetail(design.code);
  });

  return card;
}

// Update Active Filter Counters & Status Bar
function updateStatusBar() {
  const count = state.totalDesigns;
  elements.resultsCount.textContent = `${count} ${count === 1 ? 'DESIGN' : 'DESIGNS'} AVAILABLE`;

  // Count active extra filters
  let activeCount = 0;
  if (state.style) activeCount++;
  if (state.mood) activeCount++;
  if (state.color) activeCount++;
  if (state.tag) activeCount++;

  if (activeCount > 0) {
    elements.activeFilterBadge.textContent = activeCount;
    elements.activeFilterBadge.style.display = 'inline-flex';
  } else {
    elements.activeFilterBadge.style.display = 'none';
  }

  // Render active filter chips in status bar
  elements.activeChipsContainer.innerHTML = '';
  const activeFilters = [];
  if (state.category && state.category !== 'ALL') activeFilters.push({ key: 'category', label: state.category });
  if (state.style) activeFilters.push({ key: 'style', label: state.style });
  if (state.mood) activeFilters.push({ key: 'mood', label: state.mood });
  if (state.color) activeFilters.push({ key: 'color', label: state.color });
  if (state.tag) activeFilters.push({ key: 'tag', label: `#${state.tag}` });

  activeFilters.forEach(f => {
    const tagEl = document.createElement('span');
    tagEl.className = 'active-filter-tag';
    tagEl.innerHTML = `
      <span>${escapeHtml(f.label)}</span>
      <button data-remove-key="${f.key}" aria-label="Remove filter">&times;</button>
    `;
    tagEl.querySelector('button').addEventListener('click', () => {
      if (f.key === 'category') {
        setCategory('ALL');
      } else {
        state[f.key] = '';
        updateFilterDrawerActiveStates();
        fetchDesigns(true);
      }
    });
    elements.activeChipsContainer.appendChild(tagEl);
  });
}

// ===================================================================
// DESIGN DETAIL MODAL & URL ROUTING
// ===================================================================

// Open Design Detail Modal
async function openDesignDetail(code, pushHistory = true) {
  if (!code) return;

  // Find in memory or fetch from API
  let design = state.designs.find(d => d.code.toUpperCase() === code.toUpperCase());
  if (!design) {
    try {
      const res = await fetch(`/api/designs/${code}`);
      if (res.ok) {
        design = await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!design) {
    showToast(`Design ${code} not found`);
    return;
  }

  state.currentDesign = design;
  state.currentViewMode = 'artwork';

  // Populate Modal Fields
  elements.modalName.textContent = design.name;
  elements.modalCode.textContent = design.code;
  elements.modalCategory.textContent = design.category;
  elements.modalStyle.textContent = design.style || 'Modern';
  elements.modalMood.textContent = design.mood || 'Aesthetic';
  elements.modalDescription.textContent = design.description || `${design.name} original graphic artwork.`;

  // Render Image based on active mode
  updateModalImage();

  // Tags
  elements.modalTagsList.innerHTML = '';
  (design.tags || []).forEach(t => {
    const tag = document.createElement('span');
    tag.className = 'modal-tag';
    tag.textContent = `#${t}`;
    tag.addEventListener('click', () => {
      closeDesignDetail();
      state.tag = t;
      fetchDesigns(true);
    });
    elements.modalTagsList.appendChild(tag);
  });

  // Reset copy button styling
  elements.copyCodeBigBtn.classList.remove('copied');
  elements.copyBtnLabel.textContent = 'COPY DESIGN CODE';

  // Open modal
  elements.detailModalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Update URL history
  if (pushHistory) {
    history.pushState({ modalCode: design.code }, '', `/design/${design.code}`);
  }

  // Record view metric
  fetch(`/api/designs/${design.code}/view`, { method: 'POST' }).catch(() => {});
}

// Close Design Detail Modal
function closeDesignDetail(popHistory = true) {
  elements.detailModalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  state.currentDesign = null;

  if (popHistory && window.location.pathname.startsWith('/design/')) {
    history.pushState(null, '', '/designs');
  }
}

// Update Modal Image based on Artwork vs Mockup Toggle
function updateModalImage() {
  if (!state.currentDesign) return;
  const isMockup = state.currentViewMode === 'mockup';
  elements.modalImage.src = isMockup ? state.currentDesign.mockupImage : state.currentDesign.image;

  elements.viewArtworkBtn.classList.toggle('active', !isMockup);
  elements.viewMockupBtn.classList.toggle('active', isMockup);
}

// Navigate to Previous / Next Design
function navigateModalDesign(direction) {
  if (!state.currentDesign || state.designs.length === 0) return;
  const currentIndex = state.designs.findIndex(d => d.code === state.currentDesign.code);
  if (currentIndex === -1) return;

  let nextIndex = currentIndex + direction;
  if (nextIndex < 0) nextIndex = state.designs.length - 1;
  if (nextIndex >= state.designs.length) nextIndex = 0;

  openDesignDetail(state.designs[nextIndex].code, true);
}

// Copy Code to Clipboard and Flash Big Button
function copyCodeToClipboard(code) {
  const text = code || (state.currentDesign ? state.currentDesign.code : '');
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    // Button visual feedback
    if (elements.copyCodeBigBtn) {
      elements.copyCodeBigBtn.classList.add('copied');
      elements.copyBtnLabel.textContent = `COPIED: ${text}!`;
      setTimeout(() => {
        elements.copyCodeBigBtn.classList.remove('copied');
        elements.copyBtnLabel.textContent = 'COPY DESIGN CODE';
      }, 2500);
    }

    // Toast alert
    showToast(`Code ${text} copied! Show to cart team.`);

    // Record copy action in analytics
    fetch(`/api/designs/${text}/copy`, { method: 'POST' }).catch(() => {});
  }).catch(() => {
    showToast(`Design Code: ${text}`);
  });
}

// ===================================================================
// EVENT LISTENERS & SEARCH
// ===================================================================

function setupEventListeners() {
  // Search Input with Debounce
  let searchDebounceTimer = null;
  elements.searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    elements.clearSearchBtn.style.display = val ? 'flex' : 'none';

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      state.search = val;
      fetchDesigns(true);
    }, 250);
  });

  // Clear Search Button
  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';
    state.search = '';
    fetchDesigns(true);
    elements.searchInput.focus();
  });

  // Quick keyboard shortcut: Press '/' to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== elements.searchInput) {
      e.preventDefault();
      elements.searchInput.focus();
    } else if (e.key === 'Escape') {
      if (elements.detailModalOverlay.classList.contains('open')) {
        closeDesignDetail();
      } else if (elements.filterDrawerOverlay.classList.contains('open')) {
        closeFilterDrawer();
      }
    }
  });

  // Category Chips Clicks
  elements.categoriesTrack.addEventListener('click', (e) => {
    const chip = e.target.closest('.category-chip');
    if (!chip) return;
    const cat = chip.dataset.category;
    setCategory(cat);
  });

  // Sort Selection
  elements.sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    fetchDesigns(true);
  });

  // Filter Drawer Trigger
  elements.filterTriggerBtn.addEventListener('click', openFilterDrawer);
  elements.closeDrawerBtn.addEventListener('click', closeFilterDrawer);
  elements.filterDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === elements.filterDrawerOverlay) closeFilterDrawer();
  });
  elements.clearAllFiltersBtn.addEventListener('click', () => {
    state.style = '';
    state.mood = '';
    state.color = '';
    state.tag = '';
    updateFilterDrawerActiveStates();
  });
  elements.applyFiltersBtn.addEventListener('click', () => {
    closeFilterDrawer();
    fetchDesigns(true);
  });

  // Reset Filters from Empty State
  elements.resetFiltersBtn.addEventListener('click', () => {
    state.search = '';
    state.category = 'ALL';
    state.style = '';
    state.mood = '';
    state.color = '';
    state.tag = '';
    elements.searchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';
    updateCategoryChipActiveState('ALL');
    updateFilterDrawerActiveStates();
    fetchDesigns(true);
  });

  // Modal Close & Navigation
  elements.modalCloseBtn.addEventListener('click', () => closeDesignDetail(true));
  elements.detailModalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.detailModalOverlay) closeDesignDetail(true);
  });
  elements.prevDesignBtn.addEventListener('click', () => navigateModalDesign(-1));
  elements.nextDesignBtn.addEventListener('click', () => navigateModalDesign(1));

  // Toggle Artwork vs Mockup
  elements.viewArtworkBtn.addEventListener('click', () => {
    state.currentViewMode = 'artwork';
    updateModalImage();
  });
  elements.viewMockupBtn.addEventListener('click', () => {
    state.currentViewMode = 'mockup';
    updateModalImage();
  });

  // Modal Copy Button
  elements.copyCodeBigBtn.addEventListener('click', () => {
    if (state.currentDesign) copyCodeToClipboard(state.currentDesign.code);
  });

  // Share Button
  elements.shareDesignBtn.addEventListener('click', () => {
    if (!state.currentDesign) return;
    const shareUrl = `${window.location.origin}/design/${state.currentDesign.code}`;
    if (navigator.share) {
      navigator.share({
        title: `UNCommon weaR — ${state.currentDesign.code} ${state.currentDesign.name}`,
        text: `Check out this design "${state.currentDesign.name}" (${state.currentDesign.code}) on UNCommon weaR!`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Design link copied to clipboard!');
      });
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    handleInitialRoute();
  });
}

// Category Selection Helper
function setCategory(cat) {
  state.category = cat;
  updateCategoryChipActiveState(cat);
  fetchDesigns(true);

  // Scroll active chip into view
  const activeChip = elements.categoriesTrack.querySelector(`[data-category="${cat}"]`);
  if (activeChip) {
    activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function updateCategoryChipActiveState(cat) {
  const chips = elements.categoriesTrack.querySelectorAll('.category-chip');
  chips.forEach(chip => {
    chip.classList.toggle('active', chip.dataset.category === cat);
  });
}

// ===================================================================
// FILTER DRAWER RENDERING
// ===================================================================

function openFilterDrawer() {
  elements.filterDrawerOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFilterDrawer() {
  elements.filterDrawerOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function renderFilterDrawerOptions() {
  if (!state.filtersMeta) return;

  // Render Styles
  elements.styleOptions.innerHTML = '';
  state.filtersMeta.styles.forEach(style => {
    const chip = document.createElement('button');
    chip.className = `filter-option-chip ${state.style === style ? 'active' : ''}`;
    chip.textContent = style;
    chip.addEventListener('click', () => {
      state.style = state.style === style ? '' : style;
      chip.classList.toggle('active', state.style === style);
    });
    elements.styleOptions.appendChild(chip);
  });

  // Render Moods
  elements.moodOptions.innerHTML = '';
  state.filtersMeta.moods.forEach(mood => {
    const chip = document.createElement('button');
    chip.className = `filter-option-chip ${state.mood === mood ? 'active' : ''}`;
    chip.textContent = mood;
    chip.addEventListener('click', () => {
      state.mood = state.mood === mood ? '' : mood;
      chip.classList.toggle('active', state.mood === mood);
    });
    elements.moodOptions.appendChild(chip);
  });

  // Render Colors
  elements.colorOptions.innerHTML = '';
  state.filtersMeta.colors.forEach(col => {
    const chip = document.createElement('button');
    chip.className = `filter-option-chip ${state.color === col ? 'active' : ''}`;
    chip.textContent = col;
    chip.addEventListener('click', () => {
      state.color = state.color === col ? '' : col;
      chip.classList.toggle('active', state.color === col);
    });
    elements.colorOptions.appendChild(chip);
  });

  // Render Top Tags
  elements.tagOptions.innerHTML = '';
  state.filtersMeta.tags.slice(0, 24).forEach(tag => {
    const pill = document.createElement('button');
    pill.className = `filter-tag-pill ${state.tag === tag ? 'active' : ''}`;
    pill.textContent = `#${tag}`;
    pill.addEventListener('click', () => {
      state.tag = state.tag === tag ? '' : tag;
      pill.classList.toggle('active', state.tag === tag);
    });
    elements.tagOptions.appendChild(pill);
  });
}

function updateFilterDrawerActiveStates() {
  renderFilterDrawerOptions();
}

// ===================================================================
// INFINITE SCROLL OBSERVER
// ===================================================================

function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    const first = entries[0];
    if (first.isIntersecting && state.hasMore && !state.isLoading && state.designs.length > 0) {
      fetchDesigns(false);
    }
  }, {
    rootMargin: '400px',
    threshold: 0.1
  });

  observer.observe(elements.sentinel);
}

// ===================================================================
// URL ROUTING HANDLER
// ===================================================================

function handleInitialRoute() {
  const pathname = window.location.pathname;

  // Direct design URL: /design/UW-047
  const match = pathname.match(/^\/design\/([A-Za-z0-9_-]+)/);
  if (match) {
    const code = match[1];
    openDesignDetail(code, false);
  } else {
    // If modal is open from previous route, close it
    if (elements.detailModalOverlay.classList.contains('open')) {
      closeDesignDetail(false);
    }
  }
}

// ===================================================================
// TOAST NOTIFICATIONS
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
  }, 2800);
}

// HTML Escaping Utility
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
