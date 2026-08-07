import React, { useRef } from 'react';
import { Category } from '../types';
import { motion } from 'motion/react';
import { Sparkles, Shirt, Footprints, Flame, Sparkle, Tag, ChevronLeft, ChevronRight, FlameKindling } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'promocao':
        return <FlameKindling className="w-4 h-4 text-red-500" />;
      case 'camisetas':
        return <Shirt className="w-4 h-4" />;
      case 'tenis':
        return <Footprints className="w-4 h-4" />;
      case 'conjuntos':
        return <Flame className="w-4 h-4" />;
      case 'perfumes':
        return <Sparkle className="w-4 h-4" />;
      case 'acessorios':
        return <Tag className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative w-full flex items-center group/filter">
      {/* Scroll Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 z-20 p-2.5 bg-zinc-900/90 hover:bg-yellow-400 text-white hover:text-black border border-zinc-700/80 rounded-full backdrop-blur-md transition-all shadow-lg hidden sm:flex items-center justify-center -translate-x-3"
        title="Ver filtros anteriores"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar py-4 px-2 scroll-smooth"
      >
        <div className="flex items-center gap-3 min-w-max justify-start md:justify-center">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all flex items-center gap-2.5 border ${
                  isActive
                    ? 'text-black border-yellow-400 font-black shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                    : 'text-zinc-400 border-zinc-800 bg-zinc-900/80 hover:text-white hover:border-zinc-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-yellow-400 rounded-2xl z-0"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-black font-black' : ''}`}>
                  {getCategoryIcon(cat.id)}
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scroll Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 z-20 p-2.5 bg-zinc-900/90 hover:bg-yellow-400 text-white hover:text-black border border-zinc-700/80 rounded-full backdrop-blur-md transition-all shadow-lg hidden sm:flex items-center justify-center translate-x-3"
        title="Ver mais filtros"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
