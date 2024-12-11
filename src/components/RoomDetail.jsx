import React from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const RoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = React.useState(null);

  React.useEffect(() => {
    const fetchRoom = async () => {
      const docRef = doc(db, 'rooms', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRoom(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchRoom();
  }, [id]);

  if (!room) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-12">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-x-12 md:space-y-0">
        <img 
          src={room.imageUrl || 'https://via.placeholder.com/400'} 
          alt={room.name} 
          className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-md"
        />
        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">{room.name}</h2>
          <p className="text-lg text-gray-700 mb-6">{room.description}</p>
          <p className="text-xl font-bold text-gray-900">
            {room.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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

export default RoomDetail;
