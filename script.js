// ============================================
// SCRIPT.JS — entry point only
// ============================================
import './drag.js';
import { loadTasks } from './state.js';
import { render } from './render.js';
import './modal.js'; // loads all modal listeners
import { setupFilters, loadFiltersFromURL } from './filters.js';
import './activity.js'
loadTasks();
loadFiltersFromURL(); 
setupFilters();  
render();
document.addEventListener('tasksupdated', () => {
  render();
});