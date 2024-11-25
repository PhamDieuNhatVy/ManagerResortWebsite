import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { useCart } from '../context/CartContext'; // Import useCart từ CartContext
import { useNavigate } from 'react-router-dom';  // Để điều hướng khi nhấn nút thanh toán

const CartPage = () => {
  const { cart, removeFromCart } = useCart(); // Lấy giỏ hàng từ CartContext
  const navigate = useNavigate();  // Điều hướng đến trang thanh toán khi bấm thanh toán

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId); // Xóa sản phẩm khỏi giỏ hàng
  };

  const handleCheckout = () => {
    navigate('/checkout');  // Điều hướng đến trang thanh toán
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ mt: 8, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Giỏ hàng của bạn
        </Typography>
        
        {cart.length === 0 ? (
          <Typography variant="h6">Giỏ hàng của bạn hiện đang trống.</Typography>
        ) : (
          <Grid container spacing={4}>
            {cart.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    {/* Hiển thị hình ảnh sản phẩm */}
                    <img src={item.imageUrl || 'https://via.placeholder.com/300'} alt={item.name} style={{ width: '100%', height: 'auto' }} />
                    
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    
                    {/* Hiển thị giá */}
                    <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>
                      {item.price} VND
                    </Typography>
                    
                    {/* Nút Xóa sản phẩm khỏi giỏ hàng */}
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleRemoveFromCart(item.id)}
                      sx={{ mt: 2 }}
                    >
                      Xóa khỏi giỏ hàng
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {cart.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleCheckout}
              sx={{ width: '200px', padding: '16px' }}
            >
              Thanh toán
            </Button>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default CartPage;
