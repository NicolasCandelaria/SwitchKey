/**
 * Fetch Stripe balance and Escrow.com transactions from our API server.
 * The dev server proxies /api to the backend (see vite.config.js).
 */

export async function fetchStripeBalance() {
  const res = await fetch('/api/stripe/balance');
  if (res.status === 503) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, code: data.code || 'not_configured', data: null };
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error || res.statusText, data: null };
  }
  const data = await res.json();
  return { ok: true, data };
}

export async function fetchEscrowTransactions() {
  const res = await fetch('/api/escrow/transactions');
  if (res.status === 503) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, code: data.code || 'not_configured', data: null };
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error || res.statusText, data: null };
  }
  const data = await res.json();
  return { ok: true, data };
}
