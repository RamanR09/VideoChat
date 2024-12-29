import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Call from "./pages/Call";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        {/* Navbar is present on all pages */}
        <Navbar />
        <Routes>
          {/* Define all routes for the app */}
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/call/:roomId" element={<Call />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
