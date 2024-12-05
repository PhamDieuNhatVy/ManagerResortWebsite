import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Firebase configuration
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const OrderHistoryPage = () => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || !user.uid) {
      toast.error('Vui lòng đăng nhập để xem lịch sử đơn hàng.');
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể tải đơn hàng.');
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Handle order cancelation
  const handleCancelOrder = async (orderId) => {
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, {
        status: 'canceled',  // Update order status to "canceled"
      });

      // Optionally, remove the order from Firestore
      await deleteDoc(orderDocRef);

      // Show success message and remove the order from state
      toast.success('Đơn hàng đã được hủy');
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

    } catch (error) {
      console.error('Error canceling order:', error);
      toast.error('Không thể hủy đơn hàng, vui lòng thử lại!');
    }
  };

  if (loading) {
    return <div className="text-center text-lg">Đang tải...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-2">Lịch sử Đơn Đặt Hàng</h2>

      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Mã Đơn Hàng</th>
                <th className="p-3 text-left">Trạng Thái</th>
                <th className="p-3 text-left">Tổng Tiền</th>
                <th className="p-3 text-left">Sản Phẩm</th>
                <th className="p-3 text-left">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}</td>
                  <td className="p-3">
                    <ul className="space-y-2">
                      {order.cart.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 px-4 py-2 rounded-md"
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-lg">Bạn chưa có đơn hàng nào.</div>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderHistoryPage;
