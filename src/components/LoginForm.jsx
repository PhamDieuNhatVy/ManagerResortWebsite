import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const userData = await login(email, password);

      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
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

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setResetMessage('');
    try {
      await resetPassword(resetEmail);
      setResetMessage('Một email đặt lại mật khẩu đã được gửi.');
    } catch (error) {
      setResetMessage('Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.');
      console.error('Lỗi đặt lại mật khẩu:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResetMessage('');
    setResetEmail('');
  };

  return (
    <div className="p-10 flex items-center justify-center">
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
          <button onClick={openModal} className="text-blue-500 hover:text-blue-700 text-sm ml-4">
            Quên mật khẩu?
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Reset Password"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 "
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md z-50">
          <h2 className="text-xl font-semibold mb-2 text-center">Đặt lại mật khẩu</h2>
          {resetMessage && (
            <div className="bg-blue-500 text-white p-3 rounded mb-4">
              {resetMessage}
            </div>
          )}
          <form onSubmit={handleResetPassword}>
            <div className="mb-4 ">
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-600 ">
                Email
              </label>
              <input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập email để đặt lại mật khẩu"
              />
            </div>
            <div className='flex justify-between'>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Gửi yêu cầu
            </button>
            <button onClick={closeModal}  className="ml-2 w-full py-2 px-4 bg-red text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Đóng
          </button>
            </div>
           
          </form>
          
        </div>
      </Modal>
    </div>
  );
};

export default LoginForm;
