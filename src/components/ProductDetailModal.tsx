import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color?: string, qty?: number) => void;
}

// Categories that require size selection (clothing/shoes)
const CATEGORIES_WITH_SIZES = ['camisetas', 'tenis', 'conjuntos'];

// Map of color names (Portuguese, lowercase) → hex codes for visual dots
const COLOR_HEX_MAP: Record<string, string> = {
  verde: '#22c55e',
  vermelho: '#ef4444',
  azul: '#3b82f6',
  preto: '#18181b',
  branco: '#f4f4f5',
  rosa: '#ec4899',
  amarelo: '#eab308',
  cinza: '#71717a',
  marrom: '#92400e',
  roxo: '#a855f7',
  laranja: '#f97316',
  bege: '#d4a574',
  dourado: '#d4a017',
  prata: '#c0c0c0',
  vinho: '#722f37',
  turquesa: '#40e0d0',
  coral: '#ff7f50',
  navy: '#1e3a5f',
};

function getColorHex(colorName: string): string {
  return COLOR_HEX_MAP[colorName.toLowerCase().trim()] || '#a1a1aa';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const allImages = product.images && product.images.length > 0 ? product.images : [''];
  const subclasses = product.imageSubclasses || {};

  // Extract unique color names from subclasses
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    Object.values(subclasses).forEach((c) => {
      if (c && c.trim()) colors.add(c.trim());
    });
    // Also include colors that might have sizes defined in colorSizes
    if (product.colorSizes) {
      Object.keys(product.colorSizes).forEach((c) => {
        if (c && c.trim()) colors.add(c.trim());
      });
    }
    return Array.from(colors);
  }, [subclasses, product.colorSizes]);

  const hasSubclasses = availableColors.length > 0;

  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Filter images by selected color
  const filteredImages = useMemo(() => {
    if (!selectedColor || !hasSubclasses) return allImages;
    const filtered = allImages.filter((_, idx) => {
      const imgColor = subclasses[idx];
      return imgColor && imgColor.trim().toLowerCase() === selectedColor.toLowerCase();
    });
    return filtered.length > 0 ? filtered : allImages;
  }, [selectedColor, allImages, subclasses, hasSubclasses]);

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const needsSize = CATEGORIES_WITH_SIZES.includes(product.category);

  // Dynamic sizes based on selected color or fallback to general sizes
  const currentSizes = useMemo(() => {
    if (!needsSize) return [];
    const colorSizesMap = product.colorSizes;
    
    if (colorSizesMap && Object.keys(colorSizesMap).length > 0) {
      if (selectedColor && colorSizesMap[selectedColor] && colorSizesMap[selectedColor].length > 0) {
        return colorSizesMap[selectedColor];
      }
      if (!selectedColor) {
        const allColorSizes = new Set<string>();
        Object.values(colorSizesMap).forEach((sizesArr) => {
          if (Array.isArray(sizesArr)) {
            sizesArr.forEach((s) => allColorSizes.add(s));
          }
        });
        if (allColorSizes.size > 0) {
          return Array.from(allColorSizes);
        }
      }
    }
    return product.sizes || [];
  }, [product.colorSizes, product.sizes, selectedColor, needsSize]);

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (!needsSize) return 'Único';
    return currentSizes.length > 0 ? currentSizes[0] : (product.sizes?.[0] || 'Único');
  });

  // Auto-sync selectedSize when available sizes for color change
  React.useEffect(() => {
    if (needsSize && currentSizes.length > 0) {
      if (!currentSizes.includes(selectedSize)) {
        setSelectedSize(currentSizes[0]);
      }
    }
  }, [currentSizes, needsSize, selectedSize]);

  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<1 | -1>(1);

  // Reset currentImageIdx and sync color selection
  const handleColorSelect = (color: string | null) => {
    setSelectedColor(color);
    setCurrentImageIdx(0);
  };

  const handleAdd = () => {
    const colorToPass = selectedColor || (availableColors.length === 1 ? availableColors[0] : undefined);
    onAddToCart(product, selectedSize, colorToPass, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const goToImage = (dir: 1 | -1) => {
    setSwipeDirection(dir);
    setCurrentImageIdx((prev) => {
      const next = prev + dir;
      if (next < 0) return filteredImages.length - 1;
      if (next >= filteredImages.length) return 0;
      return next;
    });
  };

  // Swipe/drag handler
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 50;
    if (info.offset.x < -threshold || info.velocity.x < -300) {
      goToImage(1);
    } else if (info.offset.x > threshold || info.velocity.x > 300) {
      goToImage(-1);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 })
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-yellow-400 text-white hover:text-black rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Image Gallery with Swipe */}
          <div className="w-full md:w-1/2 relative bg-zinc-950 aspect-square md:aspect-auto md:min-h-[420px] overflow-hidden">
            <AnimatePresence initial={false} custom={swipeDirection} mode="popLayout">
              <motion.img
                key={`img-${currentImageIdx}-${selectedColor}`}
                custom={swipeDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={handleDragEnd}
                src={filteredImages[currentImageIdx]}
                alt={`${product.name} - Foto ${currentImageIdx + 1}`}
                className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
              />
            </AnimatePresence>

            {/* Badge & Discount */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
              {product.badge && (
                <span className="bg-yellow-400 text-black text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg">
                  {product.badge}
                </span>
              )}
              {product.discountPercent && (
                <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Navigation Arrows (only if >1 image) */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => goToImage(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-yellow-400 text-white hover:text-black flex items-center justify-center transition-all backdrop-blur-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goToImage(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-yellow-400 text-white hover:text-black flex items-center justify-center transition-all backdrop-blur-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {filteredImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {filteredImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSwipeDirection(idx > currentImageIdx ? 1 : -1);
                      setCurrentImageIdx(idx);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentImageIdx
                        ? 'bg-yellow-400 scale-125 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                        : 'bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Image Counter */}
            {filteredImages.length > 1 && (
              <span className="absolute top-4 right-4 z-10 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {currentImageIdx + 1} / {filteredImages.length}
              </span>
            )}
          </div>

          {/* Right Side Content */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <span className="text-xs font-extrabold text-yellow-400 uppercase tracking-widest">
                {product.category}
              </span>

              <h2 className="text-2xl font-black text-white mt-1 uppercase leading-tight">
                {product.name}
              </h2>

              {/* ============================================ */}
              {/* COLOR / SUBCLASS FILTER BUTTONS               */}
              {/* ============================================ */}
              {hasSubclasses && (
                <div className="mt-4">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-2">
                    Cor / Subclasse:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {/* "Todas" button */}
                    <button
                      onClick={() => handleColorSelect(null)}
                      className={`px-3 py-1.5 text-xs font-black rounded-xl border transition-all flex items-center gap-1.5 ${
                        selectedColor === null
                          ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg scale-105'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                      }`}
                    >
                      Todas
                    </button>
                    {/* Color buttons */}
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`px-3 py-1.5 text-xs font-black rounded-xl border transition-all flex items-center gap-1.5 ${
                          selectedColor === color
                            ? 'bg-zinc-800 border-yellow-400 text-white shadow-lg scale-105 ring-1 ring-yellow-400'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-zinc-600 shrink-0"
                          style={{ backgroundColor: getColorHex(color) }}
                        />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-black text-yellow-400">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-zinc-500 line-through font-semibold">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-300 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Sizes Selection — dynamic according to selected color */}
              {needsSize && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                      Selecione o Tamanho:
                    </label>
                    {selectedColor && product.colorSizes?.[selectedColor] && (
                      <span className="text-[10px] text-yellow-400 font-bold">
                        {currentSizes.length} tamanho{currentSizes.length !== 1 ? 's' : ''} em {selectedColor}
                      </span>
                    )}
                  </div>

                  {currentSizes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentSizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-4 py-2 text-xs font-black rounded-xl border transition-all ${
                            selectedSize === sz
                              ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg scale-105'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300">
                      Sem tamanhos disponíveis para esta cor no momento.
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Controls */}
              <div className="mt-6 flex items-center gap-4">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                  Quantidade:
                </label>
                <div className="flex items-center border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-zinc-400 hover:text-white font-black hover:bg-zinc-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-black text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-zinc-400 hover:text-white font-black hover:bg-zinc-800"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80">
              <button
                onClick={handleAdd}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                  added
                    ? 'bg-emerald-500 text-black'
                    : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-[1.02]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>ADICIONADO AO CARRINHO!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                    <span>ADICIONAR AO CARRINHO (R$ {(product.price * quantity).toFixed(2).replace('.', ',')})</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-around text-[10px] text-zinc-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-yellow-400" /> Entrega Rápida
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" /> Produto Importado
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-yellow-400" /> Suporte WhatsApp
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
