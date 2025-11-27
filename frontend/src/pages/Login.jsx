import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="font-serif text-2xl font-bold text-center text-wagnou-primary mb-6">Connexion Admin</h2>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-wagnou-primary focus:border-transparent outline-none transition-all"
            placeholder="admin@wagnou.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-wagnou-primary focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-wagnou-primary text-white py-2 rounded-lg hover:bg-wagnou-secondary transition-colors font-medium"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
