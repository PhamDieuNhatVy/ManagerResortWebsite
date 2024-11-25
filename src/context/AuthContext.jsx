import { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase'; // Firebase configuration
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Lấy thông tin người dùng từ Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userDoc.data().role || 'user', // Mặc định là 'user'
          };
          setUser(userData);
        } else {
          setUser(null); // Nếu không có dữ liệu người dùng trong Firestore
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Lấy thông tin vai trò từ Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: userDoc.data().role || 'user', // Mặc định role là 'user'
        };
        setUser(userData);
        return userData; // Trả về dữ liệu người dùng, bao gồm vai trò
      } else {
        throw new Error('Không tìm thấy thông tin người dùng.');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.message);
      throw error; // Quăng lỗi để xử lý ở phía component
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
