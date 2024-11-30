import React, { useState } from 'react'; // Don't forget to import useState
import styled from 'styled-components'; 
import { Box, Typography, TextField, Button, Container, Alert } from '@mui/material';

// Styled Components
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5; // Light gray background for the whole container
`;

const Content = styled.main`
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.5), rgba(0, 255, 123, 0.5));
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 80px 20px;
  flex-grow: 1;
  border-radius: 8px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
`;

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Simulate successful submission
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
          <Alert severity={alertSeverity} sx={{ mb: 3 }}>
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
                sx: { color: 'white' },
              }}
              InputProps={{
                sx: { 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.8)', // Soft white border
                    },
                    '&:hover fieldset': {
                      borderColor: '#007BFF', // Light blue on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#28A745', // Green when focused
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
                sx: { color: 'white' },
              }}
              InputProps={{
                sx: { 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#007BFF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#28A745',
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
                sx: { color: 'white' },
              }}
              InputProps={{
                sx: { 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#007BFF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#28A745',
                    },
                  },
                },
              }}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                backgroundColor: '#28A745', // Green background for button
                padding: '14px',
                '&:hover': {
                  backgroundColor: '#218838', // Darker green on hover
                },
                fontWeight: 600,
              }}
            >
              Gửi
            </Button>
          </form>
        </Container>
      </Content>
    </StyledContainer>
  );
};

export default Contact;
