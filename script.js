
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