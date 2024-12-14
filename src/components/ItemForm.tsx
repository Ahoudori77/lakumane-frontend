import { useState } from 'react';
import api from '../lib/api';

export default function ItemForm({ item, onSubmit }: any) {
  const [formData, setFormData] = useState(item || {});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Item Name" required />
      <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" />
      {/* 他のフィールドを追加 */}
      <button type="submit">Submit</button>
    </form>
  );
}
