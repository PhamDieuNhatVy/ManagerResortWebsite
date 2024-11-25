import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Hook để lấy thông tin người dùng từ context

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();  // Lấy thông tin người dùng từ context AuthContext

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!user) {
    return <Navigate to="/login" replace />;  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  }

  // Kiểm tra quyền truy cập của người dùng (nếu có)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;  // Nếu vai trò người dùng không hợp lệ, chuyển hướng đến trang unauthorized
  }

  // Nếu người dùng đã đăng nhập và có quyền truy cập hợp lệ, render children (các route hoặc component được bảo vệ)
  return children;
};

export default PrivateRoute;
