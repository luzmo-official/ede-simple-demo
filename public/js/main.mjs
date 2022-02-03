/* eslint-disable no-undef */
// if you want to control icons per slug -> add options
import {populateMenu, setModeButtons} from './ui.mjs';

export const dashboardElement = document.querySelector('cumulio-dashboard');

export let currentMode = 'view';

export const setMode = (requestedEditMode) => {
  if (!['view', 'editFull', 'editLimited'].includes(requestedEditMode)) return;
  if (currentMode !== requestedEditMode){
    dashboardElement.setEditMode(requestedEditMode).then(() => {
      setModeButtons(requestedEditMode);
      currentMode = requestedEditMode;
    }).catch(e => {
      console.log(e.msg);
      setModeButtons('unauthorized');
    });
  } 
};

// Do a request to our backend (see server.js) to retrieve an SSO key and token.
fetch('/authorization')
  .then(async (response) => {
    const parsedResponse =  await response.json();
    // We can now set the key and token to the dashboard component.
    dashboardElement.authKey = parsedResponse.id;
    dashboardElement.authToken = parsedResponse.token;
    // retrieve the accessible dashboards from the Integration
    dashboardElement.getAccessibleDashboards()
      .then(dashboards => {
        populateMenu(dashboards);
      });
  });