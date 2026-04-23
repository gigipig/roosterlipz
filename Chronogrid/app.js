'use strict';

/* ─── Constants ──────────────────────────────────────────────── */
const STORAGE_KEY   = 'chronogrid_events';
const COMPLETED_KEY = 'chronogrid_completed';
const NOTE_KEY      = 'chronogrid_daily_note';

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
let events        = [];
let completedLog  = [];
let editingId     = null;
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

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─── Toast ───────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
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
        if (evt.recurrence === 'weekly') d.setDate(d.getDate() + 7);
        else if (evt.recurrence === 'monthly') d.setMonth(d.getMonth() + 1);
        else break;
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
  const samples = [
    { id: uuid(), title: 'Project Deadline',    date: offsetDate(3),  time: '17:00', category: 'urgent',    recurrence: null,     notes: '', streak: 0 },
    { id: uuid(), title: 'Weekly Gym Session',  date: offsetDate(2),  time: '08:00', category: 'recurring', recurrence: 'weekly', notes: '', streak: 3 },
    { id: uuid(), title: 'Italy Trip Planning', date: offsetDate(60), time: '',      category: 'longterm',  recurrence: null,     notes: 'Research flights and accommodation', streak: 0 },
    { id: uuid(), title: 'Write Blog Post',     date: '',             time: '',      category: 'someday',   recurrence: null,     notes: '', streak: 0 }
  ];
  saveEventsToStorage(samples);
  return samples;
}

function loadCompleted() {
  const raw = localStorage.getItem(COMPLETED_KEY);
  if (raw) { try { return JSON.parse(raw); } catch(e) {} }
  return [];
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

/* ─── Complete Event ──────────────────────────────────────────── */
function markComplete(id) {
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  // Log it
  completedLog.push({
    id: uuid(),
    eventId: evt.id,
    title: evt.title,
    category: evt.category,
    completedAt: new Date().toISOString()
  });
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedLog));

  showToast(`✓  ${evt.title}`);

  // Animate out then mutate
  const row = document.querySelector(`.today-row[data-id="${id}"]`);

  const doMutate = () => {
    if (evt.category === 'recurring' && evt.recurrence) {
      let d = new Date((evt.date || todayISO()) + 'T00:00:00');
      if (evt.recurrence === 'weekly') d.setDate(d.getDate() + 7);
      else if (evt.recurrence === 'monthly') d.setMonth(d.getMonth() + 1);
      updateEvent(id, { date: d.toISOString().slice(0, 10), streak: (evt.streak || 0) + 1 });
    } else {
      deleteEvent(id);
    }
  };

  if (row) {
    row.classList.add('completing');
    setTimeout(doMutate, 380);
  } else {
    doMutate();
  }
}

/* ─── Daily Note ──────────────────────────────────────────────── */
function loadNote() {
  const raw = localStorage.getItem(NOTE_KEY);
  if (!raw) return '';
  try {
    const obj = JSON.parse(raw);
    return obj.date === todayISO() ? (obj.text || '') : '';
  } catch(e) { return ''; }
}

let noteTimer;
function initNote() {
  const el = document.getElementById('todayNote');
  el.value = loadNote();
  el.addEventListener('input', () => {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => {
      localStorage.setItem(NOTE_KEY, JSON.stringify({ date: todayISO(), text: el.value }));
    }, 400);
  });
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

