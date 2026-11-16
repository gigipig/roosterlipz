'use strict';

/* ─── Constants ──────────────────────────────────────────────── */
const STORAGE_KEY    = 'chronogrid_events';
const COMPLETED_KEY  = 'chronogrid_completed';
const NOTE_KEY       = 'chronogrid_daily_note';
const NOTIFY_LOG_KEY = 'chronogrid_notify_log';
const REMIND_LOG_KEY = 'chronogrid_remind_log';

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
let selectedRemind     = null;   // minutes before, or null

// Today view: far-horizon sections collapse by default; remember which the
// user has opened so they stay open across re-renders within a session.
const COLLAPSIBLE_SECTIONS = new Set(['month', 'year', 'later', 'someday']);
const expandedSections = new Set();

/* ─── Utilities ───────────────────────────────────────────────── */
function uuid() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// YYYY-MM-DD in the user's own timezone. (toISOString() is UTC, which is a
// day behind local midnight anywhere east of Greenwich, e.g. UK summer time.)
function localISO(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function todayISO() {
  return localISO(new Date());
}

// Local calendar day on which a completion-log entry was ticked off.
function completedDay(c) {
  return localISO(new Date(c.completedAt));
}

function offsetDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return localISO(d);
}

function getDaysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.round((target - today) / 86400000);
}

// Compact relative distance for any horizon: days → weeks → months → years.
function relativeSpan(days) {
  if (days < 7)   return `${days}d`;
  if (days < 28)  return `${Math.round(days / 7)}w`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  const years = days / 365;
  return years < 10 ? `${years.toFixed(years % 1 >= 0.1 ? 1 : 0)}y` : `${Math.round(years)}y`;
}

