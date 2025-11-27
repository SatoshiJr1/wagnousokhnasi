import { Lightbulb } from 'lucide-react';

const AstuceCard = ({ astuce }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-wagnou-secondary/10 hover:border-wagnou-secondary/30 transition-colors flex gap-4 items-start">
      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
        {astuce.image ? (
          <img src={astuce.image} alt={astuce.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-wagnou-secondary">
            <Lightbulb size={24} />
          </div>
        )}
      </div>
      <div>
        <h3 className="font-serif text-lg font-bold text-wagnou-primary mb-2">
          {astuce.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {astuce.content}
        </p>
      </div>
    </div>
  );
};

export default AstuceCard;
