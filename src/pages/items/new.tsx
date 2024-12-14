import { useRouter } from 'next/router';
import ItemForm from '../../components/ItemForm';
import api from '../../lib/api';

export default function NewItem() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await api.post('/items', data);
      router.push('/items');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>New Item</h1>
      <ItemForm onSubmit={handleSubmit} />
    </div>
  );
}
