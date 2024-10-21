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
import { useTours } from '../services/tour'; // Import service tour

const TourList = () => {
  const [tours, setTours] = useState([]);
  const getTours = useTours();

  useEffect(() => {
    const fetchTours = async () => {
      const response = await getTours();
      if (response.success) {
        setTours(response.data);
      } else {
        console.error('Lỗi khi lấy dữ liệu tour:', response.error);
      }
    };
    fetchTours();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách tour
      </Typography>
      <Grid container spacing={4}>
        {tours.map((tour) => (
          <Grid item key={tour.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={tour.imageUrl}
                alt={tour.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {tour.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tour.description}
                </Typography>
                <Button variant="contained" size="small" href={`/tour/${tour.id}`}>
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

export default TourList;