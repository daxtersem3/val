import React from 'react';
import { Home, Grid, ShoppingCart, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCatalogPage?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onOpenCart,
  activeTab,
  setActiveTab,
  onOpenCatalogPage
}) => {
  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'inicio') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'catalogo') {
      if (onOpenCatalogPage) {
        onOpenCatalogPage();
      } else {
        window.location.hash = '#catalogo';
      }
    } else if (tab === 'destaques') {
      window.location.hash = '';
      document.getElementById('destaques-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'contato') {
      window.location.hash = '';
      document.getElementById('contato-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mobile-nav-container">
      <div className="mobile-nav-wrapper">
        {/* Background Angled Polygon Layer */}
        <div className="mobile-nav-bg" />

        {/* Content Container Above Background — 5-column grid for perfect centering */}
        <div className="relative z-10 w-full px-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', alignItems: 'end' }}>
          
          {/* Início */}
          <button
            onClick={() => handleNavClick('inicio')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'inicio' ? 'text-yellow-400 font-bold scale-105' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Início</span>
          </button>

          {/* Catálogo */}
          <button
            onClick={() => handleNavClick('catalogo')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'catalogo' ? 'text-yellow-400 font-bold scale-105' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Catálogo</span>
          </button>

          {/* Central Floating Unclipped Yellow Cart Button */}
          <div className="flex justify-center" style={{ position: 'relative' }}>
            <div className="absolute z-30" style={{ bottom: '10px' }}>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={onOpenCart}
                className="relative group focus:outline-none"
                title="Abrir Carrinho"
              >
                {/* Outer Brush Ring Effect */}
                <div className="brush-ring w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.6)] border-2 border-yellow-300">
                  <ShoppingCart className="w-7 h-7 text-black stroke-[2.5]" />
                </div>

                {/* Cart Item Badge Counter */}
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-black text-yellow-400 border-2 border-yellow-400 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Destaques */}
          <button
            onClick={() => handleNavClick('destaques')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'destaques' ? 'text-yellow-400 font-bold scale-105' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Destaques</span>
          </button>

          {/* Contato */}
          <button
            onClick={() => handleNavClick('contato')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'contato' ? 'text-yellow-400 font-bold scale-105' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Contato</span>
          </button>

        </div>
      </div>
    </div>
  );
};
