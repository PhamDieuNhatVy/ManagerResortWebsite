import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProductDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Kiểm tra 3 collection: rooms, tours, foods
        let productRef;

        // Kiểm tra xem id có thuộc về rooms, tours hay foods
        if (id.startsWith('room_')) {
          productRef = doc(db, 'rooms', id); // Tìm trong collection rooms
        } else if (id.startsWith('tour_')) {
          productRef = doc(db, 'tours', id); // Tìm trong collection tours
        } else if (id.startsWith('food_')) {
          productRef = doc(db, 'foods', id); // Tìm trong collection foods
        } else {
          setError('Product not found');
          setLoading(false);
          return;
        }

        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Chạy lại khi id thay đổi

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <img
            className="w-full h-96 object-cover"
            src={product?.imageUrl || 'https://via.placeholder.com/300'}
            alt={product?.name}
          />
          <div className="p-6">
            <h2 className="text-3xl font-semibold text-gray-900">{product?.name}</h2>
            <p className="mt-4 text-gray-700">{product?.description}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">
                {product?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
              {product?.capacity && (
                <span className="text-md text-gray-700">Capacity: {product.capacity} people</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
