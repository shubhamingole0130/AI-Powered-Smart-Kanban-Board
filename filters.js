// ============================================
// FILTERS.JS — filter logic and URL state
// ============================================

import { tasks } from './state.js';
import { render } from './render.js';

// Current active filters
export let activeFilters = {
  priority: '',
  label:    '',
  assignee: ''
};

// ---- GET FILTERED TASKS ----
export function getFilteredTasks() {
  let filtered = [...tasks]; // copy — never mutate original

  if (activeFilters.priority) {
    filtered = filtered.filter(t => t.priority === activeFilters.priority);
  }
  if (activeFilters.label) {
    filtered = filtered.filter(t => t.label === activeFilters.label);
  }
  if (activeFilters.assignee) {
    const search = activeFilters.assignee.toLowerCase();
    filtered = filtered.filter(t =>
      t.assignee.toLowerCase().includes(search)
    );
  }

  return filtered;
}

// ---- UPDATE URL TO REFLECT FILTERS ----
function updateURL() {
  const params = new URLSearchParams();

  if (activeFilters.priority) params.set('priority', activeFilters.priority);
  if (activeFilters.label)    params.set('label',    activeFilters.label);
  if (activeFilters.assignee) params.set('assignee', activeFilters.assignee);

  const queryString = params.toString();
  const newURL = queryString ? `?${queryString}` : window.location.pathname;
  history.pushState(null, '', newURL);
}

// ---- READ FILTERS FROM URL ON LOAD ----
export function loadFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);

  activeFilters.priority = params.get('priority') || '';
  activeFilters.label    = params.get('label')    || '';
  activeFilters.assignee = params.get('assignee') || '';

  // Reflect loaded filters in UI buttons
  syncFilterButtons();
}

// ---- SYNC BUTTON ACTIVE STATES ---- 
function syncFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const filter = btn.dataset.filter;
    const value  = btn.dataset.value;
    btn.classList.toggle('active', activeFilters[filter] === value);
  });

  document.getElementById('assigneeFilter').value = activeFilters.assignee;
}

// ---- SETUP ALL FILTER LISTENERS ----
export function setupFilters() {

  // Priority and Label buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter; // "priority" or "label"
      const value  = btn.dataset.value;  // "high", "bug", etc or "" for All

      activeFilters[filter] = value;

      // Update active class on buttons in this group
      document.querySelectorAll(`[data-filter="${filter}"]`).forEach(b => {
        b.classList.toggle('active', b.dataset.value === value);
      });

      updateURL();
      render();
    });
  });

  // Assignee search input
  document.getElementById('assigneeFilter').addEventListener('input', (e) => {
    activeFilters.assignee = e.target.value.trim();
    updateURL();
    render();
  });

  // Clear all filters
  document.getElementById('clearFilters').addEventListener('click', () => {
    activeFilters = { priority: '', label: '', assignee: '' };
    syncFilterButtons();
    updateURL();
    render();
  });
}