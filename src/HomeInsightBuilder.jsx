When // src/HomeInsightBuilder.jsx
import React from 'react';
function HomeInsightBuilder() {
 return (
<section className="home-insight-builder">
<div className="home-insight-inner">
       {/* LEFT SIDE */}
<div className="home-insight-left">
<div className="home-insight-title-row">
<span className="home-subtitle-circle"></span>
<p className="home-insight-breadcrumb">
             Customer Experience Design Repository
</p>
</div>
<div className="home-insight-form">
<h3>Select Project Specifications</h3>
<div className="home-insight-grid">
<div className="input-block">
<label>Industry *</label>
<select>
<option>Select industry</option>
</select>
</div>
<div className="input-block">
<label>Persona *</label>
<select>
<option>Select persona</option>
</select>
</div>
<div className="input-block">
<label>Product type *</label>
<select>
<option>Select product</option>
</select>
</div>
<div className="input-block">
<label>Workflow *</label>
<select>
<option>Select workflow</option>
</select>
</div>
<div className="input-block">
<label>Customer</label>
<select>
<option>Select customer</option>
</select>
</div>
<div className="input-block">
<label>Technology Focus</label>
<select>
<option>Select technology</option>
</select>
</div>
</div>
<div className="home-insight-actions">
<button className="home-reset" type="button">Reset</button>
<button className="home-view-all" type="button">
               View All →
</button>
</div>
</div>
</div>
       {/* RIGHT SIDE */}
<div className="home-insight-right">
<h1 className="home-welcome-title">Welcome Josh.</h1>
<h2 className="home-welcome-subtitle">
           AI Intelligent Insight Builder
</h2>
<p className="home-welcome-description">
           Filter the specification of your program to filter through hundreds
           of global data metrics to identify design opportunities for our
           customers.
</p>
<p className="home-loading">Loading insights…</p>
</div>
</div>
</section>
 );
}
export default HomeInsightBuilder;