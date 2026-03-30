import { useSearchParams, Link } from 'react-router-dom';
import { NON_BINDING_NOTICE } from '@shared/nonBindingNotice.js';
import './InviteVRF.css';

export default function InviteVRF() {
  const [params] = useSearchParams();
  const token = params.get('token')?.trim();

  return (
    <div className="invite-vrf">
      <div className="invite-vrf-inner card">
        <h1 className="invite-vrf-title">Role invitation (VRF)</h1>
        {!token ? (
          <p className="invite-vrf-lead">
            This page requires a valid invitation link. Check your email for the tokenized link, or contact the project
            owner.
          </p>
        ) : (
          <>
            <p className="invite-vrf-lead">
              Your invitation link is valid. This page confirms receipt of a tokenized verification link (VRF). Project
              details were sent to your email.
            </p>
            <div className="invite-vrf-token" aria-label="Token preview">
              <span className="invite-vrf-token-label">Token</span>
              <code className="invite-vrf-token-value">{token.slice(0, 12)}…</code>
            </div>
          </>
        )}
        <section className="invite-vrf-notice" aria-labelledby="invite-vrf-notice-heading">
          <h2 id="invite-vrf-notice-heading" className="invite-vrf-notice-title">
            Non-binding notice
          </h2>
          <p className="invite-vrf-notice-body">{NON_BINDING_NOTICE}</p>
        </section>
        <p className="invite-vrf-footer">
          <Link to="/">Back to SwitchKey home</Link>
        </p>
      </div>
    </div>
  );
}
