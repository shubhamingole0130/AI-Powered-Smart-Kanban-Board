

// ============================================
// STATE — single source of truth for all tasks
// ============================================
let tasks = [
  {
    id: 1,
    title: "Fix login page error",
    desc: "Users getting 401 on fresh login",
    label: "bug",
    assignee: "Rahul",
    priority: "high",
    column: "todo"
  },
  {
    id: 2,
    title: "Add dark mode toggle",
    desc: "User preference saved in localStorage",
    label: "feature",
    assignee: "Priya",
    priority: "medium",
    column: "todo"
  },
  {
    id: 3,
    title: "Redesign dashboard layout",
    desc: "New wireframes approved, start implementation",
    label: "design",
    assignee: "Rahul",
    priority: "high",
    column: "in-progress"
  },
  {
    id: 4,
    title: "Setup project repo",
    desc: "Initialized Git, pushed to GitHub",
    label: "feature",
    assignee: "Priya",
    priority: "low",
    column: "done"
  }
];
// ============================================
// BUILD A SINGLE CARD — returns an HTML string
// ============================================
function buildCard(task) {
  return `
    <div class="card" data-id="${task.id}">
      <span class="label label-${task.label}">${task.label}</span>
      <h3 class="card-title">${task.title}</h3>
      <p class="card-desc">${task.desc}</p>
      <div class="card-footer">
        <span class="assignee">${task.assignee}</span>
        <span class="priority priority-${task.priority}">${task.priority}</span>
      </div>
    </div>
  `;
}
// ============================================
// RENDER — wipes and redraws all columns
// ============================================
function render() {
  const columns = ['todo', 'in-progress', 'done'];

  columns.forEach(col => {
    // Get all tasks belonging to this column
    const colTasks = tasks.filter(t => t.column === col);

    // Get the cards container for this column
    const container = document.getElementById(`cards-${col}`);

    // Wipe it clean
    container.innerHTML = '';
    
    if (colTasks.length === 0) {
  container.innerHTML = `<p class="empty-msg">No tasks here</p>`;
}
    // Rebuild every card
    colTasks.forEach(task => {
      container.innerHTML += buildCard(task);
    });

    // Update the count badge
    document.getElementById(`count-${col}`).textContent = colTasks.length;
  });
}
// Select elements
const modalOverlay = document.getElementById('modalOverlay');
const closeModal   = document.getElementById('closeModal');
const cancelModal  = document.getElementById('cancelModal');
const addBtns      = document.querySelectorAll('.add-btn');

// Track which column the button was clicked from
let activeColumn = null;

// Open modal when any "+ Add Task" button is clicked
addBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    activeColumn = btn.dataset.column;  // saves "todo", "in-progress", or "done"
    modalOverlay.classList.add('active');
  });
});

// Close modal on X button
closeModal.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

// Close modal on Cancel button
cancelModal.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

// Close modal when clicking the dark overlay background
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

console.log("Kanban app loaded ✅");
//calling render fn()
render();