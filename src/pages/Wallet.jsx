import { useState, useEffect } from 'react';
import { isStripeConfigured, isEscrowConfigured, preferredPaymentProvider } from '../lib/paymentConfig';
import { fetchStripeBalance, fetchEscrowTransactions } from '../lib/paymentApi';
import './Wallet.css';

const MOCK_EARNINGS = {
  available: 1240.5,
  pending: 380.0,
  paidOut: 5620.0,
};

const MOCK_TRANSACTIONS = [
  { id: '1', description: 'VideoNow – Design review', amount: 420.0, status: 'paid', date: '2025-03-05' },
  { id: '2', description: 'Tooth Tunes – BOM approval', amount: 380.0, status: 'pending', date: '2025-03-08' },
  { id: '3', description: 'ZoomBox – Final deliverable', amount: 580.5, status: 'paid', date: '2025-03-01' },
  { id: '4', description: 'Pixel Play – Phase 1', amount: 440.0, status: 'paid', date: '2025-02-28' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function Wallet() {
  const stripeConnected = isStripeConfigured;
  const escrowConnected = isEscrowConfigured;

  const [stripeBalance, setStripeBalance] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  const [escrowData, setEscrowData] = useState(null);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [escrowError, setEscrowError] = useState(null);

  useEffect(() => {
    setStripeLoading(true);
    setStripeError(null);
    fetchStripeBalance()
      .then(({ ok, data, error, code }) => {
        if (ok) setStripeBalance(data);
        else if (code !== 'STRIPE_NOT_CONFIGURED') setStripeError(error || 'Failed to load');
      })
      .catch((err) => setStripeError(err.message))
      .finally(() => setStripeLoading(false));
  }, []);

  useEffect(() => {
    setEscrowLoading(true);
    setEscrowError(null);
    fetchEscrowTransactions()
      .then(({ ok, data, error, code }) => {
        if (ok) setEscrowData(data);
        else if (code !== 'ESCROW_NOT_CONFIGURED') setEscrowError(error || 'Failed to load');
      })
      .catch((err) => setEscrowError(err.message))
      .finally(() => setEscrowLoading(false));
  }, []);

  const earnings = stripeBalance
    ? {
        available: stripeBalance.available ?? 0,
        pending: stripeBalance.pending ?? 0,
        paidOut: MOCK_EARNINGS.paidOut,
      }
    : MOCK_EARNINGS;

  const transactions = escrowData?.transactions?.length
    ? escrowData.transactions.slice(0, 10).map((t) => {
        const firstSchedule = t.items?.[0]?.schedule?.[0];
        const amount = firstSchedule ? parseFloat(firstSchedule.amount || 0) : 0;
        return {
          id: String(t.id),
          description: t.description || `Transaction #${t.id}`,
          amount,
          status: t.close_date ? 'paid' : 'pending',
          date: formatDate(t.creation_date),
        };
      })
    : MOCK_TRANSACTIONS;

  return (
    <div className="wallet-page">
      <header className="wallet-header">
        <h1 className="wallet-title">Wallet</h1>
      </header>

      <section className="wallet-section">
        <h2 className="wallet-section-title">My earnings</h2>
        {stripeLoading && (
          <p className="wallet-loading">Loading Stripe balance…</p>
        )}
        {stripeError && (
          <p className="wallet-error">Stripe: {stripeError}</p>
        )}
        <div className="wallet-cards">
          <div className="wallet-card card">
            <span className="wallet-card-label">Available</span>
            <span className="wallet-card-amount">{formatCurrency(earnings.available)}</span>
            <span className="wallet-card-hint">{stripeBalance ? 'From Stripe' : 'Ready to withdraw'}</span>
          </div>
          <div className="wallet-card card">
            <span className="wallet-card-label">Pending</span>
            <span className="wallet-card-amount wallet-card-amount--muted">{formatCurrency(earnings.pending)}</span>
            <span className="wallet-card-hint">{stripeBalance ? 'From Stripe' : 'In progress'}</span>
          </div>
          <div className="wallet-card card">
            <span className="wallet-card-label">Total paid out</span>
            <span className="wallet-card-amount wallet-card-amount--muted">{formatCurrency(earnings.paidOut)}</span>
            <span className="wallet-card-hint">All time</span>
          </div>
        </div>
      </section>

      <section className="wallet-section">
        <h2 className="wallet-section-title">Recent activity</h2>
        {escrowLoading && (
          <p className="wallet-loading">Loading Escrow.com transactions…</p>
        )}
        {escrowError && (
          <p className="wallet-error">Escrow: {escrowError}</p>
        )}
        <div className="wallet-table-wrap card">
          <table className="wallet-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
                <th className="wallet-table-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.description}</td>
                  <td>{t.date}</td>
                  <td>
                    <span className={`wallet-status wallet-status--${t.status}`}>{t.status}</span>
                  </td>
                  <td className="wallet-table-amount">{formatCurrency(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wallet-section">
        <h2 className="wallet-section-title">Payment providers</h2>
        <p className="wallet-provider-note">
          Earnings and payouts use <strong>{preferredPaymentProvider === 'stripe' ? 'Stripe' : 'Escrow.com'}</strong> by default.
          Add API keys in <code>.env</code> and run <code>npm run server</code> to fetch live data.
        </p>
        <div className="wallet-providers card">
          <div className="wallet-provider">
            <span className="wallet-provider-name">Stripe</span>
            <span className={`wallet-provider-badge ${stripeConnected ? 'wallet-provider-badge--connected' : ''}`}>
              {stripeConnected ? 'Connected' : 'Not configured'}
            </span>
          </div>
          <div className="wallet-provider">
            <span className="wallet-provider-name">Escrow.com</span>
            <span className={`wallet-provider-badge ${escrowConnected ? 'wallet-provider-badge--connected' : ''}`}>
              {escrowConnected ? 'Connected' : 'Not configured'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
