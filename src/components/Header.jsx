import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/LogowebsiteMrsHangFarm.png';
import Modal from 'react-modal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Header = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const avatarMenuRef = useRef(null);
  const navigate = useNavigate();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.classList.contains('ReactModal__Overlay') ||
        event.target.classList.contains('close-button')
      ) {
        setIsSearchModalOpen(false);
      }
    };

    if (isSearchModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchModalOpen]);

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const toggleAvatarMenu = () => {
    setIsAvatarMenuOpen((prev) => !prev);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const searchQueryNormalized = searchQuery.trim().toLowerCase();

    const searchCollections = async (collectionName) => {
      const q = collection(db, collectionName);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id, category: collectionName }))
        .filter((item) =>
          item.name.toLowerCase().includes(searchQueryNormalized)
        );
    };

    let results = [];

    if (selectedCategory === 'all') {
      const foodsResults = await searchCollections('foods');
      const roomsResults = await searchCollections('rooms');
      const toursResults = await searchCollections('tours');
      results = [...foodsResults, ...roomsResults, ...toursResults];
    } else {
      results = await searchCollections(selectedCategory);
    }

    setSearchResults(results);
  };

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-10">
      <div className="max-w-screen-xl flex justify-between items-center mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold text-gray-900 dark:text-white">Mrs. Hang Farm</span>
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-base text-gray-900 dark:text-white hover:text-blue dark:hover:text-blue-500">
            Trang chủ
          </Link>
          <Link to="/room-order" className="text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">
            Phòng nghỉ
          </Link>
          <Link to="/food-order" className="text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">
            Món ăn
          </Link>
          <Link to="/tour-order" className="text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">
            Tour tham quan
          </Link>
          <Link to="/about" className="text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500">
            Giới thiệu
          </Link>


          <button onClick={openSearchModal}>
            <FaSearch />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleGoToCart} className="bg-green-500 text-white py-2 px-3 rounded-md hover:bg-green-600 flex items-center">
            <FaShoppingCart className="mr-2" /> ({totalItems})
          </button>
          {user ? (
            <div className="relative">
              <button onClick={toggleAvatarMenu} className="flex items-center space-x-2">
                <img src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/147/147144.png'} alt="User Avatar" className="w-8 h-8" />
              </button>
              {isAvatarMenuOpen && (
                <div ref={avatarMenuRef} className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute right-0 mt-2">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                  </div>
                  <ul className="py-2">
                    <li><Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Trang cá nhân</Link></li>
                    <li><Link to="/orderhistory" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Lịch sử đơn hàng</Link></li>
                    <li><Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Đăng xuất</Link></li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">Đăng nhập</button>
            </Link>
          )}
        </div>
      </div>
      <Modal isOpen={isSearchModalOpen} onRequestClose={closeSearchModal} contentLabel="Search Modal" className="fixed inset-0 flex items-center justify-center z-50" overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40">
        <div className="bg-white rounded-lg p-4 w-full max-w-2xl z-50">
          <h3 className="text-xl mb-2">Tìm kiếm</h3>
          <form onSubmit={handleSearch}>
            <div className="flex items-center space-x-2 mb-2">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Các Dịch vụ</option>
                <option value="foods">Món ăn</option>
                <option value="rooms">Phòng nghỉ</option>
                <option value="tours">Tour du Lịch</option>
              </select>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-2.5 border border-gray-300 focus:outline-none focus:ring-2 rounded-md" placeholder="Nhập từ khóa tìm kiếm..." />
              <button type="submit" className="p-3 bg-blue-500 text-white border-none rounded-md">
                <FaSearch />
              </button>
            </div>
          </form>
          {searchResults.length > 0 && (
            <ul className="mt-4">
              {searchResults.map((result) => (
                <li key={result.id} className="border-b border-gray-200 py-2">
                  <Link
                    to={`/${result.category === 'foods' ? 'food' : result.category === 'rooms' ? 'room' : 'tour'}/${result.id}`}
                    className="text-black hover:text-blue-700"
                  >
                    {result.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <hr />
          <button onClick={closeSearchModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-end mt-2">Đóng</button>
        </div>
      </Modal>
    </nav>
  );
};

export default Header;
