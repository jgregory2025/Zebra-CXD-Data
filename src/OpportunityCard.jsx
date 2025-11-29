// OpportunityCard.jsx
import "./OpportunityCard.css";
export default function OpportunityCard({
 id,
 confidence,
 title,
 why,
 designApproach,
 onAddToWorkspace,
 isWorkspace = false,
 isInWorkspace = false,
 onRemove,
 onDevelop,
}) {
 return (
<div
     className={[
       "opp-card",
       isWorkspace ? "opp-card--workspace" : "",
       !isWorkspace && isInWorkspace ? "opp-card--added" : "",
     ]
       .filter(Boolean)
       .join(" ")}
>
     {/* ---------- TOP AREA ---------- */}
<div className="opp-card__top">
       {/* LEFT SIDE */}
       {isWorkspace ? (
         // Workspace: confidence top-left
<div className="opp-card__confidence opp-card__confidence--left">
           {confidence}
<span className="opp-card__confidence-label">
             Confidence Score
</span>
</div>
       ) : (
         // Home: ID + circle
<div className="opp-card__id-row">
<span className="opp-card__circle"></span>
<span className="opp-card__id">{id}</span>
</div>
       )}
       {/* RIGHT SIDE – confidence (home only) */}
       {!isWorkspace && (
<div className="opp-card__confidence">
           {confidence}
<span className="opp-card__confidence-label">
             Confidence Score
</span>
</div>
       )}
</div>
     {/* ---------- BODY ---------- */}
<h3 className="opp-card__title">{title}</h3>
<div className="opp-card__section">
<h4>Why?</h4>
<p>{why}</p>
</div>
<div className="opp-card__section">
<h4>Design Approach</h4>
<p>{designApproach}</p>
</div>
     {/* ---------- FOOTER BUTTONS ---------- */}
<div className="opp-card__footer">
       {isWorkspace ? (
         // Workspace: two buttons side-by-side
<div className="opp-card__footer-btns">
<button
             type="button"
             className="opp-card__develop-btn"
             onClick={onDevelop}
>
             Develop concept
</button>
<button
             type="button"
             className="opp-card__remove-btn"
             onClick={onRemove}
>
             Remove opportunity
</button>
</div>
       ) : (
         // Home: Add / Added button
<button
           type="button"
           className={
             "opp-card__add-btn" +
             (isInWorkspace ? " opp-card__add-btn--added" : "")
           }
           onClick={!isInWorkspace ? onAddToWorkspace : undefined}
           disabled={isInWorkspace}
>
           {isInWorkspace ? "Added to workspace" : "Add to Workspace"}
</button>
       )}
</div>
</div>
 );
}