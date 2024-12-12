import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Item {
  id: number;
  name: string;
  description: string;
  category: {
    name: string;
  };
}

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    api.get('/items')
      .then(response => setItems(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.description} (Category: {item.category.name})
          </li>
        ))}
      </ul>
    </div>
  );
}
