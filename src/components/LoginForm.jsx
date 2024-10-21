import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Container, Alert } from '@mui/material';
import { useLogin } from './services/Auth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State để lưu thông báo lỗi
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Reset thông báo lỗi trước khi gọi login

    try {
      const response = await login(email, password);
      if (response.success) {
        navigate('/'); // Chuyển hướng về trang Home sau khi đăng nhập
      } else {
        throw new Error(response.error || 'Đăng nhập không thành công.'); // Ném lỗi nếu không thành công
      }
    } catch (error) {
      // Xử lý lỗi từ Firebase
      if (error.code === 'auth/invalid-email') {
        setErrorMessage('Email không hợp lệ.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('Không tìm thấy tài khoản với email này.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Mật khẩu không đúng.');
      } else if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        setErrorMessage('Đăng nhập không thành công. Vui lòng thử lại sau.');
      }
      console.error('Đăng nhập thất bại:', error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Đăng nhập
      </Typography>
      {errorMessage && ( // Hiển thị thông báo lỗi nếu có
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
            <Link to="/register" variant="body2" className='link'>
              Bạn chưa có tài khoản? Đăng ký
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default LoginForm;
