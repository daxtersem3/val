import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductSkeleton';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onAddToCart: (product: Product, size: string, color?: string) => void;
  onQuickView: (product: Product) => void;
  isAdmin?: boolean;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (id: string) => void;
  onAddNewClick?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onAddToCart,
  onQuickView,
  isAdmin = false,
  onEditProduct,
  onDeleteProduct,
  onAddNewClick
}) => {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <div className="py-20 px-4 text-center bg-zinc-900/60 border border-zinc-800 rounded-3xl max-w-2xl mx-auto my-8">
        <PackageSearch className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-black text-white uppercase">Nenhum produto encontrado</h3>
        <p className="text-zinc-400 text-sm mt-2 max-w-md mx-auto">
          Tente alterar o termo de busca ou selecionar outra categoria no menu acima.
        </p>
        {isAdmin && (
          <button
            onClick={onAddNewClick}
            className="mt-6 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg"
          >
            + Cadastrar Novo Produto
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
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
  );
};
