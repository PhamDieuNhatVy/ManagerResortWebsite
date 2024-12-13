import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart from CartContext
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaShoppingCart } from 'react-icons/fa';
const TourOrder = () => {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const { cart, addToCart } = useCart(); // Use addToCart from CartContext

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursCollection = collection(db, 'tours');
        const toursSnapshot = await getDocs(toursCollection);
        const toursList = toursSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (toursList.length === 0) {
          setError('Hiện không có tour nào khả dụng.');
        } else {
          setTours(toursList);
        }
      } catch (err) {
        setError('Lỗi khi lấy dữ liệu tour. Vui lòng thử lại sau.');
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false); // Set loading to false after data fetch completes
      }
    };

    fetchTours();
  }, []);

  const handleGoToCart = () => {
    navigate('/cart'); // Navigate to the cart page
  };

  const handleAddToCart = (tour) => {
    addToCart(tour); // Add the tour to the cart
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-grow">


        {/* Loading State */}
        {loading && (
          <div className="mb-4 p-4 bg-yellow-500 text-white rounded-md">
            Đang tải dữ liệu tour...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-md">
            {error}
          </div>
        )}

        {/* Display Tours */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Chuyến tham quan hấp dẫn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4">
            {tours.map((tour) => (
              <div key={tour.id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg">
               <Link to={`/tour/${tour.id}`} className="block overflow-hidden">
                                 <img className="rounded-t-lg w-full h-64 object-cover transform transition duration-300 ease-in-out hover:scale-110" 
                                   src={tour.imageUrl || 'https://via.placeholder.com/300'} 
                                   alt={tour.name} 
                                 />
                               </Link>
                <div className="px-5 py-4">
                  <h5 className="text-xl font-semibold text-gray-900">{tour.name}</h5>
                  <p className="text-gray-700 text-base mt-2">{tour.description}</p>
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
        </div>
      </div>

     
    </div>
  );
};

export default TourOrder;
