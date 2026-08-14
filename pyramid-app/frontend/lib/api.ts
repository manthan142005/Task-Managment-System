const BASE = '/api';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  guestLogin: () => request('/auth/guest', { method: 'POST' }),
  me: () => request('/users/me'),
  updateProfile: (data: any) => request('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
  updateTheme: (data: any) => request('/users/me/theme', { method: 'PATCH', body: JSON.stringify(data) }),
  users: () => request('/users'),

  projects: () => request('/projects'),
  project: (id: string) => request(`/projects/${id}`),
  createProject: (data: any) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),

  tasks: (params: { projectId?: string; status?: string; search?: string } = {}) => {
    const qs = new URLSearchParams(params as any).toString();
    return request(`/tasks${qs ? `?${qs}` : ''}`);
  },
  task: (id: string) => request(`/tasks/${id}`),
  createTask: (data: any) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: any) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' }),
  addComment: (id: string, content: string) =>
    request(`/tasks/${id}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
  setMembers: (id: string, memberIds: string[]) =>
    request(`/tasks/${id}/members`, { method: 'PATCH', body: JSON.stringify({ memberIds }) }),
  setLabels: (id: string, labels: string[]) =>
    request(`/tasks/${id}/labels`, { method: 'PATCH', body: JSON.stringify({ labels }) }),
};
