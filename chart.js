// ============================================
// CHART.JS — Canvas velocity chart
// ============================================

import { tasks } from './state.js';

// ---- GET LAST 7 DAYS AS LABELS ----
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const label   = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    days.push({ label, dateStr });
  }
  return days;
}

// ---- COUNT TASKS COMPLETED PER DAY ----
function getVelocityData(days) {
  // ✅ Read directly from localStorage every time — never use stale import
  const stored    = localStorage.getItem('kanban-tasks');
  const allTasks  = stored ? JSON.parse(stored) : [];
  const doneTasks = allTasks.filter(t => t.column === 'done' && t.completedAt);

  console.log('Done tasks with completedAt:', doneTasks.length);

  return days.map(day => {
    const count = doneTasks.filter(task => {
      const d        = new Date(task.completedAt);
      const taskDate = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      return taskDate === day.dateStr;
    }).length;
    return count;
  });
}

// ---- DRAW THE CHART ----
export function drawVelocityChart() {
  const canvas = document.getElementById('velocityChart');
  if (!canvas) return;

  const ctx     = canvas.getContext('2d');
  const width   = canvas.width;
  const height  = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  const days    = getLast7Days();
  const data    = getVelocityData(days);
  const maxVal  = Math.max(...data, 1); // at least 1 to avoid division by zero

  // Chart dimensions
  const padding    = { top: 30, right: 20, bottom: 50, left: 40 };
  const chartW     = width  - padding.left - padding.right;
  const chartH     = height - padding.top  - padding.bottom;
  const barWidth   = (chartW / days.length) * 0.6;
  const barSpacing = chartW / days.length;

  // ---- DRAW BACKGROUND GRID LINES ----
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth   = 1;

  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartW, y);
    ctx.stroke();

    // Y axis labels
    const val = Math.round(maxVal - (maxVal / gridLines) * i);
    ctx.fillStyle   = '#aaa';
    ctx.font        = '11px Arial';
    ctx.textAlign   = 'right';
    ctx.fillText(val, padding.left - 6, y + 4);
  }

  // ---- DRAW BARS ----
  data.forEach((val, i) => {
    const barH = (val / maxVal) * chartH;
    const x    = padding.left + i * barSpacing + (barSpacing - barWidth) / 2;
    const y    = padding.top + chartH - barH;

    // Bar gradient effect
    const gradient = ctx.createLinearGradient(x, y, x, y + barH);
    gradient.addColorStop(0, '#4a90d9');
    gradient.addColorStop(1, '#2c5fa8');

    // Draw bar
    ctx.fillStyle = val > 0 ? gradient : '#f0f0f0';
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH || 4, 4); // min height 4px so empty days show
    ctx.fill();

    // Value label on top of bar
    if (val > 0) {
      ctx.fillStyle   = '#333';
      ctx.font        = 'bold 12px Arial';
      ctx.textAlign   = 'center';
      ctx.fillText(val, x + barWidth / 2, y - 6);
    }

    // Day label below bar
    ctx.fillStyle = '#888';
    ctx.font      = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(days[i].label, x + barWidth / 2, height - padding.bottom + 18);
  });

  // ---- DRAW X AXIS LINE ----
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top + chartH);
  ctx.lineTo(padding.left + chartW, padding.top + chartH);
  ctx.stroke();

  // ---- DRAW TITLE ----
  ctx.fillStyle = '#555';
  ctx.font      = '12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Tasks completed', padding.left, padding.top - 10);
}

// ---- OPEN / CLOSE CHART ----
export function setupChart() {
  const overlay   = document.getElementById('chartOverlay');
  const closeBtn  = document.getElementById('closeChart');
  const toggleBtn = document.getElementById('toggleChart');

  toggleBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    drawVelocityChart(); // draw fresh every time opened
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}