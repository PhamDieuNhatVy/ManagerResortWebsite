import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import config from '../../../config';

const Room = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState(''); // Add price state
  const [imageUrl, setImageUrl] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRoomId, setEditRoomId] = useState(null);
  const navigate = useNavigate(); // Khai báo useNavigate

  const fetchRooms = async () => {
    const roomsCollection = collection(db, 'rooms');
    const roomsSnapshot = await getDocs(roomsCollection);
    const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRooms(roomsList);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
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

    const room = {
      name,
      description,
      capacity: parseInt(capacity),
      price: parseFloat(price), // Include price in the room object
      imageUrl,
    };

    try {
      if (editRoomId) {
        const roomRef = doc(db, 'rooms', editRoomId);
        await updateDoc(roomRef, room);
        Swal.fire('Thành công', 'Đã cập nhật phòng!', 'success');
      } else {
        await addDoc(collection(db, 'rooms'), room);
        Swal.fire('Thành công', 'Đã thêm phòng!', 'success');
      }

      // Reset trạng thái sau khi thêm hoặc cập nhật
      setName('');
      setDescription('');
      setCapacity('');
      setPrice(''); // Reset price
      setImageUrl('');
      fetchRooms();
      setIsModalOpen(false);
      setEditRoomId(null);
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật tài liệu: ", error);
      Swal.fire('Lỗi', 'Không thể thêm hoặc cập nhật phòng.', 'error');
    }
  };

  const handleEdit = (room) => {
    setName(room.name);
    setDescription(room.description);
    setCapacity(room.capacity);
    setPrice(room.price); // Set price
    setImageUrl(room.imageUrl);
    setEditRoomId(room.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa phòng này không?',
      icon: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        const roomRef = doc(db, 'rooms', id);
        await deleteDoc(roomRef);
        Swal.fire('Đã xóa!', 'Phòng đã được xóa.', 'success');
        fetchRooms();
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể xóa phòng.', 'error');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-2 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Quản Lý Phòng</h1>

        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mb-1"
          onClick={() => {
            setIsModalOpen(true);
            setEditRoomId(null);
          }}
        >
          Thêm Phòng
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white rounded-lg p-6 z-10 w-96">
              <h2 className="text-xl font-bold mb-4">{editRoomId ? "Sửa Phòng" : "Thêm Phòng"}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên phòng"
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
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Sức chứa"
                  required
                  className="border border-gray-300 p-2 w-full mb-4 rounded"
                  min="1"
                />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Giá"
                  required
                  className="border border-gray-300 p-2 w-full mb-4 rounded"
                  min="0"
                  step="0.01"
                />
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="border border-gray-300 p-2 w-full mb-4 rounded"
                />
                {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-16 h-16 object-cover mb-4" />}
                <div className="flex justify-between">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editRoomId ? "Cập Nhật" : "Thêm"}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold mt-10 mb-4">Danh Sách Phòng</h2>

        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">Tên</th>
              <th className="py-2 px-4 border-b text-left">Mô Tả</th>
              <th className="py-2 px-4 border-b text-left">Sức Chứa</th>
              <th className="py-2 px-4 border-b text-left">Giá</th> {/* Add price column */}
              <th className="py-2 px-4 border-b text-left">Hình Ảnh</th>
              <th className="py-2 px-4 border-b text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{room.name}</td>
                <td className="py-2 px-4 border-b">{room.description}</td>
                <td className="py-2 px-4 border-b">{room.capacity}</td>
                <td className="py-2 px-4 border-b">{room.price}</td> {/* Display price */}
                <td className="py-2 px-4 border-b">
                  {room.imageUrl && <img src={room.imageUrl} alt={room.name} className="w-16 h-16 object-cover" />}
                </td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleEdit(room)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Sửa</button>
                  <button onClick={() => handleDelete(room.id)} className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Room;
