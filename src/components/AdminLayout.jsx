import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBed, FaUtensils, FaSuitcase, FaBox } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout flex">
      {/* Sidebar */}
      <aside className={`bg-white shadow-md ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 h-screen`}>
        <div className="flex items-center justify-between p-4">
          {sidebarOpen && (
            <h2 className="text-xl font-bold">Dashboard</h2>
          )}
          <button onClick={toggleSidebar} className="text-gray-600">
            <FaBars />
          </button>
        </div>
        {sidebarOpen && (
          <nav className="mt-5">
            <ul>
              <li className="flex items-center p-2 hover:bg-gray-200 transition duration-200">
                <Link to="/room" className="flex items-center">
                  <FaBed className="mr-2" />
                  <span>Quản Lý Phòng</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 transition duration-200">
                <Link to="/food" className="flex items-center">
                  <FaUtensils className="mr-2" />
                  <span>Quản Lý Đồ Ăn</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 transition duration-200">
                <Link to="/tour" className="flex items-center">
                  <FaSuitcase className="mr-2" />
                  <span>Quản Lý Tour</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 transition duration-200">
                <Link to="/ordermanagement" className="flex items-center">
                  <FaBox className="mr-2" />
                  <span>Quản Lý Đơn Hàng</span>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
