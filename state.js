// ============================================
// STATE.JS — single source of truth
// ======================
// ======================
import { notify } from './store.js';
export let tasks = [];

export function saveTasks() {
  localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
}

export function loadTasks() {
  const stored = localStorage.getItem('kanban-tasks');
  if (stored) {
    // ✅ Mutate in place instead of reassigning
    const parsed = JSON.parse(stored);
    tasks.length = 0;                    // wipe array
    parsed.forEach(t => tasks.push(t)); // refill it
  }
}

export function addTask(newTask) {
  tasks.push(newTask);
  saveTasks();
  notify();
}

export function deleteTask(id) {
  // ✅ Mutate in place
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) tasks.splice(index, 1);
  saveTasks();
  notify();
}

export function updateTask(id, updatedFields) {
  // ✅ Mutate in place
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {

    if(updatedFields.column==='done' && tasks[index].column!=='done'){
      updatedFields.completedAt=Date.now();
      console.log('✅ completedAt saved:', updatedFields.completedAt);
    }
    tasks[index] = { ...tasks[index], ...updatedFields };
  }
  saveTasks();
  notify();
}