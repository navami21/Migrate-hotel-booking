import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Booking"; 
import Hotels from "./pages/Hotels";
import Flights from "./pages/Flights";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/flights" element={<Flights />} />
    </Routes>
  );
}

export default App;