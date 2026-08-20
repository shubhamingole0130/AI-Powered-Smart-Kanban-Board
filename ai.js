// ============================================
// AI.JS — Gemini API integration
// ============================================

import { GEMINI_API_KEY } from './config.js';


const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
// ---- CORE API CALL ----
async function callGemini(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();

  // Extract text from response
  return data.candidates[0].content.parts[0].text.trim();
}

// ---- PRIORITY SCORING ----
export async function getPriorityScore(title, desc) {
  const prompt = `You are an experienced project manager reviewing a task.
Based on the task title and description, respond with ONLY one word — either 'high', 'medium', or 'low' — indicating the priority level.

Rules:
- high: urgent issues, bugs, crashes, security problems, blocking other work
- medium: new features, improvements, non-urgent tasks
- low: documentation, minor UI tweaks, nice-to-have improvements

Task title: ${title}
Task description: ${desc}

Respond with only one word (high, medium, or low):`;

  try {
    const result = await callGemini(prompt);

    // Parse response — extract just the priority word
    const cleaned = result.toLowerCase().replace(/[^a-z]/g, '');
    if (['high', 'medium', 'low'].includes(cleaned)) {
      return cleaned;
    }

    // Fallback if response is unexpected
    return 'medium';

  } catch (err) {
    console.error('Gemini priority error:', err);
    // Fall back to mock scoring if API fails
    return getMockPriority(title, desc);
  }
}

// ---- MOCK FALLBACK (if API fails) ----
function getMockPriority(title, desc) {
  const text = `${title} ${desc}`.toLowerCase();

  const highWords = [
    'crash', 'fix', 'bug', 'error', 'urgent', 'broken',
    'critical', 'fail', 'down', 'security', 'payment',
    'production', 'hotfix', 'blocker', 'emergency'
  ];
  const lowWords = [
    'readme', 'docs', 'documentation', 'typo', 'minor',
    'cleanup', 'refactor', 'style', 'color', 'rename'
  ];

  if (highWords.some(w => text.includes(w))) return 'high';
  if (lowWords.some(w => text.includes(w)))  return 'low';
  return 'medium';
}

// ---- SPRINT REPORT ----
export async function generateSprintReport(completedTasks) {
  if (completedTasks.length === 0) {
    return '## Sprint Report\n\nNo tasks were completed this sprint.';
  }

  const taskList = completedTasks.map((t, i) =>
    `${i + 1}. [${t.label.toUpperCase()}] ${t.title} — assigned to ${t.assignee}, priority: ${t.priority}`
  ).join('\n');

  const prompt = `You are a project manager writing a sprint summary report.
Given this list of completed tasks, write a professional but concise sprint report in markdown format.
Include: a brief summary paragraph, tasks grouped by type (features/bugs/design), key highlights, and a one-line team performance note.
Keep it under 200 words total.

Completed tasks:
${taskList}

Write the sprint report in markdown:`;

  try {
    return await callGemini(prompt);
  } catch (err) {
    console.error('Gemini report error:', err);
    return getMockReport(completedTasks);
  }
}

// ---- MOCK REPORT FALLBACK ----
function getMockReport(completedTasks) {
  const byLabel = {
    feature: completedTasks.filter(t => t.label === 'feature'),
    bug:     completedTasks.filter(t => t.label === 'bug'),
    design:  completedTasks.filter(t => t.label === 'design'),
  };

  let report = `## Sprint Report\n\n`;
  report += `**Total completed:** ${completedTasks.length} tasks\n\n`;

  if (byLabel.feature.length > 0) {
    report += `### ✨ Features (${byLabel.feature.length})\n`;
    byLabel.feature.forEach(t => report += `- ${t.title} — ${t.assignee}\n`);
    report += '\n';
  }
  if (byLabel.bug.length > 0) {
    report += `### 🐛 Bugs Fixed (${byLabel.bug.length})\n`;
    byLabel.bug.forEach(t => report += `- ${t.title} — ${t.assignee}\n`);
    report += '\n';
  }
  if (byLabel.design.length > 0) {
    report += `### 🎨 Design (${byLabel.design.length})\n`;
    byLabel.design.forEach(t => report += `- ${t.title} — ${t.assignee}\n`);
    report += '\n';
  }

  report += `---\n*Generated on ${new Date().toLocaleDateString()}*`;
  return report;
}