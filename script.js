// ============================================
// SCRIPT.JS — entry point only
// ============================================
import './drag.js';
import { loadTasks } from './state.js';
import { render } from './render.js';
import { subscribe } from './store.js';
import './modal.js'; // loads all modal listeners
import { setupFilters, loadFiltersFromURL } from './filters.js';
import './activity.js'
import { renderFeed } from './activity.js';
import { startTeammateSimulation } from './teammate.js';
import { setupChart } from './chart.js';
import { setupReport } from './report.js';
subscribe(render);
subscribe(renderFeed);
loadTasks();
loadFiltersFromURL(); 
setupFilters();  
render();
setupChart();
setupReport();
// temppp
import { getSubscriberCount } from './store.js';
console.log(`✅ ${getSubscriberCount()} subscribers registered`);
// Should print: ✅ 2 subscribers registered
 startTeammateSimulation();
document.addEventListener('tasksupdated', () => {
  render();

 
});