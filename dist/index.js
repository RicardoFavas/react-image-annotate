import React from "react";
import ReactDOM from "react-dom";
import Theme from "./Theme";
import DemoSite from "./DemoSite";
import LandingPage from "./LandingPage";
import "./site.css";

var Site = function Site() {
  var path = window.location.pathname.replace(/\/$/, "").split("/").slice(-1)[0];
  return /*#__PURE__*/React.createElement(Theme, null, path === "demo" ? /*#__PURE__*/React.createElement(DemoSite, null) : /*#__PURE__*/React.createElement(LandingPage, null));
};

ReactDOM.render( /*#__PURE__*/React.createElement(Site, null), document.getElementById("root"));