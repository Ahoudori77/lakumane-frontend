import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../lib/api';

interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  shelf_number: string;
  current_quantity: number;
  optimal_quantity: number;
  reorder_threshold: number;
  unit: string;
  manufacturer: string;
  supplier_info: string;
  price: number;
}

export default function ItemDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (id) {
      api.get(`/items/${id}`)
        .then(response => setItem(response.data))
        .catch(error => console.error(error));
    }
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>Category: {item.category}</p>
      <p>Shelf Number: {item.shelf_number}</p>
      <p>Current Quantity: {item.current_quantity}</p>
      <p>Optimal Quantity: {item.optimal_quantity}</p>
      <p>Reorder Threshold: {item.reorder_threshold}</p>
      <p>Unit: {item.unit}</p>
      <p>Manufacturer: {item.manufacturer}</p>
      <p>Supplier Info: {item.supplier_info}</p>
      <p>Price: ${item.price}</p>
    </div>
  );
}
