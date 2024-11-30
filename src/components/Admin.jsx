import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUtensils, FaBed, FaSuitcase, FaBox } from 'react-icons/fa';
import axios from 'axios';

const AdminPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalTours: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Hàm gọi API để lấy dữ liệu thống kê
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats'); // Giả sử API này trả về dữ liệu thống kê
        setStats({
          totalRooms: response.data.totalRooms,
          totalTours: response.data.totalTours,
          totalUsers: response.data.totalUsers,
        });
        setLoading(false);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-md ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
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
              <li className={`flex items-center p-2 hover:bg-gray-200 transition duration-200`}>
                <Link to="/room" className="flex items-center">
                  <FaBed className="mr-2" />
                  <span>Quản Lý Phòng</span>
                </Link>
              </li>
              <li className={`flex items-center p-2 hover:bg-gray-200 transition duration-200`}>
                <Link to="/food" className="flex items-center">
                  <FaUtensils className="mr-2" />
                  <span>Quản Lý Đồ Ăn</span>
                </Link>
              </li>
              <li className={`flex items-center p-2 hover:bg-gray-200 transition duration-200`}>
                <Link to="/tour" className="flex items-center">
                  <FaSuitcase className="mr-2" />
                  <span>Quản Lý Tour</span>
                </Link>
              </li>
              <li className={`flex items-center p-2 hover:bg-gray-200 transition duration-200`}>
                <Link to="/ordermanagement" className="flex items-center">
                  <FaBox className="mr-2" />
                  <span>Quản Lý Đơn Hàng</span>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </aside>

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
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold">Tổng Số Phòng</h3>
                <p className="text-2xl">{stats.totalRooms}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold">Tổng Số Tour</h3>
                <p className="text-2xl">{stats.totalTours}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold">Tổng Số Người Dùng</h3>
                <p className="text-2xl">{stats.totalUsers}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
