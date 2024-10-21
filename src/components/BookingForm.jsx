import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Container, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { useBooking } from '../services/booking'; // Import service booking

const BookingForm = () => {
  const [type, setType] = useState(''); // Loại đặt chỗ (tour, phòng, đồ ăn)
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('');
  const [details, setDetails] = useState('');
  const book = useBooking();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await book(type, date, people, details);
    if (response.success) {
      // Hiển thị thông báo đặt chỗ thành công
      console.log('Đặt chỗ thành công:', response.data);
    } else {
      // Hiển thị thông báo lỗi
      console.error('Đặt chỗ thất bại:', response.error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Đặt chỗ
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Loại đặt chỗ</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <MenuItem value="tour">Tour</MenuItem>
                <MenuItem value="room">Phòng</MenuItem>
                <MenuItem value="food">Đồ ăn</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth
              label="Ngày đặt"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth
              label="Số người"
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth
              label="Yêu cầu"
              multiline
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Đặt chỗ
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default BookingForm;