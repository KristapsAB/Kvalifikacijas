import React from 'react';
import { Camera, Sparkles, Clock, Leaf, Mountains, Paint, Cloud, Star, Moon, Sun } from 'lucide-react';

const CapsuleDesignSelector = ({ value, onChange }) => {
  const designs = [
    {
      id: 'default',
      name: 'Classic Elegance',
      description: 'Timeless sophistication with golden accents',
      icon: <Star className="text-amber-400" size={20} />,
      previewClass: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300'
    },
    {
      id: 'retro',
      name: 'Vintage Memories',
      description: 'Nostalgic sepia tones with polaroid accents',
      icon: <Camera className="text-orange-600" size={20} />,
      previewClass: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300'
    },
    {
      id: 'futuristic',
      name: 'Neo Digital',
      description: 'Sleek neon highlights with cyber aesthetics',
      icon: <Sparkles className="text-cyan-400" size={20} />,
      previewClass: 'bg-gradient-to-br from-cyan-900 to-blue-900 border-cyan-400'
    },
   
    {
      id: 'celestial',
      name: 'Cosmic Journey',
      description: 'Starlit design with celestial motifs',
      icon: <Star className="text-purple-400" size={20} />,
      previewClass: 'bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-400'
    },
    {
      id: 'dreamy',
      name: 'Cloud Dreams',
      description: 'Soft pastels with dreamy elements',
      icon: <Cloud className="text-pink-400" size={20} />,
      previewClass: 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-300'
    },
    {
      id: 'seasonal',
      name: 'Four Seasons',
      description: 'Dynamic design that changes with seasons',
      icon: <Sun className="text-yellow-500" size={20} />,
      previewClass: 'bg-gradient-to-br from-yellow-50 to-green-50 border-yellow-300'
    }
  ];

  return (
    <div className="w-full h-full overflow-y-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
        {designs.map((design) => (
          <div
            key={design.id}
            onClick={() => onChange({ target: { name: 'design', value: design.id } })}
            className={`
              relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-300
              ${design.previewClass}
              ${value === design.id ? 'ring-2 ring-offset-2 ring-[#A3688F]' : 'hover:scale-[1.02]'}
              transform hover:-translate-y-1 hover:shadow-lg
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-white/90 shadow-sm">
                {design.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold truncate ${design.id === 'futuristic' || design.id === 'celestial' ? 'text-white' : 'text-gray-800'}`}>
                  {design.name}
                </h4>
                <p className={`text-xs leading-relaxed line-clamp-2 ${design.id === 'futuristic' || design.id === 'celestial' ? 'text-gray-200' : 'text-gray-600'}`}>
                  {design.description}
                </p>
              </div>
              {value === design.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 rounded-full bg-[#A3688F] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
              )}
            </div>
            <div className={`h-16 mt-3 rounded-lg overflow-hidden ${design.id === 'futuristic' || design.id === 'celestial' ? 'bg-black/20' : 'bg-white/50'}`}>
              <div className="w-full h-full flex items-center justify-center opacity-50">
                <div className="w-3/4 h-1 rounded-full bg-current" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapsuleDesignSelector;