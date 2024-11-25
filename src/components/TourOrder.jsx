import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart từ CartContext
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';


const TourOrder = () => {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart(); // Sử dụng hook từ CartContext

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
      }
    };

    fetchTours();
  }, []);

  const handleGoToCart = () => {
    navigate('/cart'); // Điều hướng đến trang giỏ hàng
  };

  const handleAddToCart = (tour) => {
    addToCart(tour); // Thêm tour vào giỏ hàng
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-semibold mb-6">Danh sách tour</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tours.map((tour) => (
            <div key={tour.id} className="max-w-sm rounded overflow-hidden shadow-lg">
              <img
                className="w-full h-40 object-cover"
                src={tour.imageUrl || 'https://via.placeholder.com/300'}
                alt={tour.name}
              />
              <div className="px-6 py-4">
                <h2 className="text-xl font-semibold">{tour.name}</h2>
                <p className="text-gray-700 text-base mt-2">{tour.description}</p>
                <div className="mt-4 flex space-x-4">
                  {/* Nút "Thêm vào giỏ hàng" */}
                  <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    onClick={() => handleAddToCart(tour)} 
                  >
                    Thêm vào giỏ hàng
                  </button>
                  {/* Nút "Xem giỏ hàng" */}
                  <button 
                    className="bg-green-500 text-white py-2 px-4 rounded-md"
                    onClick={handleGoToCart} // Điều hướng đến giỏ hàng
                  >
                    Xem giỏ hàng ({cart.length})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TourOrder;
