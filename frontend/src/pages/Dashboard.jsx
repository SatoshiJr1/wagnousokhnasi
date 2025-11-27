import { Lightbulb, Package, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({ productsCount: 0, astucesCount: 0, ordersCount: 0 });
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', description: '', image: '' });
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, productsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/products')
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // fetchData();
  }, [navigate, fetchData]);

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchData(); // Refresh
      } catch (error) {
        console.error(error);
        alert('Erreur suppression');
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', newProduct);
      setShowAddForm(false);
      setNewProduct({ name: '', category: '', price: '', description: '', image: '' });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Erreur ajout');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-3xl font-bold text-wagnou-text">Tableau de Bord</h1>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Déconnexion
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Produits</p>
            <p className="text-2xl font-bold">{stats.productsCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-500 rounded-lg">
            <Lightbulb size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Astuces</p>
            <p className="text-2xl font-bold">{stats.astucesCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-500 rounded-lg">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Commandes</p>
            <p className="text-2xl font-bold">{stats.ordersCount}</p>
          </div>
        </div>
      </div>

      {/* Products Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-serif text-xl font-bold">Gestion des Produits</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-wagnou-primary text-white px-4 py-2 rounded-lg hover:bg-wagnou-secondary transition-colors text-sm"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>

        {showAddForm && (
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Nom du produit"
                className="p-2 rounded border"
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
              <input
                placeholder="Catégorie"
                className="p-2 rounded border"
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                required
              />
              <input
                placeholder="Prix"
                type="number"
                className="p-2 rounded border"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                required
              />
              <input
                placeholder="URL Image"
                className="p-2 rounded border"
                value={newProduct.image}
                onChange={e => setNewProduct({...newProduct, image: e.target.value})}
              />
              <textarea
                placeholder="Description"
                className="p-2 rounded border md:col-span-2"
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              />
              <button type="submit" className="bg-green-500 text-white p-2 rounded md:col-span-2">Enregistrer</button>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">Nom</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Prix</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-gray-500">{product.category}</td>
                  <td className="p-4">{product.price} FCFA</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
