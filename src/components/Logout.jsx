// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import firebase auth
import { signOut } from 'firebase/auth'; // Import hàm đăng xuất

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await signOut(auth); // Đăng xuất người dùng
      navigate('/'); // Chuyển hướng về trang chính
    };

    logout();
  }, [navigate]);

  return null; // Không cần hiển thị gì cả
};

export default Logout;
