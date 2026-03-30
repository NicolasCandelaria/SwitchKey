import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { NON_BINDING_NOTICE } from '../shared/nonBindingNotice.js';

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDueDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function smtpConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function publicAppUrl() {
  return (process.env.PUBLIC_APP_URL || 'http://localhost:5173').replace(/\/$/, '');
}

/**
 * @param {object} params
 * @returns {{ vrfToken: string, vrfUrl: string, emailSent: boolean, simulated: boolean, smtpDeliveryFailed: boolean }}
 */
export async function sendRoleInvitationMail({
  toEmail,
  inviteeName,
  projectName,
  canonicalProductDescription,
  roleLabel,
  dueDate,
  requestId,
}) {
  const vrfToken = crypto.randomBytes(32).toString('base64url');
  const vrfUrl = `${publicAppUrl()}/invite/vrf?token=${encodeURIComponent(vrfToken)}`;

  const subject = `SwitchKey — Role invitation: ${projectName}`;
  const desc = canonicalProductDescription?.trim() || '—';
  const dueLine = formatDueDate(dueDate);

  const text = [
    `Hello ${inviteeName},`,
    '',
    `You've been invited to review a role on project "${projectName}".`,
    '',
    'Project name',
    projectName,
    '',
    'Canonical product description (read-only)',
    desc,
    '',
    'Role',
    roleLabel,
    '',
    'Due date',
    dueLine,
    '',
    'VRF link (tokenized)',
    vrfUrl,
    '',
    'Non-binding notice',
    NON_BINDING_NOTICE,
    '',
    `Reference: ${requestId}`,
    '',
    '— SwitchKey',
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
  <p>Hello ${escapeHtml(inviteeName)},</p>
  <p>You've been invited to review a role on project <strong>${escapeHtml(projectName)}</strong>.</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 1.25rem 0;" />
  <p><strong>Project name</strong></p>
  <p>${escapeHtml(projectName)}</p>
  <p><strong>Canonical product description (read-only)</strong></p>
  <p style="white-space: pre-wrap;">${escapeHtml(desc)}</p>
  <p><strong>Role</strong></p>
  <p>${escapeHtml(roleLabel)}</p>
  <p><strong>Due date</strong></p>
  <p>${escapeHtml(dueLine)}</p>
  <p><strong>VRF link (tokenized)</strong></p>
  <p><a href="${escapeHtml(vrfUrl)}">${escapeHtml(vrfUrl)}</a></p>
  <p><strong>Non-binding notice</strong></p>
  <p style="font-size: 0.9rem; color: #4b5563;">${escapeHtml(NON_BINDING_NOTICE)}</p>
  <p style="font-size: 0.75rem; color: #9ca3af;">Reference: ${escapeHtml(requestId)}</p>
  <p>— SwitchKey</p>
</body>
</html>`.trim();

  if (!smtpConfigured()) {
    console.log('[invitations] SMTP not configured — email body (simulated):\n', text);
    return { vrfToken, vrfUrl, emailSent: false, simulated: true, smtpDeliveryFailed: false };
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === '1' || port === 465;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  /** Port 587 uses STARTTLS (upgrade); 465 uses implicit TLS. */
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure && port === 587,
    connectionTimeout: 30_000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    ...(process.env.SMTP_DEBUG === '1' ? { debug: true, logger: console } : {}),
  });

  try {
    await transporter.sendMail({
      from,
      to: toEmail,
      subject,
      text,
      html,
    });
    return { vrfToken, vrfUrl, emailSent: true, simulated: false, smtpDeliveryFailed: false };
  } catch (err) {
    console.error('[invitations] SMTP send failed (request still saved on client):', err.message);
    console.log('[invitations] Fallback — email body that was not delivered:\n', text);
    return {
      vrfToken,
      vrfUrl,
      emailSent: false,
      simulated: true,
      smtpDeliveryFailed: true,
    };
  }
}
