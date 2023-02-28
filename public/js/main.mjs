/* eslint-disable no-undef */
// if you want to control icons per slug -> add options
import {populateMenu, setUserDetails} from './ui.mjs';

export const dashboardElement = document.querySelector('cumulio-dashboard');
// Do a request to our backend (see server.js) to retrieve an SSO key and token.
const getDashboardAuthorizationToken = async () => {
  // Get the platform access credentials from the current logged in user
  const accessCredentials = await auth0.getTokenSilently();
  //Request Cumul.io Authorization token using accessCredentials
  const response = await fetch('/authorization', {
    headers: new Headers({
      Authorization: `Bearer ${accessCredentials}`,
    }),
  });
  const parsedResponse =  await response.json();
  // We can now set the key and token to the dashboard component.
  dashboardElement.authKey = parsedResponse.id;
  dashboardElement.authToken = parsedResponse.token;
  // retrieve the accessible dashboards from the Integration
  const dashboards = await dashboardElement.getAccessibleDashboards();
  populateMenu(dashboards);
  return parsedResponse;

};
// loads the user interface
const initUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();
  if (isAuthenticated) {
    const user = await auth0.getUser();
    setUserDetails(user);
    document
      .getElementById('gated-content')
      .style.setProperty('display', 'flex', 'important');
    getDashboardAuthorizationToken();
    document.getElementById('loader').setAttribute('hidden', true);
  } else {
    login();
  }
};

// on page load
window.onload = async () => {
  await configureClient();
  const isAuthenticated = await auth0.isAuthenticated();

  // If is logged in -> init UI
  if (isAuthenticated) {
    return initUI();
  }

  const query = window.location.search;
  // If redirected from login
  if (query.includes('code=') && query.includes('state=')) {
    // Process the login state
    await auth0.handleRedirectCallback();
    // Set app state based on login
    initUI();
    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, '/');
  }
  // If not logged in not redirected
  else {
    initUI();
  }
};

/* Authentication configuration */
let auth0 = null;
const fetchAuthConfig = () => fetch('/auth_config.json');
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();
  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    audience: config.audience,
  });
};

// login function
const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin,
  });
};

document.getElementById('logout-button').onclick =  function(){logout();};

// logout function
function logout() {
  auth0.logout({
    returnTo: window.location.origin,
  });
}