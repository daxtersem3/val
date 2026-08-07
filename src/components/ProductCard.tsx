import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart, Eye, Edit, Trash2, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
  isAdmin?: boolean;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  isAdmin = false,
  onEditProduct,
  onDeleteProduct
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.length > 0 ? product.sizes[0] : 'Único'
  );
  const [addedToast, setAddedToast] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1800);
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'BEST-SELLER':
        return 'bg-yellow-400 text-black font-black';
      case 'EXCLUSIVO':
        return 'bg-purple-600 text-white font-black';
      case 'PROMOÇÃO':
        return 'bg-red-600 text-white font-black';
      default:
        return 'bg-emerald-500 text-black font-black';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between group shadow-xl hover:border-yellow-400/60 hover:shadow-[0_10px_30px_rgba(250,204,21,0.15)] transition-all"
    >
      {/* Top Image Container */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative h-64 sm:h-72 w-full overflow-hidden bg-zinc-950 cursor-pointer"
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />

        {/* Badge & Discount */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 items-start">
          {product.badge && (
            <span className={`text-[10px] tracking-widest uppercase px-3 py-1 rounded-full shadow-lg ${getBadgeStyle(product.badge)}`}>
              {product.badge}
            </span>
          )}
          {product.discountPercent && (
            <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-0.5 rounded-full shadow-md">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Admin Action Buttons Overlay */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditProduct?.(product);
              }}
              className="p-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full shadow-md transition-transform hover:scale-110"
              title="Editar Produto"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
                  onDeleteProduct?.(product.id);
                }
              }}
              className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-md transition-transform hover:scale-110"
              title="Excluir Produto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 right-3 p-2.5 bg-zinc-900/90 hover:bg-yellow-400 text-white hover:text-black border border-zinc-700/80 rounded-full backdrop-blur-md transition-all shadow-lg"
          title="Ver Detalhes"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Card Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
            {product.category}
          </span>

          <h3 
            onClick={() => onQuickView(product)}
            className="text-base font-extrabold text-white line-clamp-2 mt-1 hover:text-yellow-400 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-4">
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Tamanho:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                      selectedSize === sz
                        ? 'bg-yellow-400 border-yellow-400 text-black font-black shadow-md scale-105'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Preço à Vista</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-yellow-400">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              addedToast
                ? 'bg-emerald-500 text-black'
                : 'bg-yellow-400 hover:bg-yellow-300 text-black hover:scale-105 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
            }`}
          >
            {addedToast ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>ADICIONADO!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                <span>COMPRAR</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
