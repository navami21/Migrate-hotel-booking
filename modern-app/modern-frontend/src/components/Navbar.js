import React from "react";

function Navbar() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Modern Booking Dashboard</h1>
      <div className="bg-white px-4 py-2 rounded shadow">
        Admin
      </div>
    </div>
  );
}

export default Navbar;