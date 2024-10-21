import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import hook để lấy thông tin người dùng

const AdminPage = () => {
  const { user } = useAuth(); // Lấy thông tin user từ context

  // Kiểm tra nếu user không phải là admin (trường hợp dự phòng nếu route protection chưa làm)
  if (user.role !== 'admin') {
    return <p>Access Denied. You do not have permission to view this page.</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email} (Role: {user.role})</p>
      
      {/* Các chức năng chỉ dành cho admin */}
      <div>
        <h2>User Management</h2>
        {/* Ví dụ thêm chức năng quản lý người dùng */}
        <button>View All Users</button>
        <button>Add New User</button>
      </div>

      <div>
        <h2>Other Admin Controls</h2>
        {/* Thêm các chức năng khác cho admin ở đây */}
        <button>Manage Data</button>
        <button>View Reports</button>
      </div>
    </div>
  );
};

export default AdminPage;
