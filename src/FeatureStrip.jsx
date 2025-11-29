// FeatureStrip.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import marketImg from './assets/Market.jpg';
import projectsImg from './assets/Product.jpg';
import customersImg from './assets/Customer.jpg';
import personasImg from './assets/Workflow.jpg';
import industryImg from './assets/Industry.jpg';
const CARDS = [
 {
   id: 'markets',
   title: 'Market Analysis',
   description:
     'Industry opportunities, volatility and growth signals powered by CXDplus data.',
   image: marketImg,
   link: '/markets',
 },
 {
   id: 'projects',
   title: 'Projects Library',
   description:
     'Browse active and past CXD projects with scorecards, assets and learnings.',
   image: projectsImg,
   link: '/projects',
 },
 {
   id: 'customers',
   title: 'Customer Insight',
   description:
     'Voice of customer, pain points and sentiment trends in one place.',
   image: customersImg,
   link: '/customer-insight',
 },
 {
   id: 'personas',
   title: 'Persona & Workflows',
   description:
     'Personas, journeys and workflows to align CXD, product and engineering.',
   image: personasImg,
   link: '/personas-workflows',
 },
 {
   id: 'industry',
   title: 'Industry Opportunities',
   description:
     'Cross-industry signals highlighting where new solutions can win.',
   image: industryImg,
   link: '/industry-opportunities',
 },
];
function FeatureStrip() {
 const [activeId, setActiveId] = useState(CARDS[0].id);
 const navigate = useNavigate();
 return (
<section className="feature-strip">
<div className="feature-strip__inner">
       {CARDS.map((card) => {
         const isActive = card.id === activeId;
         return (
<article
             key={card.id}
             className={
               'feature-card' + (isActive ? ' feature-card--active' : '')
             }
             onMouseEnter={() => setActiveId(card.id)}
             onFocus={() => setActiveId(card.id)}
             tabIndex={0}
>
<img
               src={card.image}
               alt={card.title}
               className="feature-card__image"
             />
<div className="feature-card__gradient" />
<div className="feature-card__content">
<h3 className="feature-card__title">{card.title}</h3>
<p className="feature-card__description">
                 {card.description}
</p>
<div className="feature-card__actions">
                 {/* Grey arrow (non-active visual only) */}
<button className="feature-card__arrow" type="button">
<span>→</span>
</button>
                 {/* Blue CTA – navigates to the card route */}
<button
                   type="button"
                   className="feature-card__cta"
                   onClick={(e) => {
                     e.stopPropagation();
                     navigate(card.link);
                   }}
>
<span>View all</span>
<span className="feature-card__cta-arrow">→</span>
</button>
</div>
</div>
</article>
         );
       })}
</div>
</section>
 );
}
export default FeatureStrip;