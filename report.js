// ============================================
// REPORT.JS — sprint report generation
// ============================================

import { tasks } from './state.js';
import { generateSprintReport } from './ai.js';
import { parseMarkdown } from './markdown.js';

// ---- SETUP REPORT MODAL ----
export function setupReport() {
  const overlay    = document.getElementById('reportOverlay');
  const closeBtn   = document.getElementById('closeReport');
  const cancelBtn  = document.getElementById('cancelReport');
  const generateBtn = document.getElementById('triggerReport');
  const reportBtn  = document.getElementById('generateReport');

  // Open modal
  reportBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    updateReportMeta();
  });

  // Close modal
  closeBtn.addEventListener('click',  () => overlay.classList.remove('active'));
  cancelBtn.addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });

  // Generate report
  generateBtn.addEventListener('click', generateReport);
}

// ---- UPDATE META INFO ----
function updateReportMeta() {
  const completed = tasks.filter(t => t.column === 'done');
  const meta      = document.getElementById('reportMeta');
  const today     = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  meta.innerHTML = `
    <strong>${completed.length}</strong> completed tasks &nbsp;·&nbsp;
    Generated on ${today}
  `;
}

// ---- GENERATE REPORT ----
async function generateReport() {
  const completed   = tasks.filter(t => t.column === 'done');
  const contentEl   = document.getElementById('reportContent');
  const generateBtn = document.getElementById('triggerReport');

  // Show loading state
  generateBtn.disabled    = true;
  generateBtn.textContent = 'Generating...';
  contentEl.innerHTML = `
    <div class="report-generating">
      <div class="big-spinner"></div>
      <p>Gemini AI is writing your sprint report...</p>
    </div>
  `;

  try {
    // Call AI
    const report = await generateSprintReport(completed);

    // Render markdown report
    contentEl.innerHTML = `
      <button class="copy-report-btn" id="copyReport">📋 Copy</button>
      <div class="report-body">
        ${parseMarkdown(report)}
      </div>
    `;

    // Copy button
    document.getElementById('copyReport').addEventListener('click', () => {
      navigator.clipboard.writeText(report).then(() => {
        document.getElementById('copyReport').textContent = '✅ Copied!';
        setTimeout(() => {
          document.getElementById('copyReport').textContent = '📋 Copy';
        }, 2000);
      });
    });

  } catch (err) {
    contentEl.innerHTML = `
      <div class="report-placeholder">
        <p>❌ Could not generate report. Please try again.</p>
      </div>
    `;
    console.error('Report generation error:', err);
  }

  generateBtn.disabled    = false;
  generateBtn.textContent = '✨ Generate with AI';
}