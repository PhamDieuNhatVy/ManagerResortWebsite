import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon
import Swiper from './layouts/Swiper';
import Footer from '../components/Footer';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [tours, setTours] = useState([]);
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsCollection = collection(db, 'rooms');
        const roomsSnapshot = await getDocs(roomsCollection);
        setRooms(roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const toursCollection = collection(db, 'tours');
        const toursSnapshot = await getDocs(toursCollection);
        setTours(toursSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const foodsCollection = collection(db, 'foods');
        const foodsSnapshot = await getDocs(foodsCollection);
        setFoods(foodsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        setLoading(false);
      } catch (err) {
        setError('Error fetching data, please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
  };

  return (
    <div className="min-h-screen bg-white">
      <Swiper />
      <main className="flex flex-col items-center justify-center h-full py-20">
        <h1 className="text-5xl font-bold mb-10 text-gray-900">Chào mừng đến với Resort Mrs. Hang</h1>

        {/* Rooms Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Phòng sang trọng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4">
            {rooms.slice(0, 3).map((room) => (
              <div key={room.id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg">
                <a href="#">
                  <img className="rounded-t-lg w-full h-64 object-cover" src={room.imageUrl || 'https://via.placeholder.com/300'} alt={room.name} />
                </a>
                <div className="px-5 py-4">
                  <h5 className="text-xl font-semibold text-gray-900">{room.name}</h5>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-gray-900">{room.price} VND</span>
                    <button
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5"
                      onClick={() => handleAddToCart(room)}
                    >
                      <FaShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/room-order" className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-800 transition-colors">
              Xem tất cả phòng
            </Link>
          </div>
        </div>

        {/* Tours Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Chuyến tham quan hấp dẫn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4">
            {tours.slice(0, 3).map((tour) => (
              <div key={tour.id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg">
                <a href="#">
                  <img className="rounded-t-lg w-full h-64 object-cover" src={tour.imageUrl || 'https://via.placeholder.com/300'} alt={tour.name} />
                </a>
                <div className="px-5 py-4">
                  <h5 className="text-xl font-semibold text-gray-900">{tour.name}</h5>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-gray-900">{tour.price} VND</span>
                    <button
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5"
                      onClick={() => handleAddToCart(tour)}
                    >
                     <FaShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/tour-order" className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-800 transition-colors">
              Xem tất cả chuyến tham quan
            </Link>
          </div>
        </div>

        {/* Foods Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Món ăn ngon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4">
            {foods.slice(0, 3).map((food) => (
              <div key={food.id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg">
                <a href="#">
                  <img className="rounded-t-lg w-full h-64 object-cover" src={food.imageUrl || 'https://via.placeholder.com/300'} alt={food.name} />
                </a>
                <div className="px-5 py-4">
                  <h5 className="text-xl font-semibold text-gray-900">{food.name}</h5>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-gray-900">{food.price} VND</span>
                    <button
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5"
                      onClick={() => handleAddToCart(food)}
                    >
                <FaShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/food-order" className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-800 transition-colors">
              Xem tất cả món ăn
            </Link>
          </div>
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className="fixed bottom-10 right-10">
            <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="sr-only">Check icon</span>
              </div>
              <div className="ms-3 text-sm font-normal">Đã thêm vào giỏ hàng</div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Home;
