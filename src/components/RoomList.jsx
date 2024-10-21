import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Button 
} from '@mui/material';
import { useRooms } from '../services/room'; // Import service room

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const getRooms = useRooms();

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await getRooms();
      if (response.success) {
        setRooms(response.data);
      } else {
        console.error('Lỗi khi lấy dữ liệu phòng:', response.error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách phòng
      </Typography>
      <Grid container spacing={4}>
        {rooms.map((room) => (
          <Grid item key={room.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={room.imageUrl}
                alt={room.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {room.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {room.description}
                </Typography>
                <Button variant="contained" size="small" href={`/room/${room.id}`}>
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RoomList;