function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  const days = getDaysUntil(dateStr);
  if (days === 0)  return 'TODAY';
  if (days === 1)  return 'TOMORROW';
  if (days === -1) return 'YESTERDAY';
  if (days > 1)    return `in ${relativeSpan(days)}`;
  return `${relativeSpan(Math.abs(days))} ago`;
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
function showToast(msg, ms = 2200) {
  const toast = document.getElementById('toast');
  scrambleText(toast, '> ' + msg, 320);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
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
      evt.date = localISO(d);
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
    remind: hasReminder(evt) ? evt.remind : null,
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
      updateEvent(id, { date: localISO(d), streak: (evt.streak || 0) + 1 });
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
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  let target;
  if (evt.date) {
    const current = new Date(evt.date + 'T00:00:00');
    if (current < tomorrow) target = tomorrow;
    else { target = current; target.setDate(target.getDate() + 1); }
  } else {
    target = tomorrow;
  }

  const iso = localISO(target);
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
  const doneToday = completedLog.filter(c => completedDay(c) === todayStr).length;
  document.getElementById('todaySubtitle').textContent =
    doneToday > 0 ? `${doneToday} completed today` : 'what needs doing today';

  // ASCII progress bar: today's done vs. still due (today + overdue)
  const dueNow   = events.filter(e => e.date && getDaysUntil(e.date) <= 0).length;
  const progress = document.getElementById('todayProgress');
  const totalDay = doneToday + dueNow;
  if (totalDay === 0) {
    progress.innerHTML = '';
  } else {
    const CELLS  = 20;
    const filled = Math.round((doneToday / totalDay) * CELLS);
    const pct    = Math.round((doneToday / totalDay) * 100);
    progress.innerHTML =
      `<span class="pb-bracket">[</span><span class="pb-fill">${'█'.repeat(filled)}</span>` +
      `<span class="pb-empty">${'░'.repeat(CELLS - filled)}</span><span class="pb-bracket">]</span>` +
      `<span class="pb-label">${doneToday}/${totalDay} · ${pct}%</span>`;
  }

  const container = document.getElementById('todayContent');
  container.innerHTML = '';

  // Categorise events by horizon
  const overdue   = [];
  const todayEvts = [];
  const week      = [];   // 1–7 days
  const month     = [];   // 8–30 days
  const year      = [];   // 31–365 days
  const later     = [];   // 365+ days
  const someday   = [];   // no date

  events.forEach(evt => {
    if (!evt.date) {
      if (evt.category !== 'recurring') someday.push(evt);
      return;
    }
    const d = getDaysUntil(evt.date);
    if (d < 0)         overdue.push(evt);
    else if (d === 0)  todayEvts.push(evt);
    else if (d <= 7)   week.push(evt);
    else if (d <= 30)  month.push(evt);
    else if (d <= 365) year.push(evt);
    else               later.push(evt);
  });

  const byDate = (a, b) => getDaysUntil(a.date) - getDaysUntil(b.date);
  overdue.sort(byDate);
  todayEvts.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
  week.sort(byDate);
  month.sort(byDate);
  year.sort(byDate);
  later.sort(byDate);

  const total = overdue.length + todayEvts.length + week.length +
                month.length + year.length + later.length + someday.length;
  if (total === 0) {
    container.innerHTML = `<div class="today-empty"><pre class="ascii-art">${ASCII_CLEAR}</pre>All clear — nothing on the horizon.<br>Tap + to add something.</div>`;
    return;
  }

  function buildSection(label, icon, list, variant) {
    if (list.length === 0) return;

    const collapsible = COLLAPSIBLE_SECTIONS.has(variant);
    const expanded    = !collapsible || expandedSections.has(variant);

    const sec = document.createElement('div');
    sec.className = 'today-section'
      + (collapsible ? ' collapsible' : '')
      + (expanded ? '' : ' collapsed');

    const hdr = document.createElement('div');
    hdr.className = `today-section-hdr ${variant}`;
    const chevron = collapsible ? '<span class="sec-chevron">▸</span>' : '';
    hdr.innerHTML = `<span class="today-sec-label">${chevron}${icon} ${label}</span><span class="sec-rule" aria-hidden="true"></span><span class="today-sec-count">${list.length}</span>`;
    sec.appendChild(hdr);

    const rows = document.createElement('div');
    rows.className = 'today-sec-rows';

    list.forEach(evt => {
      const streakPart = (evt.category === 'recurring' && evt.streak > 0) ? ` · ↻${evt.streak}` : '';
      const timePart   = evt.time ? ` · ${evt.time}` : '';
      const meta       = formatDate(evt.date) + timePart + streakPart + reminderSuffix(evt);

      const wrap = document.createElement('div');
      wrap.className = 'today-row-wrap';
      wrap.innerHTML = `
        <div class="row-action complete"><span>&gt;&gt; DONE</span></div>
        <div class="row-action snooze"><span>+1D &lt;&lt;</span></div>
        <div class="today-row ${evt.category}" data-id="${evt.id}">
          <div class="today-row-body">
            <div class="today-row-title">${escHtml(evt.title)}</div>
            <div class="today-row-meta">${escHtml(meta)}</div>
          </div>
          <button class="today-complete-btn" data-id="${evt.id}" aria-label="Mark complete">✓</button>
        </div>
      `;
      rows.appendChild(wrap);
    });

    sec.appendChild(rows);

    if (collapsible) {
      hdr.addEventListener('click', () => {
        if (expandedSections.has(variant)) expandedSections.delete(variant);
        else expandedSections.add(variant);
        sec.classList.toggle('collapsed');
      });
    }

    container.appendChild(sec);
  }

  buildSection('OVERDUE',     '⚠',  overdue,   'overdue');
  buildSection('TODAY',       '◉',  todayEvts, 'today');
  buildSection('NEXT 7 DAYS', '◈',  week,      'upcoming');
  buildSection('THIS MONTH',  '◷',  month,     'month');
  buildSection('THIS YEAR',   '◎',  year,      'year');
  buildSection('LATER',       '∞',  later,     'later');
  buildSection('SOMEDAY',     '◇',  someday,   'someday');
}

