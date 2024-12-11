import React from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const FoodDetail = () => {
  const { id } = useParams();
  const [food, setFood] = React.useState(null);

  React.useEffect(() => {
    const fetchFood = async () => {
      const docRef = doc(db, 'foods', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFood(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchFood();
  }, [id]);

  if (!food) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-12">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-x-12 md:space-y-0">
        <img 
          src={food.imageUrl || 'https://via.placeholder.com/400'} 
          alt={food.name} 
          className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-md"
        />
        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">{food.name}</h2>
          <p className="text-lg text-gray-700 mb-6">{food.description}</p>
          <p className="text-xl font-bold text-gray-900">
            {food.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <button 
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
          onClick={() => console.log('Add to cart')}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default FoodDetail;
