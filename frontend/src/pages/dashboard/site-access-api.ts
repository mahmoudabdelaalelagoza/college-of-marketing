import { dashboardRequest } from './api';

export interface SiteAccessSettings {
  maintenance_enabled: boolean;
  has_preview_pin: boolean;
  title: string;
  message: string;
  updated_at: string | null;
}

export function getSiteAccessSettings() {
  return dashboardRequest<{ settings: SiteAccessSettings }>('/api/dashboard/site-access');
}

export function saveSiteAccessSettings(settings: Record<string, unknown>) {
  return dashboardRequest<{ settings: SiteAccessSettings }>('/api/dashboard/site-access', {
    method: 'POST',
    body: JSON.stringify({ settings }),
  });
}