/* ─── Render: Stream ──────────────────────────────────────────── */
function renderStream() {
  const container = document.getElementById('orbsContainer');
  container.innerHTML = '';

  const visible = visibleEvents().sort((a, b) => getDaysUntil(b.date) - getDaysUntil(a.date));

  if (visible.length === 0) {
    container.innerHTML = `<div class="stream-empty"><pre class="ascii-art">${ASCII_VOID}</pre>No upcoming events.<br>Tap + to add your first event.</div>`;
    document.querySelector('.stream-track').style.minHeight = '400px';
    StreamRail.resize();
    return;
  }

  const count  = visible.length;
  const trackH = Math.max(500, count * 140);
  document.querySelector('.stream-track').style.minHeight = trackH + 'px';
  StreamRail.resize();

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
    container.innerHTML = `<div class="list-empty"><pre class="ascii-art">${ASCII_VOID}</pre>No upcoming events.<br>Tap + or use the dock below.</div>`;
    return;
  }

  let delay = 0;
  catOrder.forEach(cat => {
    if (grouped[cat].length === 0) return;

    const group = document.createElement('div');
    group.className = 'cat-group';

    const hdr = document.createElement('div');
    hdr.className = `cat-group-hdr ${cat}`;
    hdr.innerHTML = `<span>${CAT_ICONS[cat]} ${CAT_LABELS[cat]}</span><span class="sec-rule" aria-hidden="true"></span><span class="cat-count">${grouped[cat].length}</span>`;
    group.appendChild(hdr);

    grouped[cat].forEach(evt => {
      const streakPart = (evt.category === 'recurring' && evt.streak > 0) ? ` · ↻${evt.streak}` : '';
      const timePart   = evt.time ? ` · ${evt.time}` : '';
      const meta       = formatDate(evt.date) + timePart + streakPart + reminderSuffix(evt);

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
  checkReminders();
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
  setRemindSelection(evt && hasReminder(evt) ? evt.remind : null);

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

  updateRemindHint();
  backdrop.classList.add('open');
  setTimeout(() => document.getElementById('eventTitle').focus(), 300);
}

function closeEventModal() {
  document.getElementById('eventModalBackdrop').classList.remove('open');
  document.getElementById('quickAddInput').value = '';
  editingId = null;
  selectedRecurrence = null;
  selectedRemind = null;
}

function setRemindSelection(val) {
  selectedRemind = val;
  document.querySelectorAll('.remind-btn').forEach(b =>
    b.classList.toggle('active', val !== null && Number(b.dataset.val) === val));
}

// One line under the reminder buttons explaining what will actually happen.
function updateRemindHint() {
  const hint = document.getElementById('remindHint');
  const date = document.getElementById('eventDate').value;
  const time = document.getElementById('eventTime').value;
  hint.classList.remove('warn');
  if (selectedRemind === null) { hint.textContent = ''; return; }
  if (!date) {
    hint.textContent = 'Set a date, or this reminder has nothing to fire on.';
    hint.classList.add('warn');
  } else if (!('Notification' in window) || Notification.permission === 'denied') {
    hint.textContent = 'Notifications are blocked here, so you will only see this inside the app. Use + Calendar for a real alert.';
    hint.classList.add('warn');
  } else if (!time) {
    hint.textContent = 'No time set — counted as 9:00. Fires while ChronoGrid is open; use + Calendar for alerts when it is closed.';
  } else {
    hint.textContent = 'Fires while ChronoGrid is open; use + Calendar for alerts when it is closed.';
  }
}

// Current form contents as an event payload (shared by Save and + Calendar).
function readEventForm() {
  const catRadio = document.querySelector('input[name="category"]:checked');
  const category = catRadio ? catRadio.value : 'someday';
  return {
    title:      document.getElementById('eventTitle').value.trim(),
    date:       document.getElementById('eventDate').value || '',
    time:       document.getElementById('eventTime').value || '',
    category,
    recurrence: category === 'recurring' ? selectedRecurrence : null,
    notes:      document.getElementById('eventNotes').value.trim(),
    streak:     editingId ? (events.find(e => e.id === editingId)?.streak || 0) : 0,
    remind:     selectedRemind
  };
}

function handleEventSubmit(e) {
  e.preventDefault();
  const payload = readEventForm();
  if (!payload.title) return;

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
  updateFxButton();
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
    const wIso = completedDay(c);
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
    streak:     0,
    remind:     (c.remind === undefined ? null : c.remind)
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
  const doneToday = completedLog.filter(c => completedDay(c) === todayStr).length;

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

/* ─── Reminders ───────────────────────────────────────────────── */
// evt.remind = minutes before the event (0, 10, 60, 1440) or null for none.
// Fires while the app is open or backgrounded; a browser can't wake a closed
// app, which is what the calendar (.ics) hand-off below is for.
const REMIND_LABELS  = { 0: 'at time', 10: '10m', 60: '1h', 1440: '1d' };
const DEFAULT_TIME   = '09:00';          // events with no time count as 9am
const REMIND_GRACE   = 15 * 60000;       // still fire up to 15 min after the event

function hasReminder(evt) {
  return evt.remind !== null && evt.remind !== undefined && !!evt.date;
}

function eventDateTime(evt) {
  return new Date(`${evt.date}T${evt.time || DEFAULT_TIME}:00`);
}

function reminderSuffix(evt) {
  return hasReminder(evt) ? ` · 🔔${REMIND_LABELS[evt.remind] || ''}` : '';
}

function loadRemindLog() {
  try { return JSON.parse(localStorage.getItem(REMIND_LOG_KEY) || '{}') || {}; } catch (e) { return {}; }
}

function checkReminders() {
  const now = Date.now();
  const log = loadRemindLog();
  let dirty = false;

  // Forget fired entries after 3 days
  Object.keys(log).forEach(k => { if (now - log[k] > 3 * 86400000) { delete log[k]; dirty = true; } });

  events.forEach(evt => {
    if (!hasReminder(evt)) return;
    const at = eventDateTime(evt).getTime();
    if (isNaN(at)) return;
    const fireAt = at - evt.remind * 60000;
    if (now < fireAt || now > at + REMIND_GRACE) return;

    const key = `${evt.id}|${fireAt}`;      // recurring events get a new key each cycle
    if (log[key]) return;
    log[key] = now;
    dirty = true;
    fireReminder(evt, at - now);
  });

  if (dirty) localStorage.setItem(REMIND_LOG_KEY, JSON.stringify(log));
}

function fireReminder(evt, msUntil) {
  const mins = Math.round(msUntil / 60000);
  let when;
  if (mins <= 0)        when = 'now';
  else if (mins < 60)   when = `in ${mins}m`;
  else if (mins < 1440) when = `in ${Math.round(mins / 60)}h`;
  else                  when = formatDate(evt.date).toLowerCase();
  const body = evt.time ? `${when} · ${evt.time}` : when;

  if (navigator.vibrate) navigator.vibrate([30, 60, 30]);
  showToast(`🔔 ${evt.title} — ${when}`, 6000);

  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const opts = { body, icon: './icon.svg', badge: './icon.svg', tag: `chronogrid-remind-${evt.id}`, renotify: true };
  const direct = () => { try { new Notification(evt.title, opts); } catch (e) {} };
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(reg => reg.showNotification(evt.title, opts)).catch(direct);
  } else {
    direct();
  }
}

/* ─── Calendar hand-off (.ics) ────────────────────────────────── */
function icsEscape(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

// RFC 5545: lines are at most 75 bytes; continuation lines start with a space.
function icsFold(line) {
  const enc = new TextEncoder();
  let out = '', cur = '', bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > 73) { out += cur + '\r\n '; cur = ''; bytes = 1; }
    cur += ch; bytes += n;
  }
  return out + cur;
}

function icsDuration(mins) {          // signed minutes → e.g. -PT10M, PT8H50M, -P1D
  const sign = mins < 0 ? '-' : '';
  let m = Math.abs(mins);
  const d = Math.floor(m / 1440); m -= d * 1440;
  const h = Math.floor(m / 60);   m -= h * 60;
  const t = (h ? `${h}H` : '') + (m ? `${m}M` : '');
  return `${sign}P${d ? d + 'D' : ''}${t ? 'T' + t : ''}` + (!d && !t ? 'T0M' : '');
}

function buildICS(list) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ChronoGrid//EN', 'CALSCALE:GREGORIAN'];

  list.filter(e => e.date).forEach(evt => {
    const ymd = evt.date.replace(/-/g, '');
    lines.push('BEGIN:VEVENT', `UID:${evt.id}@chronogrid`, `DTSTAMP:${stamp}`);

    if (evt.time) {
      // Floating local time: shows at this wall-clock time on whatever device imports it
      lines.push(`DTSTART:${ymd}T${evt.time.replace(':', '')}00`, 'DURATION:PT30M');
    } else {
      const next = new Date(evt.date + 'T00:00:00'); next.setDate(next.getDate() + 1);
      lines.push(`DTSTART;VALUE=DATE:${ymd}`, `DTEND;VALUE=DATE:${localISO(next).replace(/-/g, '')}`);
    }

    lines.push(`SUMMARY:${icsEscape(evt.title)}`);
    if (evt.notes) lines.push(`DESCRIPTION:${icsEscape(evt.notes)}`);
    if (evt.category === 'recurring' && evt.recurrence) {
      lines.push(`RRULE:FREQ=${evt.recurrence === 'weekly' ? 'WEEKLY' : 'MONTHLY'}`);
    }

    if (hasReminder(evt)) {
      // All-day events start at midnight, so shift the alarm to our 9am convention
      const [dh, dm] = DEFAULT_TIME.split(':').map(Number);
      const offset = evt.time ? -evt.remind : (dh * 60 + dm) - evt.remind;
      lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape(evt.title)}`,
                 `TRIGGER:${icsDuration(offset)}`, 'END:VALARM');
    }
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.map(icsFold).join('\r\n') + '\r\n';
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportICS(list, filename) {
  const dated = list.filter(e => e.date);
  if (dated.length === 0) { showToast('Set a date first'); return; }

  const ics  = buildICS(dated);
  const file = new File([ics], filename, { type: 'text/calendar' });

  // On phones the share sheet hands the file straight to the calendar app
  const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (touch && navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'ChronoGrid' }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; /* else fall through to download */ }
  }
  downloadBlob(file, filename);
  showToast(dated.length === 1 ? 'Calendar file saved — open it to add' : `${dated.length} events saved to calendar file`, 3500);
}

/* ─── Export / Import ─────────────────────────────────────────── */
// Backup format v2: { app, version, exportedAt, events, completed, notes }.
// v1 backups were a bare array of events and are still accepted on import.
const CATEGORIES = ['urgent', 'recurring', 'longterm', 'neutral', 'someday'];
const cleanId  = id  => String(id).replace(/[^\w-]/g, '').slice(0, 64);
const cleanCat = cat => CATEGORIES.includes(cat) ? cat : 'neutral';
const cleanStr = (v, max) => (typeof v === 'string' ? v : '').slice(0, max);
const isDate   = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const isTime   = v => typeof v === 'string' && /^\d{2}:\d{2}$/.test(v);

function exportJSON() {
  const backup = {
    app: 'chronogrid',
    version: 2,
    exportedAt: new Date().toISOString(),
    events,
    completed: completedLog,
    notes: loadNotes()
  };
  downloadBlob(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }),
               `chronogrid-backup-${todayISO()}.json`);
  const noteCount = Object.keys(backup.notes).length;
  showToast(`Backup: ${events.length} events · ${completedLog.length} done · ${noteCount} notes`, 3500);
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      const inEvents    = Array.isArray(data) ? data : data && data.events;
      const inCompleted = (!Array.isArray(data) && data && data.completed) || [];
      const inNotes     = (!Array.isArray(data) && data && data.notes) || {};
      if (!Array.isArray(inEvents)) throw new Error('No events array');

      // Events — merge by id, never overwrite what's already here
      const eventIds = new Set(events.map(ev => ev.id));
      let addedEvents = 0;
      inEvents.forEach(ev => {
        if (!ev || typeof ev.title !== 'string' || !ev.title.trim()) return;
        const id = cleanId(ev.id || uuid()) || uuid();
        if (eventIds.has(id)) return;
        const category = cleanCat(ev.category);
        events.push({
          id,
          title:      cleanStr(ev.title, 500),
          date:       isDate(ev.date) ? ev.date : '',
          time:       isTime(ev.time) ? ev.time : '',
          category,
          recurrence: category === 'recurring' && ['weekly', 'monthly'].includes(ev.recurrence) ? ev.recurrence : null,
          notes:      cleanStr(ev.notes, 5000),
          streak:     Number.isFinite(ev.streak) ? ev.streak : 0,
          remind:     [0, 10, 60, 1440].includes(ev.remind) ? ev.remind : null
        });
        eventIds.add(id);
        addedEvents++;
      });

      // Completion history — merge by id
      const doneIds = new Set(completedLog.map(c => c.id));
      let addedDone = 0;
      if (Array.isArray(inCompleted)) inCompleted.forEach(c => {
        if (!c || typeof c.title !== 'string' || isNaN(new Date(c.completedAt))) return;
        const id = cleanId(c.id || uuid()) || uuid();
        if (doneIds.has(id)) return;
        completedLog.push({
          id,
          eventId:     cleanId(c.eventId || ''),
          title:       cleanStr(c.title, 500),
          category:    cleanCat(c.category),
          date:        isDate(c.date) ? c.date : '',
          time:        isTime(c.time) ? c.time : '',
          notes:       cleanStr(c.notes, 5000),
          recurrence:  ['weekly', 'monthly'].includes(c.recurrence) ? c.recurrence : null,
          remind:      [0, 10, 60, 1440].includes(c.remind) ? c.remind : null,
          completedAt: new Date(c.completedAt).toISOString()
        });
        doneIds.add(id);
        addedDone++;
      });
      completedLog.sort((a, b) => a.completedAt.localeCompare(b.completedAt));

      // Daily notes — only fill days that have no note here
      const notes = loadNotes();
      let addedNotes = 0;
      if (inNotes && typeof inNotes === 'object') Object.keys(inNotes).forEach(d => {
        if (!isDate(d) || typeof inNotes[d] !== 'string' || !inNotes[d].trim()) return;
        if (notes[d] && notes[d].trim()) return;
        notes[d] = cleanStr(inNotes[d], 20000);
        addedNotes++;
      });

      saveEventsToStorage(events);
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedLog));
      saveNotes(notes);

      const noteEl = document.getElementById('todayNote');
      if (noteEl && !noteEl.value.trim() && notes[todayISO()]) noteEl.value = notes[todayISO()];

      advanceRecurring(events);
      renderAll();
      updateSettingsStats();
      renderSettingsNotes();
      renderSettingsCompleted();
      showToast(`Imported ${addedEvents} events · ${addedDone} done · ${addedNotes} notes`, 3500);
    } catch (err) {
      showToast('Import failed: not a ChronoGrid backup', 3500);
    }
  };
  reader.readAsText(file);
}

/* ─── ASCII FX ────────────────────────────────────────────────── */
// Everything visual is drawn as text on two small canvases at ~12fps.
// Motion pauses when the tab is hidden, and is off by default for users
// who prefer reduced motion (overridable in Settings).
const FX_KEY = 'chronogrid_fx';
const reduceMotionMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
const FX_FONT = "'JetBrains Mono', ui-monospace, monospace";
const SCRAMBLE_GLYPHS = '!<>-_\\/[]{}=+*^?#%01';

function fxEnabled() {
  const v = localStorage.getItem(FX_KEY);
  if (v === 'on')  return true;
  if (v === 'off') return false;
  return !reduceMotionMQ.matches;
}

function setFxEnabled(on) {
  localStorage.setItem(FX_KEY, on ? 'on' : 'off');
  applyFx();
}

function applyFx() {
  const on = fxEnabled() && document.visibilityState === 'visible';
  document.body.classList.toggle('fx-off', !fxEnabled());
  AsciiField.setRunning(on);
  StreamRail.setRunning(on && document.getElementById('view-stream').classList.contains('active'));
  updateFxButton();
}

function updateFxButton() {
  const btn = document.getElementById('fxBtn');
  if (btn) btn.textContent = fxEnabled() ? '▒ Motion effects: ON' : '░ Motion effects: OFF';
}

// "Decrypt" text in: random glyphs resolve left-to-right into the real string.
function scrambleText(el, text, duration = 550) {
  if (el._scramble) cancelAnimationFrame(el._scramble);
  if (!fxEnabled()) { el.textContent = text; return; }
  const start = performance.now();
  const tick = now => {
    const p = Math.min(1, (now - start) / duration);
    const shown = Math.floor(p * text.length);
    let out = text.slice(0, shown);
    for (let i = shown; i < text.length; i++) {
      out += text[i] === ' ' ? ' ' : SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0];
    }
    el.textContent = out;
    el._scramble = p < 1 ? requestAnimationFrame(tick) : null;
  };
  el._scramble = requestAnimationFrame(tick);
}

function lerpColor(stops, t) {
  // stops: [[pos, r, g, b], ...] sorted by pos
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const a = stops[i - 1], b = stops[i];
      const k = (t - a[0]) / (b[0] - a[0] || 1);
      return [0, 1, 2].map(j => Math.round(a[j + 1] + (b[j + 1] - a[j + 1]) * k));
    }
  }
  return stops[stops.length - 1].slice(1);
}

// Full-screen drifting character field (replaces the star field).
const AsciiField = (() => {
  const RAMP   = '.·:-=+*#';
  const CELL_W = 11, CELL_H = 17, FPS = 12;
  const STOPS  = [[0, 68, 136, 255], [0.6, 78, 199, 196], [1, 68, 255, 136]];
  let canvas, ctx, cols = 0, rows = 0, raf = null, last = 0, t = 0, running = false;

  function init() {
    canvas = document.getElementById('asciiBg');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL_W);
    rows = Math.ceil(h / CELL_H);
    draw();
  }

  // Cheap layered interference pattern; roughly in [-2.4, 2.4].
  function field(x, y) {
    return Math.sin(x * 0.11 + t) * Math.cos(y * 0.09 - t * 0.6)
         + Math.sin((x - y) * 0.05 + t * 0.4) * 0.8
         + Math.cos(Math.hypot(x - cols * 0.75, y - rows * 0.25) * 0.2 - t * 1.3) * 0.6;
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `11px ${FX_FONT}`;
    ctx.textBaseline = 'top';
    for (let y = 0; y < rows; y++) {
      const [r, g, b] = lerpColor(STOPS, y / rows);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      for (let x = 0; x < cols; x++) {
        const v = field(x, y);
        if (v < 0.95) continue;                       // keep it sparse
        const k = Math.min(1, (v - 0.95) / 1.3);
        ctx.globalAlpha = 0.06 + k * 0.16;
        ctx.fillText(RAMP[Math.min(RAMP.length - 1, (k * RAMP.length) | 0)], x * CELL_W, y * CELL_H);
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (now - last < 1000 / FPS) return;
    last = now;
    t += 0.05;
    draw();
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on) raf = requestAnimationFrame(loop);
    else { cancelAnimationFrame(raf); draw(); }   // leave a static frame behind
  }

  return { init, setRunning, redraw: () => draw() };
})();

// Vertical character "data rail" for the Stream view (replaces line + particles).
// Packets flow downward: from the future toward now.
const StreamRail = (() => {
  const CELL_H = 14, COL_W = 9, COLS = 3, FPS = 14;
  const STOPS  = [[0, 68, 136, 255], [0.6, 68, 255, 136], [1, 255, 136, 68]];
  const TRAIL  = ['█', '▓', '▒', '░', '·'];
  let canvas, ctx, track, rows = 0, raf = null, last = 0, running = false;
  let packets = [];

  function init() {
    canvas = document.getElementById('streamRail');
    track  = document.querySelector('.stream-track');
    if (!canvas || !track) return;
    ctx = canvas.getContext('2d');
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track);
    resize();
  }

  function resize() {
    if (!canvas) return;
    const h = track.clientHeight;
    if (!h) return;
    const w = COL_W * COLS;
    // Very tall tracks: drop to 1x so the canvas stays within browser limits.
    const dpr = h * 2 > 16000 ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rows = Math.ceil(h / CELL_H);
    const n = Math.max(3, Math.round(rows / 12));
    packets = Array.from({ length: n }, () => ({ y: Math.random() * rows, v: 0.25 + Math.random() * 0.35 }));
    draw();
  }

  function draw() {
    if (!ctx || !rows) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `12px ${FX_FONT}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    const cx = COL_W * 1.5;

    // Spine
    for (let y = 0; y < rows; y++) {
      const [r, g, b] = lerpColor(STOPS, y / rows);
      ctx.fillStyle = `rgba(${r},${g},${b},0.35)`;
      ctx.fillText('│', cx, y * CELL_H);
      // occasional binary flicker on the side columns
      if (running && Math.random() < 0.025) {
        ctx.fillStyle = `rgba(${r},${g},${b},0.3)`;
        ctx.fillText(Math.random() < 0.5 ? '0' : '1', Math.random() < 0.5 ? COL_W * 0.5 : COL_W * 2.5, y * CELL_H);
      }
    }

    // Packets with a fading trail above them
    packets.forEach(p => {
      const head = Math.floor(p.y);
      TRAIL.forEach((ch, i) => {
        const y = head - i;
        if (y < 0 || y >= rows) return;
        const [r, g, b] = lerpColor(STOPS, y / rows);
        ctx.clearRect(cx - COL_W / 2, y * CELL_H, COL_W, CELL_H);
        ctx.fillStyle = `rgba(${r},${g},${b},${1 - i * 0.18})`;
        ctx.fillText(ch, cx, y * CELL_H);
      });
    });
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (now - last < 1000 / FPS) return;
    last = now;
    packets.forEach(p => {
      p.y += p.v;
      if (p.y - TRAIL.length > rows) { p.y = -Math.random() * 6; p.v = 0.25 + Math.random() * 0.35; }
    });
    draw();
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on) { resize(); raf = requestAnimationFrame(loop); }
    else { cancelAnimationFrame(raf); draw(); }
  }

  return { init, resize, setRunning };
})();

