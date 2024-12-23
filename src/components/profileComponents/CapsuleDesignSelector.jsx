import React from 'react';
import { Clock, Archive, Book, Key } from 'lucide-react';

const CapsuleDesignSelector = ({ value, onChange }) => {
  const designs = [
    {
      id: 'heritage',
      name: 'Heritage Vault',
      description: 'A classic wooden chest design with brass fittings, perfect for preserving family histories and traditions',
      icon: <Archive className="text-amber-400" size={20} />,
      previewClass: 'bg-gradient-to-br from-amber-900 via-brown-800 to-amber-900 border-amber-400'
    },
    {
      id: 'chronicle',
      name: 'Digital Chronicle',
      description: 'Modern archive interface with timeline markers, ideal for documenting life\'s key moments',
      icon: <Clock className="text-emerald-400" size={20} />,
      previewClass: 'bg-gradient-to-br from-emerald-900 to-teal-900 border-emerald-400'
    },
    {
      id: 'legacy',
      name: 'Legacy Journal',
      description: 'Leather-bound journal aesthetic for personal stories and reflections meant to last generations',
      icon: <Book className="text-red-400" size={20} />,
      previewClass: 'bg-gradient-to-br from-red-900 via-rose-900 to-red-900 border-red-400'
    },
    {
      id: 'vault',
      name: 'Quantum Vault',
      description: 'Secure digital vault design for preserving precious memories in encrypted time-locked storage',
      icon: <Key className="text-violet-400" size={20} />,
      previewClass: 'bg-gradient-to-br from-violet-900 via-indigo-900 to-violet-900 border-violet-400'
    }
  ];

  return (
    <div className="w-full h-full overflow-y-auto px-4 bg-black/90">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
        {designs.map((design) => (
          <div
            key={design.id}
            onClick={() => onChange({ target: { name: 'design', value: design.id } })}
            className={`
              relative cursor-pointer rounded-xl p-5 border-2 transition-all duration-500
              ${design.previewClass}
              ${value === design.id 
                ? 'ring-2 ring-offset-4 ring-offset-black ring-[#A3688F] scale-105' 
                : 'hover:scale-105'}
              transform hover:-translate-y-1
              backdrop-blur-lg
            `}
          >
            <div className="relative z-10">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-black/30 backdrop-blur-sm shadow-xl border border-white/10">
                  {design.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold truncate text-white">
                    {design.name}
                  </h4>
                  <p className="text-sm leading-relaxed line-clamp-2 text-gray-300 mt-1">
                    {design.description}
                  </p>
                </div>
                {value === design.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 rounded-full bg-[#A3688F] flex items-center justify-center shadow-lg">
                      <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
              <div className="h-24 mt-4 rounded-lg overflow-hidden bg-black/20 backdrop-blur-md border border-white/10">
                <div className="w-full h-full flex items-center justify-center relative">
                  {design.id === 'heritage' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-pulse" />
                  )}
                  {design.id === 'chronicle' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 animate-pulse" />
                  )}
                  {design.id === 'legacy' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20 animate-pulse" />
                  )}
                  {design.id === 'vault' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-violet-500/20 animate-pulse" />
                  )}
                  <div className="w-3/4 h-1 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapsuleDesignSelector;