// App.jsx
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// ASSETS
import Logo from "./assets/CXD+_logo.svg";
import Background from "./assets/background_1.png";
import avatarImg from "./assets/avatar-placeholder.png";

// COMPONENTS
import NavBar from "./NavBar.jsx";
import FeatureStrip from "./FeatureStrip.jsx";
import OpportunityCard from "./OpportunityCard.jsx";
import LoginPage from "./LoginPage.jsx";
import SupabaseTest from "./SupabaseTest.jsx"; // ⬅️ your Supabase text JSX


/* ----------------------------------------
  Shared Layout (hero + white section)
---------------------------------------- */
function Layout({
  children,
  heroSize,
  isHome,
  setIsAuthed,
  showWorkspace,
  workspaceItems,
  onRemoveFromWorkspace,
  isConcept,
  selectedOpportunity,
  setSelectedOpportunity,
}) {
  const heroClass =
    heroSize === "short" ? "hero hero--short" : "hero hero--full";

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isConceptSaved, setIsConceptSaved] = useState(false);
  const navigate = useNavigate();

  // Reset Save button when entering concept page / changing opportunity
  useEffect(() => {
    if (isConcept) {
      setIsConceptSaved(false);
    }
  }, [isConcept, selectedOpportunity]);

  const handleProfileToggle = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleMyWorkspace = () => {
    setIsProfileOpen(false);
    navigate("/workspace");
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsAuthed(false);
    navigate("/");
  };

  return (
    <div className="app">
      {/* HERO WITH BACKGROUND IMAGE */}
      <section
        className={heroClass}
        style={{ backgroundImage: `url(${Background})` }}
      >
        <div className="hero__overlay">
          {/* Top bar: logo, nav, profile */}
          <header className="app__header">
            {/* Logo (top-left) */}
            <div className="app__logo">
              <img src={Logo} alt="CXDplus logo" className="app__logo-img" />
            </div>

            {/* Nav (top-middle) */}
            <NavBar />

            {/* Profile (top-right) */}
            <div className="app__profile">
              <div className="profile-wrap">
                <div className="profile-box" onClick={handleProfileToggle}>
                  <img
                    src={avatarImg}
                    alt="User avatar"
                    className="profile-avatar"
                  />
                  <span className="profile-name">Josh Gregory</span>
                  <span className="profile-caret">▾</span>
                </div>

                {isProfileOpen && (
                  <div className="profile-menu">
                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={handleMyWorkspace}
                    >
                      My workspace
                    </button>
                    <button
                      type="button"
                      className="profile-menu-item profile-menu-item--logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page-specific hero content */}
          <main className="hero__main">{children}</main>
        </div>
      </section>

      {/* WHITE SECTION BELOW HERO */}
      <section className="app__section app__section--white">
        <div className="app__section-inner">
          {isHome ? (
            // ---------- HOME: Supabase test JSX ----------
            <SupabaseTest />
            
            
            
          ) : showWorkspace ? (
            // ------------ MY WORKSPACE ------------
            <div className="opp-stack">
              {workspaceItems && workspaceItems.length > 0 ? (
                workspaceItems.map((item, index) => (
                  <OpportunityCard
                    key={item.id || index}
                    id={item.id}
                    confidence={item.confidence}
                    title={item.title}
                    why={item.why}
                    designApproach={item.designApproach}
                    isWorkspace={true}
                    onRemove={
                      onRemoveFromWorkspace
                        ? () => onRemoveFromWorkspace(item.id)
                        : undefined
                    }
                    onDevelop={
                      setSelectedOpportunity
                        ? () => {
                            setSelectedOpportunity(item);
                            navigate("/concept-development");
                          }
                        : undefined
                    }
                  />
                ))
              ) : (
                <p>No opportunities in your workspace yet.</p>
              )}
            </div>
          ) : isConcept ? (
            // ------------ CONCEPT DEVELOPMENT PAGE ------------
            <div className="concept-layout">
              <div className="concept-layout__main">
                {/* Top button row */}
                <div className="concept-top-row">
                  <button
                    type="button"
                    className="concept-back-btn"
                    onClick={() => navigate("/workspace")}
                  >
                    ← Back to workspace
                  </button>
                  <button
                    type="button"
                    className={
                      isConceptSaved
                        ? "concept-save-btn concept-save-btn--saved"
                        : "concept-save-btn"
                    }
                    onClick={() => {
                      setIsConceptSaved(true);
                      console.log("Concept saved!");
                    }}
                  >
                    {isConceptSaved ? "Saved ✓" : "Save concept"}
                  </button>
                </div>
                {selectedOpportunity ? (
                  <div className="concept-grid">
                    {/* Row 1: Summary (left) + Value/Problem/Definition (right) */}
                    <div className="concept-panel concept-panel--summary">
                      <h3>Opportunity summary</h3>
                      <p className="concept-label">Title</p>
                      <p className="concept-value">
                        {selectedOpportunity.title}
                      </p>
                      <p className="concept-label">Why?</p>
                      <p className="concept-value">
                        {selectedOpportunity.why}
                      </p>
                      <p className="concept-label">Design approach</p>
                      <p className="concept-value">
                        {selectedOpportunity.designApproach}
                      </p>
                      <p className="concept-label">Confidence score</p>
                      <p className="concept-value concept-value--badge">
                        {selectedOpportunity.confidence || "—"}
                      </p>
                    </div>
                    <div className="concept-panel concept-panel--value">
                      <h3>Value, problem &amp; definition</h3>
                      <label className="concept-field">
                        <span>Value</span>
                        <textarea placeholder="What value does this create for the customer and Zebra?" />
                      </label>
                      <label className="concept-field">
                        <span>Problem</span>
                        <textarea placeholder="Describe the core customer problem in plain language." />
                      </label>
                      <label className="concept-field">
                        <span>Opportunity definition</span>
                        <textarea placeholder="Turn this into a clear problem/opportunity statement." />
                      </label>
                    </div>
                    {/* Row 2: Technology + Market (two equal boxes) */}
                    <div className="concept-panel concept-panel--tech">
                      <h4>Technology</h4>
                      <textarea placeholder="Key technologies to explore (e.g. RFID, vision, AI)." />
                    </div>
                    <div className="concept-panel concept-panel--market">
                      <h4>Market</h4>
                      <textarea placeholder="Segments, scale of impact, and where to pilot first." />
                    </div>
                    {/* Row 3: Requirements (full width across both columns) */}
                    <div className="concept-panel concept-panel--requirements">
                      <h4>Requirements</h4>
                      <textarea placeholder="Critical requirements, constraints, and dependencies." />
                    </div>
                    {/* Row 4: Risk + Success */}
                    <div className="concept-panel concept-panel--risk">
                      <h4>Risk</h4>
                      <textarea placeholder="Key risks, assumptions, and unknowns." />
                    </div>
                    <div className="concept-panel concept-panel--success">
                      <h4>Success</h4>
                      <textarea placeholder="What does success look like? Metrics and outcomes." />
                    </div>
                  </div>
                ) : (
                  <p>No opportunity selected. Go back to workspace and pick one.</p>
                )}
              </div>
              {/* Right 30% – reserved for later */}
              <div className="concept-layout__side">
                {/* Left intentionally blank for now */}
              </div>
            </div>
          ) : (
            // ------------ OTHER PAGES PLACEHOLDER ------------
            <>
              <h2>Details</h2>
              <p>
                This area will show more detailed dashboards, tables, and cards
                depending on the selected page.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/* ----------------------------------------
  HOME HERO CONTENT
---------------------------------------- */
const HomeHero = () => (
  <div className="home-hero">
    <div className="home-hero-header">
      {/* Subtitle + blue circle */}
      <div className="home-subtitle-wrap">
        <span className="home-subtitle-circle" />
        <p className="home-subtitle">Customer Experience Data Repository</p>
      </div>
      {/* Two-line title */}
      <h1 className="home-title">
        <span className="home-title-line1">Design Innovation</span>
        <span className="home-title-line2">With Our Intelligence</span>
      </h1>
    </div>
    {/* Feature strip at bottom of hero */}
    <FeatureStrip />
  </div>
);

/* ----------------------------------------
  SHORT HERO TITLES FOR OTHER PAGES
---------------------------------------- */
const MarketsHero = () => (
  <div className="hero__title">
    <h1>Market Analysis</h1>
    <p>Global industry growth, volatility and opportunity scores.</p>
  </div>
);

const CustomerInsightHero = () => (
  <div className="hero__title">
    <h1>Customer Insight</h1>
    <p>Voice-of-customer, pain points and sentiment trends.</p>
  </div>
);

const PersonasWorkflowsHero = () => (
  <div className="hero__title">
    <h1>Persona &amp; Workflows</h1>
    <p>
      Personas, journeys and workflows to align CXD, product and engineering.
    </p>
  </div>
);

const ProjectsHero = () => (
  <div className="hero__title">
    <h1>Projects</h1>
    <p>CXD project portfolio, status, assets and scorecards.</p>
  </div>
);

const IndustryOppsHero = () => (
  <div className="hero__title">
    <h1>Industry Opportunities</h1>
    <p>Cross-industry patterns highlighting where new solutions can win.</p>
  </div>
);

const WorkspaceHero = () => (
  <div className="hero__title">
    <h1>My workspace</h1>
    <p>Your pinned opportunities and personal CXD+ tools.</p>
  </div>
);

const ConceptHero = () => (
  <div className="hero__title">
    <h1>Concept development</h1>
    <p>Structure this opportunity into a design-ready concept.</p>
  </div>
);

/* ----------------------------------------
  ROUTES + LOGIN GATE
---------------------------------------- */
function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  // workspace state
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const handleRemoveFromWorkspace = (id) => {
    setWorkspaceItems((prev) => prev.filter((w) => w.id !== id));
    // if we're viewing this one in concept page, clear it
    setSelectedOpportunity((current) =>
      current && current.id === id ? null : current
    );
  };

  const handleAddToWorkspace = (item) => {
    setWorkspaceItems((prev) => {
      if (prev.some((w) => w.id === item.id)) return prev; // avoid duplicates
      return [...prev, item];
    });
  };

  // Show login page first
  if (!isAuthed) {
    return <LoginPage onLogin={() => setIsAuthed(true)} />;
  }

  // Once logged in, show full app
  return (
    <Routes>
      {/* HOME – full hero + Supabase test */}
      <Route
        path="/"
        element={
          <Layout
            heroSize="full"
            isHome={true}
            setIsAuthed={setIsAuthed}
            onAddToWorkspace={handleAddToWorkspace}
            workspaceItems={workspaceItems}
          >
            <HomeHero />
          </Layout>
        }
      />

      {/* MARKETS */}
      <Route
        path="/markets"
        element={
          <Layout heroSize="short" isHome={false} setIsAuthed={setIsAuthed}>
            <MarketsHero />
          </Layout>
        }
      />

      {/* CUSTOMER INSIGHT */}
      <Route
        path="/customer-insight"
        element={
          <Layout heroSize="short" isHome={false} setIsAuthed={setIsAuthed}>
            <CustomerInsightHero />
          </Layout>
        }
      />

      {/* PERSONAS & WORKFLOWS */}
      <Route
        path="/personas-workflows"
        element={
          <Layout heroSize="short" isHome={false} setIsAuthed={setIsAuthed}>
            <PersonasWorkflowsHero />
          </Layout>
        }
      />

      {/* PROJECTS */}
      <Route
        path="/projects"
        element={
          <Layout heroSize="short" isHome={false} setIsAuthed={setIsAuthed}>
            <ProjectsHero />
          </Layout>
        }
      />

      {/* INDUSTRY OPPORTUNITIES */}
      <Route
        path="/industry-opportunities"
        element={
          <Layout heroSize="short" isHome={false} setIsAuthed={setIsAuthed}>
            <IndustryOppsHero />
          </Layout>
        }
      />

      {/* MY WORKSPACE */}
      <Route
        path="/workspace"
        element={
          <Layout
            heroSize="short"
            isHome={false}
            setIsAuthed={setIsAuthed}
            showWorkspace={true}
            workspaceItems={workspaceItems}
            onRemoveFromWorkspace={handleRemoveFromWorkspace}
            setSelectedOpportunity={setSelectedOpportunity}
          >
            <WorkspaceHero />
          </Layout>
        }
      />

      {/* CONCEPT DEVELOPMENT */}
      <Route
        path="/concept-development"
        element={
          <Layout
            heroSize="short"
            isHome={false}
            setIsAuthed={setIsAuthed}
            isConcept={true}
            selectedOpportunity={selectedOpportunity}
          >
            <ConceptHero />
          </Layout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
