import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

const Tour = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTourId, setEditTourId] = useState(null);

  // Fetch tours from Firestore
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tour = {
      title,
      description,
      price: parseFloat(price), // Convert price to a number
    };

    try {
      if (editTourId) {
        // Update tour if editTourId is set
        const tourRef = doc(db, 'tours', editTourId);
        await updateDoc(tourRef, tour);
        Swal.fire('Success', 'Tour updated successfully!', 'success');
      } else {
        // Add new tour
        await addDoc(collection(db, 'tours'), tour);
        Swal.fire('Success', 'Tour added successfully!', 'success');
      }

      // Reset form fields
      setTitle('');
      setDescription('');
      setPrice('');
      fetchTours(); // Refresh the list of tours
      setIsModalOpen(false);
      setEditTourId(null); // Reset edit ID
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      Swal.fire('Error', 'Failed to add or update tour.', 'error');
    }
  };

  const handleEdit = (tour) => {
    setTitle(tour.title);
    setDescription(tour.description);
    setPrice(tour.price);
    setEditTourId(tour.id);
    setIsModalOpen(true); // Open modal for editing
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this tour?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const tourRef = doc(db, 'tours', id);
        await deleteDoc(tourRef);
        Swal.fire('Deleted!', 'Tour has been deleted.', 'success');
        fetchTours(); // Refresh list after deletion
      } catch (error) {
        console.error("Error deleting document: ", error);
        Swal.fire('Error', 'Failed to delete tour.', 'error');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Tour Management</h1>

      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-5"
        onClick={() => {
          setIsModalOpen(true);
          setEditTourId(null); // Reset edit ID when opening modal
        }}
      >
        Add Tour
      </button>

      {/* Modal for adding/editing tour */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-lg p-6 z-10 w-96">
            <h2 className="text-xl font-bold mb-4">{editTourId ? "Edit Tour" : "Add Tour"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tour Title"
                required
                className="border border-gray-300 p-2 w-full mb-4 rounded"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                className="border border-gray-300 p-2 w-full mb-4 rounded"
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                required
                className="border border-gray-300 p-2 w-full mb-4 rounded"
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  {editTourId ? "Update" : "Add"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-10 mb-4">Tour List</h2>
      
      {/* Table for displaying tours */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b text-left">Title</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
            <th className="py-2 px-4 border-b text-left">Price</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{tour.title}</td>
              <td className="py-2 px-4 border-b">{tour.description}</td>
              <td className="py-2 px-4 border-b">{tour.price} VND</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleEdit(tour)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(tour.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tour;
