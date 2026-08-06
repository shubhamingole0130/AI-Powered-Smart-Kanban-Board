// ============================================
// RENDER.JS — all UI drawing logic
// ============================================
import { setupDragOnCards, setupDropZones } from './drag.js';
import { tasks } from './state.js';
import { openEditModal } from './modal.js';
import { getFilteredTasks ,activeFilters} from './filters.js';
import { logActivity } from './activity.js';
export function buildCard(task) {
  return `
    
    <div class="card" data-id="${task.id}" draggable="true">
      <div class="card-top">
        <span class="label label-${task.label}">${task.label}</span>
         <span class="drag-handle" title="Drag to move">⠿</span>
        <button class="delete-btn" data-id="${task.id}" draggable="false" title="Delete">&times;</button>

      </div>
      <h3 class="card-title">${task.title}</h3>
      <p class="card-desc">${task.desc}</p>
      <div class="card-footer">
        <span class="assignee">${task.assignee}</span>
        <span class="priority priority-${task.priority}">${task.priority}</span>
      </div>
      
      <button class="edit-btn" data-id="${task.id}" draggable="false">✏️ Edit</button>
    </div>
  `;
}

export function render() {
  const columns = ['todo', 'in-progress', 'done'];

  columns.forEach(col => {
    const colTasks = getFilteredTasks().filter(t => t.column === col);
    const container = document.getElementById(`cards-${col}`);

    // Wipe container
    container.innerHTML = '';

    if (colTasks.length === 0) {
      // Show empty message
      const isFiltering = Object.values(activeFilters).some(v => v !== '');
      container.innerHTML = `
        <p class="empty-msg">
          ${isFiltering ? '🔍 No matching tasks' : 'No tasks here'}
        </p>
      `;
    } else {
      // ✅ Draw cards — this was completely missing
      colTasks.forEach(task => {
        container.innerHTML += buildCard(task);
      });
    }

    // Update count badge
    document.getElementById(`count-${col}`).textContent = colTasks.length;

    // Event delegation for delete and edit
    container.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = Number(e.target.dataset.id);

    // Find task before deleting to get its title
    const task = tasks.find(t => t.id === id);
    if (task) {
      logActivity('deleted', `<strong>${task.assignee}</strong> deleted "<strong>${task.title}</strong>"`);
    }

    deleteTaskAndRender(id);
  }

  if (e.target.classList.contains('edit-btn')) {
    const id = Number(e.target.dataset.id);
    openEditModal(id);
  }
});
  });

  // Setup drag after cards are drawn
  setupDragOnCards();
  setupDropZones();

  // Update filter results count
  const total = getFilteredTasks().length;
  const resultsEl = document.getElementById('filterResults');
  if (resultsEl) {
    const isFiltering = Object.values(activeFilters).some(v => v !== '');
    resultsEl.textContent = isFiltering
      ? `${total} task${total !== 1 ? 's' : ''} found`
      : '';
  }
}

// Helper to avoid circular imports
import { deleteTask } from './state.js';
function deleteTaskAndRender(id) {
  deleteTask(id);
  render();
}

