import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import KeybodeMainpage from "./pages/KeybodeMain";
import TypingPage from "./pages/TypingPage";

const App = () => {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} /> {/* 첫페이지 */}
      <Route path="typing" element={<KeybodeMainpage />} /> {/* 첫페이지 */}
      <Route path="ty" element={<TypingPage />} /> {/* 첫페이지 */}
    </Routes>
  );
};

export default App;
