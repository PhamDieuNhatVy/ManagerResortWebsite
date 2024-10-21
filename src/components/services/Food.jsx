import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Food = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFoodId, setEditFoodId] = useState(null); // State to manage editing food

  // Fetch foods from Firestore
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
      price: parseFloat(price), // Convert price to a number
    };

    try {
      if (editFoodId) {
        // Update food if editFoodId is set
        const foodRef = doc(db, 'foods', editFoodId);
        await updateDoc(foodRef, food);
        console.log("Document updated with ID: ", editFoodId);
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công!',
          text: 'Thực phẩm đã được cập nhật.',
        });
      } else {
        // Add new food
        const docRef = await addDoc(collection(db, 'foods'), food);
        console.log("Document written with ID: ", docRef.id);
        Swal.fire({
          icon: 'success',
          title: 'Thêm thành công!',
          text: 'Thực phẩm đã được thêm vào danh sách.',
        });
      }

      // Reset form fields
      setName('');
      setDescription('');
      setPrice('');
      // Refresh the list of foods
      fetchFoods();
      // Close modal after submission
      setIsModalOpen(false);
      setEditFoodId(null); // Reset edit ID
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra!',
        text: 'Không thể thêm hoặc cập nhật thực phẩm.',
      });
    }
  };

  const handleEdit = (food) => {
    setName(food.name);
    setDescription(food.description);
    setPrice(food.price);
    setEditFoodId(food.id); // Set food ID for editing
    setIsModalOpen(true); // Open modal for editing
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa thực phẩm này không?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        const foodRef = doc(db, 'foods', id);
        await deleteDoc(foodRef);
        console.log("Document deleted with ID: ", id);
        Swal.fire(
          'Đã xóa!',
          'Thực phẩm đã được xóa.',
          'success'
        );
        fetchFoods(); // Refresh list after deletion
      } catch (error) {
        console.error("Error deleting document: ", error);
        Swal.fire({
          icon: 'error',
          title: 'Có lỗi xảy ra!',
          text: 'Không thể xóa thực phẩm.',
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Quản Lý Thực Phẩm</h1>

      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-5"
        onClick={() => {
          setIsModalOpen(true);
          setEditFoodId(null); // Reset edit ID when opening modal
        }}
      >
        Thêm Thực Phẩm
      </button>

      {/* Modal */}
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
      
      {/* Bảng Danh Sách Thực Phẩm */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b text-left">Tên</th>
            <th className="py-2 px-4 border-b text-left">Mô Tả</th>
            <th className="py-2 px-4 border-b text-left">Giá</th>
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
                <button onClick={() => handleEdit(food)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Sửa</button>
                <button onClick={() => handleDelete(food.id)} className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Food;
