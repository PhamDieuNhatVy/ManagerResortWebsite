import React from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = React.useState(null);

  React.useEffect(() => {
    const fetchTour = async () => {
      const docRef = doc(db, 'tours', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTour(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchTour();
  }, [id]);

  if (!tour) return <div>Loading...</div>;

  return (
    <div>
      <h2>{tour.name}</h2>
      <img src={tour.imageUrl} alt={tour.name} />
      <p>{tour.description}</p>
      <p>{tour.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
    </div>
  );
};

export default TourDetail;
