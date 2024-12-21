import React from 'react';

interface Item {
  id: number;
  name: string;
  description: string;
  quantity: number;
}

const ItemsPage = () => {
  const items: Item[] = [
    { id: 1, name: 'Item 1', description: 'Description 1', quantity: 10 },
    { id: 2, name: 'Item 2', description: 'Description 2', quantity: 20 },
  ];

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.description} (Quantity: {item.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsPage;
