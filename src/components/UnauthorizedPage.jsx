import React from 'react';
import { Link } from 'react-router-dom';


const UnauthorizedPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Nội dung chính của trang */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>403 - Unauthorized</h1>
        <p>Bạn không có quyền truy cập vào trang này.</p>
        <Link to="/">Quay lại trang chủ</Link>
      </div>

     
    </div>
  );
};

export default UnauthorizedPage;
