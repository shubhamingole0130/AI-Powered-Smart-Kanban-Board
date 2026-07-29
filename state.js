// ============================================
// STATE.JS — single source of truth
// ============================================

export let tasks = [];

export function saveTasks() {
  localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
}

export function loadTasks() {
  const stored = localStorage.getItem('kanban-tasks');
  if (stored) {
    tasks = JSON.parse(stored);
  }
}

export function addTask(newTask) {
  tasks.push(newTask);
  saveTasks();
}

export function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
}

export function updateTask(id, updatedFields) {
  tasks = tasks.map(t => t.id === id ? { ...t, ...updatedFields } : t);
  saveTasks();
}