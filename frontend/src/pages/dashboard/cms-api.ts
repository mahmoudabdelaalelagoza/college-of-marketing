import { dashboardRequest } from './api';

export interface CmsResourceOption {
  id: string;
  label: string;
  icon: string;
}

export const cmsResourceOptions: CmsResourceOption[] = [
  { id: 'articles', label: 'Articles', icon: 'ri-article-line' },
  { id: 'case-studies', label: 'Case Studies', icon: 'ri-briefcase-4-line' },
  { id: 'testimonials', label: 'Testimonials', icon: 'ri-chat-quote-line' },
  { id: 'events', label: 'Events', icon: 'ri-calendar-event-line' },
  { id: 'short-courses', label: 'Short Courses', icon: 'ri-graduation-cap-line' },
  { id: 'people', label: 'People', icon: 'ri-team-line' },
  { id: 'partners', label: 'Partners', icon: 'ri-handshake-line' },
  { id: 'media', label: 'Media', icon: 'ri-image-line' },
  { id: 'page-sections', label: 'Pages & Sections', icon: 'ri-layout-3-line' },
  { id: 'knowledge-sources', label: 'Knowledge Sources', icon: 'ri-book-open-line' },
  { id: 'settings', label: 'Site Settings', icon: 'ri-settings-3-line' },
];

export interface CmsItem {
  id?: string;
  [key: string]: unknown;
}

export async function getCmsResources() {
  return dashboardRequest<{ resources: CmsResourceOption[] }>('/api/dashboard/cms?resource=resources');
}

export async function getCmsItems(resource: string, q = '') {
  const params = new URLSearchParams({ resource });
  if (q) params.set('q', q);
  return dashboardRequest<{ resource: string; items: CmsItem[] }>(`/api/dashboard/cms?${params.toString()}`);
}

export async function createCmsItem(resource: string, item: CmsItem) {
  return dashboardRequest<{ item: CmsItem }>('/api/dashboard/cms', {
    method: 'POST',
    body: JSON.stringify({ resource, item }),
  });
}

export async function updateCmsItem(resource: string, id: string, item: CmsItem, action?: string) {
  return dashboardRequest<{ item: CmsItem }>('/api/dashboard/cms', {
    method: 'PATCH',
    body: JSON.stringify({ resource, id, item, action }),
  });
}

export async function deleteCmsItem(resource: string, id: string) {
  const params = new URLSearchParams({ resource, id });
  return dashboardRequest<{ ok: boolean }>(`/api/dashboard/cms?${params.toString()}`, { method: 'DELETE' });
}

