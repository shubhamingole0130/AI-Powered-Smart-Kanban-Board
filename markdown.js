// ============================================
// MARKDOWN.JS — simple markdown to HTML parser
// ============================================

export function parseMarkdown(md) {
  if (!md) return '';

  let html = md
    // Escape HTML first for security
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')

    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')

    // Horizontal rule
    .replace(/^---$/gm, '<hr>')

    // Unordered list items
    .replace(/^- (.+)$/gm, '<li>$1</li>')

    // Wrap consecutive <li> items in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>${match}</ul>`)

    // Paragraphs — wrap lines that aren't already HTML tags
    .replace(/^(?!<[a-z]).+$/gm, match => `<p>${match}</p>`)

    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '');

  return html;
}