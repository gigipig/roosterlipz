'use strict';

/* ─── Constants ──────────────────────────────────────────────── */
const STORAGE_KEY = 'chronogrid_events';

const CAT_ICONS = {
  urgent:    '⚡',
  recurring: '↻',
  longterm:  '◎',
  someday:   '◇'
};

const CAT_LABELS = {
  urgent:    'URGENT',
  recurring: 'RECURRING',
  longterm:  'LONG-TERM',
  someday:   'SOMEDAY'
};

/* ─── State ───────────────────────────────────────────────────── */
let events = [];
let editingId = null;
let selectedRecurrence = null;

/* ─── Utilities ───────────────────────────────────────────────── */
function uuid() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function offsetDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function getDaysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.round((target - today) / 86400000);
}

function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  const days = getDaysUntil(dateStr);
  if (days === 0)  return 'TODAY';
  if (days === 1)  return 'TOMORROW';
  if (days === -1) return 'YESTERDAY';
  if (days > 1 && days < 8)  return `in ${days}d`;
  if (days < -1)  return `${Math.abs(days)}d ago`;
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function orbSize(days) {
  if (days === Infinity) return 56; // someday
  if (days <= 0)  return 88;
  if (days <= 3)  return 80;
  if (days <= 7)  return 68;
  if (days <= 30) return 56;
  if (days <= 90) return 44;
  return 36;
}

/* ─── Recurring Advancement ───────────────────────────────────── */
function advanceRecurring(evts) {
  const today = todayISO();
  let changed = false;
  evts.forEach(evt => {
    if (evt.category !== 'recurring' || !evt.recurrence || !evt.date) return;
    let d = new Date(evt.date + 'T00:00:00');
    const t = new Date(today + 'T00:00:00');
    if (d < t) {
      while (d < t) {
        if (evt.recurrence === 'weekly') {
          d.setDate(d.getDate() + 7);
        } else if (evt.recurrence === 'monthly') {
          d.setMonth(d.getMonth() + 1);
        } else break;
      }
      evt.date = d.toISOString().slice(0, 10);
      changed = true;
    }
  });
  if (changed) saveEventsToStorage(evts);
}

/* ─── Storage ─────────────────────────────────────────────────── */
function saveEventsToStorage(evts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(evts));
}

function loadEvents() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        advanceRecurring(parsed);
        return parsed;
      }
    } catch (e) { /* fall through */ }
  }
  // First-time sample events
  const samples = [
    { id: uuid(), title: 'Project Deadline',     date: offsetDate(3),  time: '17:00', category: 'urgent',    recurrence: null,     notes: '' },
    { id: uuid(), title: 'Weekly Gym Session',   date: offsetDate(2),  time: '08:00', category: 'recurring', recurrence: 'weekly', notes: '' },
    { id: uuid(), title: 'Italy Trip Planning',  date: offsetDate(60), time: '',      category: 'longterm',  recurrence: null,     notes: 'Research flights and accommodation' },
    { id: uuid(), title: 'Write Blog Post',      date: '',             time: '',      category: 'someday',   recurrence: null,     notes: '' }
  ];
  saveEventsToStorage(samples);
  return samples;
}

function addEvent(evt) {
  events.push(evt);
  saveEventsToStorage(events);
  renderAll();
}

function updateEvent(id, updates) {
  const idx = events.findIndex(e => e.id === id);
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...updates };
    saveEventsToStorage(events);
    renderAll();
  }
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveEventsToStorage(events);
  renderAll();
}

/* ─── Filtering ───────────────────────────────────────────────── */
function visibleEvents() {
  return events.filter(evt => {
    if (evt.category === 'someday') return true;
    if (evt.category === 'recurring') return true;
    if (!evt.date) return true;
    return getDaysUntil(evt.date) >= 0;
  });
}

/* ─── Render: Stream ──────────────────────────────────────────── */
function renderStream() {
  const container = document.getElementById('orbsContainer');
  container.innerHTML = '';

  const visible = visibleEvents().sort((a, b) => getDaysUntil(b.date) - getDaysUntil(a.date));

  if (visible.length === 0) {
    container.innerHTML = '<div class="stream-empty">No upcoming events.<br>Tap + to add your first event.</div>';
    document.querySelector('.stream-track').style.minHeight = '400px';
    return;
  }

  const count = visible.length;
  const trackH = Math.max(500, count * 130);
  document.querySelector('.stream-track').style.minHeight = trackH + 'px';

  visible.forEach((evt, i) => {
    const pct = count === 1 ? 50 : 5 + (i / (count - 1)) * 88;
    const days = getDaysUntil(evt.date);
    const size = orbSize(days);
    const side = i % 2 === 0 ? 'left' : 'right';

    const wrapper = document.createElement('div');
    wrapper.className = `orb-wrapper ${side}`;
    wrapper.style.top = pct + '%';

    const connector = document.createElement('div');
    connector.className = 'orb-connector';
    connector.style.color = getComputedStyle(document.documentElement).getPropertyValue(
      evt.category === 'urgent' ? '--urgent' :
      evt.category === 'recurring' ? '--recurring' :
      evt.category === 'longterm' ? '--longterm' : '--someday'
    );

    const orb = document.createElement('div');
    orb.className = `orb ${evt.category}`;
    orb.setAttribute('data-size', size);
    orb.style.animationDelay = (i * 0.4) + 's';

    orb.innerHTML = `
      <span class="orb-title">${escHtml(evt.title)}</span>
      <span class="orb-date">${formatDate(evt.date)}</span>
      ${evt.time ? `<span class="orb-time">${evt.time}</span>` : ''}
      <span class="orb-cat">${CAT_LABELS[evt.category]}</span>
    `;
    orb.addEventListener('click', () => openEventModal(evt));

    wrapper.appendChild(connector);
    wrapper.appendChild(orb);
    container.appendChild(wrapper);
  });
}

