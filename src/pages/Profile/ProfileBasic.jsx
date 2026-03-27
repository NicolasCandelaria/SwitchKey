import { getUser, getProfileProgress } from '../../lib/auth';
import '../Profile.css';

export default function ProfileBasic() {
  const user = getUser();
  const progress = getProfileProgress(user);
  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.email || 'User';

  return (
    <div className="profile-page">
      <div className="profile-content card">
        <div className="profile-progress-wrap">
          <div className="profile-progress-header">
            <span className="profile-progress-label">Profile completion</span>
            <span className="profile-progress-value">{progress}%</span>
          </div>
          <div className="profile-progress-bar">
            <div
              className="profile-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="profile-avatar-large">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <dl className="profile-info-list">
          <div className="profile-info-row">
            <dt>First name</dt>
            <dd>{user?.firstName || '—'}</dd>
          </div>
          <div className="profile-info-row">
            <dt>Last name</dt>
            <dd>{user?.lastName || '—'}</dd>
          </div>
          <div className="profile-info-row">
            <dt>Email</dt>
            <dd>{user?.email || '—'}</dd>
          </div>
          <div className="profile-info-row">
            <dt>Phone</dt>
            <dd>{user?.phone || '—'}</dd>
          </div>
          <div className="profile-info-row">
            <dt>Location</dt>
            <dd>{user?.location || '—'}</dd>
          </div>
          <div className="profile-info-row">
            <dt>Job title</dt>
            <dd>{user?.jobTitle || '—'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
