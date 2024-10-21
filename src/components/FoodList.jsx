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
import { useFoods } from '../services/food'; // Import service food

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const getFoods = useFoods();

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await getFoods();
      if (response.success) {
        setFoods(response.data);
      } else {
        console.error('Lỗi khi lấy dữ liệu món ăn:', response.error);
      }
    };
    fetchFoods();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách món ăn
      </Typography>
      <Grid container spacing={4}>
        {foods.map((food) => (
          <Grid item key={food.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={food.imageUrl}
                alt={food.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {food.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {food.description}
                </Typography>
                <Button variant="contained" size="small" href={`/food/${food.id}`}>
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

export default FoodList;