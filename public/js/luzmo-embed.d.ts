import type { AccessibleDashboard, DashboardEditMode } from './types';

/**
 * Custom element `<luzmo-embed-dashboard>` from `@luzmo/embed`.
 * Property names follow the web component API used by this demo.
 */
export interface LuzmoEmbedDashboardElement extends HTMLElement {
  authKey: string;
  authToken: string;
  dashboardId: string;
  getAccessibleDashboards(): Promise<AccessibleDashboard[]>;
  setEditMode(mode: DashboardEditMode): Promise<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'luzmo-embed-dashboard': LuzmoEmbedDashboardElement;
  }
}

export {};
