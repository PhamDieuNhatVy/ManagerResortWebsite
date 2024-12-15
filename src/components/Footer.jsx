import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-gray-700 pt-1">
      <div className="container mx-auto px-10 justify-around">
        <div className="flex flex-wrap justify-around">
          {/* Cột 1: Thông tin công ty */}
          <div className="flex-1 px-4 mb-6 min-w-[200px]">
            <h5 className="text-xl font-bold mb-2">Mrs. Hang Farm</h5>
            <p className="text-gray-600">Thưởng thức kỳ nghỉ thư giãn tại khách sạn và resort tuyệt đẹp của chúng tôi.</p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="flex-1 px-4 mb-6 min-w-[200px]">
            <h5 className="text-xl font-bold mb-2">Liên kết nhanh</h5>
            <ul className="list-none space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">Trang chủ</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/room-order" className="text-gray-600 hover:text-gray-900">Phòng nghỉ</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">Liên hệ</Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Dịch vụ */}
          <div className="flex-1 px-4 mb-6 min-w-[200px]">
            <h5 className="text-xl font-bold mb-2">Dịch vụ</h5>
            <ul className="list-none space-y-2">
              <li className="text-gray-600">Wi-Fi miễn phí</li>
              <li className="text-gray-600">Dịch vụ phòng 24/7</li>
              <li className="text-gray-600">Đưa đón sân bay</li>
              <li className="text-gray-600">Hồ bơi</li>
            </ul>
          </div>

          {/* Cột 4: Mạng xã hội */}
          <div className="flex-1 px-4 mb-6 min-w-[200px]">
            <h5 className="text-xl font-bold mb-2">Theo dõi chúng tôi</h5>
            <ul className="list-none space-y-2">
              <li>
                <a href="https://facebook.com" className="text-gray-600 hover:text-gray-900 flex items-center">
                  <FaFacebook className="mr-2" /> Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" className="text-gray-600 hover:text-gray-900 flex items-center">
                  <FaInstagram className="mr-2" /> Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com" className="text-gray-600 hover:text-gray-900 flex items-center">
                  <FaTwitter className="mr-2" /> Twitter
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" className="text-gray-600 hover:text-gray-900 flex items-center">
                  <FaLinkedin className="mr-2" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center bg-black p-4">
        <p className="text-white">© 2024 - Mrs. Hang Farm.</p>
      </div>
      {showTopButton && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300">
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
};

export default Footer;
