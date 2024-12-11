import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // If no cart or user data, redirect to cart
  if (!state || !state.userData || !state.cart) {
    navigate('/cart');
    return null;
  }

  const { userData, cart } = state;
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formattedTotalPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);

  // Function to initiate PayPal payment
  const initiatePayment = async (orderId) => {
    setIsProcessing(true);

    try {
      // Get PayPal access token
      const response = await axios.post(
        'https://api.sandbox.paypal.com/v1/oauth2/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa('AQdKkmMv9cK_KLVtib-QfAj5kbYd72JGD3mg0JfYqiB-d7jpCfd2VPSRtABMzkg0B6l6l_4aM1kyqUbD:EF0dJAlj3YngIFoRN3mgz7WjueWAdOsYEypafDpghxjLlcYR_5vVO_fYn91l-Cx4e4DtYOMbq0O2BDiR')}`,
          },
        }
      );

      const { access_token } = response.data;

      // Create the payment with PayPal API
      const paymentResponse = await axios.post(
        'https://api.sandbox.paypal.com/v1/payments/payment',
        {
          intent: 'sale',
          payer: { payment_method: 'paypal' },
          transactions: [
            {
              amount: { total: (totalPrice / 25000).toString(), currency: 'USD' },
              description: 'Thanh toán đơn hàng',
            },
          ],
          redirect_urls: {
            return_url: `http://localhost:5173/orderhistory?orderId=${orderId}`,
            cancel_url: `http://localhost:5173/orderhistory?orderId=${orderId}`,
          },
        },
        {
          headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        }
      );

      const approvalUrl = paymentResponse.data.links.find((link) => link.rel === 'approval_url').href;
      toast.success('Thanh toán thành công, chuyển hướng đến PayPal...');
      window.location.href = approvalUrl;
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Có lỗi xảy ra khi thanh toán: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle order submission
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
        status: 'pending',  // Set status to pending initially
        createdAt: serverTimestamp(),
      };

      const ordersCollection = collection(db, 'orders');
      const docRef = await addDoc(ordersCollection, order);

      // Clear the cart after order creation
      const userDocRef = doc(db, 'users', userData.uid);
      await updateDoc(userDocRef, {
        cart: [],
      });

      // Initiate payment after order is created
      initiatePayment(docRef.id);
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Đặt hàng thất bại, vui lòng thử lại!');
    }
  };

  // Function to parse URL parameters
  const getQueryParams = (url) => {
    const queryString = url.split('?')[1];
    if (!queryString) return {};

    return queryString
      .split('&')
      .map((param) => param.split('='))
      .reduce((acc, [key, value]) => {
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
  };

  // Function to handle deep link (payment status) after PayPal redirects back
  const handleDeepLink = async (url) => {
    const params = getQueryParams(url);
    const orderId = params.orderId;

    try {
      // Ensure orderId is available
      if (!orderId) {
        throw new Error('Order ID is missing');
      }

      const orderRef = doc(db, 'orders', orderId);
      const orderSnapshot = await getDoc(orderRef);

      if (!orderSnapshot.exists()) {
        throw new Error('Đơn hàng không tồn tại');
      }

      // Handle success case (payment successful)
      if (url.includes('paymentId') && url.includes('PayerID')) {
        await updateDoc(orderRef, { status: 'payment' });
        toast.success('Thanh toán thành công, trạng thái đơn hàng đã được cập nhật.');
        navigate('/orderhistory');
      }
      // Handle cancel case (payment cancelled)
      else if (url.includes('payment-cancel')) {
        await updateDoc(orderRef, { status: 'cancelled' });
        toast.error('Thanh toán bị huỷ');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Không thể cập nhật trạng thái đơn hàng: ' + error.message);
    }
  };

  // Listen to deep links to handle PayPal response
  useEffect(() => {
    const linkingListener = window.addEventListener('url', (event) => handleDeepLink(event.url));
    return () => window.removeEventListener('url', linkingListener);
  }, []);

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
            disabled={isProcessing}
          >
            {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default CheckoutPage;
