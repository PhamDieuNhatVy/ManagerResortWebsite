import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Room = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRoomId, setEditRoomId] = useState(null); // State to manage editing room

  // Fetch rooms from Firestore
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const room = {
      name,
      description,
      capacity: parseInt(capacity), // Convert capacity to a number
    };

    try {
      if (editRoomId) {
        // Update room if editRoomId is set
        const roomRef = doc(db, 'rooms', editRoomId);
        await updateDoc(roomRef, room);
        console.log("Document updated with ID: ", editRoomId);
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công!',
          text: 'Phòng đã được cập nhật.',
        });
      } else {
        // Add new room
        const docRef = await addDoc(collection(db, 'rooms'), room);
        console.log("Document written with ID: ", docRef.id);
        Swal.fire({
          icon: 'success',
          title: 'Thêm thành công!',
          text: 'Phòng đã được thêm vào danh sách.',
        });
      }

      // Reset form fields
      setName('');
      setDescription('');
      setCapacity('');
      // Refresh the list of rooms
      fetchRooms();
      // Close modal after submission
      setIsModalOpen(false);
      setEditRoomId(null); // Reset edit ID
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra!',
        text: 'Không thể thêm hoặc cập nhật phòng.',
      });
    }
  };

  const handleEdit = (room) => {
    setName(room.name);
    setDescription(room.description);
    setCapacity(room.capacity);
    setEditRoomId(room.id); // Set room ID for editing
    setIsModalOpen(true); // Open modal for editing
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa phòng này không?',
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
        const roomRef = doc(db, 'rooms', id);
        await deleteDoc(roomRef);
        console.log("Document deleted with ID: ", id);
        Swal.fire(
          'Đã xóa!',
          'Phòng đã được xóa.',
          'success'
        );
        fetchRooms(); // Refresh list after deletion
      } catch (error) {
        console.error("Error deleting document: ", error);
        Swal.fire({
          icon: 'error',
          title: 'Có lỗi xảy ra!',
          text: 'Không thể xóa phòng.',
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Quản Lý Phòng</h1>

      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-5"
        onClick={() => {
          setIsModalOpen(true);
          setEditRoomId(null); // Reset edit ID when opening modal
        }}
      >
        Thêm Phòng
      </button>

      {/* Modal */}
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
              />
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
      
      {/* Bảng Danh Sách Phòng */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b text-left">Tên</th>
            <th className="py-2 px-4 border-b text-left">Mô Tả</th>
            <th className="py-2 px-4 border-b text-left">Sức Chứa</th>
            <th className="py-2 px-4 border-b text-left">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{room.name}</td>
              <td className="py-2 px-4 border-b">{room.description}</td>
              <td className="py-2 px-4 border-b">{room.capacity}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleEdit(room)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Sửa</button>
                <button onClick={() => handleDelete(room.id)} className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Room;
