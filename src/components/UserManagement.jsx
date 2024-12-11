import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Firebase config
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify'; // For notifications
import Swal from 'sweetalert2'; // Import SweetAlert2

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from Firestore
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Filter out users with role 'admin'
      const filteredUsers = usersList.filter(user => user.role !== 'admin');
      setUsers(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa người dùng này?',
        text: "Hành động này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      });

      if (result.isConfirmed) {
        // Proceed with deletion if confirmed
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);
        setUsers(users.filter(user => user.id !== userId)); // Update list after deletion
        toast.success('Người dùng đã được xóa thành công!');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Không thể xóa người dùng!');
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Quản Lý Người Dùng</h1>

      {users.length === 0 ? (
        <p className="text-center text-lg">Hiện tại không có người dùng nào.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Username</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Địa Chỉ</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tuổi</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">CCCD</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white border-b">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{user.address}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{user.age}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{user.cccd}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{user.email}</td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {/* Delete User Button */}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserManagement;
