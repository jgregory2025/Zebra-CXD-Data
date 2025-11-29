// LoginPage.jsx
import React, { useState } from "react";
import "./LoginPage.css";
import Logo from "./assets/CXD+_logo.svg";
import HeroImage from "./assets/Product.jpg";
function LoginPage({ onLogin }) {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const handleSubmit = (e) => {
   e.preventDefault();
   onLogin();
 };
 return (
<div className="lp">
     {/* LEFT HERO BACKGROUND + OVERLAY */}
<div
       className="lp__left"
       style={{ backgroundImage: `url(${HeroImage})` }}
>
<div className="lp__left-overlay"></div>
       {/* CXD LOGO TOP LEFT */}
<div className="lp__top-left">
<img src={Logo} alt="CXD+" className="lp__logo" />
</div>
       {/* TAGLINE + STRAPLINE BOTTOM LEFT */}
<div className="lp__bottom-left">
<p className="lp__tagline-small">
           Customer Experience Design Repository
</p>
<p className="lp__strapline">
           Design Innovation<br />With Our Intelligence
</p>
</div>
</div>
     {/* RIGHT PANEL */}
<div className="lp__right">
<div className="lp__panel">
         {/* TITLE & SUBTITLE (CENTERED) */}
<div className="lp__header-center">

<h1 className="lp__title">Welcome to CXD+</h1>
<p className="lp__subtitle">
             Explore metrics influencing our business<br /> to find the best design opportunities.
</p>
</div>
         {/* FORM */}
<form className="lp__form" onSubmit={handleSubmit}>
           {/* USERNAME FIELD */}
<div className="lp__field">
<label className="lp__floating-label">Username</label>
<input
               className="lp__input"
               type="text"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
             />
</div>
           {/* PASSWORD FIELD */}
<div className="lp__field">
<label className="lp__floating-label">Password</label>
<input
               className="lp__input"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
             />
</div>
<button className="lp__button">Continue</button>
</form>
<button className="lp__help">Need help?</button>
</div>
</div>
</div>
 );
}
export default LoginPage;