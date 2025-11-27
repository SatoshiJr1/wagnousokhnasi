import { Bike, Minus, Plus, ShoppingBag, Store, Ticket, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, setIsCheckoutOpen } = useCart();
  const [deliveryMode, setDeliveryMode] = useState('delivery'); // 'delivery' or 'pickup'

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24 flex flex-col max-h-[calc(100vh-8rem)]">
      {/* Header Toggle */}
      <div className="p-2 bg-gray-50 border-b border-gray-100 shrink-0">
        <div className="flex bg-gray-200/50 p-1 rounded-xl">
          <button
            onClick={() => setDeliveryMode('delivery')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              deliveryMode === 'delivery'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bike size={16} />
            Livraison
          </button>
          <button
            onClick={() => setDeliveryMode('pickup')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              deliveryMode === 'pickup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Store size={16} />
            À emporter
          </button>
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-grow overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Votre panier est vide</h3>
            <p className="text-sm text-gray-500 max-w-[200px]">
              Ajoutez des plats délicieux pour commencer votre commande.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 items-start">
                {/* Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{item.price.toLocaleString()} FCFA</p>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-white rounded-md transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-white rounded-md transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-3 shrink-0">
        {/* Coupon Code */}
        <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-dashed border-green-300 text-green-700 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors cursor-pointer">
          <span className="flex items-center gap-2">
            <Ticket size={18} />
            Code Promo
          </span>
          <span className="text-xs bg-green-100 px-2 py-1 rounded">Ajouter</span>
        </button>

        {/* Total & Checkout */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Sous-total</span>
            <span>{cartTotal.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{cartTotal.toLocaleString()} FCFA</span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            disabled={cart.length === 0}
            className={`w-full py-3.5 font-bold rounded-xl transition-all ${
              cart.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-wagnou-primary shadow-lg cursor-pointer'
            }`}
          >
            Commander ({cartTotal.toLocaleString()} FCFA)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
