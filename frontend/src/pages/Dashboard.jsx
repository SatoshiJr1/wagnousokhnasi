import { Lightbulb, Package, Plus, ShoppingBag, Trash2, Edit, Users, Menu, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import SEO from '../components/SEO';

const Dashboard = () => {
  const [stats, setStats] = useState({ productsCount: 0, astucesCount: 0, usersCount: 0, ordersCount: 0 });
  const [activeTab, setActiveTab] = useState('products'); // products, astuces, users
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const statsRes = await api.get('/dashboard/stats');
      setStats(statsRes.data);
      
      let itemsRes;
      if (activeTab === 'products') itemsRes = await api.get('/products');
      else if (activeTab === 'astuces') itemsRes = await api.get('/astuces');
      else if (activeTab === 'users') itemsRes = await api.get('/users');
      
      setItems(itemsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  }, [activeTab]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate, fetchData]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await api.delete(`/${activeTab}/${id}`);
        fetchData();
      } catch (error) {
        console.error(error);
        alert('Erreur suppression');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/${activeTab}/${editingItem.id}`, formData);
      } else {
        await api.post(`/${activeTab}`, formData);
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Erreur enregistrement');
    }
  };

  const renderForm = () => {
    if (activeTab === 'products') {
      return (
        <>
          <input
            placeholder="Nom du produit"
            className="p-2 rounded border w-full"
            value={formData.name || ''}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            placeholder="Catégorie"
            className="p-2 rounded border w-full"
            value={formData.category || ''}
            onChange={e => setFormData({...formData, category: e.target.value})}
            required
          />
          <input
            placeholder="Prix"
            type="number"
            className="p-2 rounded border w-full"
            value={formData.price || ''}
            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
            required
          />
          <input
            placeholder="URL Image"
            className="p-2 rounded border w-full"
            value={formData.image || ''}
            onChange={e => setFormData({...formData, image: e.target.value})}
          />
          <textarea
            placeholder="Description"
            className="p-2 rounded border w-full md:col-span-2"
            value={formData.description || ''}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </>
      );
    } else if (activeTab === 'astuces') {
      return (
        <>
          <input
            placeholder="Titre"
            className="p-2 rounded border w-full md:col-span-2"
            value={formData.title || ''}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
          <input
            placeholder="URL Image"
            className="p-2 rounded border w-full md:col-span-2"
            value={formData.image || ''}
            onChange={e => setFormData({...formData, image: e.target.value})}
          />
          <textarea
            placeholder="Contenu"
            className="p-2 rounded border w-full md:col-span-2 h-32"
            value={formData.content || ''}
            onChange={e => setFormData({...formData, content: e.target.value})}
            required
          />
        </>
      );
    } else if (activeTab === 'users') {
      return (
        <>
          <input
            placeholder="Email"
            type="email"
            className="p-2 rounded border w-full md:col-span-2"
            value={formData.email || ''}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
            disabled={!!editingItem} // Prevent email change for simplicity
          />
          <input
            placeholder={editingItem ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
            type="password"
            className="p-2 rounded border w-full md:col-span-2"
            value={formData.password || ''}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required={!editingItem}
          />
        </>
      );
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <SEO title="Tableau de Bord - Wagnou Sokhna Si" noindex={true} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="font-serif text-3xl font-bold text-wagnou-text">Tableau de Bord</h1>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-4 py-2 rounded-lg"
        >
          Déconnexion
        </button>
      </div>

      {/* Stats Cards - Mobile First Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
            <Package size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Produits</p>
            <p className="text-xl font-bold">{stats.productsCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
          <div className="p-2 bg-yellow-50 text-yellow-500 rounded-lg">
            <Lightbulb size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Astuces</p>
            <p className="text-xl font-bold">{stats.astucesCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
          <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Utilisateurs</p>
            <p className="text-xl font-bold">{stats.usersCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
          <div className="p-2 bg-green-50 text-green-500 rounded-lg">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Commandes</p>
            <p className="text-xl font-bold">{stats.ordersCount}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('products'); setShowForm(false); }}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'products' ? 'text-wagnou-primary border-b-2 border-wagnou-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Produits
          </button>
          <button
            onClick={() => { setActiveTab('astuces'); setShowForm(false); }}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'astuces' ? 'text-wagnou-primary border-b-2 border-wagnou-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Astuces
          </button>
          <button
            onClick={() => { setActiveTab('users'); setShowForm(false); }}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === 'users' ? 'text-wagnou-primary border-b-2 border-wagnou-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Utilisateurs
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-serif text-lg font-bold capitalize">{activeTab}</h2>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({});
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-wagnou-primary text-white px-4 py-2 rounded-lg hover:bg-wagnou-secondary transition-colors text-sm shadow-sm"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            <span className="hidden md:inline">{showForm ? 'Fermer' : 'Ajouter'}</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="p-6 bg-gray-50 border-b border-gray-100 animate-in slide-in-from-top-2">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderForm()}
              <div className="md:col-span-2 flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  {editingItem ? 'Mettre à jour' : 'Enregistrer'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Nom / Titre / Email</th>
                {activeTab === 'products' && <th className="p-4 hidden md:table-cell">Catégorie</th>}
                {activeTab === 'products' && <th className="p-4">Prix</th>}
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400">#{item.id}</td>
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt="" className="w-8 h-8 rounded object-cover bg-gray-100" />
                      )}
                      <span>{item.name || item.title || item.email}</span>
                    </div>
                  </td>
                  {activeTab === 'products' && (
                    <td className="p-4 text-gray-500 hidden md:table-cell">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.category}</span>
                    </td>
                  )}
                  {activeTab === 'products' && <td className="p-4 font-semibold">{item.price} FCFA</td>}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition-colors"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    Aucun élément trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
