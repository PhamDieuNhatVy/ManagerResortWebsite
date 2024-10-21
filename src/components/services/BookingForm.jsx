import React, { useState } from 'react';
import { db } from '../../firebase'; // Import your Firebase configuration
import { collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const BookingForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tourId, setTourId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const booking = {
      name,
      email,
      phone,
      tourId,
    };

    try {
      // Add booking to Firestore
      await addDoc(collection(db, 'bookings'), booking);
      Swal.fire('Success', 'Your booking has been placed!', 'success');

      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setTourId('');
    } catch (error) {
      console.error("Error adding booking: ", error);
      Swal.fire('Error', 'There was an issue placing your booking.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Book Your Tour</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
          className="border border-gray-300 p-2 w-full mb-4 rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          required
          className="border border-gray-300 p-2 w-full mb-4 rounded"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your Phone"
          required
          className="border border-gray-300 p-2 w-full mb-4 rounded"
        />
        <input
          type="text"
          value={tourId}
          onChange={(e) => setTourId(e.target.value)}
          placeholder="Tour ID"
          required
          className="border border-gray-300 p-2 w-full mb-4 rounded"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
