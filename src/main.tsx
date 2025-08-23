import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* BrowserRouter로 감싸기 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
