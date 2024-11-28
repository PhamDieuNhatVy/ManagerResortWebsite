// src/pages/CheckoutPage.js
import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, TextField, Box, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Import AuthContext
import { useCart } from '../context/CartContext'; // Import CartContext
import { db } from '../firebase'; // Firebase configuration
import { collection, addDoc } from 'firebase/firestore';


const CheckoutPage = () => {
  const { user } = useAuth(); // Lấy thông tin người dùng
  const { cart, clearCart } = useCart(); // Lấy giỏ hàng từ CartContext
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!name || !address || !phone) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);

    try {
      const totalAmount = cart.reduce((total, item) => total + item.price, 0); // Tính tổng giỏ hàng

      // Lưu thông tin đơn hàng vào Firestore
      const orderData = {
        userId: user.uid,
        items: cart,
        totalAmount,
        shippingAddress: address,
        phoneNumber: phone,
        name,
        status: 'Pending', // Trạng thái đơn hàng, ví dụ: 'Pending'
        createdAt: new Date(),
      };

      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, orderData);

      // Xóa giỏ hàng sau khi thanh toán
      clearCart();

      setPaymentSuccess(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại.');
    }

    setLoading(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ mt: 8, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Đặt Ngay
        </Typography>

        {paymentSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Đặt hàng thành công! Cảm ơn bạn đã ủng hộ.
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h5">Chi tiết đơn hàng</Typography>
            {cart.length === 0 ? (
              <Typography variant="h6">Giỏ hàng của bạn hiện đang trống.</Typography>
            ) : (
              <Grid container spacing={2}>
                {cart.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Card sx={{ display: 'flex', alignItems: 'center' }}>
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          {item.price} VND
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Tổng cộng: {cart.reduce((total, item) => total + item.price, 0)} VND
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h5">Thông tin giao hàng</Typography>
            <TextField
              label="Họ và tên"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Địa chỉ"
              fullWidth
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePayment}
                fullWidth
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đặt ngay'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

  
    </Box>
  );
};

export default CheckoutPage;
