import React from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import CommentSection from './CommentSection'; // Import component CommentSection
import { useCart } from '../context/CartContext';

const RoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = React.useState(null);
  const { addToCart } = useCart(); 

  React.useEffect(() => {
    const fetchRoom = async () => {
      const docRef = doc(db, 'rooms', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRoom({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log('No such document!');
      }
    };

    fetchRoom();
  }, [id]);

  if (!room) return <div className="text-center text-gray-500">Loading...</div>;

  const handleAddToCart = () => {
    addToCart({
      id: room.id,
      name: room.name,
      description: room.description,
      price: room.price,
      imageUrl: room.imageUrl || 'https://via.placeholder.com/400', // Default image if no imageUrl is provided
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-x-12 md:space-y-0">
        <img
          src={room.imageUrl || 'https://via.placeholder.com/400'}
          alt={room.name}
          className="md:w-1/2 h-64 object-cover rounded-lg shadow-md"
        />
        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">{room.name}</h2>
          <p className="text-lg text-gray-700 mb-4">{room.description}</p>
          <p className="text-xl font-bold text-gray-900 mb-2">
            {room.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
      
      {/* Sử dụng CommentSection ở đây */}
      <CommentSection entityId={id} entityType="rooms" />
    </div>
  );
};

export default RoomDetail;
