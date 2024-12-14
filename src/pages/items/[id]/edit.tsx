import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ItemForm from '../../../components/ItemForm';
import api from '../../../lib/api';

export default function EditItem() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (id) {
      api.get(`/items/${id}`).then(res => setItem(res.data)).catch(console.error);
    }
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      await api.put(`/items/${id}`, data);
      router.push('/items');
    } catch (err) {
      console.error(err);
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Item</h1>
      <ItemForm item={item} onSubmit={handleSubmit} />
    </div>
  );
}
