// ============================================
// AI.JS — priority scoring and sprint reports
// ============================================

// ---- MOCK PRIORITY SCORER ----
// Keyword-based scoring — replaced by real API tomorrow
export async function getPriorityScore(title, desc) {
  // Simulate network delay so UI feels realistic
  await sleep(800);

  const text = `${title} ${desc}`.toLowerCase();

  // High priority keywords
  const highWords = [
    'crash', 'fix', 'bug', 'error', 'urgent', 'broken',
    'critical', 'fail', 'down', 'security', 'payment',
    'production', 'hotfix', 'blocker', 'emergency'
  ];

  // Low priority keywords
  const lowWords = [
    'readme', 'docs', 'documentation', 'typo', 'minor',
    'cleanup', 'refactor', 'style', 'color', 'rename',
    'update readme', 'nice to have', 'eventually'
  ];

  if (highWords.some(w => text.includes(w))) return 'high';
  if (lowWords.some(w => text.includes(w)))  return 'low';
  return 'medium';
}

// ---- SLEEP HELPER ----
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- MOCK SPRINT REPORT ----
// Returns a formatted markdown report — real API version comes Day 17
export async function generateSprintReport(completedTasks) {
  await sleep(1200);

  if (completedTasks.length === 0) {
    return '## Sprint Report\n\nNo tasks were completed this sprint.';
  }

  const byLabel = {
    feature: completedTasks.filter(t => t.label === 'feature'),
    bug:     completedTasks.filter(t => t.label === 'bug'),
    design:  completedTasks.filter(t => t.label === 'design'),
  };

  let report = `## Sprint Report\n\n`;
  report += `**Total completed:** ${completedTasks.length} tasks\n\n`;

  if (byLabel.feature.length > 0) {
    report += `### ✨ Features (${byLabel.feature.length})\n`;
    byLabel.feature.forEach(t => {
      report += `- ${t.title} — assigned to ${t.assignee}\n`;
    });
    report += '\n';
  }

  if (byLabel.bug.length > 0) {
    report += `### 🐛 Bugs Fixed (${byLabel.bug.length})\n`;
    byLabel.bug.forEach(t => {
      report += `- ${t.title} — assigned to ${t.assignee}\n`;
    });
    report += '\n';
  }

  if (byLabel.design.length > 0) {
    report += `### 🎨 Design (${byLabel.design.length})\n`;
    byLabel.design.forEach(t => {
      report += `- ${t.title} — assigned to ${t.assignee}\n`;
    });
    report += '\n';
  }

  report += `---\n*Generated on ${new Date().toLocaleDateString()}*`;
  return report;
}