/* ─── Render: Grid ────────────────────────────────────────────── */
function renderGrid() {
  const container = document.getElementById('gemsContainer');
  container.innerHTML = '';

  const catOrder = { urgent: 0, recurring: 1, longterm: 2, someday: 3 };
  const visible = visibleEvents().sort((a, b) => {
    const co = catOrder[a.category] - catOrder[b.category];
    if (co !== 0) return co;
    return getDaysUntil(a.date) - getDaysUntil(b.date);
  });

  if (visible.length === 0) {
    container.innerHTML = '<div class="grid-empty">No upcoming events.<br>Tap + or use the dock below.</div>';
    return;
  }

  visible.forEach((evt, i) => {
    const card = document.createElement('div');
    card.className = `gem-card ${evt.category}`;
    card.style.animationDelay = (i * 0.04) + 's';

    card.innerHTML = `
      <span class="gem-icon">${CAT_ICONS[evt.category]}</span>
      <div class="gem-title">${escHtml(evt.title)}</div>
      <div class="gem-date">${formatDate(evt.date)}</div>
      ${evt.time ? `<div class="gem-time">${evt.time}</div>` : ''}
      <div class="gem-cat">${CAT_LABELS[evt.category]}</div>
    `;
    card.addEventListener('click', () => openEventModal(evt));
    container.appendChild(card);
  });
}

function renderAll() {
  renderStream();
  renderGrid();
}

/* ─── XSS Protection ─────────────────────────────────────────── */
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─── Modal: Event ────────────────────────────────────────────── */
function openEventModal(evt = null, prefillCategory = null) {
  editingId = null;
  selectedRecurrence = null;

  const backdrop = document.getElementById('eventModalBackdrop');
  const title    = document.getElementById('modalTitle');
  const form     = document.getElementById('eventForm');

  // Reset
  form.reset();
  document.getElementById('deleteBtn').classList.remove('visible');
  document.getElementById('recurrenceRow').classList.remove('visible');
  document.querySelectorAll('.recur-btn').forEach(b => b.classList.remove('active'));

  if (evt) {
    // Edit mode
    editingId = evt.id;
    title.textContent = 'EDIT EVENT';
    document.getElementById('eventTitle').value = evt.title;
    document.getElementById('eventDate').value  = evt.date || '';
    document.getElementById('eventTime').value  = evt.time || '';
    document.getElementById('eventNotes').value = evt.notes || '';
    const radio = form.querySelector(`input[name="category"][value="${evt.category}"]`);
    if (radio) radio.checked = true;
    if (evt.category === 'recurring') {
      document.getElementById('recurrenceRow').classList.add('visible');
      selectedRecurrence = evt.recurrence || null;
      if (selectedRecurrence) {
        const btn = document.getElementById(selectedRecurrence === 'weekly' ? 'recurWeekly' : 'recurMonthly');
        if (btn) btn.classList.add('active');
      }
    }
    document.getElementById('deleteBtn').classList.add('visible');
  } else {
    title.textContent = 'NEW EVENT';
    if (prefillCategory) {
      const radio = form.querySelector(`input[name="category"][value="${prefillCategory}"]`);
      if (radio) {
        radio.checked = true;
        if (prefillCategory === 'recurring') {
          document.getElementById('recurrenceRow').classList.add('visible');
        }
      }
    }
    // Pre-fill title from quick-add input
    const quickVal = document.getElementById('quickAddInput').value.trim();
    if (quickVal) document.getElementById('eventTitle').value = quickVal;
  }

  backdrop.classList.add('open');
  setTimeout(() => document.getElementById('eventTitle').focus(), 300);
}

function closeEventModal() {
  document.getElementById('eventModalBackdrop').classList.remove('open');
  document.getElementById('quickAddInput').value = '';
  editingId = null;
  selectedRecurrence = null;
}

