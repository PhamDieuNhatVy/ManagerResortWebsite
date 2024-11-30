// components/AdminPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUtensils, FaBed, FaSuitcase, FaBox } from 'react-icons/fa';

const AdminPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
    

      {/* Main Content */}
      <main className="flex-1 p-5">
        <header className="mb-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Quản Trị Viên</h1>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Quay lại
          </button>
        </header>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Bảng Thống Kê</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold">Tổng Số Phòng</h3>
              <p className="text-2xl">50</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold">Tổng Số Tour</h3>
              <p className="text-2xl">30</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold">Tổng Số Người Dùng</h3>
              <p className="text-2xl">120</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
