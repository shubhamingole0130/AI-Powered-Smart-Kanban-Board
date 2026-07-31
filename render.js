// ============================================
// RENDER.JS — all UI drawing logic
// ============================================
import { setupDragOnCards, setupDropZones } from './drag.js';
import { tasks } from './state.js';
import { openEditModal } from './modal.js';

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
    const colTasks = tasks.filter(t => t.column === col);
    const container = document.getElementById(`cards-${col}`);
      setupDragOnCards();
  setupDropZones();

    container.innerHTML = '';

    if (colTasks.length === 0) {
      container.innerHTML = `<p class="empty-msg">No tasks here</p>`;
    } else {
      colTasks.forEach(task => {
        container.innerHTML += buildCard(task);
      });
    }

    document.getElementById(`count-${col}`).textContent = colTasks.length;

    // Delete — event delegation
    container.addEventListener('click', (e) => {
      // Delete button
      if (e.target.classList.contains('delete-btn')) {
        const id = Number(e.target.dataset.id);
        deleteTaskAndRender(id);
      }
      // Edit button
      if (e.target.classList.contains('edit-btn')) {
        const id = Number(e.target.dataset.id);
        openEditModal(id);
      }
    });
  });
}

// Helper to avoid circular imports
import { deleteTask } from './state.js';
function deleteTaskAndRender(id) {
  deleteTask(id);
  render();
}

