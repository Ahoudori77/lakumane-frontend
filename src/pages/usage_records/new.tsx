import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/router';

export default function NewUsageRecord() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    item_id: '',
    user_id: '',
    usage_date: '',
    quantity: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/usage_records', { usage_record: formData });
      router.push('/usage_records');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>New Usage Record</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="item_id" placeholder="Item ID" value={formData.item_id} onChange={handleChange} required />
        <input type="text" name="user_id" placeholder="User ID" value={formData.user_id} onChange={handleChange} required />
        <input type="date" name="usage_date" value={formData.usage_date} onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
        <textarea name="reason" placeholder="Reason" value={formData.reason} onChange={handleChange}></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
