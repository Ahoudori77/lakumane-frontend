import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';

export default function ItemDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (id) {
      api.get(`/items/${id}`)
        .then(res => setItem(res.data))
        .catch(console.error);
    }
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>Current Quantity: {item.current_quantity}</p>
      <p>Optimal Quantity: {item.optimal_quantity}</p>
      <p>Reorder Threshold: {item.reorder_threshold}</p>
      <p>Price: {item.price}</p>
    </div>
  );
}