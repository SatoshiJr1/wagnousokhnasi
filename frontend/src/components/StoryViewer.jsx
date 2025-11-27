import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import logo from '../assets/wagnousokhnasilogo.jpeg';

const StoryViewer = ({ stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const STORY_DURATION = 5000; // 5 seconds per story

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Timer for progress
  useEffect(() => {
    setProgress(0);
    const intervalTime = 50;
    const step = 100 / (STORY_DURATION / intervalTime);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
            return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Trigger next when progress completes
  useEffect(() => {
      if (progress >= 100) {
          handleNext();
      }
  }, [progress, handleNext]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-300">

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-30 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={32} />
      </button>

      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 z-30 flex gap-1.5 max-w-md mx-auto w-full">
        {stories.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{
                width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Click Areas (Invisible) */}
      <div className="absolute inset-0 z-20 flex">
        <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
        <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
      </div>

      {/* Story Content */}
      <div className="w-full h-full md:max-w-md md:h-[85vh] md:rounded-2xl overflow-hidden relative bg-gray-900 shadow-2xl">
        {/* Image */}
        <img
          src={stories[currentIndex].image}
          alt="Story"
          className="w-full h-full object-cover animate-in zoom-in-105 duration-[5000ms] ease-linear"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>

        {/* Header Info */}
        <div className="absolute top-8 left-4 flex items-center gap-3 z-10">
            <div className="w-8 h-8 rounded-full border border-white/50 overflow-hidden">
                <img src={stories[currentIndex].userImage || logo} className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-bold text-sm shadow-black drop-shadow-md">Wagnou Sokhna Si</span>
            <span className="text-white/70 text-xs font-medium">• {stories[currentIndex].time || '2h'}</span>
        </div>

        {/* Caption */}
        {stories[currentIndex].caption && (
            <div className="absolute bottom-20 left-0 right-0 p-6 text-center z-10">
                <p className="text-white font-bold text-xl drop-shadow-lg leading-relaxed">
                    {stories[currentIndex].caption}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
