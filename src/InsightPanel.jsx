// InsightPanel.jsx
import React from "react";
import "./InsightPanel.css";
// ---- SAMPLE DATA ----
const sampleChartData = [
 { month: "Jan", industry: 80, tech: 25, risk: 10 },
 { month: "Feb", industry: 35, tech: 15, risk: 20 },
 { month: "Mar", industry: 45, tech: 20, risk: 15 },
 { month: "Apr", industry: 10, tech: 10, risk: 10 },
 { month: "May", industry: 50, tech: 10, risk: 20 },
 { month: "Jun", industry: 35, tech: 25, risk: 15 },
 { month: "Jul", industry: 40, tech: 20, risk: 15 },
 { month: "Aug", industry: 55, tech: 25, risk: 15 },
 { month: "Sep", industry: 45, tech: 30, risk: 20 },
 { month: "Oct", industry: 30, tech: 30, risk: 10 },
 { month: "Nov", industry: 50, tech: 10, risk: 20 },
 { month: "Dec", industry: 35, tech: 25, risk: 15 },
];
const sampleObservations = [
 {
   id: "OBS-0012",
   comment: "High mis-pick rate on Zone B aisle, likely due to similar box sizes.Frequent screen and device switching increases mental load and the likelihood of mistakes.",
   datetime: "Dec 1, 2025 10:32 AM",
 },
 {
   id: "OBS-0013",
   comment: "New associates taking 2x longer to confirm picks during peak hours.",
   datetime: "Dec 2, 2025 09:14 AM",
 },
 {
   id: "OBS-0014",
   comment: "Cognitive overload when switching between handheld and screen workflow.",
   datetime: "Dec 3, 2025 01:05 PM",
 },
];
function InsightPanel({
 chartData = sampleChartData,
 observations = sampleObservations,
}) {
 // ==== sizing & axis ====
 const stackedMax = chartData.reduce(
   (max, d) => Math.max(max, d.industry + d.tech + d.risk),
   0
 );
 const topTickRaw = stackedMax || 60;
 const topTick = Math.ceil(topTickRaw / 20) * 20; // nice round top
 const chartHeight = 200; // px
 const scale = chartHeight / topTick; // value -> px
 const yTicks = [
   topTick,
   Math.round((topTick * 2) / 3),
   Math.round(topTick / 3),
   0,
 ];
 return (
<section className="ip-row">
     {/* LEFT: PAIN POINT INSIGHT BAR CHART */}
<div className="ip-card ip-card--chart">
<div className="ip-header">
<h3>Pain Point Insight</h3>
<p>Monthly view of industry &amp; tech signals</p>
</div>
       {/* Legend floating top-right */}
<div className="ip-legend ip-legend--top-right">
<div className="ip-legend-item">
<span className="ip-legend-swatch ip-legend-swatch--industry" />
<span>Industry</span>
</div>
<div className="ip-legend-item">
<span className="ip-legend-swatch ip-legend-swatch--tech" />
<span>Tech</span>
</div>
<div className="ip-legend-item">
<span className="ip-legend-swatch ip-legend-swatch--risk" />
<span>Risk</span>
</div>
</div>
       {/* Chart shell: gridlines + bars */}
<div className="ip-chart-shell">
         {/* Gridlines + labels (background layer) */}
         {yTicks.map((t) => {
           const pct = (t / topTick) * 100; // position from bottom
           return (
<div
               key={t}
               className="ip-grid-row"
               style={{ bottom: `${pct}%` }}
>
<span className="ip-yaxis-label">{t}</span>
<div className="ip-gridline-full" />
</div>
           );
         })}
         {/* Bars (foreground layer) */}
<div className="ip-bars">
           {chartData.map((d) => (
<div key={d.month} className="ip-bar-col">
<div className="ip-bar">
<div
                   className="ip-bar-seg ip-bar-seg--risk"
                   style={{ height: `${d.risk * scale}px` }}
                 />
<div
                   className="ip-bar-seg ip-bar-seg--tech"
                   style={{ height: `${d.tech * scale}px` }}
                 />
<div
                   className="ip-bar-seg ip-bar-seg--industry"
                   style={{ height: `${d.industry * scale}px` }}
                 />
</div>
<span className="ip-bar-label">{d.month}</span>
</div>
           ))}
</div>
</div>
</div>
     {/* RIGHT: OBSERVATIONS TABLE */}
<div className="ip-card ip-card--table">
<div className="ip-header">
<h3>Observations</h3>
<p>Pulled from Observations list in SharePoint</p>
</div>
<div className="ip-table-wrapper">
<table className="ip-table">
<thead>
<tr>
<th>OBS ID</th>
<th>Comment</th>
<th>Date / Time</th>
</tr>
</thead>
<tbody>
     {observations.map((row) => (
<tr key={row.id}>
<td>{row.id}</td>
<td className="ip-table-comment">{row.comment}</td>
<td>{row.datetime}</td>
</tr>
     ))}
</tbody>
</table>
</div>
</div>
</section>
 );
}
export default InsightPanel;