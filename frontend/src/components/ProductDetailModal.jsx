import { Plus, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetailModal = () => {
  const { viewedProduct, setViewedProduct, addToCart } = useCart();

  if (!viewedProduct) return null;

  const handleAddToCart = () => {
    addToCart(viewedProduct);
    setViewedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setViewedProduct(null)}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row">

        {/* Close Button */}
        <button
          onClick={() => setViewedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <img
            src={viewedProduct.image}
            alt={viewedProduct.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="mb-auto">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              {viewedProduct.category}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {viewedProduct.name}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {viewedProduct.description}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-500 font-medium">Prix</span>
              <span className="text-2xl font-bold text-gray-900">
                {viewedProduct.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span>
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-wagnou-primary transition-colors shadow-lg active:scale-95"
            >
              <Plus size={20} />
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
