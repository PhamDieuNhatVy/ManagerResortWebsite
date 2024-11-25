import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Register from './components/RegisterForm';
import Login from './components/LoginForm';
import Header from './components/Header';
import Footer from './components/Footer';
import Logout from './components/Logout';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';  // Đảm bảo CartProvider đã được import
import Food from './components/services/Food';
import Room from './components/services/Room';
import Tour from './components/services/Tour';
import BookingForm from './components/services/BookingForm';
import AdminPage from './components/Admin';
import RoomOrder from './components/RoomOrder';
import FoodOrder from './components/FoodOrder';
import TourOrder from './components/TourOrder';
import Cart from './components/Cart';
import CheckOut from './components/CheckOut';
import OrderManagement from './components/OrderManagement'; 


import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* Đảm bảo CartProvider bao bọc đúng các component */}
        <BrowserRouter>
          <div className="app-container">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/cart" element={<Cart />} /> 
              <Route path="/checkout" element={<CheckOut />} /> 
              <Route path="/ordermanagement" element={<OrderManagement />} /> 

              {/* PrivateRoute bảo vệ các route cho admin */}
              <Route path="/food" element={<PrivateRoute allowedRoles={['admin']}><Food /></PrivateRoute>} />
              <Route path="/room" element={<PrivateRoute allowedRoles={['admin']}><Room /></PrivateRoute>} />
              <Route path="/tour" element={<PrivateRoute allowedRoles={['admin']}><Tour /></PrivateRoute>} />
              <Route path="/bookingform" element={<BookingForm />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/room-order" element={<RoomOrder />} />
              <Route path="/food-order" element={<FoodOrder />} />
              <Route path="/tour-order" element={<TourOrder />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
