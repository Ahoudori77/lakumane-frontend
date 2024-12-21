import React, { useState } from 'react';

interface FormData {
  name: string;
  description: string;
  quantity: number;
}

const ItemForm = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', description: '', quantity: 0 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
      <input name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" />
      <input name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} placeholder="Quantity" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ItemForm;
