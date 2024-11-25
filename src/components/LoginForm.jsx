import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Container, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ context

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      // Gọi hàm login từ context
      const userData = await login(email, password);

      // Điều hướng dựa trên vai trò
      if (userData.role === 'admin') {
        navigate('/admin'); // Điều hướng đến trang admin
      } else {
        navigate('/'); // Điều hướng đến trang chính cho user thông thường
      }
    } catch (error) {
      // Xử lý các lỗi khi đăng nhập
      if (error.code === 'auth/invalid-email') {
        setErrorMessage('Email không hợp lệ.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('Không tìm thấy tài khoản với email này.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Mật khẩu không đúng.');
      } else {
        setErrorMessage('Đăng nhập không thành công. Vui lòng thử lại sau.');
      }
      console.error('Đăng nhập thất bại:', error);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Đăng nhập
      </Typography>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Đăng nhập
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Link to="/register" variant="body2" className="link">
              Bạn chưa có tài khoản? Đăng ký
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default LoginForm;
