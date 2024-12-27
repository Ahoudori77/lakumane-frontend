import { useState } from 'react';
import api from '../../lib/api';

const OrdersImport = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleImportCSV = async () => {
    if (!csvFile) {
      alert('CSVファイルを選択してください');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await api.post('/orders/import_csv', formData);
      alert(response.data.message);
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('CSVのインポートに失敗しました');
    }
  };

  return (
    <div>
      <h1>CSVインポート</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleImportCSV}>インポート</button>
    </div>
  );
};

export default OrdersImport;