/* ─── Render: Today ───────────────────────────────────────────── */
function renderToday() {
  // Date display
  const now = new Date();
  const dayNames  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monNames  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('todayDateDisplay').textContent =
    `${dayNames[now.getDay()]}, ${monNames[now.getMonth()]} ${now.getDate()}`;

  // Progress count
  const todayStr  = todayISO();
  const doneToday = completedLog.filter(c => c.completedAt.startsWith(todayStr)).length;
  document.getElementById('todaySubtitle').textContent =
    doneToday > 0 ? `${doneToday} completed today` : 'what needs doing today';

  const container = document.getElementById('todayContent');
  container.innerHTML = '';

  // Categorise events
  const overdue  = [];
  const todayEvts = [];
  const upcoming = [];
  const someday  = [];

  events.forEach(evt => {
    if (!evt.date) {
      if (evt.category !== 'recurring') someday.push(evt);
      return;
    }
    const d = getDaysUntil(evt.date);
    if (d < 0)      overdue.push(evt);
    else if (d === 0) todayEvts.push(evt);
    else if (d <= 7)  upcoming.push(evt);
  });

  overdue.sort((a, b)   => getDaysUntil(a.date) - getDaysUntil(b.date));
  todayEvts.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
  upcoming.sort((a, b)  => getDaysUntil(a.date) - getDaysUntil(b.date));

  const total = overdue.length + todayEvts.length + upcoming.length + someday.length;
  if (total === 0) {
    container.innerHTML = '<div class="today-empty">All clear — nothing on the horizon.<br>Tap + to add something.</div>';
    return;
  }

  function buildSection(label, icon, list, variant) {
    if (list.length === 0) return;

    const sec = document.createElement('div');
    sec.className = 'today-section';

    const hdr = document.createElement('div');
    hdr.className = `today-section-hdr ${variant}`;
    hdr.innerHTML = `<span>${icon} ${label}</span><span class="today-sec-count">${list.length}</span>`;
    sec.appendChild(hdr);

    list.forEach(evt => {
      const streakPart = (evt.category === 'recurring' && evt.streak > 0) ? ` · ↻${evt.streak}` : '';
      const timePart   = evt.time ? ` · ${evt.time}` : '';
      const meta       = formatDate(evt.date) + timePart + streakPart;

      const row = document.createElement('div');
      row.className = `today-row ${evt.category}`;
      row.dataset.id = evt.id;
      row.innerHTML = `
        <div class="today-dot ${evt.category}"></div>
        <div class="today-row-body">
          <div class="today-row-title">${escHtml(evt.title)}</div>
          <div class="today-row-meta">${escHtml(meta)}</div>
        </div>
        <button class="today-complete-btn" data-id="${evt.id}" aria-label="Mark complete">✓</button>
      `;
      sec.appendChild(row);
    });

    container.appendChild(sec);
  }

  buildSection('OVERDUE',     '⚠',  overdue,   'overdue');
  buildSection('TODAY',       '◉',  todayEvts, 'today');
  buildSection('NEXT 7 DAYS', '◈',  upcoming,  'upcoming');
  buildSection('SOMEDAY',     '◇',  someday,   'someday');
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

  const count  = visible.length;
  const trackH = Math.max(500, count * 140);
  document.querySelector('.stream-track').style.minHeight = trackH + 'px';

  const daysArr   = visible.map(e => getDaysUntil(e.date));
  const finiteDays = daysArr.filter(d => isFinite(d));
  const minDays   = finiteDays.length ? Math.min(...finiteDays) : 0;
  const maxDays   = finiteDays.length ? Math.max(...finiteDays) : 0;
  const range     = maxDays - minDays;

  const pcts = daysArr.map(days => {
    if (!isFinite(days)) return 5;
    if (range === 0) return 47;
    return 5 + ((maxDays - days) / range) * 88;
  });

  for (let i = 1; i < pcts.length; i++) {
    const sameDay   = isFinite(daysArr[i]) && isFinite(daysArr[i-1]) && daysArr[i] === daysArr[i-1];
    const minGapPct = ((sameDay ? 40 : 120) / trackH) * 100;
    if (pcts[i] < pcts[i-1] + minGapPct) pcts[i] = pcts[i-1] + minGapPct;
  }

  visible.forEach((evt, i) => {
    const pct  = pcts[i];
    const days = daysArr[i];
    const side = i % 2 === 0 ? 'left' : 'right';

    const streakPart = (evt.category === 'recurring' && evt.streak > 0) ? `↻${evt.streak}` : '';
    const metaParts  = [evt.time, streakPart, CAT_LABELS[evt.category]].filter(Boolean);

    const wrapper = document.createElement('div');
    wrapper.className = `orb-wrapper ${side}`;
    wrapper.style.top = pct + '%';

    const connector = document.createElement('div');
    connector.className = 'orb-connector';

    const card = document.createElement('div');
    card.className = `stream-card ${evt.category}`;
    card.style.animationDelay = (i * 0.35) + 's';
    card.innerHTML = `
      <div class="sc-top">
        <span class="sc-icon">${CAT_ICONS[evt.category]}</span>
        <span class="sc-date">${formatDate(evt.date)}</span>
      </div>
      <div class="sc-title">${escHtml(evt.title)}</div>
      ${metaParts.length ? `<div class="sc-meta">${escHtml(metaParts.join(' · '))}</div>` : ''}
    `;
    card.addEventListener('click', () => openEventModal(evt));

    wrapper.appendChild(connector);
    wrapper.appendChild(card);
    container.appendChild(wrapper);
  });
}

