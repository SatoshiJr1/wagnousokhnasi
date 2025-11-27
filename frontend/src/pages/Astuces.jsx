import { useEffect, useState } from 'react';
import api from '../api';
import AstuceCard from '../components/AstuceCard';
import AstuceSkeleton from '../components/AstuceSkeleton';

const SAMPLE_ASTUCES = [
  {
    id: 1,
    title: "Le secret d'un Riz Blanc (Niakk) parfait",
    content: "Pour un riz blanc qui ne colle pas, lavez-le abondamment jusqu'à ce que l'eau soit claire. Utilisez un ratio de 1 volume de riz pour 1.5 volume d'eau. Une fois l'eau absorbée, couvrez hermétiquement avec du papier alu ou un sachet propre et baissez le feu au minimum pour la cuisson vapeur finale.",
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Réussir son Nokoss (Marinade)",
    content: "Le secret de la cuisine sénégalaise réside dans le Nokoss. Mixez ensemble : ail, oignon vert, piment, poivre en grains, et un peu de poivron vert. Ne mixez pas trop finement pour garder de la texture. Ajoutez-le en fin de cuisson pour exploser les saveurs.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Désabler les coques et fruits de mer",
    content: "Pour bien nettoyer vos fruits de mer (pagne, touffa), laissez-les tremper dans de l'eau de mer ou de l'eau très salée pendant au moins 2 heures. Ils s'ouvriront naturellement pour rejeter le sable. Rincez ensuite à l'eau claire.",
    image: "https://images.unsplash.com/photo-1625937759420-26d7e003e04c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Conserver la fraîcheur du Bissap",
    content: "Après avoir préparé votre jus de Bissap, ajoutez quelques feuilles de menthe fraîche (nana) au moment de la mise en bouteille. Non seulement cela parfume, mais la menthe aide aussi à la conservation naturelle au frais.",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Attendrir la viande rapidement",
    content: "Si votre viande est un peu dure, faites-la mariner avec de la papaye verte écrasée ou du jus d'ananas pendant 30 minutes avant la cuisson. Les enzymes naturelles vont attendrir les fibres sans altérer le goût.",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800"
  }
];

const Astuces = () => {
  const [astuces, setAstuces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAstuces = async () => {
      try {
        const response = await api.get('/astuces');
        if (response.data && response.data.length > 0) {
          setAstuces(response.data);
        } else {
          setAstuces(SAMPLE_ASTUCES);
        }
      } catch (error) {
        console.error('Error fetching astuces, using sample data:', error);
        setAstuces(SAMPLE_ASTUCES);
      } finally {
        setLoading(false);
      }
    };

    fetchAstuces();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-bold text-wagnou-primary mb-4">Astuces & Conseils</h1>
        <p className="text-gray-600">Les petits secrets pour sublimer votre cuisine au quotidien.</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <AstuceSkeleton key={index} />
          ))
        ) : (
          astuces.map(astuce => (
            <AstuceCard key={astuce.id} astuce={astuce} />
          ))
        )}
      </div>
    </div>
  );
};

export default Astuces;
