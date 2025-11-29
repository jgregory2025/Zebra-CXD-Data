// NavBar.jsx
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
const NAV_ITEMS = [
 { label: 'Home', path: '/' },
 { label: 'Markets Analysis', path: '/markets' },
 { label: 'Customer Insight', path: '/customer-insight' },
 { label: 'Persona & Workflows', path: '/personas-workflows' },
 { label: 'Projects', path: '/projects' },
 { label: 'Industry Opportunities', path: '/industry-opportunities' },
];
function NavBar() {
 const location = useLocation();
 const containerRef = useRef(null);
 const itemRefs = useRef([]);
 const [indicatorStyle, setIndicatorStyle] = useState({
   left: 0,
   width: 0,
   opacity: 0,
 });
 // Measure the active item and move the pill
 useEffect(() => {
   const activeIndex =
     NAV_ITEMS.findIndex((item) => item.path === location.pathname) ?? 0;
   const fallbackIndex = activeIndex === -1 ? 0 : activeIndex;
   const activeEl = itemRefs.current[fallbackIndex];
   if (activeEl && containerRef.current) {
     const { offsetLeft, offsetWidth } = activeEl;
     setIndicatorStyle({
       left: offsetLeft,
       width: offsetWidth,
       opacity: 1,
     });
   }
 }, [location.pathname]);
 return (
<nav className="app__nav" ref={containerRef}>
     {/* Sliding pill indicator */}
<div className="app__nav-indicator" style={indicatorStyle} />
     {NAV_ITEMS.map((item, index) => (
<NavLink
         key={item.path}
         to={item.path}
         ref={(el) => (itemRefs.current[index] = el)}
         className={({ isActive }) =>
           'app__nav-item' + (isActive ? ' app__nav-item--active' : '')
         }
>
         {item.label}
</NavLink>
     ))}
</nav>
 );
}
export default NavBar;