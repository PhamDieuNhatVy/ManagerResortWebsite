import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FaShoppingCart } from 'react-icons/fa';
import '../App.css';
import logo from '../assets/LogowebsiteMrsHangFarm.png';

const Header = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart); 

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const handleGoToCart = () => {
    navigate('/cart'); 
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0); // Calculate total quantity

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-screen-xl flex justify-between items-center mx-auto p-4">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold text-gray-900 dark:text-white">Mrs. Hang Farm</span>
        </Link>

        {/* Navigation menu */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">Trang chủ</Link>
          <Link to="/about" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">Giới thiệu</Link>
          <Link to="/contact" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">Liên hệ</Link>
        </div>

        {/* Cart button and user authentication buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoToCart}
            className="bg-green-500 text-white py-2 px-3 rounded-md hover:bg-green-600 flex items-center"
          >
            <FaShoppingCart className="mr-2" />
            ({totalItems}) {/* Display the total quantity */}
          </button>

          {user ? (
            <>
              <span className="text-gray-900 dark:text-white">{user.email}</span>
              <Link to="/logout" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">
                Đăng xuất
              </Link>
            </>
          ) : (
            <Link to="/login">
              <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                Đăng nhập
              </button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          data-collapse-toggle="navbar-cta"
          type="button"
          className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 focus:ring-2 focus:ring-gray-200 rounded-lg p-2"
          aria-controls="navbar-cta"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden" id="navbar-cta">
        <ul className="flex flex-col space-y-4 p-4 bg-gray-50 dark:bg-gray-800">
          <li><Link to="/" className="text-gray-900 dark:text-white hover:text-blue-600 font-bold">Trang chủ</Link></li>
          <li><Link to="/about" className="text-gray-900 dark:text-white hover:text-blue-600 font-bold">Giới thiệu</Link></li>
          <li><Link to="/contact" className="text-gray-900 dark:text-white hover:text-blue-600 font-bold">Liên hệ</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
