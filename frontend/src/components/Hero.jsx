import { ChevronDown, Clock, Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/wagnousokhnasilogo.jpeg';
import { STORIES } from '../data/stories';
import StoryViewer from './StoryViewer';

const Hero = () => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [showHint, setShowHint] = useState(() => {
    // Check if user has already seen the story
    return !localStorage.getItem('wagnou_story_seen');
  });

  const handleStoryClick = () => {
    setIsStoryOpen(true);
    setShowHint(false);
    localStorage.setItem('wagnou_story_seen', 'true');
  };

  const scrollToProducts = () => {
    // Scroll by window height roughly, or to a specific element if we had the ref.
    // Since we don't have the ref here easily without prop drilling, we'll scroll a bit down.
    // Better yet, let's target the filter bar which is usually around 500px down or just use window.innerHeight * 0.8
    window.scrollTo({
      top: 600,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative mb-8">
      {/* Story Viewer Overlay */}
      {isStoryOpen && (
        <StoryViewer
          stories={STORIES}
          onClose={() => setIsStoryOpen(false)}
        />
      )}

      {/* Banner Image */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-b-[3rem] shadow-lg">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600"
          alt="Wagnou Sokhna Si Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Logo & Info Container - Centered and Overlapping */}
      <div className="relative z-20 -mt-20 flex flex-col items-center text-center px-4">

        {/* Circular Logo with Story Hint */}
        <div className="relative mb-6">
            {/* Hint Tooltip - Above the logo */}
            {showHint && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 animate-bounce pointer-events-none">
                    <div className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-gray-100 whitespace-nowrap relative">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span>Nouvelle Story</span>
                        </div>
                        {/* Downward arrow */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 transform"></div>
                    </div>
                </div>
            )}

            <button
              onClick={handleStoryClick}
              className="relative rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 shadow-2xl cursor-pointer transform hover:scale-105 transition-transform duration-300"
            >
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden">
                    <img src={logo} alt="Wagnou Sokhna Si Logo" className="w-full h-full object-cover scale-130" />
                </div>

                {/* Green Blinking Indicator */}
                <div className="absolute top-[15%] right-[15%] z-20">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white shadow-sm"></span>
                  </span>
                </div>
            </button>
        </div>        {/* Restaurant Info */}
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center gap-2 mb-3">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Wagnou Sokhna Si
            </h1>

            {/* Status & Cuisine */}
            <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                Ouvert
                </span>
                <span className="text-xs text-gray-500 font-medium">• Cuisine Sénégalaise & Fusion</span>
            </div>

            {/* Info Cards - Compact & Elegant */}
            <div className="flex flex-nowrap justify-center items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-500 font-medium w-full overflow-x-auto scrollbar-hide px-2">
                <div className="flex items-center gap-1 whitespace-nowrap px-1 py-1 rounded-md hover:bg-gray-50 transition-colors cursor-default shrink-0">
                  <MapPin size={12} className="text-wagnou-primary md:w-3.5 md:h-3.5" />
                  <span>Dakar, Sénégal</span>
                </div>
                <div className="w-px h-3 bg-gray-300 shrink-0"></div>
                <div className="flex items-center gap-1 whitespace-nowrap px-1 py-1 rounded-md hover:bg-gray-50 transition-colors cursor-default shrink-0">
                  <Clock size={12} className="text-wagnou-primary md:w-3.5 md:h-3.5" />
                  <span>11:30 - 23:30</span>
                </div>
                <div className="w-px h-3 bg-gray-300 shrink-0"></div>
                <div className="flex items-center gap-1 whitespace-nowrap px-1 py-1 rounded-md hover:bg-gray-50 transition-colors cursor-default shrink-0">
                  <Phone size={12} className="text-wagnou-primary md:w-3.5 md:h-3.5" />
                  <span>+221 77 000 00 00</span>
                </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://www.tiktok.com/@wagnousokhnasi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-black transition-colors transform hover:scale-110"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" height="20" width="20">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/wagnousokhnasi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/wagnousokhnasi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition-colors transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://wa.me/221770000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-colors transform hover:scale-110"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" height="20" width="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          <p className="text-gray-600 text-sm md:text-base mb-8 font-light leading-relaxed max-w-xl mx-auto italic">
            "Des bols, des saveurs, une énergie : vivez mieux, mangez vrai."
          </p>

          {/* Scroll Down Arrow */}
          <button
            onClick={scrollToProducts}
            className="animate-bounce p-2 text-gray-300 hover:text-wagnou-primary transition-colors cursor-pointer"
            aria-label="Voir les produits"
          >
            <ChevronDown size={28} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
