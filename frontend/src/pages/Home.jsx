import { BookOpen, Search, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api';
import CartSidebar from '../components/CartSidebar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { useCart } from '../context/CartContext';

// Fallback data in case API fails
const SAMPLE_PRODUCTS = [
  {
    "id": 1,
    "name": "Plateau Amuse-bouches Royal",
    "category": "Amuse-bouches",
    "description": "Assortiment de fatayas, nems et acras maison.",
    "price": 15000,
    "image": "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 2,
    "name": "Seafood Bowl Signature",
    "category": "Seafood bowls",
    "description": "Riz parfumé, crevettes grillées, calamars, légumes croquants.",
    "price": 8500,
    "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 3,
    "name": "Bol de Saison Végétarien",
    "category": "Bols de saison",
    "description": "Quinoa, avocat, patate douce rôtie, sauce tahini.",
    "price": 6000,
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 4,
    "name": "Crevettes Pasta à l'Ail",
    "category": "Crevettes pasta",
    "description": "Linguine fraîches, crevettes sautées à l'ail et persil.",
    "price": 9000,
    "image": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 5,
    "name": "Miel de Casamance Bio",
    "category": "Épicerie bio",
    "description": "Miel pur récolté traditionnellement.",
    "price": 4500,
    "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 6,
    "name": "Jus Bissap Rouge Menthe",
    "category": "Jus naturels “Tonus +”",
    "description": "Rafraîchissant et riche en vitamine C.",
    "price": 1500,
    "image": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 7,
    "name": "Jus Bouye Onctueux",
    "category": "Jus naturels “Tonus +”",
    "description": "Nectar de fruit de baobab, énergie pure.",
    "price": 1800,
    "image": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 8,
    "name": "Mélange Fruits Secs Énergie",
    "category": "Fruits secs",
    "description": "Amandes, noix de cajou, raisins secs.",
    "price": 3000,
    "image": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 9,
    "name": "Nougat Sésame Maison",
    "category": "Nougat / Coco lait",
    "description": "Croustillant et fondant, au miel local.",
    "price": 2000,
    "image": "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 10,
    "name": "E-book Recettes Sénégalaises",
    "category": "Recettes",
    "description": "Les secrets de la cuisine de Wagnou Sokhna Si.",
    "price": 5000,
    "image": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 11,
    "name": "Huile de Touloucouna",
    "category": "Huiles bio",
    "description": "Huile thérapeutique traditionnelle.",
    "price": 7000,
    "image": "https://images.unsplash.com/photo-1474979266404-7cadd259c308?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": 12,
    "name": "Consulting Menu Semaine",
    "category": "Consulting culinaire",
    "description": "Planification de repas équilibrés pour la famille.",
    "price": 20000,
    "image": "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=800"
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        if (response.data && response.data.length > 0) {
            setProducts(response.data);
        } else {
            setProducts(SAMPLE_PRODUCTS);
        }
      } catch (error) {
        console.error('Error fetching products, using sample data:', error);
        setProducts(SAMPLE_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['Tout', ...new Set(products.filter(p => !['Recettes', 'Consulting culinaire'].includes(p.category)).map(p => p.category))];

  // Filter for the main food menu (excludes services)
  const filteredProducts = products.filter(p => {
    const isService = ['Recettes', 'Consulting culinaire'].includes(p.category);
    if (isService) return false;

    const matchesCategory = selectedCategory === 'Tout' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter for the Services section
  const serviceProducts = products.filter(p => ['Recettes', 'Consulting culinaire'].includes(p.category));

  const { addToCart } = useCart();

  const scrollToServices = () => {
    const element = document.getElementById('services-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <Hero />

      <div className="container mx-auto px-4 max-w-7xl">

        {/* Sticky Filter Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3 -mx-4 px-4 md:mx-0 md:px-6 md:rounded-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex overflow-x-auto gap-2 w-full md:w-auto scrollbar-hide pb-1 md:pb-0 items-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Separator */}
            <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>

            {/* Services Link Button */}
            <button
              onClick={scrollToServices}
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold text-wagnou-primary border border-wagnou-primary/30 hover:bg-wagnou-primary hover:text-white transition-all flex items-center gap-2"
            >
              <BookOpen size={16} />
              Services & E-books
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64 flex-shrink-0">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-gray-900/20 transition-all">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Main Content - Product Grid */}
          <div className="lg:col-span-3">
            {/* Section Title */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                {selectedCategory === 'Tout' ? 'Notre Carte' : selectedCategory}
              </h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                {filteredProducts.length}
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              ) : (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                  <ShoppingBag className="text-gray-400" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres de recherche.</p>
              </div>
            )}

            {/* Services & Consulting Section */}
            {!loading && serviceProducts.length > 0 && (
              <div id="services-section" className="mt-16 pt-10 border-t border-gray-200 scroll-mt-28">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-1 bg-wagnou-primary rounded-full"></div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
                    Nos Services & E-books
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {serviceProducts.map(service => (
                    <div key={service.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <div className="w-full md:w-1/3 h-40 rounded-xl overflow-hidden shrink-0">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
                          {service.category}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{service.description}</p>
                        <div className="flex items-center justify-center md:justify-between">
                          <span className="font-bold text-lg text-gray-900">{service.price.toLocaleString()} FCFA</span>
                          <button
                            onClick={() => addToCart(service)}
                            className="ml-4 px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-wagnou-primary transition-colors cursor-pointer"
                          >
                            Commander
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Cart (Hidden on mobile, visible on Desktop) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <CartSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
