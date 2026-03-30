/**
 * Role invitation emails (proxied to API server when `npm run server` is running).
 */

const BASE = '/api/invitations';

/**
 * @param {{
 *   toEmail: string;
 *   inviteeName: string;
 *   projectName: string;
 *   canonicalProductDescription: string;
 *   roleLabel: string;
 *   dueDate: string;
 *   requestId: string;
 * }} payload
 */
export async function sendRoleInvitationEmail(payload) {
  const res = await fetch(`${BASE}/send-role-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: data.error || res.statusText || 'Request failed',
      data: null,
    };
  }
  return {
    ok: true,
    data: {
      vrfToken: data.vrfToken,
      vrfUrl: data.vrfUrl,
      emailSent: data.emailSent,
      simulated: data.simulated,
      smtpDeliveryFailed: Boolean(data.smtpDeliveryFailed),
    },
  };
}
