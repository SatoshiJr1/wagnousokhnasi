import { Home, Lightbulb, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CheckoutModal from './CheckoutModal';
import MobileCart from './MobileCart';
import ProductDetailModal from './ProductDetailModal';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-wagnou-bg font-sans text-wagnou-text pb-20 md:pb-0">

      {/* Main Content - Full Width to allow pages to control their own layout */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Mobile Cart Floating Bar */}
      <MobileCart />

      {/* Checkout Modal */}
      <CheckoutModal />

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 md:hidden pb-safe">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-wagnou-primary' : 'text-gray-400'}`}
          >
            <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Accueil</span>
          </Link>
          <Link
            to="/astuces"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/astuces') ? 'text-wagnou-primary' : 'text-gray-400'}`}
          >
            <Lightbulb size={24} strokeWidth={isActive('/astuces') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Astuces</span>
          </Link>
          <Link
            to="/login"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/login') ? 'text-wagnou-primary' : 'text-gray-400'}`}
          >
            <User size={24} strokeWidth={isActive('/login') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Compte</span>
          </Link>
        </div>
      </div>

      {/* Footer (Hidden on mobile to avoid clutter with bottom nav) */}
      <footer className="hidden md:block bg-white border-t border-wagnou-secondary/20 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-serif text-xl text-wagnou-primary mb-2">Wagnou Sokhna Si</h3>
          <p className="text-sm text-gray-500 mb-4">Cuisine raffinée, livraison & emporter</p>
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <span>&copy; 2025 Wagnou Sokhna Si</span>
            <span>•</span>
            <span>Dakar, Sénégal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
