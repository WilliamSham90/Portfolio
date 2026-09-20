/* ─────────────────────────────────────────────────────
   DEMO DASHBOARD — script.js
   ───────────────────────────────────────────────────── */

'use strict';

let salesChart, subChart, donutChart;

// ── THEME ──────────────────────────────────────────
const html             = document.documentElement;
const themeToggle      = document.getElementById('themeToggle');
const settingsDarkToggle = document.getElementById('settingsDarkToggle');
const dropThemeToggle  = document.getElementById('dropThemeToggle');
const dropThemeLabel   = document.querySelector('.drop-theme-label');

function getTheme() { return localStorage.getItem('demo-theme') || 'light'; }

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('demo-theme', t);
  if (settingsDarkToggle) settingsDarkToggle.classList.toggle('active', t === 'dark');
  if (dropThemeLabel) dropThemeLabel.textContent = t === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  updateChartsTheme();
}

applyTheme(getTheme());

themeToggle?.addEventListener('click', () => {
  const next = getTheme() === 'light' ? 'dark' : 'light';
  applyTheme(next);
  showToast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on', 'info');
  closeAllDropdowns();
});

settingsDarkToggle?.addEventListener('click', () => {
  applyTheme(getTheme() === 'light' ? 'dark' : 'light');
});

dropThemeToggle?.addEventListener('click', () => {
  const next = getTheme() === 'light' ? 'dark' : 'light';
  applyTheme(next);
  showToast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on', 'info');
  closeAllDropdowns();
});

// ── SIDEBAR ────────────────────────────────────────
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const hamburger      = document.getElementById('hamburger');
const sidebarClose   = document.getElementById('sidebarClose');

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openSidebar);
sidebarClose?.addEventListener('click', closeSidebar);
sidebarOverlay?.addEventListener('click', closeSidebar);

// ── NAVIGATION ─────────────────────────────────────
const navItems = document.querySelectorAll('.nav-item[data-page]');
const pages    = document.querySelectorAll('.page');

function navigateTo(pageId) {
  navItems.forEach(n => n.classList.remove('active'));
  pages.forEach(p => p.classList.remove('active'));

  const target = document.querySelector(`[data-page="${pageId}"]`);
  const page   = document.getElementById(`page-${pageId}`);

  if (target) target.classList.add('active');
  if (page)   page.classList.add('active');

  if (page) {
    const cards = page.querySelectorAll('[data-animate]');
    cards.forEach((c, i) => {
      c.classList.remove('visible');
      setTimeout(() => c.classList.add('visible'), 60 + i * 80);
    });
  }

  closeSidebar();
  closeAllDropdowns();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(item.dataset.page);
  });
});

// Trigger initial dashboard animation
setTimeout(() => {
  const dashCards = document.querySelectorAll('#page-dashboard [data-animate]');
  dashCards.forEach((c, i) => {
    setTimeout(() => c.classList.add('visible'), 100 + i * 100);
  });
}, 200);

// Resize charts after animation completes so they fill containers
setTimeout(() => {
  salesChart?.resize();
  subChart?.resize();
  donutChart?.resize();
}, 1200);

// ── PERIOD BUTTONS ─────────────────────────────────
document.querySelectorAll('[data-period]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active-period'));
    btn.classList.add('active-period');
    updateSalesChartData(btn.dataset.period);
    showToast(`Switched to ${btn.dataset.period} view`, 'info');
  });
});

// ── COUNTER ANIMATION ──────────────────────────────
function animateCounter(el, end, duration = 1400, isFloat = false, prefix = '', suffix = '') {
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = end * ease;

    if (isFloat) {
      el.textContent = prefix + current.toFixed(1) + suffix;
    } else if (end > 1000) {
      el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    } else {
      el.textContent = prefix + Math.floor(current) + suffix;
    }

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const raw = parseFloat(el.dataset.count);

      if (el.classList.contains('currency')) {
        animateCounter(el, raw / 100, 1400, true, 'R');
      } else if (el.classList.contains('percent')) {
        animateCounter(el, raw, 1400, true, '', '%');
      } else {
        animateCounter(el, raw, 1400, false);
      }

      observer.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value[data-count]').forEach(el => observer.observe(el));

// ── CHARTS ─────────────────────────────────────────
// Guard: only set defaults if Chart.js actually loaded
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.font.size   = 11;
}



