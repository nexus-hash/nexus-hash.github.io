import React from "react";
import ReactDOM from "react-dom/client";
import { LazyMotion, domAnimation } from "framer-motion";
import App from "./App";
import "./index.css";

// LazyMotion + `m` components with the small `domAnimation` feature set
// (animate / whileInView / exit). No layout animations are used, so the
// heavier `domMax` bundle isn't needed.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </React.StrictMode>
);
