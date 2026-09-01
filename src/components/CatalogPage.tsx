import React, { useState } from 'react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductSkeleton';
import { CategoryFilter } from './CategoryFilter';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Sparkles, ShoppingBag, PackageSearch } from 'lucide-react';

interface CatalogPageProps {
  products: Product[];
  categories: Category[];
  isLoading?: boolean;
  onAddToCart: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
  onGoBack: () => void;
  isAdmin?: boolean;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (id: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  categories,
  isLoading = false,
  onAddToCart,
  onQuickView,
  onGoBack,
  isAdmin = false,
  onEditProduct,
  onDeleteProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'promocao'
        ? (product.category === 'promocao' || product.badge === 'PROMOÇÃO' || Boolean(product.discountPercent) || Boolean(product.originalPrice))
        : product.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={onGoBack}
            className="p-2.5 bg-zinc-900 hover:bg-yellow-400 text-zinc-300 hover:text-black rounded-full border border-zinc-700 hover:border-yellow-400 transition-all shrink-0"
            title="Voltar à Loja"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/favicon.png"
              alt="LP Importados"
              className="w-9 h-9 rounded-full border border-yellow-400/60 object-cover"
            />
            <h1 className="font-black text-lg text-white hidden sm:block">
              LP <span className="text-yellow-400">IMPORTADOS</span>
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar no catálogo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-black uppercase tracking-widest rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> CATÁLOGO COMPLETO
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            TODOS OS <span className="text-yellow-400">PRODUTOS</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Navegue por todas as categorias. Adicione ao carrinho e finalize pelo WhatsApp.
          </p>
        </motion.div>

        {/* Categories Bar */}
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-400 font-bold border-b border-zinc-800 pb-3">
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-yellow-400" />
            {isLoading ? (
              <span className="text-zinc-500 animate-pulse">Carregando catálogo...</span>
            ) : (
              <>
                Exibindo <strong className="text-yellow-400">{filteredProducts.length}</strong> produtos
                {selectedCategory !== 'all' && (
                  <span className="text-zinc-500">
                    em "{categories.find(c => c.id === selectedCategory)?.name || selectedCategory}"
                  </span>
                )}
              </>
            )}
          </span>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-yellow-400 hover:underline text-xs"
            >
              Limpar busca "{searchQuery}"
            </button>
          )}
        </div>

        {/* Product Grid / Skeleton */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 px-4 text-center bg-zinc-900/60 border border-zinc-800 rounded-3xl max-w-2xl mx-auto">
            <PackageSearch className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-black text-white uppercase">Nenhum produto encontrado</h3>
            <p className="text-zinc-400 text-sm mt-2 max-w-md mx-auto">
              Tente alterar o termo de busca ou selecionar outra categoria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                isAdmin={isAdmin}
                onEditProduct={onEditProduct}
                onDeleteProduct={onDeleteProduct}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
