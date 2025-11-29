// OpportunityStack.jsx
import "./OpportunityStack.css";
import OpportunityCard from "./OpportunityCard";
export default function OpportunityStack({
 opportunities,
 onAddToWorkspace,
 workspaceItems = [],
}) {
 return (
<div className="opp-stack">
     {opportunities.map((item, index) => {
       const isInWorkspace = workspaceItems.some(
         (w) => w.id === item.id
       );
       return (
<OpportunityCard
           key={index}
           id={item.id}
           confidence={item.confidence}
           title={item.title}
           why={item.why}
           designApproach={item.designApproach}
           onAddToWorkspace={() =>
             !isInWorkspace && onAddToWorkspace && onAddToWorkspace(item)
           }
           isWorkspace={false}
           isInWorkspace={isInWorkspace}
         />
       );
     })}
</div>
 );
}