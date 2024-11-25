import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';  // Import useCart từ CartContext
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const RoomOrder = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();  // Sử dụng hook từ CartContext

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, 'rooms');
        const roomsSnapshot = await getDocs(roomsCollection);
        const roomsList = roomsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRooms(roomsList);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phòng:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleGoToCart = () => {
    navigate('/cart'); // Điều hướng đến trang giỏ hàng
  };

  const handleAddToCart = (room) => {
    // Thêm phòng vào giỏ hàng với tất cả các thông tin chi tiết
    addToCart({
      id: room.id,
      name: room.name,
      description: room.description,
      price: room.price,  // Giả sử có trường 'price'
      imageUrl: room.imageUrl || 'https://via.placeholder.com/300',  // Dùng ảnh mặc định nếu không có
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-semibold mb-6">Danh sách phòng</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="max-w-sm rounded-lg overflow-hidden shadow-lg">
              <img
                className="w-full h-40 object-cover"
                src={room.imageUrl || 'https://via.placeholder.com/300'}
                alt={room.name}
              />
              <div className="px-6 py-4">
                <h2 className="text-xl font-semibold">{room.name}</h2>
                <p className="text-gray-700 text-base mt-2">{room.description}</p>
                <p className="text-gray-900 font-bold mt-2">{room.price} VND</p> {/* Giá phòng */}
                <div className="mt-4 flex space-x-4">
                  {/* Nút "Thêm vào giỏ hàng" */}
                  <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    onClick={() => handleAddToCart(room)}  // Thêm phòng vào giỏ hàng
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

export default RoomOrder;
