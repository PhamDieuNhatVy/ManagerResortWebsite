import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const Food = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFoodId, setEditFoodId] = useState(null);
  const navigate = useNavigate();

  // Lấy danh sách món ăn từ Firestore
  const fetchFoods = async () => {
    const foodsCollection = collection(db, 'foods');
    const foodsSnapshot = await getDocs(foodsCollection);
    const foodsList = foodsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFoods(foodsList);
    setLoading(false);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Tải ảnh lên
  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Tải ảnh lên không thành công');
      }

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể tải ảnh lên.', 'error');
      console.error('Lỗi khi tải ảnh lên:', error);
    }
  };

  // Xử lý việc thêm hoặc chỉnh sửa món ăn
  const handleSubmit = async (e) => {
    e.preventDefault();

    const food = {
      name,
      description,
      price: parseFloat(price),
    };

    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
        food.imageUrl = imageUrl;
      }

      if (editFoodId) {
        const foodRef = doc(db, 'foods', editFoodId);
        await updateDoc(foodRef, food);
        Swal.fire('Thành công', 'Món ăn đã được cập nhật!', 'success');
      } else {
        await addDoc(collection(db, 'foods'), food);
        Swal.fire('Thành công', 'Món ăn đã được thêm!', 'success');
      }

      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
      fetchFoods();
      setIsModalOpen(false);
      setEditFoodId(null);
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật món ăn:", error);
      Swal.fire('Lỗi', 'Không thể thêm hoặc cập nhật món ăn.', 'error');
    }
  };

  // Xử lý chỉnh sửa món ăn
  const handleEdit = (food) => {
    setName(food.name);
    setDescription(food.description);
    setPrice(food.price);
    setEditFoodId(food.id);
    setIsModalOpen(true);
  };

  // Xử lý xóa món ăn
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa món ăn này không?',
      icon: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        const foodRef = doc(db, 'foods', id);
        await deleteDoc(foodRef);
        Swal.fire('Đã xóa!', 'Món ăn đã bị xóa.', 'success');
        fetchFoods();
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể xóa món ăn.', 'error');
      }
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <main className="p-1 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Quản lý Món Ăn</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mb-1"
          onClick={() => {
            setIsModalOpen(true);
            setEditFoodId(null);
          }}
        >
          Thêm Món Ăn
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white rounded-lg p-6 z-10 w-96">
              <h2 className="text-xl font-bold mb-4">{editFoodId ? "Chỉnh Sửa Món Ăn" : "Thêm Món Ăn"}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên Món Ăn"
                  required
                  className="border border-gray-300 p-2 w-full mb-4 rounded"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả"
                  required
                  className="border border-gray-300 p-2 w-full mb-4 rounded"
                />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Giá"
                  required
                  className="border border-gray-300 p-2 w-full mb-4 rounded"
                />
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  required={!editFoodId}
                  className="border border-gray-300 p-2 w-full mb-4 rounded"
                />
                <div className="flex justify-between">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editFoodId ? "Cập Nhật" : "Thêm"}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold mt-10 mb-4">Danh Sách Món Ăn</h2>

        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Tên Món Ăn</th>
              <th className="py-2 px-4 border-b">Mô Tả</th>
              <th className="py-2 px-4 border-b">Giá</th>
              <th className="py-2 px-4 border-b">Ảnh</th>
              <th className="py-2 px-4 border-b">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food, index) => (
              <tr key={food.id}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{food.name}</td>
                <td className="py-2 px-4 border-b">{food.description}</td>
                <td className="py-2 px-4 border-b">{food.price}</td>
                <td className="py-2 px-4 border-b">
                  {food.imageUrl && <img src={food.imageUrl} alt={food.name} className="w-20 h-20 object-cover" />}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(food)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Chỉnh Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Food;
