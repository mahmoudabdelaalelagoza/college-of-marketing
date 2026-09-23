import { dashboardRequest } from './api';

export interface CmsResourceOption {
  id: string;
  label: string;
}

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
