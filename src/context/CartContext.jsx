import { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    if (user) {
      setLoading(true);
      const cartDocRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartDocRef);
      if (cartDoc.exists()) {
        setCart(cartDoc.data().items);
      } else {
        // Create a new cart document with email and empty items if it doesn't exist
        await setDoc(cartDocRef, { 
          items: [], 
          email: user.email // Store the user's email
        });
        setCart([]); 
      }
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (user) {
      const cartDocRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartDocRef);
      let updatedCart = [];

      if (cartDoc.exists()) {
        updatedCart = cartDoc.data().items;
        const existingProduct = updatedCart.find(item => item.id === product.id);

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          updatedCart.push({ ...product, quantity: 1 });
        }
      } else {
        updatedCart = [{ ...product, quantity: 1 }];
      }

      // Update the cart and include the user's email
      await updateDoc(cartDocRef, { 
        items: updatedCart,
        email: user.email // Ensure email is updated in the cart
      });
      setCart(updatedCart);
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      const cartDocRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartDocRef);
      const updatedItems = cartDoc.data().items.filter(item => item.id !== productId);
      await updateDoc(cartDocRef, { items: updatedItems });
      setCart(updatedItems);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (user) {
      const cartDocRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartDocRef);
      let updatedCart = [];

      if (cartDoc.exists()) {
        updatedCart = cartDoc.data().items;
        const productIndex = updatedCart.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
          updatedCart[productIndex].quantity = quantity;
        }
      }

      await updateDoc(cartDocRef, { items: updatedCart });
      setCart(updatedCart);
    }
  };

  const clearCart = async () => {
    if (user) {
      const cartDocRef = doc(db, 'carts', user.uid);
      await setDoc(cartDocRef, { items: [], email: user.email });
      setCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
