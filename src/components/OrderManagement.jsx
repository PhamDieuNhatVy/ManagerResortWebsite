import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Cấu hình Firebase
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify'; // Để hiển thị thông báo
import 'jspdf-autotable';  // Import autoTable
import html2pdf from 'html2pdf.js';
import axios from 'axios'; // Import Axios
const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceSrc, setInvoiceSrc] = useState('');

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

  // Tạo hóa đơn PDF dưới dạng HTML
  const generateInvoiceHTML = (order) => {
    const { username, address, cart, totalPrice } = order;

    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; border: 1px solid #ccc; border-radius: 8px;">
        <h2 style="text-align: center; margin-bottom: 20px; font-size: 24px;">HÓA ĐƠN MUA HÀNG</h2>

        <div style="margin-bottom: 30px;">
          <p><strong>Tên khách hàng:</strong> ${username}</p>
          <p><strong>Địa chỉ:</strong> ${address}</p>
        </div>

        <h3 style="font-size: 18px; margin-bottom: 10px;">Chi tiết đơn hàng:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; background-color: #f4f4f4;">Sản phẩm</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px; background-color: #f4f4f4;">Số lượng</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right; font-size: 14px; background-color: #f4f4f4;">Đơn giá</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right; font-size: 14px; background-color: #f4f4f4;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 16px;">
          <p><strong>Tổng giá trị:</strong></p>
          <p style="text-align: right; font-weight: bold;">${totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
        </div>

        <div style="margin-top: 30px;">
          <p><strong>Chữ ký của quán:</strong> Mrs. Hang</p>
        </div>
      </div>
    `;
  };

  const generateInvoice = (order) => {
    const invoiceHTML = generateInvoiceHTML(order);
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setInvoiceSrc(url);
  };

  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
    generateInvoice(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setInvoiceSrc('');
  };

  // Tải hóa đơn dưới dạng PDF
  const handleDownloadInvoice = (order) => {
    const invoiceHTML = generateInvoiceHTML(order);
    const element = document.createElement('div');
    element.innerHTML = invoiceHTML;
    html2pdf()
      .from(element)
      .save(`Hoa don Mrs.HangFarm.pdf`);
  };

  const handleSendInvoice = async (order) => {
    try {
      const response = await axios.post('/api', {
        recipient: order.email, 
        subject: 'Phản hồi từ hệ thống',
        html: `
          <p>ID đơn hàng: ${order.id}</p>
          <p>Tên khách hàng: ${order.username}</p>
          <p>Địa chỉ: ${order.address}</p>
          <p>Tổng giá: ${order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
        `,
      });
  
      if (response.status === 200) {
        toast.success('Hóa đơn đã được gửi qua email!');
      } else {
        toast.error('Không thể gửi hóa đơn qua email.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      toast.error('Không thể gửi hóa đơn qua email.');
    }
  };
  
  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <div className="flex flex-col">
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
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white border-b">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{order.username}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{order.address}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
             
                <td className="px-4 py-4 text-sm text-gray-900 flex ">
                  <select
                    className="px-1 py-2 bg-blue-600 text-white rounded-md mr-2 text-center"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="pending">Chưa thanh toán</option>
                    <option value="payment">Đã thanh toán</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>

                  {order.status === 'delivered' && (
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-md"
                        onClick={() => handleViewInvoice(order)}
                      >
                        Xem hóa đơn
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && selectedOrder && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg w-1/2">

            <iframe
              src={invoiceSrc}
              width="100%"
              height="500px"
              title="Invoice"
              frameBorder="0"
              className="mb-4"
            ></iframe>
            <div className="flex space-x-4 mt-4 justify-center">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleDownloadInvoice(selectedOrder)}
              >
                Tải hóa đơn
              </button>
              <button
                className="bg-yellow-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleSendInvoice(selectedOrder)}
              >
                Gửi hóa đơn
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={handleCloseModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderManagementPage;
