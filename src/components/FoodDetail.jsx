import React from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import CommentSection from './CommentSection'; // Importing the CommentSection component
import { useCart } from '../context/CartContext'; 

const FoodDetail = () => {
  const { id } = useParams();
  const [food, setFood] = React.useState(null);
  const { addToCart } = useCart(); // Access addToCart from context
  const [showToast, setShowToast] = React.useState(false); // State for showing toast

  React.useEffect(() => {
    const fetchFood = async () => {
      const docRef = doc(db, 'foods', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFood({ id: docSnap.id, ...docSnap.data() }); // Include id in the food data
      } else {
        console.log('No such document!');
      }
    };
    fetchFood();
  }, [id]);

  if (!food) return <div className="text-center text-gray-500">Loading...</div>;

  const handleAddToCart = (item) => {
    addToCart(item); 
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-x-12 md:space-y-0">
        <img
          src={food.imageUrl || 'https://via.placeholder.com/400'}
          alt={food.name}
          className="md:w-1/2 h-64 object-cover rounded-lg shadow-md"
        />
        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">{food.name}</h2>
          <p className="text-lg text-gray-700 mb-4">{food.description}</p>
          <p className="text-xl font-bold text-gray-900 mb-2">
            {food.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
            onClick={() => handleAddToCart(food)} // Pass the food item itself
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* Show toast if showToast is true */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
          Đã thêm vào giỏ hàng!
        </div>
      )}

      {/* CommentSection component integrated here */}
      <div className="mt-12">
        <CommentSection entityId={id} entityType="foods" />
      </div>
    </div>
  );
};

export default FoodDetail;
