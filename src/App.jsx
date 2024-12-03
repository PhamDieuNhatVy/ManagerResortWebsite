import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Register from './components/RegisterForm';
import Login from './components/LoginForm';
import Logout from './components/Logout';
import Cart from './components/Cart';
import CheckOut from './components/CheckOut';
import OrderManagement from './components/OrderManagement';
import Food from './components/services/Food';
import Room from './components/services/Room';
import Tour from './components/services/Tour';
import BookingForm from './components/services/BookingForm';
import AdminPage from './components/admin/AdminPage';
import RoomOrder from './components/RoomOrder';
import FoodOrder from './components/FoodOrder';
import TourOrder from './components/TourOrder';
import AdminLayout from './components/admin/AdminLayout';
import Review from './components/Review';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/MainLayout';  

import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              {/* Public Routes with Header and Footer */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/about" element={<MainLayout><About /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
              <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
              <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
              <Route path="/checkout" element={<CheckOut />} />
              <Route path="/ordermanagement" element={<OrderManagement />} />

              {/* Admin Routes without Header and Footer */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminPage />} />
                <Route path="food" element={<Food />} />
                <Route path="room" element={<Room />} />
                <Route path="tour" element={<Tour />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="reviews" element={<Review />} />
              </Route>

              {/* Other Routes */}
              <Route path="/food" element={<Food />} />
              <Route path="/room" element={<Room />} />
              <Route path="/tour" element={<Tour />} />
              <Route path="/bookingform" element={<BookingForm />} />
              <Route path="/room-order" element={<RoomOrder />} />
              <Route path="/food-order" element={<MainLayout><FoodOrder /></MainLayout>} />
              <Route path="/tour-order" element={<TourOrder />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
