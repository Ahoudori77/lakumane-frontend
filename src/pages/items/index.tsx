import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

export default function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/items')
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Item List</h1>
      <ul>
        {items.map((item: any) => (
          <li key={item.id}>
            <Link href={`/items/${item.id}`}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
