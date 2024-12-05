import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import useCart from CartContext
import logo from '../assets/LogowebsiteMrsHangFarm.png';

const Header = () => {
  const { user } = useAuth();
  const { cart } = useCart(); // Get the cart state from context
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef(null);
  const navigate = useNavigate();

  // Calculate total items in the cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
        setIsAvatarMenuOpen(false);
      }
    };

    if (isAvatarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAvatarMenuOpen]);

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const toggleAvatarMenu = () => {
    setIsAvatarMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-screen-xl flex justify-between items-center mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold text-gray-900 dark:text-white">Mrs. Hang Farm</span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">Trang chủ</Link>
          <Link to="/room-order" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">Phòng nghỉ</Link>
          <Link to="/food-order" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">Món ăn</Link>
          <Link to="/tour-order" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">Tour tham quan</Link>
         
          <Link to="/about" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">Giới thiệu</Link>
          <Link to="/contact" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">Liên hệ</Link>
        </div>

        {/* Cart and User */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoToCart}
            className="bg-green-500 text-white py-2 px-3 rounded-md hover:bg-green-600 flex items-center"
          >
            <FaShoppingCart className="mr-2" />
            ({totalItems}) {/* Show total quantity */}
          </button>

          {user ? (
            <div className="relative">
              <button onClick={toggleAvatarMenu} className="flex items-center space-x-2">
                <img
                  src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/147/147144.png'}
                  alt="User Avatar"
                  className="w-8 h-8"
                />
              </button>
              {isAvatarMenuOpen && (
                <div ref={avatarMenuRef} className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute right-0 mt-2">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                        Trang cá nhân
                      </Link>
                    </li>
                    <li>
                      <Link to="/orderhistory" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                        Lịch sử đơn hàng
                      </Link>
                    </li>
                    <li>
                      <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                        Đăng xuất
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                Đăng nhập
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
