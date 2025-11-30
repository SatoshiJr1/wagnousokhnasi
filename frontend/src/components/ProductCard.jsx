import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, setViewedProduct } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div
        className="relative h-48 overflow-hidden cursor-pointer"
        onClick={() => setViewedProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-lg font-bold text-gray-900 leading-tight group-hover:text-wagnou-primary transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-light">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">FCFA</span>
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md cursor-pointer ${
              isAdded
                ? 'bg-green-600 text-white scale-105'
                : 'bg-black text-white hover:bg-wagnou-primary hover:scale-105'
            }`}
          >
            {isAdded ? <Check size={16} /> : <Plus size={16} />}
            {isAdded ? 'Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
