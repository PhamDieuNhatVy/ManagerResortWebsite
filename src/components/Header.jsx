// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { auth } from '../firebase'; // Import firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // Import để theo dõi trạng thái đăng nhập
import '../App.css'; // Import file CSS
import logo from '../assets/LogowebsiteMrsHangFarm.png'; // Import hình ảnh logo

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Theo dõi trạng thái đăng nhập của người dùng
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Cập nhật trạng thái người dùng
    });

    return () => {
      unsubscribe(); // Hủy theo dõi khi component bị hủy
    };
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box component="img" src={logo} alt="Logo" sx={{ width: 50, height: 50, marginRight: 2 }} />  {/* Thêm logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <span style={{ fontWeight: 'bold' }}>Mrs. Hang Farm</span>  {/* Chữ in đậm */}
        </Typography>
        <Link to="/" className="nav-link">
          <Button color="inherit" style={{ fontWeight: 'bold' }}>Trang chủ</Button>  {/* Chữ in đậm */}
        </Link>
        <Link to="/about" className="nav-link">
          <Button color="inherit" style={{ fontWeight: 'bold' }}>Giới thiệu</Button>  {/* Chữ in đậm */}
        </Link>
        <Link to="/contact" className="nav-link">
          <Button color="inherit" style={{ fontWeight: 'bold' }}>Liên hệ</Button>  {/* Chữ in đậm */}
        </Link>

        {user ? ( // Nếu người dùng đã đăng nhập
          <>
            <Typography variant="body1" color="inherit" style={{ marginRight: '16px' }}>
              {user.email} {/* Hiển thị email của người dùng */}
            </Typography>
            <Link to="/logout" className="nav-link">
              <Button color="inherit" style={{ fontWeight: 'bold' }}>Đăng xuất</Button>  {/* Chữ in đậm */}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              <Button color="inherit" style={{ fontWeight: 'bold' }}>Đăng nhập</Button>  {/* Chữ in đậm */}
            </Link>
            <Link to="/register" className="nav-link">
              <Button color="inherit" style={{ fontWeight: 'bold' }}>Đăng ký</Button>  {/* Chữ in đậm */}
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
