// ============================================
// STORE.JS — Observer Pattern implementation
// ============================================

// ---- SUBSCRIBERS LIST ----
const subscribers = [];

// ---- SUBSCRIBE ----
// Any module can register a function to be called on state change
export function subscribe(fn) {
  subscribers.push(fn);
}

// ---- NOTIFY ALL SUBSCRIBERS ----
// Called internally whenever state changes
export function notify() {
  subscribers.forEach(fn => fn());
}

// ---- UNSUBSCRIBE (bonus) ----
// Remove a subscriber when it's no longer needed
export function unsubscribe(fn) {
  const index = subscribers.indexOf(fn);
  if (index !== -1) subscribers.splice(index, 1);
}

// ---- DEBUG HELPER ----
// Useful during development to see how many subscribers are active
export function getSubscriberCount() {
  return subscribers.length;
}