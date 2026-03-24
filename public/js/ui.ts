import type { AccessibleDashboard, DashboardEditMode } from './types';
import { dashboardElement } from './dashboard';

const slugToIcon: Record<string, string> = {
  home: 'fa-home',
  sample: 'fa-lightbulb',
};

const fallbackIcons = ['fa-chart-line', 'fa-chart-pie', 'fa-lightbulb'] as const;

export let currentMode: DashboardEditMode = 'view';

export function setMode(requestedEditMode: DashboardEditMode): void {
  if (!['view', 'editFull', 'editLimited'].includes(requestedEditMode)) return;
  if (currentMode === requestedEditMode) return;

  dashboardElement
    .setEditMode(requestedEditMode)
    .then(() => {
      setModeButtons(requestedEditMode);
      currentMode = requestedEditMode;
    })
    .catch((e: unknown) => {
      const msg =
        e !== null && typeof e === 'object' && 'msg' in e
          ? String((e as { msg?: unknown }).msg)
          : String(e);
      console.log(msg);
      setModeButtons('unauthorized');
    });
}

export function populateMenu(dashboards: AccessibleDashboard[]): void {
  const menu = document.getElementById('dashboard-menu');
  if (!menu) return;

  if (dashboards.length > 0) {
    const first = dashboards[0];
    if (first) {
      dashboardElement.dashboardId = first.id;
    }
    dashboards.forEach((dashboard, i) => {
      const newOption = document.createElement('li');
      if (i === 0) newOption.classList.toggle('active');
      const localizedName = dashboard.name;
      const iconClass =
        slugToIcon[dashboard.slug ?? ''] ?? fallbackIcons[i % fallbackIcons.length];
      newOption.innerHTML = `
                <i class="fa fa-fw ${iconClass}"></i>
                <span class="text-truncate">${localizedName ? localizedName : 'Dashboard -' + i}</span>
              `;
      newOption.onclick = () => {
        dashboardElement.dashboardId = dashboard.id;
        const options = Array.from(menu.querySelectorAll('li'));
        for (const option of options) {
          if (option.isSameNode(newOption)) option.classList.add('active');
          else option.classList.remove('active');
        }
      };
      menu.appendChild(newOption);
    });
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
    toggleEdit.innerText = 'Mode Change Unauthorized';
    return;
  }
  if (requestedEditMode === 'view') {
    toggleEdit.innerText = 'To Editor Mode';
    picker.style.display = 'none';
  } else {
    toggleEdit.innerText = 'To Viewer Mode';
    picker.style.display = 'flex';
    if (requestedEditMode === 'editFull') {
      limitedBtn.classList.remove('active');
      fullBtn.classList.add('active');
    } else if (requestedEditMode === 'editLimited') {
      limitedBtn.classList.add('active');
      fullBtn.classList.remove('active');
    }
  }
}

function wireModeControls(): void {
  const toggleEdit = document.getElementById('toggle-edit-mode');
  const limitedBtn = document.getElementById('toggle-edit-limited-mode');
  const fullBtn = document.getElementById('toggle-edit-full-mode');
  if (!toggleEdit || !limitedBtn || !fullBtn) return;

  toggleEdit.onclick = () => {
    if (currentMode === 'view') setMode('editFull');
    else setMode('view');
  };

  limitedBtn.onclick = () => {
    setMode('editLimited');
  };

  fullBtn.onclick = () => {
    setMode('editFull');
  };
}

wireModeControls();
