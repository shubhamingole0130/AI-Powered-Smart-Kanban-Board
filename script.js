// ============================================
// SCRIPT.JS — entry point only
// ============================================

import { loadTasks } from './state.js';
import { render } from './render.js';
import './modal.js'; // loads all modal listeners

loadTasks();
render();