import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default Layout;