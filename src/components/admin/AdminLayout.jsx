import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout flex h-screen bg-white">
      <Sidebar />
      <div className="content flex-1 p-8  bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
