import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username || '',
    address: user.address || '',
    age: user.age || '',
    phone: user.phone || '',
    cccd: user.cccd || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, formData);
    setUser((prevUser) => ({
      ...prevUser,
      ...formData
    }));
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">Trang cá nhân</h2>
      <div className="space-y-5">
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Tên khách hàng:</span>
          <span className="text-gray-900 dark:text-gray-100">{user.username || 'Chưa cập nhật'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Email:</span>
          <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Số CCCD:</span>
          <span className="text-gray-900 dark:text-gray-100">{user.cccd || 'Chưa cập nhật'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Địa chỉ:</span>
          <span className="text-gray-900 dark:text-gray-100">{user.address || 'Chưa cập nhật'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Tuổi:</span>
          <span className="text-gray-900 dark:text-gray-100">{user.age || 'Chưa cập nhật'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Số điện thoại:</span>
          <span className="text-gray-900 dark:text-gray-100">{user.phone || 'Chưa cập nhật'}</span>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          Sửa thông tin
        </button>
      </div>

      {/* Modal for Editing User Information */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Chỉnh sửa thông tin</h3>
            <form onSubmit={handleEdit} className="space-y-1">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium">Tên người dùng</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium">Số CCCD</label>
                <input
                  type="text"
                  name="cccd"
                  value={formData.cccd}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium">Tuổi</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
