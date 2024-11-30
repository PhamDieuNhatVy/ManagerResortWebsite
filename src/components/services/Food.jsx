import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Food = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFoodId, setEditFoodId] = useState(null);
  const navigate = useNavigate(); // Khai báo useNavigate

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
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
        food.imageUrl = imageUrl;
      }

      if (editFoodId) {
        const foodRef = doc(db, 'foods', editFoodId);
        await updateDoc(foodRef, food);
        Swal.fire('Thành công', 'Đã cập nhật món ăn!', 'success');
      } else {
        await addDoc(collection(db, 'foods'), food);
        Swal.fire('Thành công', 'Đã thêm món ăn!', 'success');
      }

      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
      fetchFoods();
      setIsModalOpen(false);
      setEditFoodId(null);
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật tài liệu: ", error);
      Swal.fire('Lỗi', 'Không thể thêm hoặc cập nhật món ăn.', 'error');
    }
  };

  const handleEdit = (food) => {
    setName(food.name);
    setDescription(food.description);
    setPrice(food.price);
    setEditFoodId(food.id);
    setIsModalOpen(true);
  };

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
        Swal.fire('Đã xóa!', 'Món ăn đã được xóa.', 'success');
        fetchFoods();
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể xóa món ăn.', 'error');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <main className="p-1 flex-grow">
        <h1 className="text-2xl font-bold mb-5">Quản Lý Thực Phẩm</h1>

        {/* Nút Quay lại */}
        <button 
          onClick={() => navigate(-1)} 
          className="bg-gray-500 text-white px-4 py-2 rounded mb-5"
        >
          Quay lại
        </button>

        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mb-5"
          onClick={() => {
            setIsModalOpen(true);
            setEditFoodId(null);
          }}
        >
          Thêm Thực Phẩm
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white rounded-lg p-6 z-10 w-96">
              <h2 className="text-xl font-bold mb-4">{editFoodId ? "Sửa Thực Phẩm" : "Thêm Thực Phẩm"}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên thực phẩm"
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

        <h2 className="text-xl font-semibold mt-10 mb-4">Danh Sách Thực Phẩm</h2>

        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">Tên</th>
              <th className="py-2 px-4 border-b text-left">Mô Tả</th>
              <th className="py-2 px-4 border-b text-left">Giá</th>
              <th className="py-2 px-4 border-b text-left">Hình Ảnh</th>
              <th className="py-2 px-4 border-b text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{food.name}</td>
                <td className="py-2 px-4 border-b">{food.description}</td>
                <td className="py-2 px-4 border-b">{food.price} VND</td>
                <td className="py-2 px-4 border-b">
                  {food.imageUrl && <img src={food.imageUrl} alt={food.name} className="w-16 h-16 object-cover" />}
                </td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleEdit(food)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Sửa</button>
                  <button onClick={() => handleDelete(food.id)} className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button>
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
