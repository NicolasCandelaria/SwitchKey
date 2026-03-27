const AUTH_KEY = 'switchkey_user';
const TERMS_VERSION = '1.0';

export function getUser() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(data) {
  const user = {
    ...data,
    userId: data.userId || `user-${Date.now()}`,
    acceptedTermsVersion: data.acceptedTermsVersion ?? TERMS_VERSION,
    acceptedTermsAt: data.acceptedTermsAt ?? new Date().toISOString(),
  };
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function clearUser() {
  sessionStorage.removeItem(AUTH_KEY);
}

const PROFILE_FIELDS = ['firstName', 'lastName', 'email', 'location'];

export function getProfileProgress(user) {
  if (!user) return 0;
  const filled = PROFILE_FIELDS.filter((f) => (user[f] || '').toString().trim() !== '').length;
  return Math.round((filled / PROFILE_FIELDS.length) * 100);
}

export { TERMS_VERSION };
