import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { db } from '../firebase'; // Firebase configuration
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';


const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy tất cả đơn hàng từ Firestore
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      const ordersList = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // Thay đổi trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, { status: newStatus });
      // Cập nhật lại danh sách đơn hàng sau khi thay đổi trạng thái
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Gọi hàm lấy đơn hàng khi trang được tải
  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <Typography variant="h6" align="center">Đang tải...</Typography>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ mt: 8, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý Đơn Hàng
        </Typography>

        {orders.length === 0 ? (
          <Typography variant="h6">Hiện tại không có đơn hàng nào.</Typography>
        ) : (
          <Grid container spacing={4}>
            {orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5">
                      Đơn hàng #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Người mua: {order.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Địa chỉ giao hàng: {order.shippingAddress}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tổng giá: {order.totalAmount} VND
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trạng thái: {order.status}
                    </Typography>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="status-label">Trạng thái</InputLabel>
                      <Select
                        labelId="status-label"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        label="Trạng thái"
                      >
                        <MenuItem value="Pending">Chờ xử lý</MenuItem>
                        <MenuItem value="Shipped">Đang giao</MenuItem>
                        <MenuItem value="Delivered">Đã giao</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

     
    </div>
  );
};

export default OrderManagementPage;
