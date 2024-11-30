import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ context

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous error message

    try {
      const userData = await login(email, password); // Gọi hàm login từ context

      // Điều hướng dựa trên vai trò
      if (userData.role === 'admin') {
        navigate('/admin'); // Điều hướng đến trang admin
      } else {
        navigate('/'); // Điều hướng đến trang chính cho user thông thường
      }
    } catch (error) {
      // Xử lý các lỗi khi đăng nhập
      if (error.code === 'auth/invalid-email') {
        setErrorMessage('Email không hợp lệ.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('Không tìm thấy tài khoản với email này.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Mật khẩu không đúng.');
      } else {
        setErrorMessage('Đăng nhập không thành công. Vui lòng thử lại sau.');
      }
      console.error('Đăng nhập thất bại:', error);
    }
  };

  return (
    <div className="m-10 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Đăng nhập</h2>

  
        {errorMessage && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-500 hover:text-blue-700 text-sm">
            Bạn chưa có tài khoản? Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
