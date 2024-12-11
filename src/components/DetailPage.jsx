import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const DetailPage = () => {
  const { id } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let docRef;
      let servicePath = '';

      // Identify service type based on URL path
      if (window.location.pathname.includes('food')) {
        servicePath = 'foods';
        setServiceType('food');
      } else if (window.location.pathname.includes('room')) {
        servicePath = 'rooms';
        setServiceType('room');
      } else if (window.location.pathname.includes('tour')) {
        servicePath = 'tours';
        setServiceType('tour');
      }

      if (!servicePath) {
        setError('Invalid service type');
        return;
      }

      // Try fetching the document
      try {
        docRef = doc(db, servicePath, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setServiceData(docSnap.data());
        } else {
          setError('No such document!');
        }
      } catch (err) {
        console.error("Error fetching document: ", err);
        setError('Failed to load service details');
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!serviceData) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{serviceData.name}</h2>
      <img src={serviceData.imageUrl} alt={serviceData.name} className="w-full h-auto mt-4" />
      <p className="mt-2 text-gray-700">{serviceData.description}</p>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Price: {serviceData.price}</h3>
      </div>
      {/* Additional content based on service type */}
      {serviceType === 'food' && <div>Food-specific details...</div>}
      {serviceType === 'room' && <div>Room-specific details...</div>}
      {serviceType === 'tour' && <div>Tour-specific details...</div>}
    </div>
  );
};

export default DetailPage;