function handleEventSubmit(e) {
  e.preventDefault();
  const title    = document.getElementById('eventTitle').value.trim();
  const date     = document.getElementById('eventDate').value;
  const time     = document.getElementById('eventTime').value;
  const notes    = document.getElementById('eventNotes').value.trim();
  const catRadio = document.querySelector('input[name="category"]:checked');
  const category = catRadio ? catRadio.value : 'someday';

  if (!title) return;

  const payload = {
    title,
    date:       date || '',
    time:       time || '',
    category,
    recurrence: category === 'recurring' ? selectedRecurrence : null,
    notes
  };

  if (editingId) {
    updateEvent(editingId, payload);
  } else {
    addEvent({ id: uuid(), ...payload });
  }
  closeEventModal();
}

/* ─── Modal: Settings ─────────────────────────────────────────── */
function openSettingsModal() {
  updateSettingsStats();
  document.getElementById('settingsModalBackdrop').classList.add('open');
}

function closeSettingsModal() {
  document.getElementById('settingsModalBackdrop').classList.remove('open');
}

function updateSettingsStats() {
  const counts = { urgent: 0, recurring: 0, longterm: 0, someday: 0 };
  events.forEach(e => { if (counts[e.category] !== undefined) counts[e.category]++; });
  document.getElementById('settingsStats').innerHTML = `
    <span class="stat-urgent">⚡ Urgent: ${counts.urgent}</span><br>
    <span class="stat-recurring">↻ Recurring: ${counts.recurring}</span><br>
    <span class="stat-longterm">◎ Long-term: ${counts.longterm}</span><br>
    <span class="stat-someday">◇ Someday: ${counts.someday}</span><br>
    <br>Total: ${events.length} events
  `;
}

/* ─── Export / Import ─────────────────────────────────────────── */
function exportJSON() {
  const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `chronogrid-backup-${todayISO()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error('Not an array');
      const existingIds = new Set(events.map(ev => ev.id));
      let added = 0;
      imported.forEach(ev => {
        if (ev.id && !existingIds.has(ev.id) && ev.title) {
          events.push(ev);
          existingIds.add(ev.id);
          added++;
        }
      });
      saveEventsToStorage(events);
      renderAll();
      updateSettingsStats();
      alert(`Import complete: ${added} new event(s) added.`);
    } catch (err) {
      alert('Import failed: invalid JSON file.');
    }
  };
  reader.readAsText(file);
}

/* ─── Background FX ───────────────────────────────────────────── */
function generateStars() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = (Math.random() * 2 + 0.5).toFixed(1);
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${(Math.random() * 3 + 2).toFixed(1)}s;
      --delay: ${(Math.random() * 4).toFixed(1)}s;
      opacity: ${(Math.random() * 0.4 + 0.2).toFixed(2)};
    `;
    container.appendChild(star);
  }
}

function generateParticles() {
  const container = document.getElementById('streamParticles');
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      --dur: ${(Math.random() * 3 + 3).toFixed(1)}s;
      --delay: ${(Math.random() * 5).toFixed(1)}s;
    `;
    container.appendChild(p);
  }
}

/* ─── View Switching ──────────────────────────────────────────── */
function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`view-${name}`).classList.add('active');
  document.querySelector(`.tab-btn[data-view="${name}"]`).classList.add('active');
}

/* ─── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  events = loadEvents();

  generateStars();
  generateParticles();
  renderAll();

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // FAB
  document.getElementById('fabBtn').addEventListener('click', () => openEventModal());

  // Event form submit
  document.getElementById('eventForm').addEventListener('submit', handleEventSubmit);

  // Event modal close
  document.getElementById('eventModalClose').addEventListener('click', closeEventModal);
  document.getElementById('eventModalBackdrop').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeEventModal();
  });

  // Delete button
  document.getElementById('deleteBtn').addEventListener('click', () => {
    if (editingId && confirm('Delete this event?')) {
      deleteEvent(editingId);
      closeEventModal();
    }
  });

  // Category pills → show/hide recurrence row
  document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const row = document.getElementById('recurrenceRow');
      if (radio.value === 'recurring') {
        row.classList.add('visible');
      } else {
        row.classList.remove('visible');
        selectedRecurrence = null;
        document.querySelectorAll('.recur-btn').forEach(b => b.classList.remove('active'));
      }
    });
  });

  // Recurrence buttons
  document.querySelectorAll('.recur-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;
      if (selectedRecurrence === val) {
        // Toggle off
        selectedRecurrence = null;
        btn.classList.remove('active');
      } else {
        selectedRecurrence = val;
        document.querySelectorAll('.recur-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // Settings
  document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);
  document.getElementById('settingsModalClose').addEventListener('click', closeSettingsModal);
  document.getElementById('settingsModalBackdrop').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeSettingsModal();
  });

  // Export / Import
  document.getElementById('exportBtn').addEventListener('click', exportJSON);
  document.getElementById('importFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) { importJSON(file); e.target.value = ''; }
  });

  // Quick-add: Enter key
  document.getElementById('quickAddInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      openEventModal(null, null);
    }
  });
  document.getElementById('quickAddBtn').addEventListener('click', () => openEventModal(null, null));

  // Dock buttons
  document.querySelectorAll('.dock-btn').forEach(btn => {
    btn.addEventListener('click', () => openEventModal(null, btn.dataset.cat));
  });

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('SW registration failed:', err);
    });
  }
});
