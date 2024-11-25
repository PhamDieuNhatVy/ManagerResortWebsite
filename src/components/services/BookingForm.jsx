import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Alert,
} from '@mui/material';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Dữ liệu nhận từ các trang "Đặt ngay"
  const initialSelectedItems = location.state?.selectedItems || [];
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [error, setError] = useState(null);

  // Thêm một mặt hàng mới vào danh sách giỏ hàng
  const handleAddItem = (item) => {
    setSelectedItems((prevItems) => [...prevItems, item]);
  };

  // Xóa một mặt hàng khỏi giỏ hàng
  const handleRemoveItem = (id) => {
    setSelectedItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      setError('Bạn chưa chọn bất kỳ sản phẩm nào.');
      return;
    }
    // Điều hướng tới trang thanh toán hoặc xử lý backend
    navigate('/checkout', { state: { selectedItems } });
  };

  useEffect(() => {
    if (!initialSelectedItems.length) {
      setError('Không có mặt hàng nào trong giỏ hàng.');
    }
  }, [initialSelectedItems]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Giỏ hàng của bạn
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={4}>
        {selectedItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={item.imageUrl || 'https://via.placeholder.com/300'} // Placeholder nếu không có ảnh
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Giá: {item.price ? `${item.price} VND` : 'Liên hệ'}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Xóa khỏi giỏ hàng
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 4 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/room-order')}>
          Thêm phòng
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/tour-order')}>
          Thêm tour
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/food-order')}>
          Thêm món ăn
        </Button>
        <Button variant="contained" color="success" onClick={handleCheckout}>
          Thanh toán
        </Button>
      </div>
    </Container>
  );
};

export default BookingForm;
