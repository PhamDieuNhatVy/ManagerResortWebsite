import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUtensils,
  FaBed,
  FaShoppingCart,
  FaStar,
  FaUser
} from 'react-icons/fa';
import logo from '../../assets/LogowebsiteMrsHangFarm.png';

const Sidebar = ({ children }) => {
  const location = useLocation();

  // Mapping pathnames to header titles
  const pageTitles = {
    '/admin': 'Trang chủ',
    '/admin/food': 'Food',
    '/admin/room': 'Room',
    '/admin/tour': 'Tour',
    '/admin/orders': 'Orders',
    '/admin/users': 'Orders',

  };

  const currentPageTitle = pageTitles[location.pathname] || '';

  const menuItem = [
    { path: '/admin', name: 'Trang chủ', icon: <FaHome /> },
    { path: '/admin/food', name: 'Quản lý món ăn', icon: <FaUtensils /> },
    { path: '/admin/room', name: 'Quản lý phòng', icon: <FaBed /> },
    { path: '/admin/tour', name: 'Quản lý Tour', icon: <FaBed /> },
    { path: '/admin/orders', name: 'Quản lý đơn đặt hàng', icon: <FaShoppingCart /> },
    { path: '/admin/users', name: 'Quản lý người dùng', icon: <FaUser /> },


  ];

  return (
    <div className="flex ">
      {/* Sidebar */}
      <div
        style={{ width: '300px' }}
        className="sidebar text-black transition-all duration-300 ease-in-out min-h-full "
      >
        {/* Logo */}
        <div className="logo flex items-center mb-4 mt-4 ml-3">
          <img
            style={{ width: '80px',  }}
            src={logo}
            alt="Logo"
          />
          <h1 className='font-bold p-1.5 text-xl'>Mrs. Hang Farm</h1>
        </div>  

        {/* Menu */}
        <div className="menu">
          {menuItem.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className={`flex items-center py-4 px-4 mb-2 text-lg ${
                location.pathname === item.path
                  ? 'bg-blue-700 text-white'
                  : 'hover:bg-blue-700 hover:text-white'
              }`} 
            >
              <div className="icon mr-3">{item.icon}</div>
              <div className="text-sm">{item.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {/* <header className="bg-blue-500 text-white p-3 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h1 className="m-0">{currentPageTitle}</h1>
          </div>
        </header> */}

        {/* Main content */}
        <main className="flex-1 p-1">{children}</main>
      </div>
    </div>
  );
};

export default Sidebar;
