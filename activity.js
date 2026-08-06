// ============================================
// ACTIVITY.JS — activity feed logic
// ============================================

// Store activity events
let activityLog = [];

// ---- RELATIVE TIME ----
function timeAgo(timestamp) {
  const diff    = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours   = Math.floor(diff / 3600000);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24)   return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

// ---- ADD EVENT TO FEED ----
export function logActivity(type, message) {
  const event = {
    id: Date.now(),
    type,       // 'created' | 'deleted' | 'moved' | 'edited'
    message,
    timestamp: Date.now()
  };

  // Add to beginning of array so newest shows first
  activityLog.unshift(event);

  // Keep max 50 events
  if (activityLog.length > 50) {
    activityLog = activityLog.slice(0, 50);
  }

  renderFeed();
}

// ---- RENDER FEED ----
export function renderFeed() {
  const feedEl = document.getElementById('activityFeed');
  if (!feedEl) return;

  if (activityLog.length === 0) {
    feedEl.innerHTML = '<li class="feed-empty">No activity yet</li>';
    return;
  }

  feedEl.innerHTML = activityLog.map(event => `
    <li class="feed-item type-${event.type}">
      <p class="feed-item-message">${event.message}</p>
      <span class="feed-item-time">${timeAgo(event.timestamp)}</span>
    </li>
  `).join('');
}

// ---- CLEAR FEED ----
export function clearFeed() {
  activityLog = [];
  renderFeed();
}

// ---- AUTO REFRESH TIMESTAMPS ----
// Updates "2m ago" → "3m ago" every 30 seconds automatically
setInterval(renderFeed, 30000);

// ---- CLEAR BUTTON LISTENER ----
document.getElementById('clearFeed').addEventListener('click', clearFeed);