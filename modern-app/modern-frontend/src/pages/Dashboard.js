// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import StatsCard from "../components/StatsCard";
// import BookingCard from "../components/BookingCard";

// function Dashboard() {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:6001/bookings")
//       .then(res => setBookings(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-100">

//       <Sidebar />

//       <div className="flex-1 p-6 overflow-y-auto">

//         <Navbar />

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <StatsCard title="Total Bookings" value={bookings.length} />
//           <StatsCard
//             title="Rooms Booked"
//             value={bookings.reduce((acc, b) => acc + b.rooms.length, 0)}
//           />
//           <StatsCard title="Customers" value={bookings.length} />
//         </div>

//         {/* Booking Cards */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {bookings.map((b, i) => (
//             <BookingCard key={i} booking={b} />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiCalendar, 
  FiUsers, 
  FiDollarSign,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { MdOutlineHotel } from "react-icons/md";
import { BiTrendingUp, BiTrendingDown } from "react-icons/bi";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import BookingCard from "../components/BookingCard";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const fetchBookings = async () => {
    try {
      setError(null);
      const response = await axios.get("http://localhost:6001/bookings");
      setBookings(response.data);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setCurrentPage(1); // Reset to first page on refresh
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalRooms = bookings.reduce((acc, b) => acc + (b.rooms?.length || 0), 0);
  const totalCustomers = totalBookings;
  const averageBookingValue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0) / totalBookings || 0;
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const statsData = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: FiCalendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "+12%",
      trendUp: true,
      description: "vs last month"
    },
    {
      title: "Rooms Booked",
      value: totalRooms,
      icon: MdOutlineHotel,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "+8%",
      trendUp: true,
      description: "vs last month"
    },
    {
      title: "Active Customers",
      value: totalCustomers,
      icon: FiUsers,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      trend: "+15%",
      trendUp: true,
      description: "vs last month"
    },
    {
      title: "Avg. Booking Value",
      value: `$${averageBookingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: FiDollarSign,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      trend: "+5%",
      trendUp: true,
      description: "vs last month"
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        
        <div className="p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your bookings today.</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm ${
                    refreshing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>
            </div>
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <div className="flex items-center gap-1">
                        {stat.trendUp ? (
                          <BiTrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <BiTrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                    <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
                  </div>
                  <div className={`h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                </div>
              ))}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-700 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">Please check your connection and try again.</p>
              </div>
              <button
                onClick={handleRefresh}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Bookings Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, bookings.length)} of {bookings.length} bookings
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCalendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6">Start by creating your first booking to see it here.</p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  Create New Booking
                </button>
              </div>
            ) : (
              <>
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Avg. Stay Duration</p>
                    <p className="text-xl font-bold text-gray-900">3.2 days</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                    <p className="text-xl font-bold text-green-600">94%</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Active Bookings</p>
                    <p className="text-xl font-bold text-blue-600">{bookings.length}</p>
                  </div>
                </div>

                {/* Booking Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentBookings.map((booking, index) => (
                    <div
                      key={index}
                      className="transform transition-all duration-300 hover:-translate-y-1"
                    >
                      <BookingCard booking={booking} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 border border-gray-300 rounded-lg transition-colors flex items-center gap-1 ${
                          currentPage === 1
                            ? 'opacity-50 cursor-not-allowed bg-gray-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                      
                      <div className="flex gap-1">
                        {getPageNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={index} className="px-3 py-2 text-gray-500">
                              ...
                            </span>
                          ) : (
                            <button
                              key={index}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        ))}
                      </div>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 border border-gray-300 rounded-lg transition-colors flex items-center gap-1 ${
                          currentPage === totalPages
                            ? 'opacity-50 cursor-not-allowed bg-gray-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span>Next</span>
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Go to page:</span>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (page >= 1 && page <= totalPages) {
                            handlePageChange(page);
                          }
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;