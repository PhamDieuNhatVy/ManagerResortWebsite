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
import Food from './components/services/Food';
import Room from './components/services/Room';
import Tour from './components/services/Tour';
import BookingForm from './components/services/BookingForm';

import './index.css'
function App() {
  return (
    <AuthProvider>
    <BrowserRouter>  {/* Bao bọc toàn bộ ứng dụng */}
      <div className="app-container">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
       
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/food" element={<Food />} />
          <Route path="/room" element={<Room />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="/bookingform" element={<BookingForm />} />

          

        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;