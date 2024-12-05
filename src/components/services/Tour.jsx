import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
const Tour = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null); // To store selected image
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTourId, setEditTourId] = useState(null);
  const navigate = useNavigate();

  const fetchTours = async () => {
    const toursCollection = collection(db, 'tours');
    const toursSnapshot = await getDocs(toursCollection);
    const toursList = toursSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTours(toursList);
    setLoading(false);
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      
      const response = await fetch(config.apiUrl, { 
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setImageUrl(data.fileUrl);  // Set the returned image URL to the state
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire('Error', 'Failed to upload image.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tour = {
      name,
      description,
      price: parseFloat(price),
      imageUrl,
    };

    try {
      if (editTourId) {
        const tourRef = doc(db, 'tours', editTourId);
        await updateDoc(tourRef, tour);
        Swal.fire('Thành công', 'Đã cập nhật tour!', 'success');
      } else {
        await addDoc(collection(db, 'tours'), tour);
        Swal.fire('Thành công', 'Đã thêm tour!', 'success');
      }

      // Reset trạng thái sau khi thêm hoặc cập nhật
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setImageFile(null);
      fetchTours();
      setIsModalOpen(false);
      setEditTourId(null);
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật tài liệu: ", error);
      Swal.fire('Lỗi', 'Không thể thêm hoặc cập nhật tour.', 'error');
    }
  };

  const handleEdit = (tour) => {
    setName(tour.name);
    setDescription(tour.description);
    setPrice(tour.price);
    setImageUrl(tour.imageUrl);
    setEditTourId(tour.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa tour này không?',
      icon: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        const tourRef = doc(db, 'tours', id);
        await deleteDoc(tourRef);
        Swal.fire('Đã xóa!', 'Tour đã được xóa.', 'success');
        fetchTours();
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể xóa tour.', 'error');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-2 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Quản Lý Tour</h1>

        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mb-1"
          onClick={() => {
            setIsModalOpen(true);
            setEditTourId(null);
          }}
        >
          Thêm Tour
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white rounded-lg p-6 z-10 w-96">
              <h2 className="text-xl font-bold mb-4">{editTourId ? "Sửa Tour" : "Thêm Tour"}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên tour"
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
                  min="0"
                />
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="border border-gray-300 p-2 w-full mb-4 rounded"
                />
                {imageUrl && <img src={imageUrl} alt="Tour" className="w-16 h-16 object-cover" />}
                <div className="flex justify-between">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editTourId ? "Cập Nhật" : "Thêm"}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold mt-10 mb-4">Danh Sách Tour</h2>

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
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{tour.name}</td>
                <td className="py-2 px-4 border-b">{tour.description}</td>
                <td className="py-2 px-4 border-b">{tour.price} VND</td>
                <td className="py-2 px-4 border-b">
                  {tour.imageUrl && <img src={tour.imageUrl} alt={tour.name} className="w-16 h-16 object-cover" />}
                </td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleEdit(tour)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Sửa</button>
                  <button onClick={() => handleDelete(tour.id)} className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Tour;
