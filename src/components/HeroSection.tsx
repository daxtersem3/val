import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, MessageCircle, Sparkles, Shield, Truck, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface HeroSectionProps {
  featuredProducts?: Product[];
  onExploreProducts: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProducts = [],
  onExploreProducts,
  onSelectProduct
}) => {
  const WHATSAPP_NUMBER = '5547999999999';

  // Fallback defaults if no featured products
  const displayItems = featuredProducts.length > 0 ? featuredProducts : [
    {
      id: 'prod-2',
      name: 'Air Jordan 1 High OG Yellow Toe',
      category: 'tenis',
      price: 749.00,
      originalPrice: 899.00,
      images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'],
      description: '',
      sizes: [],
      inStock: true,
      badge: 'EXCLUSIVO' as const
    },
    {
      id: 'prod-1',
      name: 'Camiseta Nike Tech Oversized Black Gold',
      category: 'camisetas',
      price: 189.90,
      originalPrice: 249.90,
      images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'],
      description: '',
      sizes: [],
      inStock: true,
      badge: 'BEST-SELLER' as const
    },
    {
      id: 'prod-3',
      name: 'Conjunto Trapstar London Black Edition',
      category: 'conjuntos',
      price: 459.90,
      originalPrice: 580.00,
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
      description: '',
      sizes: [],
      inStock: true,
      badge: 'NOVO' as const
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate featured products every 3 seconds
  useEffect(() => {
    if (displayItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [displayItems.length]);

  const currentItem = displayItems[currentIndex] || displayItems[0];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-14 overflow-hidden border-b border-zinc-800 bg-[url('/store-front.jpg')] bg-cover bg-center">
      {/* Matte Dark Gradient Overlays ONLY for this first section */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-black/85 pointer-events-none" />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none" />

      {/* Subtle Warm Accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Hero Copy */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900/90 border border-yellow-500/40 rounded-full text-yellow-400 text-xs font-extrabold tracking-widest uppercase mb-5 shadow-lg backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coleção Importada 2026</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none uppercase drop-shadow-md"
          >
            ESTILO UNISSEX <br />
            <span className="text-yellow-400">
              & EXCLUSIVIDADE
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed font-normal drop-shadow-sm"
          >
            Sua loja premium em Balneário Camboriú. Camisetas grifadas, tênis, conjuntos, perfumes importados e acessórios. Qualidade selecionada e envio imediato.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-7 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto"
          >
            {/* CTA 1: VER PRODUTOS */}
            <button
              onClick={onExploreProducts}
              className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2.5 transition-all hover:scale-105 shadow-xl"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>VER CATÁLOGO COMPLETO</span>
            </button>

            {/* CTA 2: FALAR NO WHATSAPP */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20LP%20Importados%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2.5 transition-all hover:scale-105 shadow-xl border border-emerald-500/40"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>FALAR NO WHATSAPP</span>
            </a>
          </motion.div>

          {/* Value Props Badges */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-zinc-800/90 pt-5 w-full max-w-xl">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <Truck className="w-4 h-4 text-yellow-400 mb-1" />
              <span className="text-xs font-bold text-white">ENVIO RÁPIDO</span>
              <span className="text-[10px] text-zinc-400">Balneário & SC</span>
            </div>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <Award className="w-4 h-4 text-yellow-400 mb-1" />
              <span className="text-xs font-bold text-white">100% IMPORTADO</span>
              <span className="text-[10px] text-zinc-400">Qualidade Garantida</span>
            </div>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <Shield className="w-4 h-4 text-yellow-400 mb-1" />
              <span className="text-xs font-bold text-white">COMPRA SEGURA</span>
              <span className="text-[10px] text-zinc-400">Direto no WhatsApp</span>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Featured Carousel (3s Auto-Rotating) */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md"
          >
            <div className="relative bg-zinc-900/90 border border-zinc-800 p-5 rounded-3xl shadow-2xl overflow-hidden group backdrop-blur-md">
              
              {/* Product Hero Image Carousel */}
              <div 
                onClick={() => onSelectProduct?.(currentItem)}
                className="relative h-72 rounded-2xl overflow-hidden bg-black mb-4 cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentItem.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    src={currentItem.images?.[0] || ''}
                    alt={currentItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                
                {/* Badge */}
                <span className="absolute top-3 left-3 bg-yellow-400 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                  {currentItem.badge || 'DESTAQUE DA SEMANA'}
                </span>

                {/* Left/Right Arrows for Manual Slide */}
                {displayItems.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-yellow-400 text-white hover:text-black rounded-full transition-all backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-yellow-400 text-white hover:text-black rounded-full transition-all backdrop-blur-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Product Title & Price */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-base font-black text-white uppercase line-clamp-1">{currentItem.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-yellow-400 font-black text-lg">
                      R$ {currentItem.price.toFixed(2).replace('.', ',')}
                    </span>
                    {currentItem.originalPrice && (
                      <span className="text-xs text-zinc-400 line-through">
                        R$ {currentItem.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dots & Info Box */}
              <div className="flex justify-center gap-1.5 mb-3">
                {displayItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex ? 'w-6 bg-yellow-400' : 'w-1.5 bg-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/favicon.png"
                    alt="LP Importados Logo"
                    className="w-8 h-8 rounded-full border border-yellow-400/60 object-cover"
                  />
                  <div>
                    <p className="text-[11px] font-bold text-white">LP IMPORTADOS SC</p>
                    <p className="text-[9px] text-zinc-400">@lpimportadosss_</p>
                  </div>
                </div>
                <button
                  onClick={() => onSelectProduct?.(currentItem)}
                  className="px-3 py-1.5 bg-yellow-400 text-black text-[11px] font-black rounded-lg hover:bg-yellow-300 transition-colors"
                >
                  VER PRODUTO
                </button>
              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
