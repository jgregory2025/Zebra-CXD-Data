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
import OpportunityStack from "./OpportunityStack.jsx";
import OpportunityCard from "./OpportunityCard.jsx";
import InsightPanel from "./InsightPanel.jsx";
import LoginPage from "./LoginPage.jsx";

// SHAREPOINT SERVICE
import { getListItems } from "./services/sharepoint.js";

/* ----------------------------------------
  Shared Layout (hero + white section)
---------------------------------------- */
function Layout({
  children,
  heroSize,
  isHome,
  setIsAuthed,
  onAddToWorkspace,
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

  console.log("🎨 Layout render. isHome =", isHome);
 // --- Insight Builder SharePoint data ---
 const [industries, setIndustries] = useState([]);
 const [personas, setPersonas] = useState([]);
 const [workflows, setWorkflows] = useState([]);
 const [productTypes, setProductTypes] = useState([]);
 const [technologies, setTechnologies] = useState([]);
 const [customers, setCustomers] = useState([]);
 // Selected IDs
 const [selectedIndustry, setSelectedIndustry] = useState("");
 const [selectedPersona, setSelectedPersona] = useState("");
 const [selectedWorkflow, setSelectedWorkflow] = useState("");
 const [selectedProductType, setSelectedProductType] = useState("");
 const [selectedTechnology, setSelectedTechnology] = useState("");
 const [selectedCustomer, setSelectedCustomer] = useState("");
 const [jsonOutput, setJsonOutput] = useState("");

  // Reset Save button when entering concept page / changing opportunity
  useEffect(() => {
    if (isConcept) {
      setIsConceptSaved(false);
    }
  }, [isConcept, selectedOpportunity]);

  // Load SharePoint lists for the Insight Builder
  // Load SharePoint lists for the Insight Builder (home page only)
 useEffect(() => {
   console.log("🔵 useEffect (SharePoint load) fired. isHome =", isHome);
   if (!isHome) {
     console.log("⛔ Not home, skipping SharePoint load.");
     return;
   }
   async function load() {
     console.log("🟣 Loading SharePoint lists via getListItems…");
     try {
       const [ind, per, wf, pt, tech, cust] = await Promise.all([
         getListItems("Industry"),
         getListItems("Persona"),
         getListItems("Workflow"),
         getListItems("ProductType"),
         getListItems("Technology"),
         getListItems("Customer"),
       ]);
       console.log("🟢 Industry items:", ind);
       console.log("🟢 Persona items:", per);
       console.log("🟢 Workflow items:", wf);
       console.log("🟢 ProductType items:", pt);
       console.log("🟢 Technology items:", tech);
       console.log("🟢 Customer items:", cust);
       setIndustries(ind);
       setPersonas(per);
       setWorkflows(wf);
       setProductTypes(pt);
       setTechnologies(tech);
       setCustomers(cust);
     } catch (err) {
       console.error("❌ Error loading SharePoint data:", err);
     }
   }
   load();
 }, [isHome]);

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

  // TEMP SAMPLE DATA FOR THE 4 OPPORTUNITY CARDS ON HOME
  const opportunityData = [
    {
      id: "Opportunity 01",
      confidence: "90%",
      title: "Reducing Mis-Picks with RFID-Driven Accuracy",
      why:
        "Mis-picks are the most common pain point and directly affect Tesco’s goal to reduce shrink.",
      designApproach:
        "Leverage RFID technology to ensure real-time item verification during picking, providing alerts for incorrect selections.",
    },
    {
      id: "Opportunity 02",
      confidence: "84%",
      title: "Speeding Up Picking Workflows",
      why:
        "Associates spend excessive time double-checking items, slowing down order fulfilment.",
      designApproach:
        "Streamline UI flows and introduce automated confirmation for high-confidence matches.",
    },
    {
      id: "Opportunity 03",
      confidence: "78%",
      title: "Reducing Training Effort for New Staff",
      why:
        "New colleagues struggle to remember workflow steps, increasing onboarding time and error rates.",
      designApproach:
        "Embed inline guidance, micro-tutorials and contextual help into the picking experience.",
    },
    {
      id: "Opportunity 04",
      confidence: "71%",
      title: "Lowering Cognitive Load in Store Operations",
      why:
        "Frequent screen and device switching increases mental load and the likelihood of mistakes.",
      designApproach:
        "Consolidate key tasks into a single view and prioritise the most important actions on-screen.",
    },
  ];

  // Build the JSON payload for AI
  const buildInsightPayload = () => {
    const industry = industries.find((i) => i.Id === Number(selectedIndustry));
    const persona = personas.find((p) => p.Id === Number(selectedPersona));
    const workflow = workflows.find((w) => w.Id === Number(selectedWorkflow));
    const productType = productTypes.find(
      (pt) => pt.Id === Number(selectedProductType)
    );
    const technology = technologies.find(
      (t) => t.Id === Number(selectedTechnology)
    );
    const customer = customers.find((c) => c.Id === Number(selectedCustomer));

    return {
      industry,
      persona,
      workflow,
      productType,
      technology,
      customer,
    };
  };

  const handleResetFilters = () => {
    setSelectedIndustry("");
    setSelectedPersona("");
    setSelectedWorkflow("");
    setSelectedProductType("");
    setSelectedTechnology("");
    setSelectedCustomer("");
    setJsonOutput("");
  };

  const handleGenerateJson = () => {
    const payload = buildInsightPayload();
    setJsonOutput(JSON.stringify(payload, null, 2));
  };

  const handleCopyJson = async () => {
    const payload = buildInsightPayload();
    const json = JSON.stringify(payload, null, 2);
    await navigator.clipboard.writeText(json);
    alert("Insight JSON copied – paste into ChatGPT.");
  };

  // Filtering helpers
  const filteredPersonas = personas.filter(
    (p) => p.IndustryId === Number(selectedIndustry)
  );

  const filteredWorkflows = workflows.filter((w) => {
    const matchIndustry = selectedIndustry
      ? w.IndustryId === Number(selectedIndustry)
      : true;
    const matchPersona = selectedPersona
      ? w.PersonaId === Number(selectedPersona)
      : true; // adjust if your lookup name differs
    return matchIndustry && matchPersona;
  });

  const filteredCustomers = customers.filter(
    (c) => c.IndustryId === Number(selectedIndustry)
  );

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
            <>
              {/* HOME INSIGHT BUILDER SECTION */}
              <section className="home-insight-builder">
                <div className="home-insight-inner">
                  {/* LEFT SIDE: title + filters */}
                  <div className="home-insight-left">
                    <div className="home-insight-title-row">
                      <span className="home-subtitle-circle"></span>
                      <p className="home-insight-breadcrumb">
                        Customer Experience Design Repository
                      </p>
                    </div>
                    <div className="home-insight-form">
                      <h3>Select Project Specifications</h3>
                      {/* GREY BOX */}
                      <div className="filter-box">
                        <div className="home-insight-grid">
                          {/* Industry */}
                          <div className="input-block">
                            <label>Industry *</label>
                            <select
                              value={selectedIndustry}
                              onChange={(e) => {
                                setSelectedIndustry(e.target.value);
                                setSelectedPersona("");
                                setSelectedWorkflow("");
                                setSelectedCustomer("");
                              }}
                            >
                              <option value="">Select industry</option>
                              {industries.map((i) => (
                                <option key={i.Id} value={i.Id}>
                                  {i.Title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Persona */}
                          <div className="input-block">
                            <label>Persona *</label>
                            <select
                              value={selectedPersona}
                              onChange={(e) => {
                                setSelectedPersona(e.target.value);
                                setSelectedWorkflow("");
                              }}
                              disabled={!selectedIndustry}
                            >
                              <option value="">Select persona</option>
                              {filteredPersonas.map((p) => (
                                <option key={p.Id} value={p.Id}>
                                  {p.Title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Product type */}
                          <div className="input-block">
                            <label>Product type *</label>
                            <select
                              value={selectedProductType}
                              onChange={(e) =>
                                setSelectedProductType(e.target.value)
                              }
                            >
                              <option value="">Select product type</option>
                              {productTypes.map((pt) => (
                                <option key={pt.Id} value={pt.Id}>
                                  {pt.Title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Workflow */}
                          <div className="input-block">
                            <label>Workflow *</label>
                            <select
                              value={selectedWorkflow}
                              onChange={(e) =>
                                setSelectedWorkflow(e.target.value)
                              }
                              disabled={!selectedPersona}
                            >
                              <option value="">Select workflow</option>
                              {filteredWorkflows.map((w) => (
                                <option key={w.Id} value={w.Id}>
                                  {w.Title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Customer */}
                          <div className="input-block">
                            <label>Customer</label>
                            <select
                              value={selectedCustomer}
                              onChange={(e) =>
                                setSelectedCustomer(e.target.value)
                              }
                              disabled={!selectedIndustry}
                            >
                              <option value="">Select customer</option>
                              {filteredCustomers.map((c) => (
                                <option key={c.Id} value={c.Id}>
                                  {c.Title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Technology */}
                          <div className="input-block">
                            <label>Technology Focus</label>
                            <select
                              value={selectedTechnology}
                              onChange={(e) =>
                                setSelectedTechnology(e.target.value)
                              }
                            >
                              <option value="">Select technology</option>
                              {technologies.map((t) => (
                                <option key={t.Id} value={t.Id}>
                                  {t.Title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="home-insight-actions">
                          <button
                            className="home-reset"
                            type="button"
                            onClick={handleResetFilters}
                          >
                            Reset
                          </button>
                          <button
                            className="home-view-all"
                            type="button"
                            onClick={handleGenerateJson}
                          >
                            Generate insight JSON
                          </button>
                          <button
                            className="home-view-all"
                            type="button"
                            onClick={handleCopyJson}
                          >
                            Copy for AI →
                          </button>
                        </div>

                        {jsonOutput && (
                          <pre className="home-json-preview">
                            {jsonOutput}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE: welcome content */}
                  <div className="home-insight-right">
                    <h1 className="home-welcome-title">Welcome Josh.</h1>
                    <h2 className="home-welcome-subtitle">
                      AI Intelligent Insight Builder
                    </h2>
                    <p className="home-welcome-description">
                      Filter the specification of your program to filter through
                      hundreds of global data metrics to identify design
                      opportunities for our customers.
                    </p>
                    <p className="home-loading">Loading insights…</p>
                  </div>
                </div>
              </section>

              {/* DIVIDER LINE */}
              <div className="home-section-divider"></div>

              {/* FOUR GREY CARDS SECTION – OPPORTUNITY STACK */}
              <section className="home-opportunities-section">
                <OpportunityStack
                  opportunities={opportunityData}
                  onAddToWorkspace={onAddToWorkspace}
                  workspaceItems={workspaceItems}
                />
              </section>

              <section className="insight-panel">
                <InsightPanel />
              </section>
            </>
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
      {/* HOME – full hero + insight builder */}
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
