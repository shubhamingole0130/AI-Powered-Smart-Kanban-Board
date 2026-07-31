// ============================================
// DRAG.JS — polished drag and drop
// ============================================

import { updateTask, tasks } from './state.js';
import { render } from './render.js';

let draggedId   = null;
let placeholder = null;

// ---- CREATE PLACEHOLDER ELEMENT ----
function createPlaceholder() {
  const el = document.createElement('div');
  el.className = 'drop-placeholder';
  return el;
}

// ---- GET ELEMENT TO INSERT BEFORE ----
// Returns the card element the dragged card should be inserted before
function getDragAfterElement(container, y) {
  // Get all cards that are NOT being dragged
  const cards = [...container.querySelectorAll('.card:not(.dragging)')];

  return cards.reduce((closest, card) => {
    const box = card.getBoundingClientRect();
    const midpoint = box.top + box.height / 2;
    const offset = y - midpoint;

    // We want the card whose midpoint is closest above the cursor
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: card };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ---- SETUP DRAG EVENTS ON CARDS ----
export function setupDragOnCards() {
  document.querySelectorAll('.card').forEach(card => {

    card.addEventListener('dragstart', (e) => {
      draggedId = Number(card.dataset.id);
      e.dataTransfer.setData('text/plain', draggedId);
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => {card.classList.add('dragging');
         document.querySelector('.board').classList.add('dragging-active'); 
      } ,0);

    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      draggedId = null;

      // Remove placeholder if it exists
      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }
      placeholder = null;

      // Remove highlights from all columns
      document.querySelectorAll('.column').forEach(col => {
        col.classList.remove('drag-over');
          document.querySelector('.board').classList.remove('dragging-active'); 
      });
    });

  });
}
column.addEventListener('drop', (e) => {
  e.preventDefault();
  column.classList.remove('drag-over');

  const newColumn = column.id;
  const id = Number(e.dataTransfer.getData('text/plain'));

  if (placeholder && placeholder.parentNode) {
    placeholder.parentNode.removeChild(placeholder);
    placeholder = null;
  }

  if (id && newColumn) {
    // Find current column of dragged task
    const currentTask = tasks.find(t => t.id === id);

    // Only update if column actually changed
    if (currentTask && currentTask.column !== newColumn) {
      updateTask(id, { column: newColumn });
      render();
      setupDragOnCards();
      setupDropZones();
    }
  }
});

// ---- SETUP DROP ZONES ON COLUMNS ----
export function setupDropZones() {
  document.querySelectorAll('.column').forEach(column => {
    const container = column.querySelector('.cards-container');

    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      column.classList.add('drag-over');

      // Create placeholder if it doesn't exist yet
      if (!placeholder) {
        placeholder = createPlaceholder();
      }

      // Find where to insert the placeholder
      const afterElement = getDragAfterElement(container, e.clientY);

      if (afterElement) {
        container.insertBefore(placeholder, afterElement);
      } else {
        container.appendChild(placeholder);
      }
    });

    column.addEventListener('dragleave', (e) => {
      if (!column.contains(e.relatedTarget)) {
        column.classList.remove('drag-over');

        // Remove placeholder when leaving column
        if (placeholder && placeholder.parentNode === container) {
          container.removeChild(placeholder);
        }
      }
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.classList.remove('drag-over');

      const newColumn = column.id;
      const id = Number(e.dataTransfer.getData('text/plain'));

      // Remove placeholder
      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
        placeholder = null;
      }

      if (id && newColumn) {
        updateTask(id, { column: newColumn });
        render();
        setupDragOnCards();
        setupDropZones();
      }
    });

  });
}