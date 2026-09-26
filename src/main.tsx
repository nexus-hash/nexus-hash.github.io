import React from "react";
import ReactDOM from "react-dom/client";
import { LazyMotion, domMax } from "framer-motion";
import App from "./App";
import "./index.css";

// LazyMotion + `m` components: only the animation features we use (domMax,
// because the experience cards need `layout`) ship in the bundle, instead of
// the full `motion` runtime.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LazyMotion features={domMax} strict>
      <App />
    </LazyMotion>
  </React.StrictMode>
);
