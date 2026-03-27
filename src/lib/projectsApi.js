/**
 * Projects API – fetch from backend (proxied to /api by Vite).
 * Run npm run server for live data.
 */

const BASE = '/api/projects';

export async function fetchProjects() {
  const res = await fetch(BASE);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error || res.statusText, data: [] };
  }
  const data = await res.json();
  return { ok: true, data: Array.isArray(data) ? data : [] };
}

export async function fetchProjectBySlug(slug) {
  const res = await fetch(`${BASE}/${encodeURIComponent(slug)}`);
  if (res.status === 404) return { ok: false, error: 'Not found', data: null };
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error || res.statusText, data: null };
  }
  const data = await res.json();
  return { ok: true, data };
}

export async function createProject(formData, options = {}) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formData, options }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error || res.statusText, data: null };
  }
  const data = await res.json();
  return { ok: true, data };
}

export async function deleteProject(slug) {
  const res = await fetch(`${BASE}/${encodeURIComponent(slug)}`, { method: 'DELETE' });
  if (res.status === 404) return { ok: false, error: 'Not found' };
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error || res.statusText };
  }
  return { ok: true };
}
