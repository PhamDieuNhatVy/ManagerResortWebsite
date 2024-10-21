// src/components/RegisterForm.js
import React, { useState } from 'react';
import { useNavigate, Link  } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Container, 
 
} from '@mui/material';
import { useRegister } from './services/Auth';


const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const register = useRegister();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await register(username, email, password);
    if (response.success) {
      navigate('/'); // Chuyển hướng về trang Home sau khi đăng ký
    } else {
      console.error('Đăng ký thất bại:', response.error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Đăng ký
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField 
              fullWidth
              label="Tên người dùng"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Grid>
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
              Đăng ký
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Link to="/login" variant="body2" className='link'>
              Bạn đã có tài khoản? Đăng nhập
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RegisterForm;

