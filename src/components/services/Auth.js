import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc} from 'firebase/firestore';
import { db } from '../../firebase';


// Đăng nhập
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lấy role từ Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role; // Lấy role từ Firestore
      return { success: true, data: { ...user, role } }; // Trả về thông tin người dùng và role
    } else {
      throw new Error('Người dùng không có role trong Firestore');
    }
  } catch (error) {
    return { success: false, error: error.message }; // Trả về thông báo lỗi
  }
};

// Đăng ký
export const register = async (username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu thông tin người dùng và role vào Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      role: 'user', // Đặt role mặc định là "user"
    });

    return { success: true, data: user }; // Trả về thông tin người dùng
  } catch (error) {
    return { success: false, error: error.message }; // Trả về thông báo lỗi
  }
};

// Export hàm useRegister và useLogin
export const useRegister = () => {
  return register;
};

export const useLogin = () => {
  return login;
};
