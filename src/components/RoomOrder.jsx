import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart from CartContext
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon
import Footer from '../components/Footer'; // Import Footer component

const RoomOrder = () => {
  const [rooms, setRooms] = useState([]); // State to store rooms data
  const [error, setError] = useState(null); // State to store error message
  const [loading, setLoading] = useState(true); // State to handle loading state
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Get the addToCart function from CartContext
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 4 // Number of items to display per page

  // Fetch rooms data from Firestore
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
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchRooms();
  }, []);

  // Navigate to the cart page
  const handleGoToCart = () => {
    navigate('/cart');
  };

  // Add room to cart
  // const handleAddToCart = (room) => {
  //   addToCart({
  //     id: room.id,
  //     name: room.name,
  //     description: room.description,
  //     price: room.price,
  //     imageUrl: room.imageUrl || 'https://via.placeholder.com/300', // Default image if no imageUrl is provided
  //   });
  // };

  const handleAddToCart = (item) => {
    addToCart(item);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Calculate the current items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(rooms.length / itemsPerPage);

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
        {/* Display loading state */}
        {loading && (
          <div className="mb-4 p-4 bg-yellow-500 text-white rounded-md">
            Đang tải dữ liệu phòng...
          </div>
        )}

        {/* Display error message if any */}
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-md">
            {error}
          </div>
        )}

        {/* Display list of rooms */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">Danh sách phòng</h2>
          <div className='center justify-center items-center flex'>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
              {currentRooms.map((room) => (
                <div key={room.id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg">
                  <Link to={`/room/${room.id}`} className="block overflow-hidden">
                    <img
                      className="rounded-t-lg w-full h-64 object-cover transform transition duration-300 ease-in-out hover:scale-110"
                      src={room.imageUrl || 'https://via.placeholder.com/300'}
                      alt={room.name}
                    />
                  </Link>
                  <div className="px-5 py-4">
                    <h5 className="text-xl font-semibold text-gray-900">{room.name}</h5>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-bold text-gray-900">{room.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                      <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5"
                        onClick={() => handleAddToCart(room)}
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

        {showToast && (
          <div className="fixed bottom-10 right-10">
            <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="sr-only">Check icon</span>
              </div>
              <div className="ms-3 text-sm font-normal">Đã thêm vào giỏ hàng</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomOrder;
