import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../App.css';
import logo from '../assets/LogowebsiteMrsHangFarm.png';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="flex items-center p-4 bg-white shadow sticky top-0 z-50">
      <Link to="/" className="flex items-center text-black">
        <img src={logo} alt="Logo" className="w-12 h-12 mr-2" />
        <h1 className="font-bold text-xl">Mrs. Hang Farm</h1>
      </Link>

      <nav className="ml-auto flex space-x-4">
        <Link to="/" className="hover:underline font-bold uppercase py-2">Trang chủ</Link>
        <Link to="/about" className="hover:underline font-bold uppercase py-2">Giới thiệu</Link>
        <Link to="/contact" className="hover:underline font-bold uppercase py-2">Liên hệ</Link>

        {user ? (
          <>
            <span className="py-2">{user.email}</span>
            <Link to="/logout" className="hover:underline font-bold uppercase py-2">Đăng xuất</Link>
          </>
        ) : (
          <Link to="/login">
            <button className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 uppercase">
              Đăng nhập
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
