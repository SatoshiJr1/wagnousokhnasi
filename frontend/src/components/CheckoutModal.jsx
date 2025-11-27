import { Bike, MapPin, Minus, Phone, Plus, Store, Trash2, User, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const [deliveryMode, setDeliveryMode] = useState('delivery');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct WhatsApp message
    let message = `*Nouvelle Commande Wagnou Sokhna Si*\n\n`;
    message += `👤 *Client:* ${formData.name}\n`;
    message += `📞 *Tel:* ${formData.phone}\n`;
    message += `🚚 *Mode:* ${deliveryMode === 'delivery' ? 'Livraison' : 'À emporter'}\n`;

    if (deliveryMode === 'delivery') {
      message += `📍 *Adresse:* ${formData.address}\n`;
    }

    message += `\n🛒 *Détails de la commande:*\n`;
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${(item.price * item.quantity).toLocaleString()} FCFA)\n`;
    });

    message += `\n💰 *Total:* ${cartTotal.toLocaleString()} FCFA`;

    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/221788277985?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    // Clear cart and close modal
    clearCart();
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCheckoutOpen(false)}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full md:w-[500px] md:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <h2 className="font-serif text-xl font-bold text-gray-900">Finaliser la commande</h2>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Delivery Mode Toggle */}
          <div className="bg-gray-50 p-1.5 rounded-xl flex">
            <button
              type="button"
              onClick={() => setDeliveryMode('delivery')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                deliveryMode === 'delivery'
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bike size={18} />
              Livraison
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMode('pickup')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                deliveryMode === 'pickup'
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Store size={18} />
              À emporter
            </button>
          </div>

          {/* Order Summary (Compact) */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Résumé de la commande</h3>
            <div className="space-y-3 mb-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex flex-col bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-gray-900 leading-tight">{item.name}</span>
                    <span className="font-bold text-sm text-gray-900 whitespace-nowrap ml-2">
                      {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-white rounded-md shadow-sm transition-all text-gray-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-white rounded-md shadow-sm transition-all text-gray-900"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
              <span>Total à payer</span>
              <span>{cartTotal.toLocaleString()} FCFA</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="tel"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  placeholder="77 000 00 00"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {deliveryMode === 'delivery' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all min-h-[80px]"
                    placeholder="Quartier, rue, indications..."
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-wagnou-primary transition-colors shadow-lg"
          >
            Confirmer la commande
          </button>

        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
