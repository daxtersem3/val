import React, { useState } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [''];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.length > 0 ? product.sizes[0] : 'Único'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<1 | -1>(1);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
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
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
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
          <div className="w-full md:w-1/2 relative bg-zinc-950 h-72 md:h-auto min-h-[300px] overflow-hidden">
            <AnimatePresence initial={false} custom={swipeDirection} mode="popLayout">
              <motion.img
                key={`img-${currentImageIdx}`}
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
                src={images[currentImageIdx]}
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
            {images.length > 1 && (
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
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {images.map((_, idx) => (
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
            {images.length > 1 && (
              <span className="absolute top-4 right-4 z-10 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {currentImageIdx + 1} / {images.length}
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

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-2">
                    Selecione o Tamanho:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
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
