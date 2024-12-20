import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';


const OrderHistoryPage = () => {
    const { user, loading } = useAuth();
    const [orders, setOrders] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [orderStatus, setOrderStatus] = useState(null);
    const notificationShownRef = useRef(false); // Track whether notification has been shown

    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            orderId: params.get('orderId'),
            paymentId: params.get('paymentId'),
            token: params.get('token'),
            payerID: params.get('PayerID'),
        };
    };

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

                const fetchedOrders = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const groupedOrders = groupOrdersByProduct(fetchedOrders);

                setOrders(groupedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Không thể tải đơn hàng.');
            }
        };

        fetchOrders();
    }, [user, location]);

    useEffect(() => {
        const { orderId, paymentId, token, payerID } = getQueryParams();
        if (orderId && paymentId && token && payerID && !notificationShownRef.current) {
            const updateOrderStatus = async () => {
                try {
                    const orderDocRef = doc(db, 'orders', orderId);
                    await updateDoc(orderDocRef, {
                        status: 'payment',
                        paymentId: paymentId,
                        token: token,
                        payerID: payerID,
                    });

                    await clearCart();

                    // toast.success('Đơn hàng đã được thanh toán!');
                    setOrderStatus('payment');

                    // Mark the notification as shown
                    notificationShownRef.current = true;

                } catch (error) {
                    console.error('Error updating order:', error);
                    toast.error('Không thể cập nhật trạng thái đơn hàng!');
                }
            };

            updateOrderStatus();
        }
    }, [location, clearCart]);

    const groupOrdersByProduct = (orders) => {
        const grouped = [];

        orders.forEach(order => {
            order.cart.forEach(item => {
                const existingProduct = grouped.find(group => group.orderId === order.id && group.name === item.name);

                if (existingProduct) {
                    existingProduct.quantity += item.quantity;
                    existingProduct.totalPrice += item.price * item.quantity;
                } else {
                    grouped.push({
                        orderId: order.id,
                        name: item.name,
                        quantity: item.quantity,
                        totalPrice: item.price * item.quantity,
                        status: order.status,
                    });
                }
            });
        });

        return grouped;
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const orderDocRef = doc(db, 'orders', orderId);

            // Delete the order
            await deleteDoc(orderDocRef);

            toast.success('Đơn hàng đã được hủy thành công');

            // Remove the canceled order from the local state
            setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
        } catch (error) {
            console.error('Error canceling order:', error);
            toast.error('Không thể hủy đơn hàng, vui lòng thử lại!');
        }
    };

    if (loading) {
        return <div className="text-center text-lg">Đang tải...</div>;
    }

    const getOrderStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'Chưa thanh toán';
            case 'payment':
                return 'Đã thanh toán';
            case 'delivered':
                return 'Đã giao hàng';
            default:
                return 'Không xác định';
        }
    };

    return (
        <div className="flex flex-col min-h-screen"> {/* Wrapper */}
          
            <div className="flex-grow"> {/* Content container, occupies the space above footer */}
              <div className="max-w-3xl mx-auto p-4">
                <h2 className="text-2xl font-semibold text-center mb-2">Lịch sử Đơn Đặt Hàng</h2>
                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-md">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">Sản Phẩm</th>
                                <th className="p-3 text-left">Số Lượng</th>
                                <th className="p-3 text-left">Tổng Tiền</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-3">{order.name}</td>
                                    <td className="p-3">{order.quantity}</td>
                                    <td className="p-3">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(order.totalPrice)}
                                    </td>
                                    <td className="p-3">{getOrderStatusLabel(order.status)}</td>
                                    <td className="p-2">
                                        {order.status !== 'delivered' && (
                                            <button
                                                onClick={() => handleCancelOrder(order.orderId)}
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
            </div>
          
         </div>
    );
};

export default OrderHistoryPage;