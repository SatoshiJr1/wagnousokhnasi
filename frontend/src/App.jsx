import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { CartProvider } from './context/CartContext';
import Astuces from './pages/Astuces';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/astuces" element={<Astuces />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
