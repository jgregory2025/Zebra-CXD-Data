// SupabaseTest.jsx – Industry/Customer/Persona + Workflow text + Problems list + Product Type
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./SupabaseTest.css";

export default function SupabaseTest() {
  // Database tables
  const [industries, setIndustries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  // Selected dropdown values
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");

  // Free text workflow
  const [workflowText, setWorkflowText] = useState("");

  // Problems / pain points (bullet list)
  const [problemInput, setProblemInput] = useState("");
  const [problems, setProblems] = useState([]);

  // Product type checkboxes
  const [productHardware, setProductHardware] = useState(false);
  const [productSoftware, setProductSoftware] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copyMsg, setCopyMsg] = useState("");
  const [pasteMsg, setPasteMsg] = useState("");

  // Loaded opportunity cards
  const [generatedOpps, setGeneratedOpps] = useState([]);

  // Load Supabase data
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [ind, cust, per, tech] = await Promise.all([
        supabase.from("industries").select("*").order("title"),
        supabase.from("customers").select("*").order("title"),
        supabase.from("personas").select("*").order("title"),
        supabase.from("technologies").select("*").order("title"),
      ]);

      const error = ind.error || cust.error || per.error || tech.error;

      if (error) {
        setErrorMsg(error.message);
      } else {
        setIndustries(ind.data || []);
        setCustomers(cust.data || []);
        setPersonas(per.data || []);
        setTechnologies(tech.data || []);
      }
      setLoading(false);
    };

    load();
  }, []);

  // Helpers
  const findById = (arr, id) => arr.find((a) => a.id === id) || null;

  const selectedIndustryObj = findById(industries, selectedIndustry);
  const selectedCustomerObj = findById(customers, selectedCustomer);
  const selectedPersonaObj = findById(personas, selectedPersona);
  const selectedTechObj = findById(technologies, selectedTechnology);

  // Filtered dropdowns
  const filteredCustomers = customers.filter((c) =>
    selectedIndustry ? c.industry_id === selectedIndustry : false
  );

  const filteredPersonas = personas.filter((p) =>
    selectedIndustry ? p.industry_id === selectedIndustry : false
  );

  // --------------------------
  // Problems list handlers
  // --------------------------
  const handleAddProblem = () => {
    const trimmed = problemInput.trim();
    if (!trimmed) return;
    setProblems((prev) => [...prev, trimmed]);
    setProblemInput("");
    setGeneratedOpps([]);
    setPasteMsg("");
  };

  const handleRemoveProblem = (index) => {
    setProblems((prev) => prev.filter((_, i) => i !== index));
    setGeneratedOpps([]);
    setPasteMsg("");
  };

  // --------------------------
  // BUILD INSIGHT JSON FOR AI
  // --------------------------
  const buildInsightJSON = () => {
    const now = new Date().toISOString();

    const payload = {
      meta: {
        tool: "CXD+ Insight Builder",
        version: "0.5",
        generated_at_utc: now,
      },

      prompt_for_ai: `
You are a Customer Experience Design strategist at Zebra Technologies.

Using ONLY the context below, generate 4 real-world, actionable design opportunities for Zebra.

You are given:
- Industry, customer and persona context.
- A free-text workflow description.
- A list of specific problems/pain points (as bullet points).
- Whether the concept should involve hardware, software, or both.

Use those bullet-point problems as the starting point for your opportunities. You may group related problems or focus on the most impactful ones, but stay very close to the list.

Each opportunity must contain the following fields EXACTLY:

- id (Opportunity 01, 02, 03, 04)
- problem (the clear friction or pain point in your own words)
- impact_if_solved (what customer/business value improves)
- solution_direction (a practical direction Zebra could explore using handhelds, devices, software, sensors, RFID, vision, analytics, workflow redesign, etc. – aligned to the product_type flags)
- confidence (percentage score, e.g. "86%")

Return ONLY valid JSON using this EXACT template — no extra text:

{
  "opportunities": [
    {
      "id": "Opportunity 01",
      "problem": "",
      "impact_if_solved": "",
      "solution_direction": "",
      "confidence": "85%"
    }
  ]
}
`.trim(),

      filters: {
        industry_id: selectedIndustry || null,
        customer_id: selectedCustomer || null,
        persona_id: selectedPersona || null,
        technology_id: selectedTechnology || null,
      },

      context: {
        industry: selectedIndustryObj
          ? {
              id: selectedIndustryObj.id,
              title: selectedIndustryObj.title,
              description: selectedIndustryObj.description,
            }
          : null,

        customer: selectedCustomerObj
          ? {
              id: selectedCustomerObj.id,
              title: selectedCustomerObj.title,
              description: selectedCustomerObj.description,
            }
          : null,

        persona: selectedPersonaObj
          ? {
              id: selectedPersonaObj.id,
              title: selectedPersonaObj.title,
              role: selectedPersonaObj.role,
              description: selectedPersonaObj.description,
            }
          : null,

        workflow_description: workflowText || null,

        technology: selectedTechObj
          ? {
              id: selectedTechObj.id,
              title: selectedTechObj.title,
              category: selectedTechObj.category,
              description: selectedTechObj.description,
            }
          : null,

        problems: problems.length > 0 ? problems : null,

        product_type: {
          hardware: productHardware,
          software: productSoftware,
        },
      },
    };

    return JSON.stringify(payload, null, 2);
  };

  // COPY JSON
  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(buildInsightJSON());
      setCopyMsg("Insight JSON copied — paste into Gemini.");
    } catch (e) {
      setCopyMsg("Could not copy JSON.");
    }
  };

  // IMPORT JSON from clipboard and render cards
  const handleImportFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setPasteMsg("Clipboard is empty.");
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        setPasteMsg("Clipboard does not contain valid JSON.");
        return;
      }

      if (!parsed.opportunities || !Array.isArray(parsed.opportunities)) {
        setPasteMsg("JSON has no 'opportunities' array.");
        return;
      }

      setGeneratedOpps(parsed.opportunities.slice(0, 4));
      setPasteMsg("Opportunities loaded.");
    } catch (e) {
      setPasteMsg("Unable to read clipboard.");
    }
  };

  const reset = () => {
    setSelectedIndustry("");
    setSelectedCustomer("");
    setSelectedPersona("");
    setSelectedTechnology("");
    setWorkflowText("");
    setProblemInput("");
    setProblems([]);
    setProductHardware(false);
    setProductSoftware(false);
    setCopyMsg("");
    setPasteMsg("");
    setGeneratedOpps([]);
  };

  // ------------------------------------
  // RENDER COMPONENT
  // ------------------------------------
  return (
    <div className="supabase-test">
      <div className="supabase-card">
        <div className="supabase-header">
          <div>
            <p className="supabase-kicker">CXD+ Insight Builder</p>
            <h2 className="supabase-title">
              Generate AI-ready opportunity JSON
            </h2>
            <p className="supabase-description">
              1) Choose industry, customer, persona & workflow. 2) Add problems
              as bullets and set product type. 3) Copy JSON for Gemini, then
              paste the AI output back to see structured opportunities.
            </p>
          </div>
          <div className="supabase-meta">
            <span className="supabase-tag">Prototype</span>
            <span className="supabase-tag supabase-tag--green">Supabase</span>
          </div>
        </div>

        {loading && (
          <p className="supabase-status supabase-status--neutral">
            Loading data…
          </p>
        )}
        {errorMsg && <p className="supabase-error">{errorMsg}</p>}

        {!loading && !errorMsg && (
          <>
            {/* SPECIFICATION FORM */}
            <div className="supabase-form">
              <h3 className="supabase-section-title">Project specification</h3>

              <div className="supabase-grid supabase-grid--3">
                {/* INDUSTRY */}
                <div className="supabase-input-block">
                  <label className="supabase-label">Industry *</label>
                  <select
                    className="supabase-input"
                    value={selectedIndustry}
                    onChange={(e) => {
                      setSelectedIndustry(e.target.value);
                      setSelectedCustomer("");
                      setSelectedPersona("");
                      setGeneratedOpps([]);
                    }}
                  >
                    <option value="">Select industry</option>
                    {industries.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CUSTOMER */}
                <div className="supabase-input-block">
                  <label className="supabase-label">Customer</label>
                  <select
                    className="supabase-input"
                    value={selectedCustomer}
                    disabled={!selectedIndustry}
                    onChange={(e) => {
                      setSelectedCustomer(e.target.value);
                      setGeneratedOpps([]);
                    }}
                  >
                    <option value="">Select customer</option>
                    {filteredCustomers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PERSONA */}
                <div className="supabase-input-block">
                  <label className="supabase-label">Persona</label>
                  <select
                    className="supabase-input"
                    value={selectedPersona}
                    disabled={!selectedIndustry}
                    onChange={(e) => {
                      setSelectedPersona(e.target.value);
                      setGeneratedOpps([]);
                    }}
                  >
                    <option value="">Select persona</option>
                    {filteredPersonas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TECHNOLOGY (optional) */}
                <div className="supabase-input-block">
                  <label className="supabase-label">Technology (optional)</label>
                  <select
                    className="supabase-input"
                    value={selectedTechnology}
                    onChange={(e) => {
                      setSelectedTechnology(e.target.value);
                      setGeneratedOpps([]);
                    }}
                  >
                    <option value="">Any technology</option>
                    {technologies.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PRODUCT TYPE CHECKBOXES */}
                <div className="supabase-input-block supabase-input-block--full">
                  <span className="supabase-label">
                    Product type (select one or both)
                  </span>
                  <div className="supabase-toggle-row">
                    <label className="supabase-toggle">
                      <input
                        type="checkbox"
                        checked={productHardware}
                        onChange={(e) => {
                          setProductHardware(e.target.checked);
                          setGeneratedOpps([]);
                        }}
                      />
                      <span>Hardware</span>
                    </label>

                    <label className="supabase-toggle">
                      <input
                        type="checkbox"
                        checked={productSoftware}
                        onChange={(e) => {
                          setProductSoftware(e.target.checked);
                          setGeneratedOpps([]);
                        }}
                      />
                      <span>Software</span>
                    </label>
                  </div>
                </div>

                {/* WORKFLOW TEXT */}
                <div className="supabase-input-block supabase-input-block--full">
                  <label className="supabase-label">Workflow description</label>
                  <input
                    className="supabase-input"
                    type="text"
                    placeholder="e.g., Associate picks online grocery orders from shelves using a handheld…"
                    value={workflowText}
                    onChange={(e) => {
                      setWorkflowText(e.target.value);
                      setGeneratedOpps([]);
                    }}
                  />
                </div>

                {/* PROBLEMS / PAIN POINTS */}
                <div className="supabase-input-block supabase-input-block--full">
                  <label className="supabase-label">
                    Problems / pain points (add as bullets)
                  </label>
                  <div className="supabase-row">
                    <input
                      className="supabase-input supabase-input--inline"
                      type="text"
                      placeholder="e.g., Too many mis-picks when shelves are crowded"
                      value={problemInput}
                      onChange={(e) => setProblemInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddProblem();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="supabase-btn supabase-btn--ghost"
                      onClick={handleAddProblem}
                      disabled={!problemInput.trim()}
                    >
                      Add
                    </button>
                  </div>

                  {problems.length > 0 && (
                    <ul className="supabase-pill-list">
                      {problems.map((p, idx) => (
                        <li key={idx} className="supabase-pill">
                          <span>{p}</span>
                          <button
                            type="button"
                            className="supabase-pill-remove"
                            onClick={() => handleRemoveProblem(idx)}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS + STATUS */}
              <div className="supabase-footer supabase-footer--actions">
                <div className="supabase-actions-left">
                  <button
                    type="button"
                    className="supabase-btn supabase-btn--ghost"
                    onClick={reset}
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    className="supabase-btn"
                    onClick={copyJSON}
                    disabled={!selectedIndustry}
                  >
                    Copy JSON for Gemini
                  </button>

                  <button
                    type="button"
                    className="supabase-btn supabase-btn--ghost"
                    onClick={handleImportFromClipboard}
                  >
                    Paste opportunities from clipboard
                  </button>
                </div>

                <div className="supabase-actions-right">
                  {copyMsg && (
                    <p className="supabase-status supabase-status--primary">
                      {copyMsg}
                    </p>
                  )}
                  {pasteMsg && (
                    <p className="supabase-status supabase-status--secondary">
                      {pasteMsg}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* OPPORTUNITY CARDS – 4 cards in a grid */}
            {generatedOpps.length > 0 && (
              <section className="supabase-opps">
                <h3 className="supabase-opps__heading">
                  AI-generated opportunities
                </h3>

                <div className="supabase-opps__grid">
                  {generatedOpps.slice(0, 4).map((opp, index) => (
                    <article
                      className="supabase-opps__card"
                      key={index}
                    >
                      <header className="supabase-opps__card-header">
                        <span className="supabase-opps__card-id">
                          {opp.id || `Opportunity 0${index + 1}`}
                        </span>
                        <span className="supabase-opps__card-confidence">
                          {opp.confidence || "—"}
                        </span>
                      </header>

                      <h4 className="supabase-opps__card-title">
                        {opp.title || opp.problem || "Untitled opportunity"}
                      </h4>

                      <div className="supabase-opps__card-body">
                        {opp.problem && (
                          <p className="supabase-opps__field supabase-opps__field--problem">
                            <span className="supabase-opps__field-label">
                              Problem
                            </span>
                            <span className="supabase-opps__field-value">
                              {opp.problem}
                            </span>
                          </p>
                        )}

                        {opp.impact_if_solved && (
                          <p className="supabase-opps__field supabase-opps__field--impact">
                            <span className="supabase-opps__field-label">
                              Impact if solved
                            </span>
                            <span className="supabase-opps__field-value">
                              {opp.impact_if_solved}
                            </span>
                          </p>
                        )}

                        {opp.solution_direction && (
                          <p className="supabase-opps__field supabase-opps__field--solution">
                            <span className="supabase-opps__field-label">
                              Solution direction
                            </span>
                            <span className="supabase-opps__field-value">
                              {opp.solution_direction}
                            </span>
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

