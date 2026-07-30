// ============================================
// DRAG.JS — all drag and drop logic
// ============================================

import { updateTask } from './state.js';
import { render } from './render.js';

// Tracks the id of the card currently being dragged
let draggedId = null;

// ---- SETUP DRAG EVENTS ON CARDS ----
export function setupDragOnCards() {
  document.querySelectorAll('.card').forEach(card => {

    // When drag starts — store the task id
    card.addEventListener('dragstart', (e) => {
      draggedId = Number(card.dataset.id);
      e.dataTransfer.setData('text/plain', draggedId);
      e.dataTransfer.effectAllowed = 'move';

      // Small delay so the card doesn't disappear instantly
      setTimeout(() => card.classList.add('dragging'), 0);
    });

    // When drag ends — clean up
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      draggedId = null;
      // Remove highlight from all columns
      document.querySelectorAll('.column').forEach(col => {
        col.classList.remove('drag-over');
      });
    });

  });
}

// ---- SETUP DROP ZONES ON COLUMNS ----
export function setupDropZones() {
  document.querySelectorAll('.column').forEach(column => {

    // dragover — must preventDefault to allow dropping
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      column.classList.add('drag-over');
    });

    // dragleave — remove highlight when card leaves column
    column.addEventListener('dragleave', (e) => {
      // Only remove if actually leaving the column (not a child element)
      if (!column.contains(e.relatedTarget)) {
        column.classList.remove('drag-over');
      }
    });

    // drop — move the task to the new column
    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.classList.remove('drag-over');

      const newColumn = column.id; // "todo", "in-progress", or "done"
      const id = Number(e.dataTransfer.getData('text/plain'));

      if (id && newColumn) {
        updateTask(id, { column: newColumn }); // update state
        render();                               // redraw board
        setupDragOnCards();                     // re-attach drag listeners
      }
    });

  });
}