// Small ASCII banners for empty states.
const ASCII_CLEAR = [
  '   \\   :   /   ',
  ' -- ( ◉ ) --  ',
  '   /   :   \\   ',
  '_______________'
].join('\n');

const ASCII_VOID = [
  '┌──────────────┐',
  '│  . · : · .   │',
  '│  NO SIGNAL   │',
  '└──────────────┘'
].join('\n');

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
  if (name === 'stream') StreamRail.resize();   // size the rail now that it's visible
  applyFx();
}

/* ─── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  events       = loadEvents();
  completedLog = loadCompleted();

  AsciiField.init();
  StreamRail.init();
  initNote();
  renderAll();
  applyFx();

  // Boot-up "decrypt" of the title and date
  document.querySelectorAll('.title-chrono, .title-grid').forEach((el, i) =>
    setTimeout(() => scrambleText(el, el.textContent, 700), i * 180));
  const dateEl = document.getElementById('todayDateDisplay');
  scrambleText(dateEl, dateEl.textContent, 800);

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

  // Reminder buttons (tap again to turn off). First use asks for permission.
  document.querySelectorAll('.remind-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const val = Number(btn.dataset.val);
      setRemindSelection(selectedRemind === val ? null : val);
      if (selectedRemind !== null && 'Notification' in window && Notification.permission === 'default') {
        try { await Notification.requestPermission(); } catch (e) {}
      }
      updateRemindHint();
    });
  });
  ['eventDate', 'eventTime'].forEach(id =>
    document.getElementById(id).addEventListener('input', updateRemindHint));

  // + Calendar: hand the event as currently typed to the device calendar
  document.getElementById('icsBtn').addEventListener('click', () => {
    const payload = readEventForm();
    if (!payload.title) { showToast('Give it a title first'); return; }
    const safe = payload.title.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'event';
    exportICS([{ id: editingId || uuid(), ...payload }], `${safe}.ics`);
  });
  document.getElementById('exportIcsBtn').addEventListener('click', () =>
    exportICS(events, `chronogrid-${todayISO()}.ics`));

  // Check for due reminders twice a minute while the app is alive
  setInterval(checkReminders, 30000);

  // Notifications opt-in
  document.getElementById('notifyBtn').addEventListener('click', enableNotifications);

  // Motion effects toggle
  document.getElementById('fxBtn').addEventListener('click', () => setFxEnabled(!fxEnabled()));
  if (reduceMotionMQ.addEventListener) reduceMotionMQ.addEventListener('change', applyFx);

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
    applyFx();                              // pause canvases while hidden
    if (document.visibilityState === 'visible') {
      updateAppBadge();
      maybeNotifyOnLaunch();
      checkReminders();
    }
  });
});
