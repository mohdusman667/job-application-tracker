import { useEffect, useState } from "react";
import "./App.css";
import {
  draftFollowUpEmail,
  analyzeJobDescription,
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from "./api";


const statuses = ["Applied", "Interview", "Offer", "Rejected", "Withdrawn"];

function App() {
  const [analysis, setAnalysis] = useState("");
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [analyzerError, setAnalyzerError] = useState("");
const [emailDraft, setEmailDraft] = useState("");
const [isDraftingEmail, setIsDraftingEmail] = useState(false);
const [emailDraftError, setEmailDraftError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    company: "",
    jobTitle: "",
    location: "",
    jobUrl: "",
    status: "Applied",
    description: "",
    notes: "",
  });
  async function handleAnalyzeJob() {
  setIsAnalyzing(true);
  setAnalyzerError("");
  setAnalysis("");

  try {
    const result = await analyzeJobDescription(jobDescription);
    setAnalysis(result);
  } catch (requestError) {
    setAnalyzerError(requestError.message);
  } finally {
    setIsAnalyzing(false);
  }
}
async function handleDraftFollowUpEmail() {
  setIsDraftingEmail(true);
  setEmailDraftError("");
  setEmailDraft("");

  try {
    const draft = await draftFollowUpEmail(form);
    setEmailDraft(draft);
  } catch (requestError) {
    setEmailDraftError(requestError.message);
  } finally {
    setIsDraftingEmail(false);
  }
}

  useEffect(() => {
    async function loadApplications() {
      try {
        setApplications(await getApplications());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  const activeCount = applications.filter((item) =>
    ["Applied", "Interview"].includes(item.status)
  ).length;
  const interviewCount = applications.filter(
    (item) => item.status === "Interview"
  ).length;
  const offerCount = applications.filter(
    (item) => item.status === "Offer"
  ).length;

  const visibleApplications = applications.filter((item) =>
    `${item.company} ${item.jobTitle}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const created = await createApplication(form);
      setApplications((current) => [created, ...current]);
      setForm({
        company: "",
        jobTitle: "",
        location: "",
        jobUrl: "",
        status: "Applied",
        description: "",
        notes: "",
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleStatusChange(id, status) {
    setError("");

    try {
      const updated = await updateApplication(id, { status });
      setApplications((current) =>
        current.map((item) => (item._id === id ? updated : item))
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDelete(id) {
    setError("");

    try {
      await deleteApplication(id);
      setApplications((current) => current.filter((item) => item._id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function scrollToForm() {
    document
      .getElementById("add-application")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">J</span>
          <span>JOURNAL<span className="brand-dot">.</span></span>
        </div>

        <p className="sidebar-label">WORKSPACE</p>
        <a className="nav-link active" href="#applications">
          <span className="nav-icon">▦</span>
          Applications
          <span className="nav-count">{applications.length}</span>
        </a>

        <p className="sidebar-label tools-label">TOOLS</p>
        <a className="nav-link" href="#ai-analyzer">
          <span className="nav-icon">✳</span>
          AI job analyzer
        </a>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-spark">✦</span>
            <p>Make your next move with confidence.</p>
            <span>More career tools coming soon</span>
          </div>
          <p className="sidebar-caption">JOB SEARCH WORKSPACE</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span>PERSONAL WORKSPACE <span className="breadcrumb">/ APPLICATIONS</span></span>
          <span className="profile-mark">U</span>
        </header>

        <section className="welcome-row">
          <div>
            <p className="eyebrow">YOUR CAREER DASHBOARD</p>
            <h1>Make your next move.</h1>
            <p className="welcome-copy">
              Keep every opportunity, conversation, and next step in focus.
            </p>
          </div>
          <button className="primary-button" type="button" onClick={scrollToForm}>
            <span>＋</span> Add application
          </button>
        </section>

        {error && <p className="error-message">{error}</p>}

        <section className="stats-grid" aria-label="Application summary">
          <article className="stat-card">
            <span className="stat-label">TOTAL APPLICATIONS</span>
            <strong>{applications.length}</strong>
            <span className="stat-footnote">Opportunities tracked</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">ACTIVE PROCESSES</span>
            <strong>{activeCount}</strong>
            <span className="stat-footnote">Applied or interviewing</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">INTERVIEWS</span>
            <strong>{interviewCount}</strong>
            <span className="stat-footnote">Conversations in progress</span>
          </article>
          <article className="stat-card highlight-stat">
            <span className="stat-label">OFFERS</span>
            <strong>{offerCount}</strong>
            <span className="stat-footnote">Good things take focus</span>
          </article>
        </section>

        <section className="content-grid">
          <section className="panel form-panel" id="add-application">
            <div className="section-heading">
              <div>
                <p className="eyebrow">NEW OPPORTUNITY</p>
                <h2>Add an application</h2>
              </div>
              <span className="heading-mark">01</span>
            </div>

            <form onSubmit={handleSubmit} className="application-form">
              <label>
                Company *
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Acme Inc."
                />
              </label>

              <label>
                Job title *
                <input
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Product Designer"
                />
              </label>

              <label>
                Location
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Remote, city, or hybrid"
                />
              </label>

              <label>
                Job posting link
                <input
                  name="jobUrl"
                  type="url"
                  value={form.jobUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </label>

              <label>
                Current status
                <select name="status" value={form.status} onChange={handleChange}>
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>

              <label className="full-width">
                Job description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Save the job description here for your AI analysis later."
                />
              </label>

              <label className="full-width">
                Notes
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="A contact, a reminder, or something to prepare..."
                />
              </label>
              <div className="email-draft-section full-width">
  <button
    type="button"
    className="email-draft-button"
    onClick={handleDraftFollowUpEmail}
    disabled={!form.company.trim() || !form.jobTitle.trim() || isDraftingEmail}
  >
    {isDraftingEmail ? "Drafting email..." : "Draft follow-up email"}
  </button>

  {emailDraftError && (
    <p className="analyzer-error" role="alert">
      {emailDraftError}
    </p>
  )}

  {emailDraft && (
    <label className="email-draft-label" htmlFor="follow-up-email">
      Follow-up email draft
      <textarea
        id="follow-up-email"
        className="email-draft-input"
        rows={8}
        value={emailDraft}
        onChange={(event) => setEmailDraft(event.target.value)}
      />
    </label>
  )}
</div>

              <button className="primary-button form-submit" type="submit">
                Save application <span>→</span>
              </button>
            </form>
          </section>

          <aside className="ai-card" id="ai-analyzer">
            <span className="ai-symbol">✳</span>
            <p className="eyebrow">A LITTLE EXTRA EDGE</p>
            <h2>Understand the role before you apply.</h2>
            <p>
              Our AI job description analyzer will surface key skills and help
              you prepare thoughtful interview questions.
            </p>
            <label className="analyzer-label" htmlFor="job-description">
  Paste a job description
</label>
<textarea
  id="job-description"
  className="analyzer-input"
  rows={6}
  placeholder="Paste the job description here..."
  value={jobDescription}
  onChange={(event) => setJobDescription(event.target.value)}
/>
<button
  className="analyzer-button"
  type="button"
  onClick={handleAnalyzeJob}
  disabled={!jobDescription.trim() || isAnalyzing}
>
  {isAnalyzing ? "Analyzing..." : "Analyze job description"}
</button>
{analyzerError && (
  <p className="analyzer-error" role="alert">
    {analyzerError}
  </p>
)}

{analysis && (
  <div className="analyzer-result">
    <h3>Job description insights</h3>
    <p>{analysis}</p>
    <button
  className="analyzer-use-button"
  type="button"
  onClick={() => {
  setForm((currentForm) => ({
    ...currentForm,
    notes: currentForm.notes?.includes(analysis)
      ? currentForm.notes
      : [currentForm.notes, analysis].filter(Boolean).join("\n\n"),
  }));

  document.querySelector('textarea[name="notes"]')?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}}
>
  Add insights to application notes
</button>
  </div>
)}
          </aside>
        </section>

        <section className="applications-section" id="applications">
          <div className="list-heading">
            <div>
              <p className="eyebrow">YOUR PIPELINE</p>
              <h2>Applications <span>{applications.length}</span></h2>
            </div>
            <input
              className="search-input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company or role"
              aria-label="Search applications"
            />
          </div>

          {loading ? (
            <p className="empty-state">Loading your applications…</p>
          ) : visibleApplications.length === 0 ? (
            <p className="empty-state">
              {applications.length === 0
                ? "Your pipeline starts here. Add your first application above."
                : "No applications match that search."}
            </p>
          ) : (
            <div className="application-list">
              {visibleApplications.map((application) => (
                <article className="application-card" key={application._id}>
                  <div className="company-mark">
                    {application.company?.charAt(0).toUpperCase() || "J"}
                  </div>
                  <div className="application-info">
                    <h3>{application.jobTitle}</h3>
                    <p>
                      {application.company}
                      {application.location ? ` · ${application.location}` : ""}
                    </p>
                    {application.jobUrl && (
                      <a href={application.jobUrl} target="_blank" rel="noreferrer">
                        View job posting
                      </a>
                    )}
                  </div>
                  <span className={`status-pill status-${application.status.toLowerCase()}`}>
                    {application.status}
                  </span>
                  <select
                    className="status-select"
                    value={application.status}
                    onChange={(event) =>
                      handleStatusChange(application._id, event.target.value)
                    }
                    aria-label={`Change status for ${application.jobTitle}`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleDelete(application._id)}
                    aria-label={`Delete ${application.jobTitle}`}
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;