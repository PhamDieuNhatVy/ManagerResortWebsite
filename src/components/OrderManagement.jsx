import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Cấu hình Firebase
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify'; // Để hiển thị thông báo

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy tất cả các đơn hàng từ Firestore
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      const ordersList = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
      setLoading(false);
    }
  };

  // Xử lý thay đổi trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, { status: newStatus });
      // Cập nhật danh sách đơn hàng trong giao diện sau khi thay đổi trạng thái
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Trạng thái đơn hàng đã được cập nhật!');
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      toast.error('Không thể cập nhật trạng thái!');
    }
  };

  // Lấy đơn hàng khi trang được tải
  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <div className="flex flex-col ">
      <h1 className="text-2xl font-bold mb-4">Quản Lý Đơn Hàng</h1>

      {orders.length === 0 ? (
        <p className="text-center text-lg">Hiện tại không có đơn hàng nào.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Mã Đơn Hàng</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Người Mua</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Địa Chỉ</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tổng Giá</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Trạng Thái</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white border-b">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{order.username}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{order.address}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>

                
                <td className="px-4 py-4 text-sm text-gray-900">{order.status}</td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {/* Thay đổi trạng thái đơn hàng */}
                  <select
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Pending">Chờ xử lý</option>
                    <option value="Shipped">Đang giao</option>
                    <option value="Delivered">Đã giao</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderManagementPage;