/* ─── Render: Grid ────────────────────────────────────────────── */
function renderGrid() {
  const container = document.getElementById('gemsContainer');
  container.innerHTML = '';

  const catOrder = ['urgent', 'recurring', 'longterm', 'someday'];
  const grouped  = { urgent: [], recurring: [], longterm: [], someday: [] };

  visibleEvents().forEach(evt => { if (grouped[evt.category]) grouped[evt.category].push(evt); });
  catOrder.forEach(cat => grouped[cat].sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date)));

  const hasAny = catOrder.some(cat => grouped[cat].length > 0);
  if (!hasAny) {
    container.innerHTML = '<div class="list-empty">No upcoming events.<br>Tap + or use the dock below.</div>';
    return;
  }

  let delay = 0;
  catOrder.forEach(cat => {
    if (grouped[cat].length === 0) return;

    const group = document.createElement('div');
    group.className = 'cat-group';

    const hdr = document.createElement('div');
    hdr.className = `cat-group-hdr ${cat}`;
    hdr.innerHTML = `${CAT_ICONS[cat]} ${CAT_LABELS[cat]}`;
    group.appendChild(hdr);

    grouped[cat].forEach(evt => {
      const streakPart = (evt.category === 'recurring' && evt.streak > 0) ? ` · ↻${evt.streak}` : '';
      const timePart   = evt.time ? ` · ${evt.time}` : '';
      const meta       = formatDate(evt.date) + timePart + streakPart;

      const card = document.createElement('div');
      card.className = `event-card ${cat}`;
      card.style.animationDelay = (delay * 0.04) + 's';
      card.innerHTML = `
        <div class="ec-body">
          <div class="ec-title">${escHtml(evt.title)}</div>
          <div class="ec-meta">${escHtml(meta)}</div>
        </div>
        <span class="ec-date-badge">${formatDate(evt.date)}</span>
      `;
      card.addEventListener('click', () => openEventModal(evt));
      group.appendChild(card);
      delay++;
    });

    container.appendChild(group);
  });
}

function renderAll() {
  renderToday();
  renderStream();
  renderGrid();
}

/* ─── Modal: Event ────────────────────────────────────────────── */
function openEventModal(evt = null, prefillCategory = null) {
  editingId = null;
  selectedRecurrence = null;

  const backdrop = document.getElementById('eventModalBackdrop');
  const title    = document.getElementById('modalTitle');
  const form     = document.getElementById('eventForm');

  form.reset();
  document.getElementById('deleteBtn').classList.remove('visible');
  document.getElementById('recurrenceRow').classList.remove('visible');
  document.querySelectorAll('.recur-btn').forEach(b => b.classList.remove('active'));

  if (evt) {
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
        if (prefillCategory === 'recurring') document.getElementById('recurrenceRow').classList.add('visible');
      }
    }
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
    notes,
    streak:     editingId ? (events.find(e => e.id === editingId)?.streak || 0) : 0
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
  const counts   = { urgent: 0, recurring: 0, longterm: 0, someday: 0 };
  events.forEach(e => { if (counts[e.category] !== undefined) counts[e.category]++; });

  const todayStr  = todayISO();
  const doneToday = completedLog.filter(c => c.completedAt.startsWith(todayStr)).length;

  document.getElementById('settingsStats').innerHTML = `
    <span class="stat-urgent">⚡ Urgent: ${counts.urgent}</span><br>
    <span class="stat-recurring">↻ Recurring: ${counts.recurring}</span><br>
    <span class="stat-longterm">◎ Long-term: ${counts.longterm}</span><br>
    <span class="stat-someday">◇ Someday: ${counts.someday}</span><br>
    <br>Total: ${events.length} events<br>
    <br><span style="color:var(--recurring)">✓ Done today: ${doneToday}</span><br>
    <span style="color:rgba(224,232,255,0.4)">✓ All-time: ${completedLog.length}</span>
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
      showToast(`Imported ${added} event(s)`);
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
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
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
    p.style.cssText = `--dur: ${(Math.random() * 3 + 3).toFixed(1)}s; --delay: ${(Math.random() * 5).toFixed(1)}s;`;
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
  events       = loadEvents();
  completedLog = loadCompleted();

  generateStars();
  generateParticles();
  initNote();
  renderAll();

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // FAB
  document.getElementById('fabBtn').addEventListener('click', () => openEventModal());

  // Today view: event delegation for rows and complete buttons
  document.getElementById('todayContent').addEventListener('click', e => {
    const completeBtn = e.target.closest('.today-complete-btn');
    if (completeBtn) {
      markComplete(completeBtn.dataset.id);
      return;
    }
    const row = e.target.closest('.today-row');
    if (row) {
      const evt = events.find(ev => ev.id === row.dataset.id);
      if (evt) openEventModal(evt);
    }
  });

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

  // Clear completed history
  document.getElementById('clearCompletedBtn').addEventListener('click', () => {
    if (confirm('Clear all completion history?')) {
      completedLog = [];
      localStorage.removeItem(COMPLETED_KEY);
      updateSettingsStats();
      showToast('History cleared');
    }
  });

  // Export / Import
  document.getElementById('exportBtn').addEventListener('click', exportJSON);
  document.getElementById('importFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) { importJSON(file); e.target.value = ''; }
  });

  // Quick-add
  document.getElementById('quickAddInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); openEventModal(null, null); }
  });
  document.getElementById('quickAddBtn').addEventListener('click', () => openEventModal(null, null));

  // Dock buttons
  document.querySelectorAll('.dock-btn').forEach(btn => {
    btn.addEventListener('click', () => openEventModal(null, btn.dataset.cat));
  });

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW registration failed:', err));
  }
});
