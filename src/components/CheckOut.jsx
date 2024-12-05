import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.userData || !state.cart) {
    navigate('/cart'); 
    return null;
  }

  const { userData, cart } = state;


  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

 
  const formattedTotalPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalPrice);


  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    try {
  
      const order = {
        userId: userData.uid,
        email: userData.email,
        username: userData.username,
        address: userData.address,
        phone: userData.phone,
        cart: cart,
        totalPrice: totalPrice,
        status: 'pending',  
        createdAt: serverTimestamp(),
      };


      const ordersCollection = collection(db, 'orders');
      await addDoc(ordersCollection, order);

 
      const userDocRef = doc(db, 'users', userData.uid);
      await updateDoc(userDocRef, {
        cart: []  
      });

    
      toast.success('Đặt hàng thành công!');

      navigate('/');  
    } catch (error) {
      console.error('Order submission error:', error);

      toast.error('Đặt hàng thất bại, vui lòng thử lại!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Thông tin đặt hàng</h2>

      <form onSubmit={handleOrderSubmit} className="space-y-4">
        {/* User Info */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Tên</label>
            <input
              type="text"
              value={userData.username}
              readOnly
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={userData.email}
              readOnly
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input
              type="text"
              value={userData.address}
              readOnly
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              value={userData.phone}
              readOnly
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>
        </div>

        {/* Cart Info */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
          <ul className="space-y-3">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm">
                  {item.quantity} x {item.price} VND
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-semibold">Tổng cộng:</span>
          <span className="text-lg">{formattedTotalPrice}</span>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="w-full py-2 px-4 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Đặt hàng
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default CheckoutPage;
