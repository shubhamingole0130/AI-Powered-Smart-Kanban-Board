// ============================================
// MODAL.JS — all modal and form logic
// ============================================

import { tasks, addTask, updateTask } from './state.js';
import { logActivity } from './activity.js';
import { getPriorityScore } from './ai.js';

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
   document.getElementById('aiResult').style.display = 'none';
  document.getElementById('aiSuggestPriority').textContent = '✨ AI Suggest Priority';
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

// ---- AI PRIORITY SUGGEST ----
document.getElementById('aiSuggestPriority').addEventListener('click', async () => {
  const title = document.getElementById('taskTitle').value.trim();
  const desc  = document.getElementById('taskDesc').value.trim();

  if (!title) {
    alert('Please enter a task title first');
    return;
  }

  const btn       = document.getElementById('aiSuggestPriority');
  const resultBox = document.getElementById('aiResult');
  const resultTxt = document.getElementById('aiResultText');

  // Show loading state
  btn.disabled     = true;
  btn.textContent  = 'Analyzing...';
  resultBox.style.display = 'block';
  resultTxt.innerHTML = '<span class="ai-loading"></span> AI is thinking...';

  try {
    const priority = await getPriorityScore(title, desc);

    // Show result
    const emoji = { high: '🔴', medium: '🟡', low: '🟢' };
    resultTxt.innerHTML = `AI suggests: <strong>${emoji[priority]} ${priority} priority</strong>`;

    // Auto-set the priority dropdown
    document.getElementById('taskPriority').value = priority;

    btn.textContent = '✨ AI Suggest Priority';
    btn.disabled    = false;

  } catch (err) {
    resultTxt.textContent = '❌ Could not get suggestion. Try again.';
    btn.textContent       = '✨ AI Suggest Priority';
    btn.disabled          = false;
  }
});