/**
 * Payment provider config from env.
 * Prefer Stripe for earnings/payouts; Escrow.com for escrow.
 * Never put secret keys in the frontend – use a backend for payouts.
 */
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
export const escrowApiKey = import.meta.env.VITE_ESCROW_API_KEY || '';

export const isStripeConfigured = Boolean(stripePublishableKey);
export const isEscrowConfigured = Boolean(escrowApiKey);

/** Preferred payment for earnings: Stripe */
export const preferredPaymentProvider = 'stripe';
