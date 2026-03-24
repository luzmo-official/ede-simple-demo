import { dashboardElement } from './dashboard';
import { populateMenu } from './ui';
import type { AuthorizationResponse } from './types';

function isAuthorizationResponse(value: unknown): value is AuthorizationResponse {
  if (value === null || typeof value !== 'object') return false;
  const o = value as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.token === 'string';
}

fetch('/authorization')
  .then(async (response) => {
    const parsedResponse: unknown = await response.json();
    if (!isAuthorizationResponse(parsedResponse)) {
      console.error('Unexpected /authorization response shape', parsedResponse);
      return;
    }
    dashboardElement.authKey = parsedResponse.id;
    dashboardElement.authToken = parsedResponse.token;
    return dashboardElement.getAccessibleDashboards();
  })
  .then((dashboards) => {
    if (dashboards) {
      populateMenu(dashboards);
    }
  })
  .catch((err: unknown) => {
    console.error(err);
  });
