import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiCalendar, 
  FiHome as FiHotel, 
  FiPlane,
  FiChevronLeft,
  FiChevronRight,
  FiUser
} from 'react-icons/fi';
import { MdDashboard, MdOutlineHotel, MdOutlineFlight } from 'react-icons/md';
import { BiBookmark } from 'react-icons/bi';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", name: "Dashboard", icon: MdDashboard },
    { path: "/bookings", name: "Bookings", icon: BiBookmark },
    { path: "/hotels", name: "Hotels", icon: MdOutlineHotel },
    { path: "/flights", name: "Flights", icon: MdOutlineFlight },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-30 
        flex flex-col
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        text-white
        transition-all duration-300 ease-in-out
        shadow-2xl
        ${isCollapsed ? 'w-20' : 'w-72'}
        h-screen
      `}>
        
        {/* Header with collapse toggle */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MdOutlineFlight className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                TravelApp
              </h2>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <MdOutlineFlight className="w-6 h-6 text-white" />
            </div>
          )}
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FiChevronRight className="w-5 h-5" />
            ) : (
              <FiChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl
                      transition-all duration-200 group
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 text-white' 
                        : 'hover:bg-white/10 text-white/80 hover:text-white'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.name : ''}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'} transition-colors`} />
                    {!isCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <Link
            to="/profile"
            className={`
              flex items-center gap-3 p-2 rounded-xl
              transition-all duration-200 hover:bg-white/10
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? "Profile" : ""}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-white/60">john@example.com</p>
              </div>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;