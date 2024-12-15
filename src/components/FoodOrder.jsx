import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart from CartContext
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaShoppingCart } from 'react-icons/fa';

const FoodOrder = () => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Use addToCart from CartContext
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 4; // Number of items to display per page

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
      } finally {
        setLoading(false); // Set loading to false after data fetch completes
      }
    };

    fetchFoods();
  }, []);

  const handleGoToCart = () => {
    navigate('/cart'); // Navigate to the cart page
  };

  const handleAddToCart = (food) => {
    addToCart(food); 
  };

  // Calculate the current items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFoods = foods.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(foods.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Loading State */}
        {loading && (
          <div className="mb-4 p-4 bg-yellow-500 text-white rounded-md">
            Đang tải dữ liệu món ăn...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-md">
            {error}
          </div>
        )}

        {/* Display Food Items */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">Món ăn hấp dẫn</h2>
          <div className='center justify-center items-center flex'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
              {currentFoods.map((food) => (
                <div key={food.id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg">
                  <Link to={`/food/${food.id}`} className="block overflow-hidden">
                    <img
                      className="rounded-t-lg w-full h-64 object-cover transform transition duration-300 ease-in-out hover:scale-110"
                      src={food.imageUrl || 'https://via.placeholder.com/300'}
                      alt={food.name}
                    />
                  </Link>
                  <div className="px-5 py-4">
                    <h5 className="text-xl font-semibold text-gray-900">{food.name}</h5>
                    {/* <p className="text-gray-700 text-base mt-2">{food.description}</p> */}
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
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
         
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`mx-1 px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
         
        </div>
      </div>
    </div>
  );
};

export default FoodOrder;
