// ============================================
// TEAMMATE.JS — simulated live user activity
// ============================================

import { tasks, addTask, updateTask } from './state.js';
import { logActivity } from './activity.js';

// ---- PAUSE STATE ----
let isPaused = false;

// ---- FAKE TEAMMATE DATA ----
const teammates = ['Priya', 'Arjun', 'Sara', 'Dev'];

const fakeTasks = [
  { title: 'Update API documentation',  desc: 'Swagger docs need updating',       label: 'feature' },
  { title: 'Fix mobile nav bug',        desc: 'Hamburger menu not closing',       label: 'bug'     },
  { title: 'Redesign onboarding flow',  desc: 'New user experience improvements', label: 'design'  },
  { title: 'Add unit tests for auth',   desc: 'Coverage is below 60%',            label: 'feature' },
  { title: 'Fix payment gateway error', desc: 'Stripe webhook failing silently',  label: 'bug'     },
  { title: 'Dark mode for dashboard',   desc: 'CSS variables already set up',     label: 'design'  },
  { title: 'Optimize image loading',    desc: 'Use lazy loading on product page', label: 'feature' },
  { title: 'Fix search indexing',       desc: 'Elasticsearch query too slow',     label: 'bug'     },
];

const columns  = ['todo', 'in-progress', 'done'];
const colNames = {
  'todo':        'To Do',
  'in-progress': 'In Progress',
  'done':        'Done'
};
const priorities = ['low', 'medium', 'high'];

// ---- HELPERS ----
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTeammate() {
  return randomFrom(teammates);
}

// ---- ACTIONS ----

function simulateCreate() {
  const fake     = randomFrom(fakeTasks);
  const assignee = randomTeammate();
  const column   = randomFrom(['todo', 'in-progress']);
  const priority = randomFrom(priorities);

  const newTask = {
    id:       Date.now(),
    title:    fake.title,
    desc:     fake.desc,
    label:    fake.label,
    assignee,
    priority,
    column
  };

  addTask(newTask); // ✅ this also calls notify() → render() automatically
  logActivity('created', `<strong>${assignee}</strong> created "<strong>${fake.title}</strong>"`);
}

function simulateMove() {
  if (tasks.length === 0) return;

  const task     = randomFrom(tasks);
  const newCol   = randomFrom(columns.filter(c => c !== task.column));
  const assignee = randomTeammate();

  updateTask(task.id, { column: newCol }); // ✅ notify() fires automatically
  logActivity('moved', `<strong>${assignee}</strong> moved "<strong>${task.title}</strong>" to <strong>${colNames[newCol]}</strong>`);
}

function simulatePickUp() {
  const todoTasks = tasks.filter(t => t.column === 'todo');
  if (todoTasks.length === 0) return;

  const task     = randomFrom(todoTasks);
  const assignee = randomTeammate();

  updateTask(task.id, { column: 'in-progress', assignee }); // ✅
  logActivity('moved', `<strong>${assignee}</strong> started working on "<strong>${task.title}</strong>"`);
}

function simulateComplete() {
  const inProgressTasks = tasks.filter(t => t.column === 'in-progress');
  if (inProgressTasks.length === 0) return;

  const task     = randomFrom(inProgressTasks);
  const assignee = task.assignee;

  updateTask(task.id, { column: 'done' }); // ✅
  logActivity('moved', `<strong>${assignee}</strong> completed "<strong>${task.title}</strong>" ✅`);
}

function simulateComment() {
  if (tasks.length === 0) return;

  const task     = randomFrom(tasks);
  const assignee = randomTeammate();

  const comments = [
    `left a comment on "<strong>${task.title}</strong>"`,
    `is reviewing "<strong>${task.title}</strong>"`,
    `flagged "<strong>${task.title}</strong>" for review`,
    `added notes to "<strong>${task.title}</strong>"`
  ];

  logActivity('edited', `<strong>${assignee}</strong> ${randomFrom(comments)}`);
}

// ---- WEIGHTED RANDOM ACTION PICKER ----
function runRandomAction() {
  const roll = Math.random();

  if (roll < 0.25)      simulateComment();
  else if (roll < 0.45) simulatePickUp();
  else if (roll < 0.62) simulateMove();
  else if (roll < 0.78) simulateComplete();
  else                  simulateCreate();
}

// ---- ONLINE INDICATOR ----
function updateOnlineIndicator(count) {
  const indicator = document.getElementById('onlineCount');
  if (indicator) indicator.textContent = `${count} online`;
}

// ---- PAUSE BUTTON ----
document.getElementById('pauseSimulation').addEventListener('click', () => {
  isPaused = !isPaused;
  const btn = document.getElementById('pauseSimulation');
  const dot = document.getElementById('onlineDot');

  if (isPaused) {
    btn.textContent        = '▶ Resume';
    dot.style.background   = '#e74c3c';
  } else {
    btn.textContent        = '⏸ Pause';
    dot.style.background   = '#2ecc71';
  }
});

// ---- START SIMULATION ----
export function startTeammateSimulation() {
  console.log('✅ Simulation started');

  const onlineCount = Math.floor(Math.random() * 3) + 2;
  updateOnlineIndicator(onlineCount);

  // First action after 8 seconds
  setTimeout(() => {
    if (!isPaused) runRandomAction();
  }, 8000);

  // Then every 15 seconds
  setInterval(() => {
    if (!isPaused && Math.random() < 0.7) {
      runRandomAction();
    }
  }, 15000);
}