import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

export default function NewItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    shelf_number: '',
    current_quantity: '',
    optimal_quantity: '',
    reorder_threshold: '',
    unit: '',
    manufacturer: '',
    supplier_info: '',
    price: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/items', { item: formData });
      router.push('/items');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>New Item</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
        <input type="number" name="current_quantity" placeholder="Current Quantity" value={formData.current_quantity} onChange={handleChange} required />
        <input type="number" name="optimal_quantity" placeholder="Optimal Quantity" value={formData.optimal_quantity} onChange={handleChange} required />
        <input type="number" name="reorder_threshold" placeholder="Reorder Threshold" value={formData.reorder_threshold} onChange={handleChange} required />
        <input type="text" name="unit" placeholder="Unit" value={formData.unit} onChange={handleChange} />
        <input type="text" name="manufacturer" placeholder="Manufacturer" value={formData.manufacturer} onChange={handleChange} />
        <textarea name="supplier_info" placeholder="Supplier Info" value={formData.supplier_info} onChange={handleChange}></textarea>
        <input type="number" step="0.01" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
