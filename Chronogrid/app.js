'use strict';

/* ─── Constants ──────────────────────────────────────────────── */
const STORAGE_KEY    = 'chronogrid_events';
const COMPLETED_KEY  = 'chronogrid_completed';
const NOTE_KEY       = 'chronogrid_daily_note';
const NOTIFY_LOG_KEY = 'chronogrid_notify_log';

const CAT_ICONS = {
  urgent:    '⚡',
  recurring: '↻',
  longterm:  '◎',
  neutral:   '○',
  someday:   '◇'
};

const CAT_LABELS = {
  urgent:    'URGENT',
  recurring: 'RECURRING',
  longterm:  'LONG-TERM',
  neutral:   'NEUTRAL',
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

function formatChipDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const monNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${monNames[d.getMonth()]} ${d.getDate()}`;
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

  // Log it — keep a full snapshot so a completed task can be restored later.
  completedLog.push({
    id: uuid(),
    eventId: evt.id,
    title: evt.title,
    category: evt.category,
    date: evt.date || '',
    time: evt.time || '',
    notes: evt.notes || '',
    recurrence: evt.recurrence || null,
    completedAt: new Date().toISOString()
  });
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedLog));

  if (navigator.vibrate) navigator.vibrate(10);
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

/* ─── Snooze ──────────────────────────────────────────────────── */
function snoozeEvent(id) {
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 86400000);

  let target;
  if (evt.date) {
    const current = new Date(evt.date + 'T00:00:00');
    target = current < tomorrow ? tomorrow : new Date(current.getTime() + 86400000);
  } else {
    target = tomorrow;
  }

  const iso = target.toISOString().slice(0, 10);
  if (navigator.vibrate) navigator.vibrate(10);
  showToast(`⏰  ${evt.title} → ${formatDate(iso)}`);
  updateEvent(id, { date: iso });
}

/* ─── Daily Note (journal) ────────────────────────────────────── */
function loadNotes() {
  const raw = localStorage.getItem(NOTE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    // Migrate legacy single-note format { date, text } → { [date]: text }
    if (parsed && typeof parsed === 'object' && typeof parsed.date === 'string' && typeof parsed.text === 'string') {
      const map = {};
      if (parsed.text.trim()) map[parsed.date] = parsed.text;
      localStorage.setItem(NOTE_KEY, JSON.stringify(map));
      return map;
    }
    return (parsed && typeof parsed === 'object') ? parsed : {};
  } catch (e) { return {}; }
}

function saveNotes(notes) {
  localStorage.setItem(NOTE_KEY, JSON.stringify(notes));
}

let noteTimer;
function initNote() {
  const el = document.getElementById('todayNote');
  const today = todayISO();
  const notes = loadNotes();
  el.value = notes[today] || '';
  el.addEventListener('input', () => {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => {
      const current = loadNotes();
      if (el.value.trim()) {
        current[today] = el.value;
      } else {
        delete current[today];
      }
      saveNotes(current);
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

      const wrap = document.createElement('div');
      wrap.className = 'today-row-wrap';
      wrap.innerHTML = `
        <div class="row-action complete"><span>✓</span></div>
        <div class="row-action snooze"><span>⏰</span></div>
        <div class="today-row ${evt.category}" data-id="${evt.id}">
          <div class="today-dot ${evt.category}"></div>
          <div class="today-row-body">
            <div class="today-row-title">${escHtml(evt.title)}</div>
            <div class="today-row-meta">${escHtml(meta)}</div>
          </div>
          <button class="today-complete-btn" data-id="${evt.id}" aria-label="Mark complete">✓</button>
        </div>
      `;
      sec.appendChild(wrap);
    });

    container.appendChild(sec);
  }

  buildSection('OVERDUE',     '⚠',  overdue,   'overdue');
  buildSection('NEXT 7 DAYS', '◈',  upcoming,  'upcoming');
  buildSection('TODAY',       '◉',  todayEvts, 'today');
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
    const minGapPct = ((sameDay ? 40 : 200) / trackH) * 100;
    if (pcts[i] < pcts[i-1] + minGapPct) pcts[i] = pcts[i-1] + minGapPct;
  }

  visible.forEach((evt, i) => {
    const pct  = pcts[i];
    const days = daysArr[i];
    const side = i % 2 === 0 ? 'left' : 'right';

    if (i > 0 && isFinite(daysArr[i]) && isFinite(daysArr[i-1]) && daysArr[i] !== daysArr[i-1]) {
      const chipText = formatChipDate(evt.date);
      if (chipText) {
        const chip = document.createElement('div');
        chip.className = 'stream-date-chip';
        chip.style.top = ((pcts[i] + pcts[i-1]) / 2) + '%';
        chip.textContent = chipText;
        container.appendChild(chip);
      }
    }

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

  const catOrder = ['urgent', 'recurring', 'longterm', 'neutral', 'someday'];
  const grouped  = { urgent: [], recurring: [], longterm: [], neutral: [], someday: [] };

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
  updateAppBadge();
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
  renderSettingsNotes();
  renderSettingsCompleted();
  updateNotifyButton();
  document.getElementById('settingsModalBackdrop').classList.add('open');
}

function renderSettingsNotes() {
  const container = document.getElementById('settingsNotes');
  if (!container) return;
  const notes = loadNotes();
  const today = todayISO();
  const dates = Object.keys(notes)
    .filter(d => notes[d] && notes[d].trim())
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 14);

  if (dates.length === 0) {
    container.innerHTML = '<div class="notes-empty">No notes yet. Write today’s focus on the Today page.</div>';
    return;
  }

  container.innerHTML = dates.map(d => {
    const day = new Date(d + 'T00:00:00');
    const isToday = d === today;
    const label = isToday
      ? 'TODAY'
      : day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
    return `<div class="note-entry${isToday ? ' is-today' : ''}">
      <div class="note-date">${label}</div>
      <div class="note-text">${escHtml(notes[d])}</div>
    </div>`;
  }).join('');
}

function renderSettingsCompleted() {
  const container = document.getElementById('settingsCompleted');
  if (!container) return;

  const recent = completedLog.slice().reverse().slice(0, 30);

  if (recent.length === 0) {
    container.innerHTML = '<div class="notes-empty">No completed tasks yet. Tick a task to log it here.</div>';
    return;
  }

  const today = todayISO();
  container.innerHTML = recent.map(c => {
    const when = new Date(c.completedAt);
    const wIso = c.completedAt.slice(0, 10);
    const label = wIso === today
      ? 'TODAY'
      : when.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
    const icon = CAT_ICONS[c.category] || '○';
    return `<div class="done-entry">
      <div class="done-dot ${c.category}"></div>
      <div class="done-body">
        <div class="done-title">${escHtml(c.title)}</div>
        <div class="done-date">${icon} ${label}</div>
      </div>
      <button class="done-restore" data-id="${c.id}" aria-label="Restore task">↺</button>
    </div>`;
  }).join('');
}

function restoreCompleted(logId) {
  const idx = completedLog.findIndex(c => c.id === logId);
  if (idx === -1) return;
  const c = completedLog[idx];

  // Re-create the event from the stored snapshot.
  addEvent({
    id:         uuid(),
    title:      c.title,
    date:       c.date || '',
    time:       c.time || '',
    category:   c.category,
    recurrence: c.recurrence || null,
    notes:      c.notes || '',
    streak:     0
  });

  // Remove it from the completion log so it isn't double-counted.
  completedLog.splice(idx, 1);
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedLog));

  if (navigator.vibrate) navigator.vibrate(10);
  showToast(`↺  ${c.title} restored`);
  renderSettingsCompleted();
  updateSettingsStats();
}

function closeSettingsModal() {
  document.getElementById('settingsModalBackdrop').classList.remove('open');
}

function updateSettingsStats() {
  const counts   = { urgent: 0, recurring: 0, longterm: 0, neutral: 0, someday: 0 };
  events.forEach(e => { if (counts[e.category] !== undefined) counts[e.category]++; });

  const todayStr  = todayISO();
  const doneToday = completedLog.filter(c => c.completedAt.startsWith(todayStr)).length;

  document.getElementById('settingsStats').innerHTML = `
    <span class="stat-urgent">⚡ Urgent: ${counts.urgent}</span><br>
    <span class="stat-recurring">↻ Recurring: ${counts.recurring}</span><br>
    <span class="stat-longterm">◎ Long-term: ${counts.longterm}</span><br>
    <span class="stat-neutral">○ Neutral: ${counts.neutral}</span><br>
    <span class="stat-someday">◇ Someday: ${counts.someday}</span><br>
    <br>Total: ${events.length} events<br>
    <br><span style="color:var(--recurring)">✓ Done today: ${doneToday}</span><br>
    <span style="color:rgba(224,232,255,0.4)">✓ All-time: ${completedLog.length}</span>
  `;
}

/* ─── App Badge + Notifications ───────────────────────────────── */
function countDueAndOverdue() {
  let overdue = 0, today = 0;
  events.forEach(evt => {
    if (!evt.date) return;
    const d = getDaysUntil(evt.date);
    if (d < 0) overdue++;
    else if (d === 0) today++;
  });
  return { overdue, today };
}

function updateAppBadge() {
  if (!('setAppBadge' in navigator)) return;
  const { overdue, today } = countDueAndOverdue();
  const total = overdue + today;
  if (total > 0) {
    navigator.setAppBadge(total).catch(() => {});
  } else if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge().catch(() => {});
  }
}

function maybeNotifyOnLaunch() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!('serviceWorker' in navigator)) return;

  const today = todayISO();
  let log = {};
  try { log = JSON.parse(localStorage.getItem(NOTIFY_LOG_KEY) || '{}'); } catch (e) {}
  if (log.lastNotifiedDate === today) return;

  const { overdue, today: todayCount } = countDueAndOverdue();
  if (overdue === 0 && todayCount === 0) return;

  const parts = [];
  if (todayCount > 0) parts.push(`${todayCount} due today`);
  if (overdue > 0)    parts.push(`${overdue} overdue`);

  navigator.serviceWorker.ready.then(reg => {
    reg.showNotification('ChronoGrid', {
      body: parts.join(' · '),
      icon: './icon.svg',
      badge: './icon.svg',
      tag: 'chronogrid-daily',
      renotify: true
    }).catch(() => {});
  });

  log.lastNotifiedDate = today;
  localStorage.setItem(NOTIFY_LOG_KEY, JSON.stringify(log));
}

async function enableNotifications() {
  if (!('Notification' in window)) {
    showToast('Notifications not supported');
    return;
  }
  if (Notification.permission === 'granted') {
    showToast('Notifications already enabled');
    return;
  }
  if (Notification.permission === 'denied') {
    showToast('Blocked in browser settings');
    return;
  }
  const result = await Notification.requestPermission();
  if (result === 'granted') {
    showToast('🔔 Notifications enabled');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification('ChronoGrid', {
          body: 'You will be reminded of due and overdue events when you open the app.',
          icon: './icon.svg',
          tag: 'chronogrid-welcome'
        }).catch(() => {});
      });
    }
  } else {
    showToast('Notifications declined');
  }
  updateNotifyButton();
}

function updateNotifyButton() {
  const btn = document.getElementById('notifyBtn');
  if (!btn) return;
  if (!('Notification' in window)) {
    btn.textContent = '🔕 Notifications unsupported';
    btn.disabled = true;
    return;
  }
  if (Notification.permission === 'granted') {
    btn.textContent = '🔔 Notifications enabled';
    btn.disabled = true;
  } else if (Notification.permission === 'denied') {
    btn.textContent = '🔕 Blocked in browser';
    btn.disabled = true;
  } else {
    btn.textContent = '🔔 Enable notifications';
    btn.disabled = false;
  }
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

/* ─── Today swipe gestures ────────────────────────────────────── */
let suppressNextClick = false;

function initTodaySwipe() {
  const container = document.getElementById('todayContent');
  if (!container) return;

  let state = null;
  const ACTION_THRESHOLD  = 90;
  const DIRECTION_LOCK_PX = 8;

  container.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    const row = e.target.closest('.today-row');
    if (!row) return;
    if (e.target.closest('.today-complete-btn')) return;

    state = {
      row,
      wrap: row.parentElement,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      dx: 0,
      direction: null
    };
    row.style.transition = 'none';
  }, { passive: true });

  container.addEventListener('touchmove', e => {
    if (!state) return;
    const t = e.touches[0];
    const dx = t.clientX - state.startX;
    const dy = t.clientY - state.startY;

    if (!state.direction) {
      if (Math.abs(dx) < DIRECTION_LOCK_PX && Math.abs(dy) < DIRECTION_LOCK_PX) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        // vertical scroll — release control
        state.row.style.transition = '';
        state = null;
        return;
      }
      state.direction = 'horizontal';
    }

    if (state.direction === 'horizontal') {
      if (e.cancelable) e.preventDefault();
      state.dx = dx;
      state.row.style.transform = `translateX(${dx}px)`;
      state.wrap.classList.toggle('swiping-right', dx > 20);
      state.wrap.classList.toggle('swiping-left',  dx < -20);
    }
  }, { passive: false });

  const endHandler = () => {
    if (!state) return;
    const { row, wrap, dx, direction } = state;
    state = null;

    if (direction !== 'horizontal') return;

    suppressNextClick = true;
    row.style.transition = 'transform 0.22s ease-out';
    const id = row.dataset.id;

    if (dx > ACTION_THRESHOLD) {
      row.style.transform = 'translateX(120%)';
      setTimeout(() => {
        wrap.classList.remove('swiping-right', 'swiping-left');
        markComplete(id);
      }, 220);
    } else if (dx < -ACTION_THRESHOLD) {
      row.style.transform = 'translateX(-120%)';
      setTimeout(() => {
        wrap.classList.remove('swiping-right', 'swiping-left');
        snoozeEvent(id);
      }, 220);
    } else {
      row.style.transform = '';
      wrap.classList.remove('swiping-right', 'swiping-left');
    }
  };

  container.addEventListener('touchend',    endHandler, { passive: true });
  container.addEventListener('touchcancel', endHandler, { passive: true });
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
    if (suppressNextClick) { suppressNextClick = false; e.stopPropagation(); e.preventDefault(); return; }
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

  // Today view: swipe gestures (→ complete, ← snooze)
  initTodaySwipe();

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

  // Notifications opt-in
  document.getElementById('notifyBtn').addEventListener('click', enableNotifications);

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
      renderSettingsCompleted();
      showToast('History cleared');
    }
  });

  // Restore a completed task
  document.getElementById('settingsCompleted').addEventListener('click', e => {
    const btn = e.target.closest('.done-restore');
    if (btn) restoreCompleted(btn.dataset.id);
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
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        reg.update();                       // check for a newer worker on launch
        maybeNotifyOnLaunch();
      })
      .catch(err => console.warn('SW registration failed:', err));

    // When a new worker takes control (after skipWaiting), reload once so the
    // app shows the latest code instead of staying on the old cached version.
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    });
  }

  // Refresh badge / notification when tab regains focus (handles next-day rollover)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      updateAppBadge();
      maybeNotifyOnLaunch();
    }
  });
});
