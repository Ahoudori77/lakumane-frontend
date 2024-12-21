import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';

export default function EditItem() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    current_quantity: '',
    optimal_quantity: '',
    reorder_threshold: '',
    unit: '',
    manufacturer: '',
    supplier_info: '',
    price: '',
  });

  useEffect(() => {
    if (id) {
      api.get(`/items/${id}`)
        .then(res => setFormData(res.data))
        .catch(console.error);
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/items/${id}`, { item: formData });
      router.push('/items');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Edit Item</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        <input type="number" name="current_quantity" value={formData.current_quantity} onChange={handleChange} required />
        <input type="number" name="optimal_quantity" value={formData.optimal_quantity} onChange={handleChange} required />
        <input type="number" name="reorder_threshold" value={formData.reorder_threshold} onChange={handleChange} required />
        <input type="text" name="unit" value={formData.unit} onChange={handleChange} />
        <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
        <textarea name="supplier_info" value={formData.supplier_info} onChange={handleChange}></textarea>
        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
