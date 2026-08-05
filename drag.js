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


// ---- SETUP DROP ZONES ON COLUMNS ----
export function setupDropZones() {
  document.querySelectorAll('.column').forEach(col => {  // renamed to col
    const container = col.querySelector('.cards-container');

    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');

      if (!placeholder) {
        placeholder = createPlaceholder();
      }

      const afterElement = getDragAfterElement(container, e.clientY);

      if (afterElement) {
        container.insertBefore(placeholder, afterElement);
      } else {
        container.appendChild(placeholder);
      }
    });

    col.addEventListener('dragleave', (e) => {
      if (!col.contains(e.relatedTarget)) {
        col.classList.remove('drag-over');

        if (placeholder && placeholder.parentNode === container) {
          container.removeChild(placeholder);
        }
      }
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');  // ✅ now correctly using col

      const newColumn = col.id;
      const id = Number(e.dataTransfer.getData('text/plain'));

      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
        placeholder = null;
      }

      if (id && newColumn) {
        const currentTask = tasks.find(t => t.id === id);

        if (currentTask && currentTask.column !== newColumn) {
          updateTask(id, { column: newColumn });
          render();
          setupDragOnCards();
          setupDropZones();
        }
      }
    });

  });
}