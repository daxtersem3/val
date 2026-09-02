import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './data/initialProducts';
import { DesktopHeader } from './components/DesktopHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CatalogPage } from './components/CatalogPage';
import { FooterContact } from './components/FooterContact';
import { CookieConsent } from './components/CookieConsent';
import { LegalModals } from './components/LegalModals';
import { fetchProductsFromDB, saveProductToDB, deleteProductFromDB, isSupabaseConfigured } from './lib/supabase';
import { AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  // View state: 'home' or 'catalog'
  const [currentView, setCurrentView] = useState<'home' | 'catalog'>(() => {
    return window.location.hash === '#catalogo' ? 'catalog' : 'home';
  });

  // Listen to hash changes for routing (#catalogo, #admin, #home)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#catalogo') {
        setCurrentView('catalog');
      } else if (hash === '#admin') {
        setIsAdminOpen(true);
      } else {
        setCurrentView('home');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Products State & Initial Load
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('lp_importados_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return isSupabaseConfigured ? [] : INITIAL_PRODUCTS;
  });

  // Initial loading state with minimum aesthetic duration
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);

  // Load from Supabase DB on startup with clean minimum loading time
  useEffect(() => {
    let isMounted = true;
    async function syncWithDB() {
      if (isSupabaseConfigured) {
        setIsLoading(true);
        // Minimum smooth duration (500ms) to ensure full render preparation
        const minDelay = new Promise((resolve) => setTimeout(resolve, 500));

        try {
          const [dbProducts] = await Promise.all([
            fetchProductsFromDB(),
            minDelay
          ]);

          if (isMounted && dbProducts !== null && dbProducts.length > 0) {
            setProducts(dbProducts);
            try {
              localStorage.setItem('lp_importados_products', JSON.stringify(dbProducts));
            } catch (e) {
              console.error('Error saving products cache:', e);
            }
          }
        } catch (err) {
          console.error('Error loading Supabase products:', err);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
    }
    syncWithDB();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lp_importados_products', JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }, [products]);

  // Cart State with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lp_importados_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lp_importados_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // Navigation & Filter States for Home preview
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('inicio');

  // Modals & Drawers States
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  // Cart Actions
  const handleAddToCart = (product: Product, size: string, color?: string, qty: number = 1) => {
    setCart((prev) => {
      const colorKey = color ? color.trim().toLowerCase() : 'default';
      const cartId = `${product.id}-${colorKey}-${size}`;
      const existing = prev.find((item) => item.cartId === cartId);
      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { cartId, product, selectedSize: size, selectedColor: color, quantity: qty }];
    });
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Product Admin Actions (Syncs to Supabase & localStorage)
  const handleAddProduct = async (newProd: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [created, ...prev]);
    saveProductToDB(created);
  };

  const handleUpdateProduct = async (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    saveProductToDB(updated);
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteProductFromDB(id);
  };

  // Filtered Products Logic for Home preview
  const featuredProducts = products.filter((p) => p.featured);
  const homeCatalogProducts = products.filter((product) => {
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

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 1. DEDICATED CATALOG PAGE VIEW (#catalogo)
  if (currentView === 'catalog') {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
        <CatalogPage
          products={products}
          categories={INITIAL_CATEGORIES}
          isLoading={isLoading}
          onAddToCart={(p, sz) => handleAddToCart(p, sz, 1)}
          onQuickView={(p) => setQuickViewProduct(p)}
          onGoBack={() => {
            window.location.hash = '';
            setCurrentView('home');
          }}
          isAdmin={isAdminOpen}
          onEditProduct={(p) => {
            setEditingProduct(p);
            setIsAdminOpen(true);
          }}
          onDeleteProduct={handleDeleteProduct}
        />

        {/* Custom Mobile Navigation Bar */}
        <MobileBottomNav
          cartCount={cartTotalCount}
          onOpenCart={() => setIsCartOpen(true)}
          activeTab="catalogo"
          setActiveTab={(tab) => {
            if (tab === 'inicio') {
              window.location.hash = '';
              setCurrentView('home');
            }
          }}
          onOpenCatalogPage={() => {}}
        />

        {/* Modals */}
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
        />

        <AdminPanelModal
          isOpen={isAdminOpen}
          onClose={() => {
            setIsAdminOpen(false);
            setEditingProduct(null);
            if (window.location.hash === '#admin') {
              window.history.pushState('', document.title, window.location.pathname);
            }
          }}
          products={products}
          categories={INITIAL_CATEGORIES}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />

        {/* Cookie Consent & Legal */}
        <CookieConsent
          onOpenPrivacy={() => setLegalModal('privacy')}
          onOpenTerms={() => setLegalModal('terms')}
        />
        <LegalModals
          activeModal={legalModal}
          onClose={() => setLegalModal(null)}
        />
      </div>
    );
  }

  // 3. MAIN HOME PAGE VIEW
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      
      {/* Desktop Top Navbar */}
      <DesktopHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          if (sec === 'catalogo') {
            window.location.hash = '#catalogo';
            setCurrentView('catalog');
          }
        }}
      />

      {/* Main Hero Section with Auto-Rotating 3s Carousel */}
      <HeroSection
        featuredProducts={featuredProducts}
        fallbackProducts={products}
        isLoading={isLoading}
        onExploreProducts={() => {
          window.location.hash = '#catalogo';
          setCurrentView('catalog');
        }}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      {/* Main Catalog Summary Section on Home */}
      <main id="catalogo-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-black uppercase tracking-widest rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> DESTAQUES & CATEGORIAS LP IMPORTADOS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            ESCOLHA SEU <span className="text-yellow-400">ESTILO</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Confira nossos principais destaques ou acesse o catálogo completo em uma página dedicada.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="mb-8">
          <CategoryFilter
            categories={INITIAL_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setActiveSection('catalogo');
            }}
          />
        </div>

        {/* Results Info & Dedicated Catalog Button */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-400 font-bold border-b border-zinc-800 pb-3">
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-yellow-400" />
            {isLoading ? (
              <span className="text-zinc-500 animate-pulse">Carregando catálogo...</span>
            ) : (
              <>
                Exibindo <strong className="text-yellow-400">{homeCatalogProducts.length}</strong> produtos em destaque
              </>
            )}
          </span>

          <button
            onClick={() => {
              window.location.hash = '#catalogo';
              setCurrentView('catalog');
            }}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-md"
          >
            <span>VER CATÁLOGO COMPLETO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={homeCatalogProducts}
          isLoading={isLoading}
          onAddToCart={(p, sz) => handleAddToCart(p, sz, 1)}
          onQuickView={(p) => setQuickViewProduct(p)}
          isAdmin={isAdminOpen}
          onEditProduct={(p) => {
            setEditingProduct(p);
            setIsAdminOpen(true);
          }}
          onDeleteProduct={handleDeleteProduct}
          onAddNewClick={() => {
            setEditingProduct(null);
            setIsAdminOpen(true);
          }}
        />

        {/* CTA to full catalog */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              window.location.hash = '#catalogo';
              setCurrentView('catalog');
            }}
            className="px-8 py-4 bg-zinc-900 hover:bg-yellow-400 text-white hover:text-black border border-yellow-400/50 rounded-2xl font-black text-sm uppercase tracking-wider inline-flex items-center gap-3 transition-all hover:scale-105 shadow-xl"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>ABRIR PÁGINA EXCLUSIVA DE CATÁLOGO</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>

      {/* Footer & Contact Section */}
      <FooterContact
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
      />

      {/* Custom Mobile Navigation Bar */}
      <MobileBottomNav
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeSection}
        setActiveTab={setActiveSection}
        onOpenCatalogPage={() => {
          window.location.hash = '#catalogo';
          setCurrentView('catalog');
        }}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setEditingProduct(null);
          if (window.location.hash === '#admin') {
            window.history.pushState('', document.title, window.location.pathname);
          }
        }}
        products={products}
        categories={INITIAL_CATEGORIES}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />

      {/* Cookie Consent & Legal */}
      <CookieConsent
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
      />
      <LegalModals
        activeModal={legalModal}
        onClose={() => setLegalModal(null)}
      />

    </div>
  );
};
