import React, { useState } from 'react'; // Đừng quên import useState
import styled from 'styled-components'; 
import { Box, Typography, TextField, Button, Container, Alert } from '@mui/material';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; // Đảm bảo chiều cao tối thiểu của container
`;

const Content = styled.main`
  background-image: url('https://img.pikbest.com/wp/202344/blue-sky-green-grass-expansive-field-with-fresh-clear-and-plenty-of-copy-space-for-spring-landscape_9932222.jpg!sw800');
  background-size: cover;
  color: black; 
  text-align: center;
  padding: 100px 0;
  flex-grow: 1; 
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: yellow;
  font-weight: bold; // Add this line
`;
    
const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Giả sử gửi thành công
    setAlertMessage('Thành công! Cảm ơn bạn đã liên hệ.');
    setAlertSeverity('success');
    
    // Reset form
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <StyledContainer>
      <Content>
        <Title>Liên hệ với chúng tôi</Title>
        {alertMessage && (
          <Alert severity={alertSeverity} sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Họ và tên"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              InputLabelProps={{
                sx: { color: 'white' }, // Màu trắng cho label
              }}
              InputProps={{
                sx: { 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'darkgreen', // Màu xanh đậm cho viền
                    },
                    '&:hover fieldset': {
                      borderColor: 'green', // Màu viền khi hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'blue', // Màu viền khi focus
                    },
                  },
                },
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{
                sx: { color: 'white' }, // Màu trắng cho label
              }}
              InputProps={{
                sx: { 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'darkgreen', // Màu xanh đậm cho viền
                    },
                    '&:hover fieldset': {
                      borderColor: 'green', // Màu viền khi hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'blue', // Màu viền khi focus
                    },
                  },
                },
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Tin nhắn"
              variant="outlined"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              InputLabelProps={{
                sx: { color: 'white' }, // Màu trắng cho label
              }}
              InputProps={{
                sx: { 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'darkgreen', // Màu xanh đậm cho viền
                    },
                    '&:hover fieldset': {
                      borderColor: 'green', // Màu viền khi hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'blue', // Màu viền khi focus
                    },
                  },
                },
              }}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Gửi
            </Button>
          </form>
        </Container>
      </Content>
    </StyledContainer>
  );
};

export default Contact;
