import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api';
import AstuceCard from '../components/AstuceCard';

const Astuces = () => {
  const [astuces, setAstuces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAstuces = async () => {
      try {
        const response = await api.get('/astuces');
        setAstuces(response.data);
      } catch (error) {
        console.error('Error fetching astuces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAstuces();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-wagnou-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-bold text-wagnou-primary mb-4">Astuces & Conseils</h1>
        <p className="text-gray-600">Les petits secrets pour sublimer votre cuisine au quotidien.</p>
      </div>

      <div className="space-y-6">
        {astuces.map(astuce => (
          <AstuceCard key={astuce.id} astuce={astuce} />
        ))}
      </div>
    </div>
  );
};

export default Astuces;
