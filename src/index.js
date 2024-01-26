import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <div className="Nombre_Alumno">
      <h1>Alumno: Iván Llaguno Vázquez.</h1>
    </div>
    <App />
  </StrictMode>
);