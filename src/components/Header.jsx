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
    <header className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Logo" className="w-12 h-12 mr-2" />
          <h1 className="font-weight-bold text-dark">Mrs. Hang Farm</h1>
        </Link>

        <nav className="ml-auto">
          <ul className="navbar-nav d-flex">
            <li className="nav-item">
              <Link to="/" className="nav-link font-weight-bold text-uppercase py-2">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link font-weight-bold text-uppercase py-2">Giới thiệu</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link font-weight-bold text-uppercase py-2">Liên hệ</Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link py-2">{user.email}</span>
                </li>
                <li className="nav-item">
                  <Link to="/logout" className="nav-link font-weight-bold text-uppercase py-2">Đăng xuất</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login">
                  <button className="btn btn-danger text-white font-weight-bold py-2 px-4 rounded-pill hover:bg-green-600">
                    Đăng nhập
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
