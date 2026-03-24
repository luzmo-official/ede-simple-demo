import type { LuzmoEmbedDashboardElement } from './luzmo-embed';

function getDashboardElement(): LuzmoEmbedDashboardElement {
  const el = document.querySelector('luzmo-embed-dashboard');
  if (!el) {
    throw new Error('Missing required element <luzmo-embed-dashboard>');
  }
  return el;
}

/** Lazily resolved so a missing element throws at first use (clearer than silent null). */
export const dashboardElement: LuzmoEmbedDashboardElement = getDashboardElement();
