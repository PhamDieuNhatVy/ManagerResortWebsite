// src/context/CartContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase'; // Firebase configuration
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from './AuthContext'; // Import AuthContext để lấy thông tin người dùng

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // Lấy thông tin người dùng từ AuthContext
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  // Lấy giỏ hàng từ Firestore
  const fetchCart = async () => {
    if (user) {
      setLoading(true);
      const cartDocRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartDocRef);
      if (cartDoc.exists()) {
        setCart(cartDoc.data().items);
      } else {
        await setDoc(cartDocRef, { items: [] }); // Nếu giỏ hàng chưa tồn tại, tạo mới
        setCart([]);
      }
      setLoading(false);
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (product) => {
    if (user) {
      const cartDocRef = doc(db, 'carts', user.uid);
      await updateDoc(cartDocRef, {
        items: arrayUnion(product),
      });
      setCart((prevCart) => [...prevCart, product]);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (productId) => {
    if (user) {
      const cartDocRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartDocRef);
      const updatedItems = cartDoc.data().items.filter(item => item.id !== productId);
      await updateDoc(cartDocRef, { items: updatedItems });
      setCart(updatedItems);
    }
  };

  // Xóa tất cả sản phẩm trong giỏ hàng
  const clearCart = async () => {
    if (user) {
      const cartDocRef = doc(db, 'carts', user.uid);
      await setDoc(cartDocRef, { items: [] });
      setCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
