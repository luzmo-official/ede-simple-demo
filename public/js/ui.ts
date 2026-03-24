import type { AccessibleDashboard, DashboardEditMode } from './types';
import { dashboardElement } from './dashboard';

const FALLBACK_ICONS = [
  '<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>',
  '<path d="M11 2v20c5.52 0 10-4.48 10-10S16.52 2 11 2zm2 18.93V12h4.97A8.01 8.01 0 0 1 13 20.93zM13 10V3.07A8.01 8.01 0 0 1 17.97 10H13z"/>',
  '<path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>',
] as const;

const HOME_ICON = '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>';

let currentMode: DashboardEditMode = 'view';
let lastEditMode: DashboardEditMode = 'editFull';

/** Creates an SVG icon element from an SVG inner path string. */
function svgIcon(pathContent: string): string {
  return `<svg class="sidebar__icon" viewBox="0 0 24 24" aria-hidden="true">${pathContent}</svg>`;
}

export function setMode(requestedEditMode: DashboardEditMode): void {
  if (!['view', 'editFull', 'editLimited'].includes(requestedEditMode)) return;
  if (currentMode === requestedEditMode) return;

  dashboardElement
    .setEditMode(requestedEditMode)
    .then(() => {
      setModeButtons(requestedEditMode);
      currentMode = requestedEditMode;
      if (requestedEditMode !== 'view') {
        lastEditMode = requestedEditMode;
      }
    })
    .catch((e: unknown) => {
      const msg =
        e !== null && typeof e === 'object' && 'msg' in e
          ? String((e as { msg?: unknown }).msg)
          : String(e);
      console.warn('[setMode]', msg);
      setModeButtons('unauthorized');
    });
}

export function populateMenu(dashboards: AccessibleDashboard[]): void {
  const menu = document.getElementById('dashboard-menu');
  if (!menu) return;

  if (dashboards.length === 0) return;

  const first = dashboards[0];
  if (first) {
    dashboardElement.dashboardId = first.id;
  }

  dashboards.forEach((dashboard, i) => {
    const li = document.createElement('li');
    li.className = `sidebar__item${i === 0 ? ' active' : ''}`;
    li.tabIndex = 0;
    li.setAttribute('role', 'menuitem');

    const iconPath = i === 0
      ? HOME_ICON
      : FALLBACK_ICONS[i % FALLBACK_ICONS.length];
    const name = dashboard.name ?? `Dashboard ${i + 1}`;

    li.innerHTML = `${svgIcon(iconPath)}<span>${name}</span>`;

    li.addEventListener('click', () => selectDashboard(menu, li, dashboard.id));
    li.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectDashboard(menu, li, dashboard.id);
      }
    });

    menu.appendChild(li);
  });
}

function selectDashboard(menu: HTMLElement, active: HTMLElement, id: string): void {
  dashboardElement.dashboardId = id;
  for (const item of Array.from(menu.querySelectorAll('.sidebar__item'))) {
    item.classList.toggle('active', item === active);
  }

  if (currentMode !== 'view') {
    const modeToRestore = currentMode;
    dashboardElement.addEventListener(
      'load',
      () => {
        dashboardElement.setEditMode(modeToRestore).catch((e: unknown) => {
          const msg =
            e !== null && typeof e === 'object' && 'msg' in e
              ? String((e as { msg?: unknown }).msg)
              : String(e);
          console.warn('[selectDashboard]', msg);
          setModeButtons('unauthorized');
        });
      },
      { once: true }
    );
  }
}

export function setModeButtons(
  requestedEditMode: DashboardEditMode | 'unauthorized'
): void {
  const toggleEdit = document.getElementById('toggle-edit-mode');
  const picker = document.getElementById('edit-mode-picker');
  const limitedBtn = document.getElementById('toggle-edit-limited-mode');
  const fullBtn = document.getElementById('toggle-edit-full-mode');
  if (!toggleEdit || !picker || !limitedBtn || !fullBtn) return;

  if (requestedEditMode === 'unauthorized') {
    toggleEdit.textContent = 'Mode Change Unauthorized';
    return;
  }

  if (requestedEditMode === 'view') {
    toggleEdit.textContent = 'To Edit Mode';
    picker.classList.remove('sidebar__mode-picker--visible');
  } else {
    toggleEdit.textContent = 'To View Mode';
    picker.classList.add('sidebar__mode-picker--visible');
    fullBtn.classList.toggle('active', requestedEditMode === 'editFull');
    limitedBtn.classList.toggle('active', requestedEditMode === 'editLimited');
  }
}

function wireModeControls(): void {
  const toggleEdit = document.getElementById('toggle-edit-mode');
  const limitedBtn = document.getElementById('toggle-edit-limited-mode');
  const fullBtn = document.getElementById('toggle-edit-full-mode');
  if (!toggleEdit || !limitedBtn || !fullBtn) return;

  toggleEdit.addEventListener('click', () => {
    setMode(currentMode === 'view' ? lastEditMode : 'view');
  });
  limitedBtn.addEventListener('click', () => setMode('editLimited'));
  fullBtn.addEventListener('click', () => setMode('editFull'));
}

wireModeControls();
