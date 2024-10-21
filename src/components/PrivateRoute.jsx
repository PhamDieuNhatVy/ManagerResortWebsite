import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Hoặc đường dẫn tới AuthContext bạn đã tạo

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth(); // Lấy thông tin user và trạng thái loading từ context

  // Nếu đang tải, có thể hiển thị spinner hoặc thông báo
//   if (loading) {
//     return(
//         <h1>hhhh</h1>
//     )  // Hoặc một spinner
//   }

  // Nếu user chưa đăng nhập hoặc role không phù hợp, chuyển hướng tới trang login
  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return <Link to="/login" />;
  }

  // Nếu có quyền, hiển thị nội dung con (children)
  return children;
};

export default PrivateRoute;
