import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';

type Item = {
  id: number;
  name: string;
  description: string;
  current_quantity: number;
  optimal_quantity: number;
  reorder_threshold: number;
  price: number;
};

export default function ItemDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<Item | null>(null);

  // Fetch item details
  useEffect(() => {
    if (id) {
      api
        .get(`/items/${id}`)
        .then((res) => setItem(res.data))
        .catch(console.error);
    }
  }, [id]);

  // Delete item handler
  const handleDelete = async () => {
    try {
      await api.delete(`/items/${id}`);
      router.push('/items');
    } catch (error) {
      console.error(error);
    }
  };

  // Loading state
  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>Current Quantity: {item.current_quantity}</p>
      <p>Optimal Quantity: {item.optimal_quantity}</p>
      <p>Reorder Threshold: {item.reorder_threshold}</p>
      <p>Price: {item.price}</p>
      <button onClick={handleDelete}>Delete Item</button>
    </div>
  );
}
