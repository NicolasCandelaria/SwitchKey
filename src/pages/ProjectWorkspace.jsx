import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { sendRoleInvitationEmail } from '../lib/invitationsApi';
import { PATHWAY_ITEMS } from './CreateProject/constants';
import './Dashboard.css';
import './ProjectWorkspace.css';

export default function ProjectWorkspace() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProjectBySlug, updateProjectStatus, updateProject } = useProjects();
  const project = slug ? getProjectBySlug(slug) : null;

  async function handlePromote() {
    if (!project || !slug) return;
    updateProjectStatus(slug, 'active');
    navigate('/dashboard/projects');
  }

  async function handleDelete() {
    if (!project || !slug) return;
    if (project.status !== 'draft') return;
    if (!window.confirm(`Delete draft "${project.projectName}"? This will move it to Trash.`)) return;
    updateProjectStatus(slug, 'trash');
    navigate('/dashboard/projects/trash');
  }

  const pathwayIdToLabel = useMemo(
    () =>
      PATHWAY_ITEMS.reduce((acc, p) => {
        acc[p.id] = p.label;
        return acc;
      }, {}),
    []
  );

  const roleItems = useMemo(() => {
    if (!project) return [];
    const ids = Array.isArray(project.selectedPathways) ? project.selectedPathways : [];
    return ids.map((id) => ({ id, label: pathwayIdToLabel[id] || id }));
  }, [project, pathwayIdToLabel]);

  const roleSpecAlignments = project?.roleSpecAlignments || {};
  const roleRequests = Array.isArray(project?.roleRequests) ? project.roleRequests : [];

  const [activeRoleId, setActiveRoleId] = useState(null);
  const [alignmentSummary, setAlignmentSummary] = useState('');
  const [alignmentDeliverables, setAlignmentDeliverables] = useState('');
  const [alignmentSuccessCriteria, setAlignmentSuccessCriteria] = useState('');
  const [alignmentConstraints, setAlignmentConstraints] = useState('');
  const [inviteeName, setInviteeName] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState('');
  const [requestSent, setRequestSent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [repoTab, setRepoTab] = useState(/** @type {'roles' | 'requests'} */ ('roles'));

  const activeRole = roleItems.find((r) => r.id === activeRoleId) || null;
  const existingAlignment = activeRoleId ? roleSpecAlignments[activeRoleId] : null;

  const canonicalDescription = String(project?.productDescription ?? '').trim();

  useEffect(() => {
    if (!activeRoleId && roleItems.length > 0) setActiveRoleId(roleItems[0].id);
  }, [activeRoleId, roleItems]);

  useEffect(() => {
    if (!activeRoleId) return;
    const stillExists = roleItems.some((r) => r.id === activeRoleId);
    if (!stillExists) setActiveRoleId(roleItems.length > 0 ? roleItems[0].id : null);
  }, [activeRoleId, roleItems]);

  useEffect(() => {
    setRequestSent(null);
  }, [activeRoleId]);

  useEffect(() => {
    if (!project) return;
    setFormError('');

    setAlignmentSummary(existingAlignment?.summary ?? '');
    setAlignmentDeliverables(existingAlignment?.deliverables ?? '');
    setAlignmentSuccessCriteria(existingAlignment?.successCriteria ?? '');
    setAlignmentConstraints(existingAlignment?.constraints ?? '');
    setInviteeName(existingAlignment?.invitee?.name ?? '');
    setInviteeEmail(existingAlignment?.invitee?.email ?? '');
    setRequestMessage(existingAlignment?.message ?? '');
    setDueDate(
      typeof existingAlignment?.dueDate === 'string' ? existingAlignment.dueDate : ''
    );
  }, [activeRoleId, project, existingAlignment]);

  if (!project) {
    return (
      <div className="dashboard workspace-not-found">
        <header className="dashboard-header">
          <h1 className="dashboard-welcome">Project not found</h1>
        </header>
        <p className="dashboard-empty-text">
          No project with this baseline was found. It may have been created in another session.
        </p>
        <Link to="/dashboard/projects" className="btn btn-primary">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard project-workspace project-repo">
      <header className="repo-page-header">
        <div className="repo-header-top">
          <div className="repo-header-title-row">
            <h1 className="repo-title">
              <span className="repo-title-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 11-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 00.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                </svg>
              </span>
              {project.projectName}
            </h1>
            <span className={`repo-visibility-badge ${project.status === 'draft' ? 'repo-visibility-badge--draft' : ''}`}>
              {project.status === 'draft' ? 'Draft' : 'Public'}
            </span>
          </div>
          <p className="repo-description">
            {[project.primaryCategory, project.productCategory].filter(Boolean).join(' · ') || 'No category'}
          </p>
        </div>

        <nav className="repo-tabs" aria-label="Project">
          <button
            type="button"
            role="tab"
            aria-selected={repoTab === 'roles'}
            className="repo-tab"
            onClick={() => setRepoTab('roles')}
          >
            Roles
            {roleItems.length > 0 && (
              <span className="repo-tab-count">{roleItems.length}</span>
            )}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={repoTab === 'requests'}
            className="repo-tab"
            onClick={() => setRepoTab('requests')}
          >
            Requests
            {roleRequests.length > 0 && (
              <span className="repo-tab-count">{roleRequests.length}</span>
            )}
          </button>
        </nav>
      </header>

      <div className="repo-layout">
        <div className="repo-main">
          {repoTab === 'roles' && (
            <div className="repo-tab-panel">
              <div className="repo-roles-toolbar">
                <h2 className="dashboard-section-title repo-panel-title">Roles & spec alignment</h2>
                <p className="repo-panel-sub">Select a role, then complete alignment and send a request.</p>
              </div>
              <div className="repo-roles-split">
                <div className="repo-roles-list card">
                  {roleItems.length > 0 ? (
                    roleItems.map((role, index) => (
                      <button
                        key={role.id}
                        type="button"
                        className={`repo-role-row ${activeRoleId === role.id ? 'repo-role-row--active' : ''}`}
                        onClick={() => setActiveRoleId(role.id)}
                      >
                        <span className="workspace-pathway-num">{index + 1}</span>
                        <span className="repo-role-name">{role.label}</span>
                        <span className="repo-role-status">
                          {roleSpecAlignments[role.id] ? 'Aligned' : 'Open'}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="dashboard-empty-text">No roles selected for this project.</p>
                  )}
                </div>
                <div className="card repo-spec-card">
              {activeRole ? (
                <>
                  <p className="workspace-board-spec-context">
                    {activeRole.label}
                  </p>

              <form
                className="workspace-role-alignment-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!slug || !activeRoleId || !activeRole) return;

                  const name = inviteeName.trim();
                  const email = inviteeEmail.trim();
                  if (!name) {
                    setFormError('Invitee name is required.');
                    return;
                  }
                  if (!email) {
                    setFormError('Invitee email is required.');
                    return;
                  }
                  if (!dueDate.trim()) {
                    setFormError('Due date is required.');
                    return;
                  }

                  const now = new Date().toISOString();
                  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

                  setFormError('');
                  setIsSubmitting(true);
                  try {
                    const mailResult = await sendRoleInvitationEmail({
                      toEmail: email,
                      inviteeName: name,
                      projectName: project.projectName,
                      canonicalProductDescription: canonicalDescription,
                      roleLabel: activeRole.label,
                      dueDate: dueDate.trim(),
                      requestId,
                    });

                    if (!mailResult.ok || !mailResult.data) {
                      setFormError(
                        mailResult.error ||
                          'Could not send invitation. Start the API server (`npm run server`) or check SMTP settings.'
                      );
                      setIsSubmitting(false);
                      return;
                    }

                    const { vrfToken, vrfUrl, emailSent, simulated, smtpDeliveryFailed } = mailResult.data;

                    updateProject(slug, (p) => {
                      const roleSpecAlignmentsNext = { ...(p.roleSpecAlignments || {}) };
                      roleSpecAlignmentsNext[activeRoleId] = {
                        summary: alignmentSummary,
                        deliverables: alignmentDeliverables,
                        successCriteria: alignmentSuccessCriteria,
                        constraints: alignmentConstraints,
                        invitee: { name, email },
                        message: requestMessage,
                        dueDate: dueDate.trim(),
                        vrfToken,
                        vrfUrl,
                        emailSent,
                        emailSimulated: simulated,
                        smtpDeliveryFailed,
                        updatedAt: now,
                      };

                      const roleRequestsNext = Array.isArray(p.roleRequests) ? [...p.roleRequests] : [];
                      roleRequestsNext.unshift({
                        id: requestId,
                        roleId: activeRoleId,
                        roleLabel: activeRole.label,
                        invitee: { name, email },
                        message: requestMessage,
                        dueDate: dueDate.trim(),
                        vrfToken,
                        vrfUrl,
                        emailSent,
                        emailSimulated: simulated,
                        smtpDeliveryFailed,
                        alignment: {
                          summary: alignmentSummary,
                          deliverables: alignmentDeliverables,
                          successCriteria: alignmentSuccessCriteria,
                          constraints: alignmentConstraints,
                        },
                        status: 'sent',
                        createdAt: now,
                      });

                      return {
                        ...p,
                        roleSpecAlignments: roleSpecAlignmentsNext,
                        roleRequests: roleRequestsNext,
                      };
                    });

                    setRequestSent({
                      id: requestId,
                      invitee: { name, email },
                      roleLabel: activeRole.label,
                      vrfUrl,
                      emailSent,
                      simulated,
                      smtpDeliveryFailed,
                    });
                  } catch {
                    setFormError(
                      'Network error. Is the API server running? Use `npm run server` in a separate terminal.'
                    );
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <div className="form-group workspace-canonical-product">
                  <label htmlFor="canonical-product-desc">Canonical product description (read-only)</label>
                  <textarea
                    id="canonical-product-desc"
                    readOnly
                    value={canonicalDescription || '—'}
                    rows={4}
                    className="workspace-canonical-readonly"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role-due-date">Due date</label>
                  <input
                    id="role-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="alignment-summary">Alignment summary</label>
                  <textarea
                    id="alignment-summary"
                    value={alignmentSummary}
                    onChange={(e) => setAlignmentSummary(e.target.value)}
                    placeholder="What should the role deliver, and what does success look like?"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="alignment-deliverables">Deliverables</label>
                  <textarea
                    id="alignment-deliverables"
                    value={alignmentDeliverables}
                    onChange={(e) => setAlignmentDeliverables(e.target.value)}
                    placeholder="List specific deliverables for this role."
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="alignment-success">Success criteria</label>
                  <textarea
                    id="alignment-success"
                    value={alignmentSuccessCriteria}
                    onChange={(e) => setAlignmentSuccessCriteria(e.target.value)}
                    placeholder="How will you measure that the role was completed successfully?"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="alignment-constraints">Constraints (optional)</label>
                  <textarea
                    id="alignment-constraints"
                    value={alignmentConstraints}
                    onChange={(e) => setAlignmentConstraints(e.target.value)}
                    placeholder="Timeline constraints, dependencies, budget limits, etc."
                    rows={3}
                  />
                </div>

                <div className="workspace-role-alignment-invite">
                  <div className="form-group">
                    <label htmlFor="invitee-name">Invitee name</label>
                    <input
                      id="invitee-name"
                      type="text"
                      value={inviteeName}
                      onChange={(e) => setInviteeName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="invitee-email">Invitee email</label>
                    <input
                      id="invitee-email"
                      type="email"
                      value={inviteeEmail}
                      onChange={(e) => setInviteeEmail(e.target.value)}
                      placeholder="alex@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="request-message">Message to invitee (optional)</label>
                  <textarea
                    id="request-message"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Any extra context or next steps."
                    rows={3}
                  />
                </div>

                {formError && (
                  <p className="workspace-role-form-error" role="alert">
                    {formError}
                  </p>
                )}

                <div className="workspace-role-alignment-actions">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Convert to request & send'}
                  </button>
                </div>
              </form>

              {requestSent && (
                <div className="workspace-role-request-sent">
                  <p className="workspace-role-request-sent-title">Request recorded</p>
                  <p className="workspace-role-request-sent-desc">
                    {requestSent.smtpDeliveryFailed ? (
                      <>
                        <strong>Email could not be delivered</strong> (SMTP error — check <code>.env</code> and API
                        terminal). Share the VRF link below with the invitee manually.{' '}
                      </>
                    ) : requestSent.simulated ? (
                      <>
                        SMTP not configured — invitation was <strong>simulated</strong> (see API terminal).{' '}
                      </>
                    ) : requestSent.emailSent ? (
                      <>
                        Email sent to <strong>{requestSent.invitee.name}</strong> ({requestSent.invitee.email}) for role{' '}
                        <strong>{requestSent.roleLabel}</strong>.{' '}
                      </>
                    ) : (
                      <>
                        Saved for <strong>{requestSent.invitee.email}</strong> — role <strong>{requestSent.roleLabel}</strong>.{' '}
                      </>
                    )}
                    VRF link:{' '}
                    <a href={requestSent.vrfUrl} className="workspace-vrf-link" target="_blank" rel="noreferrer">
                      Open verification link
                    </a>
                  </p>
                </div>
              )}
                </>
              ) : (
                <p className="dashboard-empty-text workspace-board-empty">
                  Select a role to open spec alignment.
                </p>
              )}
                </div>
              </div>
            </div>
          )}

          {repoTab === 'requests' && (
            <div className="repo-tab-panel">
              <h2 className="dashboard-section-title repo-panel-title">Requests</h2>
              {roleRequests.length > 0 ? (
                <div className="dashboard-table-wrap card repo-requests-table-wrap">
                  <table className="dashboard-table repo-requests-table">
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Invitee</th>
                        <th>Due</th>
                        <th>Status</th>
                        <th>Sent</th>
                      </tr>
                    </thead>
                    <tbody className="dashboard-table-body">
                      {roleRequests.map((r) => (
                        <tr key={r.id} className="dashboard-table-row">
                          <td>{r.roleLabel}</td>
                          <td>{r.invitee?.name || '—'}</td>
                          <td>{r.dueDate || '—'}</td>
                          <td>{r.status}</td>
                          <td>{new Date(r.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="dashboard-empty-text">No requests yet.</p>
              )}
            </div>
          )}
        </div>

        <aside className="repo-sidebar" aria-label="About">
          <div className="repo-about-toolbar">
            <h2 className="dashboard-section-title repo-panel-title repo-about-toolbar-title">About</h2>
          </div>
          <div className="card repo-about-card">
            <p className="repo-about-desc">
              {project.productDescription
                ? `${String(project.productDescription).slice(0, 160)}${String(project.productDescription).length > 160 ? '…' : ''}`
                : 'Add a product description in your baseline.'}
            </p>
            <dl className="repo-about-dl">
              <div>
                <dt>Primary</dt>
                <dd>{project.primaryCategory || '—'}</dd>
              </div>
              <div>
                <dt>Product</dt>
                <dd>{project.productCategory || '—'}</dd>
              </div>
            </dl>
            {project.scenarioTags?.length > 0 && (
              <div className="repo-about-tags">
                <span className="repo-about-tags-label">Tags</span>
                <div className="workspace-tags">
                  {project.scenarioTags.slice(0, 6).map((tag) => (
                    <span key={tag} className="workspace-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            {project.status === 'draft' && (
              <div className="repo-about-actions">
                <button type="button" className="btn btn-primary" onClick={handlePromote}>
                  Move to projects
                </button>
                <button type="button" className="btn btn-secondary workspace-delete-btn" onClick={handleDelete}>
                  Delete draft
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
