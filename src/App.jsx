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
import Profile from './components/Profile';
import Review from './components/Review';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import OrderHistoryPage from './components/OrderHistory';
import MainLayout from './components/MainLayout';  
import DetailPage from './components/DetailPage';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import UserManagement from './components/UserManagement';

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
              <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/orderhistory" element={<MainLayout><OrderHistoryPage /></MainLayout>} />

              {/* PayPalScriptProvider Wrap for Checkout */}
              <Route 
                path="/checkout" 
                element={
                  <PayPalScriptProvider options={{ "client-id": "Ad9vLq74WzUvfDdIAEBZjCSfHR2QUjAQAqqnGDZPupFDC7zWAFBU55RqQoYRpxsRGoig7VsbvsGN8s1b", "currency": "USD" }}>
                    <MainLayout><CheckOut /></MainLayout>
                  </PayPalScriptProvider>
                } 
              />

              <Route path="/detail/:id" element={<MainLayout><DetailPage /></MainLayout>} />

              <Route path="/ordermanagement" element={<OrderManagement />} />

              {/* Admin Routes without Header and Footer */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminPage />} />
                <Route path="food" element={<Food />} />
                <Route path="room" element={<Room />} />
                <Route path="tour" element={<Tour />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="reviews" element={<Review />} />
              </Route>

              {/* Other Routes */}
              <Route path="/food" element={<Food />} />
              <Route path="/room" element={<Room />} />
              <Route path="/tour" element={<Tour />} />
              <Route path="/bookingform" element={<BookingForm />} />
              <Route path="/room-order" element={<MainLayout><RoomOrder /></MainLayout>} />
              <Route path="/food-order" element={<MainLayout><FoodOrder /></MainLayout>} />
              <Route path="/tour-order" element={<MainLayout><TourOrder /></MainLayout>} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
