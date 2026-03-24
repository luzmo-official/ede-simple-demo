/** Edit modes supported by `luzmo-embed-dashboard` (see Luzmo embed docs). */
export type DashboardEditMode = 'view' | 'editFull' | 'editLimited';

/** API response from `GET /authorization` on success. */
export interface AuthorizationResponse {
  id: string;
  token: string;
}

/** Minimal dashboard entry returned by `getAccessibleDashboards()`. */
export interface AccessibleDashboard {
  id: string;
  name?: string;
  slug?: string;
}
