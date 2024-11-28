import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart từ CartContext
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Footer from '../components/Footer'; // Import Footer component

const RoomOrder = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm loading state
  const navigate = useNavigate();
  const { cart, addToCart } = useCart(); // Dùng hook từ CartContext

  // Lấy dữ liệu phòng từ Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, 'rooms');
        const roomsSnapshot = await getDocs(roomsCollection);
        const roomsList = roomsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (roomsList.length === 0) {
          setError('Hiện không có phòng nào khả dụng.');
        } else {
          setRooms(roomsList);
        }
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu phòng. Vui lòng thử lại sau.');
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false); // Set loading thành false khi đã lấy dữ liệu
      }
    };

    fetchRooms();
  }, []);

  // Điều hướng đến trang giỏ hàng
  const handleGoToCart = () => {
    navigate('/cart');
  };

  // Thêm phòng vào giỏ hàng
  const handleAddToCart = (room) => {
    // Gọi addToCart từ CartContext
    addToCart({
      id: room.id,
      name: room.name,
      description: room.description,
      price: room.price, // Thêm giá phòng vào giỏ
      imageUrl: room.imageUrl || 'https://via.placeholder.com/300', // Dùng ảnh mặc định nếu không có ảnh
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-semibold mb-6">Danh sách phòng</h1>
        
        {/* Hiển thị trạng thái loading */}
        {loading && (
          <div className="mb-4 p-4 bg-yellow-500 text-white rounded-md">
            Đang tải dữ liệu phòng...
          </div>
        )}

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-md">
            {error}
          </div>
        )}

        {/* Hiển thị danh sách phòng */}
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
                <p className="text-gray-900 font-bold mt-2">{room.price} VND</p> {/* Hiển thị giá phòng */}
                <div className="mt-4 flex space-x-4">
                  {/* Nút Thêm vào giỏ hàng */}
                  <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    onClick={() => handleAddToCart(room)} // Thêm phòng vào giỏ hàng
                  >
                    Thêm vào giỏ hàng
                  </button>
                  {/* Nút Xem giỏ hàng */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RoomOrder;
