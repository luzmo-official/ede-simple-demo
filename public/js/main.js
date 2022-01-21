/* eslint-disable no-undef */
// if you want to control icons per slug -> add options
const slugToIcon = {
  'home': 'fa-home',
  'sample': 'fa-lightbulb'
};
const dashboardElement = document.querySelector('cumulio-dashboard');
let editMode = null;
let currentMode = null;

setEditMode = (requestedEditMode) => {
  if (requestedEditMode === 'editFull') {
    editMode = 'editFull';
    document.getElementById('edit-mode-switcher').innerText = 'Full edit mode';
  }
  else if (requestedEditMode === 'editLimited') {
    editMode = 'editLimited';
    document.getElementById('edit-mode-switcher').innerText = 'Limited edit mode';
  }
};

setCurrentMode = (requestedEditMode) => {
  if (!['view', 'editFull', 'editLimited'].includes(requestedEditMode)) return;

  if (requestedEditMode === 'view') document.getElementById('toggle-edit-mode').innerText = 'To editor mode';
  else document.getElementById('toggle-edit-mode').innerText = 'To view mode';

  if (currentMode !== requestedEditMode) dashboardElement.setEditMode(requestedEditMode);
  currentMode = requestedEditMode;
};

setTimeout(() => {
  // Read currentMode from webcomponent
  currentMode = dashboardElement.editMode;
  if (currentMode === 'editFull' | currentMode === 'editLimited') setEditMode(currentMode);
  else setEditMode('editFull');

  setCurrentMode(currentMode);
}, 150);

// Switch to editor
document.getElementById('toggle-edit-mode').onclick = () => {
  if (currentMode === 'view') setCurrentMode(editMode);
  else setCurrentMode('view');
};

document.getElementById('edit-mode-switcher').onclick = () => {
  if (editMode === 'editFull') setEditMode('editLimited');
  else if (editMode === 'editLimited') setEditMode('editFull');
};

// Do a request to our backend (see server.js) to retrieve an SSO key and token.
fetch('/authorization')
  .then((response) => response.json())
  .then((response) => {
    const key = response.id;
    const token = response.token;
    // We can now set the key and token to the dashboard component.
    dashboardElement.authKey = key;
    dashboardElement.authToken = token;
    // retrieve the accessible dashboards from the Integration
    dashboardElement.getAccessibleDashboards()
      .then(dashboards => {
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
      });
  });

