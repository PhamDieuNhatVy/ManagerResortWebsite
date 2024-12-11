import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for selected items
  const [selectedItems, setSelectedItems] = useState([]);

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity > 0) {
      updateQuantity(itemId, quantity);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setSelectedItems((prev) => prev.filter((id) => id !== itemId)); // Remove from selectedItems if removed from cart
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleCheckout = () => {
    if (user) {
      const selectedCartItems = cart.filter((item) => selectedItems.includes(item.id));
      if (selectedCartItems.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
        return;
      }
      navigate('/checkout', { state: { userData: user, cart: selectedCartItems } });
    } else {
      alert('User not logged in!');
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mt-8 text-center">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-illustration-download-in-svg-png-gif-file-formats--shopping-ecommerce-simple-error-state-pack-user-interface-illustrations-6024626.png?f=webp"
              alt="Empty Cart"
              className="w-48 mb-5"
            />
            <h3 className="text-xl text-gray-600">Giỏ hàng của bạn hiện đang trống.</h3>
          </div>
        ) : (
          <div className="overflow-x-auto mt-10">
            <table className="table-auto w-full max-w-3xl mx-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Chọn</th>
                  <th className="px-4 py-2 text-left">Sản phẩm</th>
                  <th className="px-4 py-2 text-left">Giá</th>
                  <th className="px-4 py-2 text-left">Số lượng</th>
                  <th className="px-4 py-2 text-left">Tổng</th>
                  <th className="px-4 py-2 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="form-checkbox h-3 w-3 text-blue-600"
                      />
                    </td>
                    <td className="px-4 py-2 flex items-center">
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div className="flex flex-col">
                        <div className="font-semibold">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{item.price} VND</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-20 p-2 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>
                    <td className="px-4 py-2">{item.price * item.quantity} VND</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 transition duration-300 ease-in-out"
                      >
                        <i className="fas fa-trash-alt"></i> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {cart.length > 0 && (
          <div className="flex justify-center mt-9">
            <button
              onClick={handleCheckout}
              className="py-3 px-8 mb-9 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Đặt Ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
