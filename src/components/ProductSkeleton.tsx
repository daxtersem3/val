import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col justify-between animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-64 sm:h-72 w-full bg-zinc-800/50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-700/40" />
        <div className="absolute top-3 left-3 w-20 h-5 rounded-full bg-zinc-700/50" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          {/* Category Pill */}
          <div className="w-24 h-4 rounded-md bg-zinc-800 mb-2.5" />
          {/* Title Lines */}
          <div className="w-4/5 h-5 rounded-md bg-zinc-700/60 mb-2" />
          <div className="w-3/5 h-4 rounded-md bg-zinc-800/80" />
        </div>

        <div>
          {/* Size / Color Pill placeholders */}
          <div className="flex gap-1.5 mb-4">
            <div className="w-8 h-7 rounded-lg bg-zinc-800/60" />
            <div className="w-8 h-7 rounded-lg bg-zinc-800/60" />
            <div className="w-8 h-7 rounded-lg bg-zinc-800/60" />
          </div>

          {/* Price and Button Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
            <div>
              <div className="w-14 h-3 rounded bg-zinc-800 mb-1" />
              <div className="w-20 h-6 rounded bg-zinc-700/60" />
            </div>
            <div className="w-28 h-10 rounded-xl bg-zinc-800/90" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
