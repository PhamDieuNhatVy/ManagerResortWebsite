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

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch(config.apiUrl, {

        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      Swal.fire('Error', 'Failed to upload image.', 'error');
      console.error('Error during image upload:', error);
    }
  };

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
        Swal.fire('Success', 'Food updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'foods'), food);
        Swal.fire('Success', 'Food added successfully!', 'success');
      }

      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
      fetchFoods();
      setIsModalOpen(false);
      setEditFoodId(null);
    } catch (error) {
      console.error("Error adding/updating food:", error);
      Swal.fire('Error', 'Unable to add or update food.', 'error');
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
      title: 'Are you sure you want to delete this food?',
      icon: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        const foodRef = doc(db, 'foods', id);
        await deleteDoc(foodRef);
        Swal.fire('Deleted!', 'Food has been deleted.', 'success');
        fetchFoods();
      } catch (error) {
        Swal.fire('Error', 'Unable to delete food.', 'error');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <main className="p-1 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Food Management</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mb-1"
          onClick={() => {
            setIsModalOpen(true);
            setEditFoodId(null);
          }}
        >
          Add Food
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white rounded-lg p-6 z-10 w-96">
              <h2 className="text-xl font-bold mb-4">{editFoodId ? "Edit Food" : "Add Food"}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Food Name"
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
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  required={!editFoodId}
                  className="border border-gray-300 p-2 w-full mb-4 rounded"
                />
                <div className="flex justify-between">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editFoodId ? "Update" : "Add"}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold mt-10 mb-4">Food List</h2>

        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Actions</th>
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
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
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
