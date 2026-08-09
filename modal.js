// ============================================
// MODAL.JS — all modal and form logic
// ============================================

import { tasks, addTask, updateTask } from './state.js';
import { logActivity } from './activity.js';

// DOM elements
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle   = document.getElementById('modalTitle');

// Mode tracking
let modalMode  = 'create';
let editingId  = null;
export let activeColumn = null;

// ---- OPEN MODAL (create mode) ----
export function openCreateModal(column) {
  modalMode      = 'create';
  editingId      = null;
  activeColumn   = column;
  modalTitle.textContent = 'Add New Task';
  clearForm();
  modalOverlay.classList.add('active');
}

// ---- OPEN MODAL (edit mode) ----
export function openEditModal(id) {
  modalMode = 'edit';
  editingId = id;

  const task = tasks.find(t => t.id === id);
  if (!task) return;

  document.getElementById('taskTitle').value    = task.title;
  document.getElementById('taskDesc').value     = task.desc;
  document.getElementById('taskLabel').value    = task.label;
  document.getElementById('taskAssignee').value = task.assignee;
  document.getElementById('taskPriority').value = task.priority;

  modalTitle.textContent = 'Edit Task';
  modalOverlay.classList.add('active');
}

// ---- CLOSE MODAL ----
export function closeModalFn() {
  modalOverlay.classList.remove('active');
  clearForm();
  modalMode = 'create';
  editingId = null;
}

// ---- CLEAR FORM ----
function clearForm() {
  document.getElementById('taskTitle').value    = '';
  document.getElementById('taskDesc').value     = '';
  document.getElementById('taskAssignee').value = '';
  document.getElementById('taskLabel').value    = 'feature';
  document.getElementById('taskPriority').value = 'medium';
}

// ---- SUBMIT HANDLER ----
export function handleSubmit() {
  const title    = document.getElementById('taskTitle').value.trim();
  const desc     = document.getElementById('taskDesc').value.trim();
  const label    = document.getElementById('taskLabel').value;
  const assignee = document.getElementById('taskAssignee').value.trim();
  const priority = document.getElementById('taskPriority').value;

  if (!title) {
    alert('Please enter a task title');
    return;
  }

  if (modalMode === 'create') {
    const newTask = {
      id:       Date.now(),
      title,
      desc:     desc || 'No description',
      label:    label || 'feature',
      assignee: assignee || 'Unassigned',
      priority: priority || 'medium',
      column:   activeColumn
    };
    addTask(newTask);
    logActivity('created', `<strong>${newTask.assignee}</strong> created "<strong>${newTask.title}</strong>"`);

  } else {
    updateTask(editingId, { title, desc, label, assignee, priority });
    logActivity('edited', `<strong>${assignee}</strong> edited "<strong>${title}</strong>"`);
  }

  
  closeModalFn();
}

// ---- EVENT LISTENERS ----
document.getElementById('closeModal').addEventListener('click', closeModalFn);
document.getElementById('cancelModal').addEventListener('click', closeModalFn);
document.getElementById('submitTask').addEventListener('click', handleSubmit);

document.getElementById('taskTitle').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSubmit();
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModalFn();
});

document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    openCreateModal(btn.dataset.column);
  });
});