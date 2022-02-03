import { dashboardElement, currentMode, setMode } from './main.mjs';

const slugToIcon = {
  home: 'fa-home',
  sample: 'fa-lightbulb',
};

export function populateMenu(dashboards) {
  const menu = document.getElementById('dashboard-menu');
  if (dashboards.length > 0) {
    dashboardElement.dashboardId = dashboards[0].id;
    dashboards.forEach((dashboard, i) => {
      const newOption = document.createElement('li');
      if (i === 0) newOption.classList.toggle('active');
      const localizedName = dashboard.name;
      newOption.innerHTML = `
                <i class="fa fa-fw ${slugToIcon[dashboard.slug] || ['fa-chart-line', 'fa-chart-pie', 'fa-lightbulb'][i % 3]}"></i>
                <span class="text-truncate">${localizedName ? localizedName : 'Dashboard -' + i}</span>
              `;
      newOption.onclick = () => {
        dashboardElement.dashboardId = dashboard.id;
        const options = menu.querySelectorAll('li');
        for (const option of options) {
          if (option.isSameNode(newOption)) option.classList.add('active');
          else option.classList.remove('active');
        }
      };
      menu.appendChild(newOption);
    });
  }
}

export function setModeButtons(requestedEditMode){
  if(requestedEditMode === 'unauthorized'){
    document.getElementById('toggle-edit-mode').innerText = 'Mode Change Unauthorized';
    return;
  }
  if (requestedEditMode === 'view') {
    document.getElementById('toggle-edit-mode').innerText = 'To Editor Mode';
    document.getElementById('edit-mode-picker').style.display = 'none';
  } 
  else{
    document.getElementById('toggle-edit-mode').innerText = 'To Viewer Mode';
    document.getElementById('edit-mode-picker').style.display = 'flex';
    if (requestedEditMode === 'editFull') {
      document.getElementById('toggle-edit-limited-mode').classList.remove('active');
      document.getElementById('toggle-edit-full-mode').classList.add('active');
    }
    else if (requestedEditMode === 'editLimited') {
      document.getElementById('toggle-edit-limited-mode').classList.add('active');
      document.getElementById('toggle-edit-full-mode').classList.remove('active');
    }
  } 
}

document.getElementById('toggle-edit-mode').onclick = () => {
  if (currentMode === 'view') setMode('editFull');
  else setMode('view');
};


document.getElementById('toggle-edit-limited-mode').onclick = () => {
  setMode('editLimited');
};

document.getElementById('toggle-edit-full-mode').onclick = () => {
  setMode('editFull');
};
