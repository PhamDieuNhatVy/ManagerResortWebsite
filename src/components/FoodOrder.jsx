import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart từ CartContext
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';


const FoodOrder = () => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart(); // Sử dụng hook từ CartContext

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const foodsCollection = collection(db, 'foods');
        const foodsSnapshot = await getDocs(foodsCollection);
        const foodsList = foodsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (foodsList.length === 0) {
          setError('Hiện không có món ăn nào khả dụng.');
        } else {
          setFoods(foodsList);
        }
      } catch (err) {
        setError('Lỗi khi lấy dữ liệu món ăn. Vui lòng thử lại sau.');
        console.error('Error fetching foods:', err);
      }
    };

    fetchFoods();
  }, []);

  const handleGoToCart = () => {
    navigate('/cart'); // Điều hướng đến trang giỏ hàng
  };

  const handleAddToCart = (food) => {
    addToCart(food); // Thêm món ăn vào giỏ hàng
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-semibold mb-6">Danh sách món ăn</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div key={food.id} className="max-w-sm rounded overflow-hidden shadow-lg">
              <img
                className="w-full h-40 object-cover"
                src={food.imageUrl || 'https://via.placeholder.com/300'}
                alt={food.name}
              />
              <div className="px-6 py-4">
                <h2 className="text-xl font-semibold">{food.name}</h2>
                <p className="text-gray-700 text-base mt-2">{food.description}</p>
                <div className="mt-4 flex space-x-4">
                  {/* Nút "Thêm vào giỏ hàng" */}
                  <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    onClick={() => handleAddToCart(food)} 
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

export default FoodOrder;