function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ─── SALES OVERVIEW CHART ──────────────────────────
const salesDataSets = {
  monthly: {
    labels: ['Oct', 'Nov', 'Dec'],
    china:  [1200, 900, 1800],
    ue:     [800,  650,  950],
    usa:    [600,  450,  750],
    canada: [388,  215,  505],
  },
  weekly: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    china:  [320, 410, 380, 490],
    ue:     [210, 280, 250, 340],
    usa:    [160, 200, 175, 230],
    canada: [90,  110, 100, 125],
  },
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    china:  [140, 180, 160, 220, 190, 90,  60],
    ue:     [80,  110,  95, 130, 115, 55,  35],
    usa:    [60,   80,  70,  95,  85, 40,  25],
    canada: [35,   45,  40,  55,  50, 20,  12],
  },
};

function makeSalesChart() {
  if (typeof Chart === 'undefined') return; // guard if CDN failed
  const ctx = document.getElementById('salesChart')?.getContext('2d');
  if (!ctx) return;

  const d         = salesDataSets.monthly;
  const gridColor = getCSSVar('--border');
  const textColor = getCSSVar('--text-secondary');

  function grad(ctx, color1, color2) {
    const g = ctx.createLinearGradient(0, 0, 0, 260);
    g.addColorStop(0, color1);
    g.addColorStop(1, color2);
    return g;
  }

  salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'China',
          data: d.china,
          backgroundColor: grad(ctx, 'rgba(108,92,231,0.85)', 'rgba(108,92,231,0.3)'),
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'UE',
          data: d.ue,
          backgroundColor: grad(ctx, 'rgba(0,206,201,0.85)', 'rgba(0,206,201,0.3)'),
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'USA',
          data: d.usa,
          backgroundColor: grad(ctx, 'rgba(116,185,255,0.85)', 'rgba(116,185,255,0.3)'),
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Canada',
          data: d.canada,
          backgroundColor: grad(ctx, 'rgba(162,155,254,0.85)', 'rgba(162,155,254,0.3)'),
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(26,29,46,0.95)',
          titleColor: '#F0F1FF',
          bodyColor: '#9A9DC8',
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            label: (c) => ` ${c.dataset.label}: $${c.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          border: { display: false },
          ticks: { color: textColor },
        },
        y: {
          stacked: true,
          grid: { color: gridColor, drawBorder: false },
          border: { display: false, dash: [4, 4] },
          ticks: {
            color: textColor,
            callback: v => '$' + (v / 1000).toFixed(0) + 'k',
          },
        },
      },
      animation: { duration: 700, easing: 'easeInOutQuart' },
    },
  });
}

function updateSalesChartData(period) {
  if (!salesChart) return;
  const d = salesDataSets[period] || salesDataSets.monthly;
  salesChart.data.labels             = d.labels;
  salesChart.data.datasets[0].data   = d.china;
  salesChart.data.datasets[1].data   = d.ue;
  salesChart.data.datasets[2].data   = d.usa;
  salesChart.data.datasets[3].data   = d.canada;
  salesChart.update('active');
}

// ─── SUBSCRIBER BAR CHART ──────────────────────────
function makeSubChart() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('subChart')?.getContext('2d');
  if (!ctx) return;

  const textColor = getCSSVar('--text-secondary');

  subChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [{
        data: [620, 980, 3874, 770, 540, 890, 410],
        backgroundColor: (c) => c.dataIndex === 2
          ? 'rgba(108,92,231,0.95)'
          : 'rgba(108,92,231,0.18)',
        borderRadius: 7,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(26,29,46,0.95)',
          titleColor: '#F0F1FF',
          bodyColor: '#9A9DC8',
          padding: 8,
          cornerRadius: 8,
          callbacks: {
            label: c => ` ${c.parsed.y.toLocaleString()} subscribers`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { display: false } },
        y: { grid: { display: false }, border: { display: false }, ticks: { display: false } },
      },
      animation: { duration: 800, easing: 'easeInOutQuart' },
    },
  });
}

// ─── DONUT CHART ───────────────────────────────────
function makeDonutChart() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('donutChart')?.getContext('2d');
  if (!ctx) return;

  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Website', 'Mobile App', 'Other'],
      datasets: [{
        data: [374.82, 241.60, 213.42],
        backgroundColor: [
          'rgba(108,92,231,0.9)',
          'rgba(0,206,201,0.85)',
          'rgba(116,185,255,0.85)',
        ],
        borderWidth: 0,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(26,29,46,0.95)',
          titleColor: '#F0F1FF',
          bodyColor: '#9A9DC8',
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            label: c => ` $${c.parsed.toFixed(2)}`,
          },
        },
      },
      animation: { animateRotate: true, duration: 1000, easing: 'easeInOutQuart' },
    },
  });
}

function updateChartsTheme() {
  const gridColor = getCSSVar('--border');
  const textColor = getCSSVar('--text-secondary');

  if (salesChart) {
    salesChart.options.scales.x.ticks.color = textColor;
    salesChart.options.scales.y.ticks.color = textColor;
    salesChart.options.scales.y.grid.color  = gridColor;
    salesChart.update('none');
  }
}

// ── Init charts via requestAnimationFrame to ensure layout is ready
// This is the key fix: defer chart creation until after the first paint
requestAnimationFrame(() => {
  makeSalesChart();
  makeSubChart();
  makeDonutChart();
});

// ── SUBSCRIBER PERIOD ──────────────────────────────
const subPeriodSets = {
  Weekly:  [620, 980, 3874, 770, 540, 890, 410],
  Monthly: [4200, 3800, 5100, 4600, 3200, 6000, 2800],
  Daily:   [210, 340, 280, 190, 310, 420, 260],
};

document.getElementById('subPeriod')?.addEventListener('change', (e) => {
  if (!subChart) return;
  subChart.data.datasets[0].data = subPeriodSets[e.target.value] || subPeriodSets.Weekly;
  subChart.update('active');
  showToast(`Subscribers: ${e.target.value} view`, 'info');
});

// ── TOAST ──────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '✓'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3200);
}

// ── MODAL ──────────────────────────────────────────
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalBody    = document.getElementById('modalBody');

function openModal(html) {
  modalBody.innerHTML = html;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ── CLOSE ALL DROPDOWNS / PANELS ───────────────────
function closeAllDropdowns() {
  // User dropdown
  document.getElementById('userDropdown')?.classList.remove('open');
  document.getElementById('userMenuWrap')?.classList.remove('open');
  document.getElementById('userProfile')?.setAttribute('aria-expanded', 'false');
  // Notification panel
  document.getElementById('notifPanel')?.classList.remove('open');
  document.getElementById('notifBtn')?.setAttribute('aria-expanded', 'false');
}

// Close panels on outside click
document.addEventListener('click', (e) => {
  // Close user dropdown
  const userMenuWrap = document.getElementById('userMenuWrap');
  if (userMenuWrap && !userMenuWrap.contains(e.target)) {
    userMenuWrap.classList.remove('open');
    document.getElementById('userDropdown')?.classList.remove('open');
    document.getElementById('userProfile')?.setAttribute('aria-expanded', 'false');
  }
  // Close notification panel
  const notifWrap = document.getElementById('notifWrap');
  if (notifWrap && !notifWrap.contains(e.target)) {
    document.getElementById('notifPanel')?.classList.remove('open');
    document.getElementById('notifBtn')?.setAttribute('aria-expanded', 'false');
  }
});

// ── USER DROPDOWN ──────────────────────────────────
const userProfile  = document.getElementById('userProfile');
const userDropdown = document.getElementById('userDropdown');
const userMenuWrap = document.getElementById('userMenuWrap');

userProfile?.addEventListener('click', (e) => {
  e.stopPropagation();
  // Close notification panel first
  document.getElementById('notifPanel')?.classList.remove('open');
  document.getElementById('notifBtn')?.setAttribute('aria-expanded', 'false');

  const isOpen = userDropdown?.classList.contains('open');
  userDropdown?.classList.toggle('open', !isOpen);
  userMenuWrap?.classList.toggle('open', !isOpen);
  userProfile.setAttribute('aria-expanded', String(!isOpen));
});

// Also support keyboard activation
userProfile?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    userProfile.click();
  }
});

// Dropdown item actions
document.getElementById('dropGoSettings')?.addEventListener('click', () => {
  navigateTo('settings');
  closeAllDropdowns();
});

document.getElementById('dropSwitchWorkspace')?.addEventListener('click', () => {
  showToast('Switching workspace…', 'info');
  closeAllDropdowns();
});

document.getElementById('dropViewProfile')?.addEventListener('click', () => {
  closeAllDropdowns();
  openModal(`
    <div style="text-align:center;padding:6px 0 16px">
      <div style="width:60px;height:60px;border-radius:14px;background:linear-gradient(135deg,#6C5CE7,#00CEC9);color:#fff;font-size:1.1rem;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">DU</div>
      <div style="font-size:1rem;font-weight:700;color:var(--text)">Demo User</div>
      <div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:2px">demo@demo.io · Business Plan</div>
      <div style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;background:var(--pos-bg);color:var(--pos);padding:4px 12px;border-radius:99px;font-size:0.75rem;font-weight:600">
        <span style="width:6px;height:6px;border-radius:50%;background:var(--pos);display:inline-block"></span> Active
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:0.8rem;color:var(--text-secondary)">Member since</span>
        <span style="font-size:0.8rem;font-weight:600;color:var(--text)">Jan 2024</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:0.8rem;color:var(--text-secondary)">Plan</span>
        <span style="font-size:0.8rem;font-weight:600;color:var(--brand)">Business ⭐</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:10px 0">
        <span style="font-size:0.8rem;color:var(--text-secondary)">Workspace</span>
        <span style="font-size:0.8rem;font-weight:600;color:var(--text)">Marketing</span>
      </div>
    </div>
    <button class="action-btn primary" style="width:100%;justify-content:center;margin-top:16px" onclick="navigateTo('settings');closeModal()">
      Edit Profile
    </button>
  `);
});

document.getElementById('dropSignOut')?.addEventListener('click', () => {
  closeAllDropdowns();
  openModal(`
    <div style="text-align:center;padding:10px 0">
      <div style="font-size:2rem;margin-bottom:12px">👋</div>
      <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;color:var(--text)">Sign out of Demo?</h2>
      <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:22px">You'll need to sign back in to access your dashboard.</p>
      <div style="display:flex;gap:10px">
        <button class="action-btn ghost" style="flex:1;justify-content:center" onclick="closeModal()">Cancel</button>
        <button class="action-btn primary" style="flex:1;justify-content:center" onclick="showToast('Signed out successfully','success');closeModal()">Sign Out</button>
      </div>
    </div>
  `);
});

// ── NOTIFICATION PANEL ─────────────────────────────
const notifBtn   = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');
let unreadCount  = 4;

notifBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  // Close user dropdown
  userDropdown?.classList.remove('open');
  userMenuWrap?.classList.remove('open');
  userProfile?.setAttribute('aria-expanded', 'false');

  const isOpen = notifPanel?.classList.contains('open');
  notifPanel?.classList.toggle('open', !isOpen);
  notifBtn.setAttribute('aria-expanded', String(!isOpen));
});

document.getElementById('markAllRead')?.addEventListener('click', () => {
  // Remove all unread styles
  document.querySelectorAll('.notif-item.is-unread').forEach(el => el.classList.remove('is-unread'));
  document.querySelectorAll('.n-dot').forEach(el => el.remove());
  unreadCount = 0;

  const badge = document.getElementById('notifBadgeCount');
  if (badge) badge.textContent = 'All read';

  // Hide notif dot on bell
  const dot = document.querySelector('.notif-dot');
  if (dot) dot.style.display = 'none';

  showToast('All notifications marked as read', 'success');
  notifPanel?.classList.remove('open');
  notifBtn?.setAttribute('aria-expanded', 'false');
});

// ── SCHEDULE PANEL ─────────────────────────────────
const scheduleBtn     = document.getElementById('scheduleBtn');
const schedulePanelEl = document.getElementById('schedulePanel');
const scheduleOverlay = document.getElementById('scheduleOverlay');
const scheduleClose   = document.getElementById('scheduleClose');

function buildMiniCalendar() {
  const now        = new Date();
  const year       = now.getFullYear();
  const month      = now.getMonth();
  const today      = now.getDate();
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName  = now.toLocaleString('default', { month: 'long' });

  // Update subtitle
  const sub = document.getElementById('schedulePanelMonth');
  if (sub) sub.textContent = `${monthName} ${year}`;

  // Days with events (dummy data)
  const eventDays = new Set([today, today + 1, today + 2, today + 6, today + 7]);

  const wrap = document.getElementById('scheduleCalWrap');
  if (!wrap) return;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let html = `<div class="cal-day-headers">`;
  dayNames.forEach(d => { html += `<div class="cal-day-hdr">${d}</div>`; });
  html += `</div><div class="cal-grid">`;

  // Empty cells before month starts
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday    = d === today;
    const hasEvent   = eventDays.has(d);
    let classes = 'cal-day';
    if (isToday)  classes += ' today';
    if (hasEvent) classes += ' has-event';

    html += `<div class="${classes}" title="${monthName} ${d}">${d}</div>`;
  }

  html += `</div>`;
  wrap.innerHTML = html;
}

function openSchedulePanel() {
  buildMiniCalendar();
  schedulePanelEl?.classList.add('open');
  scheduleOverlay?.classList.add('show');
  document.body.style.overflow = 'hidden';
  closeAllDropdowns();
}

function closeSchedulePanel() {
  schedulePanelEl?.classList.remove('open');
  scheduleOverlay?.classList.remove('show');
  document.body.style.overflow = '';
}

scheduleBtn?.addEventListener('click', () => {
  const isOpen = schedulePanelEl?.classList.contains('open');
  if (isOpen) closeSchedulePanel();
  else openSchedulePanel();
});

scheduleClose?.addEventListener('click', closeSchedulePanel);
scheduleOverlay?.addEventListener('click', closeSchedulePanel);

// ── EXPORT BUTTON ──────────────────────────────────
document.getElementById('exportBtn')?.addEventListener('click', () => {
  openModal(`
    <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;color:var(--text)">Export Dashboard</h2>
    <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:20px">Choose your preferred export format.</p>
    <div style="display:flex;flex-direction:column;gap:10px">
      <button class="action-btn primary" style="justify-content:center" onclick="showToast('Exporting as PDF…','info');closeModal()">
        📄 Export as PDF
      </button>
      <button class="action-btn ghost" style="justify-content:center" onclick="showToast('Exporting as CSV…','info');closeModal()">
        📊 Export as CSV
      </button>
      <button class="action-btn ghost" style="justify-content:center" onclick="showToast('Exporting as PNG…','info');closeModal()">
        🖼️ Export as PNG
      </button>
    </div>
  `);
});

// ── UPGRADE BUTTON ─────────────────────────────────
document.getElementById('upgradeBtn')?.addEventListener('click', () => {
  openModal(`
    <div style="text-align:center;padding:10px 0">
      <div style="width:56px;height:56px;background:linear-gradient(135deg,#6C5CE7,#00CEC9);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:#fff;font-size:1.5rem">✦</div>
      <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:8px;color:var(--text)">Upgrade to Pro</h2>
      <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:20px;line-height:1.6">Unlock advanced analytics, unlimited integrations, and priority support.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:16px 20px;min-width:140px">
          <div style="font-size:1.4rem;font-weight:700;color:var(--text)">R29<span style="font-size:0.8rem;font-weight:400;color:var(--text-secondary)">/mo</span></div>
          <div style="font-size:0.75rem;color:var(--text-tertiary);margin-top:4px">Pro Plan</div>
        </div>
        <div style="background:linear-gradient(135deg,rgba(108,92,231,0.15),rgba(0,206,201,0.1));border:1px solid rgba(108,92,231,0.3);border-radius:12px;padding:16px 20px;min-width:140px">
          <div style="font-size:1.4rem;font-weight:700;color:var(--text)">R79<span style="font-size:0.8rem;font-weight:400;color:var(--text-secondary)">/mo</span></div>
          <div style="font-size:0.75rem;color:var(--brand);font-weight:600;margin-top:4px">Business ⭐</div>
        </div>
      </div>
      <button class="action-btn primary" style="margin-top:20px;width:100%;justify-content:center" onclick="showToast('Redirecting to checkout…','success');closeModal()">
        Get Started — 14-day free trial
      </button>
    </div>
  `);
});

// ── SEE ALL INTEGRATIONS ───────────────────────────
document.getElementById('seeAllBtn')?.addEventListener('click', () => {
  const allIntegrations = [
    { icon: 'S',  cls: 'stripe',  name: 'Stripe',     type: 'Finance',     rate: 40, profit: 'R650.00', pos: true  },
    { icon: 'Z',  cls: 'zapier',  name: 'Zapier',     type: 'CRM',         rate: 80, profit: 'R720.50', pos: true  },
    { icon: 'Sh', cls: 'shopify', name: 'Shopify',    type: 'Marketplace', rate: 20, profit: 'R432.25', pos: false },
    { icon: 'Sl', cls: 'slack',   name: 'Slack',      type: 'Comms',       rate: 65, profit: 'R510.00', pos: true  },
    { icon: 'G',  cls: 'stripe',  name: 'Google Ads', type: 'Marketing',   rate: 55, profit: 'R890.00', pos: true  },
    { icon: 'H',  cls: 'zapier',  name: 'HubSpot',    type: 'CRM',         rate: 72, profit: 'R634.80', pos: true  },
    { icon: 'M',  cls: 'shopify', name: 'Mailchimp',  type: 'Email',       rate: 33, profit: 'R215.40', pos: false },
  ];

  const rows = allIntegrations.map(i => `
    <tr style="border-bottom:1px solid var(--border)">
      <td style="padding:10px"><div style="width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:0.68rem;font-weight:800;background:rgba(108,92,231,0.1);color:#6C5CE7">${i.icon}</div></td>
      <td style="padding:10px;font-weight:600;font-size:0.83rem;color:var(--text)">${i.name}</td>
      <td style="padding:10px;font-size:0.75rem;color:var(--text-secondary)">${i.type}</td>
      <td style="padding:10px;font-size:0.78rem;color:var(--text-secondary)">${i.rate}%</td>
      <td style="padding:10px;font-family:'DM Mono',monospace;font-size:0.8rem;font-weight:600;color:${i.pos ? 'var(--pos)' : 'var(--neg)'}">${i.profit}</td>
    </tr>
  `).join('');

  openModal(`
    <h2 style="font-size:1rem;font-weight:700;margin-bottom:16px;color:var(--text)">All Integrations</h2>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="border-bottom:1px solid var(--border)">
          <th style="padding:8px;text-align:left;font-size:0.68rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em">Icon</th>
          <th style="padding:8px;text-align:left;font-size:0.68rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em">Name</th>
          <th style="padding:8px;text-align:left;font-size:0.68rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em">Type</th>
          <th style="padding:8px;text-align:left;font-size:0.68rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em">Rate</th>
          <th style="padding:8px;text-align:left;font-size:0.68rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em">Profit</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <button class="action-btn primary" style="width:100%;justify-content:center;margin-top:14px" onclick="showToast('Adding new integration…','info');closeModal()">
      + Add Integration
    </button>
  `);
});

// ── DATE RANGE BUTTON ──────────────────────────────
document.getElementById('dateRangeBtn')?.addEventListener('click', () => {
  showToast('Date range picker coming soon!', 'info');
});

// ── TOGGLE SWITCHES (Settings) ─────────────────────
document.querySelectorAll('.toggle-switch').forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    if (toggle.id === 'settingsDarkToggle') {
      applyTheme(toggle.classList.contains('active') ? 'dark' : 'light');
    } else if (toggle.id === 'emailNotifToggle') {
      showToast(toggle.classList.contains('active') ? 'Email notifications on' : 'Email notifications off', 'info');
    } else if (toggle.id === 'twoFAToggle') {
      showToast(toggle.classList.contains('active') ? '2FA enabled' : '2FA disabled', toggle.classList.contains('active') ? 'success' : 'info');
    }
  });
});

// ── SEARCH INPUT ───────────────────────────────────
let searchDebounce;
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  clearTimeout(searchDebounce);
  if (!e.target.value.trim()) return;
  searchDebounce = setTimeout(() => {
    showToast(`Searching for "${e.target.value}"…`, 'info');
  }, 600);
});

// ── KEYBOARD SHORTCUTS ─────────────────────────────
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
    e.preventDefault();
    document.getElementById('searchInput')?.focus();
  }
  if (e.key === 'Escape') {
    if (modalOverlay.classList.contains('open')) {
      closeModal();
    } else if (schedulePanelEl?.classList.contains('open')) {
      closeSchedulePanel();
    } else {
      closeAllDropdowns();
      closeSidebar();
    }
  }
});

// ── LIVE STATS TICKER ──────────────────────────────
function liveUpdate() {
  document.querySelectorAll('.stat-value[data-count]').forEach(el => {
    const base  = parseFloat(el.dataset.count);
    const delta = (Math.random() - 0.5) * base * 0.002;
    const newVal = base + delta;
    el.dataset.count = newVal.toFixed(2);

    el.style.transition = 'color 0.3s ease';
    el.style.color = delta > 0 ? 'var(--pos)' : 'var(--neg)';
    setTimeout(() => { el.style.color = ''; }, 600);
  });
}

setInterval(liveUpdate, 6000);

// ── INITIALISE SETTINGS DARK TOGGLE STATE ─────────
if (settingsDarkToggle) {
  settingsDarkToggle.classList.toggle('active', getTheme() === 'dark');
}

// ── WINDOW RESIZE — redraw charts ──────────────────
window.addEventListener('resize', () => {
  salesChart?.resize();
  subChart?.resize();
  donutChart?.resize();
});

// ── EXPOSE HELPERS FOR INLINE onclick ─────────────
window.showToast    = showToast;
window.closeModal   = closeModal;
window.navigateTo   = navigateTo;
window.closeAllDropdowns = closeAllDropdowns;
