import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MobileCart = () => {
  const { cart, cartTotal, cartCount, setIsCheckoutOpen } = useCart();

  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 md:hidden">
      <button
        onClick={() => setIsCheckoutOpen(true)}
        className="w-full bg-gray-900 text-white p-4 rounded-xl shadow-xl flex items-center justify-between animate-in slide-in-from-bottom-4 fade-in duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
            {cartCount}
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-300 font-medium">Total</p>
            <p className="font-bold text-lg leading-none">{cartTotal.toLocaleString()} FCFA</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-bold text-sm bg-white/10 px-4 py-2 rounded-lg">
          <span>Voir le panier</span>
          <ShoppingBag size={16} />
        </div>
      </button>
    </div>
  );
};

export default MobileCart;
