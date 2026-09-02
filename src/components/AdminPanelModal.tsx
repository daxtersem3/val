import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Edit, Trash2, Save, Upload, CheckCircle, ShieldCheck, 
  Lock, Database, ImagePlus, Mail, Eye, EyeOff, LogOut, Loader2, Sparkles, Camera
} from 'lucide-react';
import { uploadProductImage, isSupabaseConfigured, supabase } from '../lib/supabase';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  editingProduct?: Product | null;
  setEditingProduct: (product: Product | null) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  editingProduct,
  setEditingProduct
}) => {
  if (!isOpen) return null;

  // Supabase Auth States
  const [session, setSession] = useState<any>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState('');

  // Check Supabase session on open & listen to changes
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        setSession(currentSession);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErrorMessage('');

    if (!supabase) {
      setAuthErrorMessage('Supabase ainda não foi configurado no arquivo .env.');
      return;
    }

    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setAuthErrorMessage('Email ou senha incorretos. Verifique os dados em Supabase.');
        } else {
          setAuthErrorMessage(error.message);
        }
      } else if (data?.session) {
        setSession(data.session);
        setEmailInput('');
        setPasswordInput('');
      }
    } catch (err: any) {
      setAuthErrorMessage(err?.message || 'Erro ao conectar. Tente novamente.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Quick Photo Manager state (inline in product list)
  const [photoManagerId, setPhotoManagerId] = useState<string | null>(null);
  const [photoManagerImages, setPhotoManagerImages] = useState<string[]>([]);
  const [photoManagerSubclasses, setPhotoManagerSubclasses] = useState<Record<number, string>>({});
  const [photoManagerUploading, setPhotoManagerUploading] = useState(false);
  const [photoManagerSaved, setPhotoManagerSaved] = useState(false);
  const [photoManagerUrlInput, setPhotoManagerUrlInput] = useState('');

  // Multi-image form data
  const [formData, setFormData] = useState({
    name: '',
    category: 'camisetas',
    price: '',
    originalPrice: '',
    discountPercent: '',
    images: [] as string[],
    imageSubclasses: {} as Record<number, string>,
    description: '',
    sizes: 'P, M, G, GG',
    badge: 'NOVO',
    featured: true,
    inStock: true
  });

  // Sync form when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price.toString(),
        originalPrice: editingProduct.originalPrice ? editingProduct.originalPrice.toString() : '',
        discountPercent: editingProduct.discountPercent ? editingProduct.discountPercent.toString() : '',
        images: editingProduct.images || [],
        imageSubclasses: editingProduct.imageSubclasses || {},
        description: editingProduct.description,
        sizes: editingProduct.sizes.join(', '),
        badge: editingProduct.badge || 'NOVO',
        featured: editingProduct.featured || false,
        inStock: true
      });
      setActiveTab('add');
    }
  }, [editingProduct]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // File Upload Handler — adds to images array with auto-compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadProductImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      alert('Erro ao carregar imagem. Verifique se o bucket "product-images" está público.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageUrlInput('');
  };

  // Remove single image from array
  const handleRemoveImage = (idx: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== idx);
      // Re-index subclasses after removing an image
      const newSubclasses: Record<number, string> = {};
      let newIdx = 0;
      for (let i = 0; i < prev.images.length; i++) {
        if (i === idx) continue;
        if (prev.imageSubclasses[i]) {
          newSubclasses[newIdx] = prev.imageSubclasses[i];
        }
        newIdx++;
      }
      return { ...prev, images: newImages, imageSubclasses: newSubclasses };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || formData.images.length === 0) {
      alert('Por favor, preencha o Nome, Preço e adicione ao menos 1 Foto do produto.');
      return;
    }

    const priceNum = parseFloat(formData.price.replace(',', '.'));
    const origPriceNum = formData.originalPrice ? parseFloat(formData.originalPrice.replace(',', '.')) : undefined;
    const discountNum = formData.discountPercent ? parseInt(formData.discountPercent, 10) : undefined;
    const sizesArray = formData.sizes.split(',').map((s) => s.trim()).filter(Boolean);

    // Clean subclasses: remove empty entries
    const cleanedSubclasses: Record<number, string> = {};
    Object.entries(formData.imageSubclasses).forEach(([key, val]) => {
      if (val && val.trim()) {
        cleanedSubclasses[Number(key)] = val.trim();
      }
    });

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: formData.name,
        category: formData.category,
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercent: discountNum,
        images: formData.images,
        imageSubclasses: Object.keys(cleanedSubclasses).length > 0 ? cleanedSubclasses : undefined,
        description: formData.description,
        sizes: sizesArray,
        badge: formData.badge as any,
        featured: formData.featured,
        inStock: true
      });
    } else {
      onAddProduct({
        name: formData.name,
        category: formData.category,
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercent: discountNum,
        images: formData.images,
        imageSubclasses: Object.keys(cleanedSubclasses).length > 0 ? cleanedSubclasses : undefined,
        description: formData.description,
        sizes: sizesArray,
        badge: formData.badge as any,
        featured: formData.featured,
        inStock: true
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setEditingProduct(null);
      resetForm();
      setActiveTab('list');
    }, 1200);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'camisetas',
      price: '',
      originalPrice: '',
      discountPercent: '',
      images: [],
      imageSubclasses: {},
      description: '',
      sizes: 'P, M, G, GG',
      badge: 'NOVO',
      featured: true,
      inStock: true
    });
    setImageUrlInput('');
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
  };

  // ======================================
  // QUICK PHOTO MANAGER HANDLERS
  // ======================================
  const openPhotoManager = (prod: Product) => {
    if (photoManagerId === prod.id) {
      setPhotoManagerId(null);
      return;
    }
    setPhotoManagerId(prod.id);
    setPhotoManagerImages([...(prod.images || [])]);
    setPhotoManagerSubclasses({ ...(prod.imageSubclasses || {}) });
    setPhotoManagerSaved(false);
    setPhotoManagerUrlInput('');
  };

  const pmRemoveImage = (idx: number) => {
    const newImages = photoManagerImages.filter((_, i) => i !== idx);
    const newSub: Record<number, string> = {};
    let newIdx = 0;
    for (let i = 0; i < photoManagerImages.length; i++) {
      if (i === idx) continue;
      if (photoManagerSubclasses[i]) newSub[newIdx] = photoManagerSubclasses[i];
      newIdx++;
    }
    setPhotoManagerImages(newImages);
    setPhotoManagerSubclasses(newSub);
  };

  const pmFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setPhotoManagerUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(f => uploadProductImage(f)));
      setPhotoManagerImages(prev => [...prev, ...urls]);
    } catch {
      alert('Erro ao carregar imagem.');
    } finally {
      setPhotoManagerUploading(false);
      e.target.value = '';
    }
  };

  const pmAddUrl = () => {
    const url = photoManagerUrlInput.trim();
    if (!url) return;
    setPhotoManagerImages(prev => [...prev, url]);
    setPhotoManagerUrlInput('');
  };

  const pmSave = () => {
    const prod = products.find(p => p.id === photoManagerId);
    if (!prod) return;
    const cleanSub: Record<number, string> = {};
    Object.entries(photoManagerSubclasses).forEach(([k, v]) => {
      if (v && v.trim()) cleanSub[Number(k)] = v.trim();
    });
    onUpdateProduct({
      ...prod,
      images: photoManagerImages,
      imageSubclasses: Object.keys(cleanSub).length > 0 ? cleanSub : undefined,
    });
    setPhotoManagerSaved(true);
    setTimeout(() => setPhotoManagerSaved(false), 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  PAINEL DE ADMINISTRAÇÃO
                </h2>
                <p className="text-xs text-yellow-400 font-semibold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  {isSupabaseConfigured ? '🟢 Conectado ao Supabase (Nuvem)' : '🟡 Modo Local'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {session && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-zinc-800/80 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 border border-zinc-700/50 hover:border-red-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Cerrar sesión de Administrador"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 bg-zinc-800 hover:bg-yellow-400 text-zinc-300 hover:text-black rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* IF NOT AUTHENTICATED: SUPABASE SECURE LOGIN SCREEN         */}
          {/* ========================================================= */}
          {!session ? (
            <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto w-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 text-black flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                <Lock className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Acesso do Administrador
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 mb-6">
                Inicie sessão com sua conta de administrador do Supabase para gerenciar produtos.
              </p>

              <form onSubmit={handleSupabaseLogin} className="space-y-4 text-left">
                <div>
                  <label className="text-[11px] font-black text-zinc-300 uppercase tracking-wider block mb-1.5">
                    Email de Administrador
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="admin@lpimportados.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black text-zinc-300 uppercase tracking-wider block mb-1.5">
                    Senha Secreta
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-11 py-3 text-sm text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authErrorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-bold">
                    {authErrorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AUTENTICANDO...</span>
                    </>
                  ) : (
                    <span>ENTRAR NO PAINEL</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ========================================================= */
            /* AUTHENTICATED ADMIN DASHBOARD                              */
            /* ========================================================= */
            <>
              {/* Navigation Tabs */}
              <div className="flex border-b border-zinc-800 bg-zinc-900/40">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    resetForm();
                    setActiveTab('add');
                  }}
                  className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
                    activeTab === 'add'
                      ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingProduct ? 'Editar Produto' : '+ Novo Produto'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('list')}
                  className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
                    activeTab === 'list'
                      ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Gerenciar Catálogo ({products.length})</span>
                </button>
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                {activeTab === 'add' ? (
                  /* Add/Edit Form */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                          Nome do Produto *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Camiseta Balenciaga Oversized"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                          Categoria *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                        >
                          {categories.filter(c => c.id !== 'all').map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                          Preço Promocional (R$) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: 189.90"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                          Preço Original (De:)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 249.90"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                          Desconto % (Ex: 20%)
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 20"
                          value={formData.discountPercent}
                          onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* ============================================== */}
                    {/* MULTI-IMAGE UPLOAD WITH AUTO-COMPRESSION VIEW  */}
                    {/* ============================================== */}
                    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-black text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                          <ImagePlus className="w-4 h-4 text-yellow-400" />
                          Fotos do Produto ({formData.images.length} adicionada{formData.images.length !== 1 ? 's' : ''}) *
                        </label>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <Sparkles className="w-3 h-3" />
                          Otimização WebP Ativa
                        </span>
                      </div>

                      {/* Image Previews Grid */}
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                          {formData.images.map((imgUrl, idx) => (
                            <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-700/80 bg-zinc-950 shadow-md flex flex-col">
                              <div className="relative aspect-square">
                                <img
                                  src={imgUrl}
                                  alt={`Foto ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                  title="Remover foto"
                                >
                                  ✕
                                </button>
                                <span className={`absolute bottom-1.5 left-1.5 text-[9px] font-black px-2 py-0.5 rounded-md shadow ${
                                  idx === 0 ? 'bg-yellow-400 text-black' : 'bg-black/80 text-white'
                                }`}>
                                  {idx === 0 ? 'CAPA' : `#${idx + 1}`}
                                </span>
                              </div>
                              {/* Subclass / Color Input */}
                              <div className="p-1.5">
                                <input
                                  type="text"
                                  placeholder="Cor... (ex: Verde)"
                                  value={formData.imageSubclasses[idx] || ''}
                                  onChange={(e) => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      imageSubclasses: { ...prev.imageSubclasses, [idx]: e.target.value }
                                    }));
                                  }}
                                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-2 py-1 text-[10px] text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none transition-colors"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload and URL input Area */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2">
                        <div className="sm:col-span-8">
                          <input
                            type="text"
                            placeholder="Ou cole a URL de uma imagem da internet..."
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddImageUrl();
                              }
                            }}
                            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-4 flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddImageUrl}
                            className="flex-1 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5 text-yellow-400" />
                            URL
                          </button>
                          <label className={`flex-1 py-2.5 px-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md ${
                            uploadingImage ? 'opacity-50 pointer-events-none' : ''
                          }`}>
                            {uploadingImage ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Subindo...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Subir Foto</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              disabled={uploadingImage}
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-400">
                        💡 A primeira foto será a capa principal. Pode selecionar várias fotos ao mesmo tempo.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                        Tamanhos Disponíveis (Separados por vírgula)
                      </label>
                      <input
                        type="text"
                        placeholder="P, M, G, GG  ou  38, 39, 40, 41"
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                        Descrição Detalhada do Produto
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Descrição sobre o tecido, corte, caimento ou detalhes importados..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                          Selo / Destaque
                        </label>
                        <select
                          value={formData.badge}
                          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                        >
                          <option value="NOVO">NOVO</option>
                          <option value="BEST-SELLER">BEST-SELLER</option>
                          <option value="EXCLUSIVO">EXCLUSIVO</option>
                          <option value="PROMOÇÃO">PROMOÇÃO</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3 pt-6">
                        <input
                          type="checkbox"
                          id="featured-check"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                        />
                        <label htmlFor="featured-check" className="text-xs font-extrabold text-white cursor-pointer">
                          Destacar na Página Inicial
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                        savedSuccess
                          ? 'bg-emerald-500 text-black'
                          : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                      }`}
                    >
                      {savedSuccess ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>SALVO COM SUCESSO!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>{editingProduct ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PRODUTO'}</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Product Management List */
                  <div className="space-y-3">
                    {products.length === 0 ? (
                      <div className="text-center py-12 text-zinc-500 text-sm">
                        Nenhum produto cadastrado ainda. Clique em <strong>+ Novo Produto</strong> para começar.
                      </div>
                    ) : (
                      products.map((prod) => (
                        <div key={prod.id} className="space-y-0">
                          <div
                            className={`p-4 bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4 ${
                              photoManagerId === prod.id ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img 
                                src={prod.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'} 
                                alt={prod.name} 
                                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-zinc-800" 
                              />
                              {/* Small thumbnails for extra images */}
                              {prod.images && prod.images.length > 1 && (
                                <div className="flex gap-1 shrink-0">
                                  {prod.images.slice(1, 3).map((img, idx) => (
                                    <img key={idx} src={img} alt="" className="w-7 h-7 rounded-lg object-cover border border-zinc-700 opacity-60" />
                                  ))}
                                  {prod.images.length > 3 && (
                                    <span className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-400">
                                      +{prod.images.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-extrabold text-white truncate">{prod.name}</h4>
                              <p className="text-xs text-yellow-400 font-black">
                                R$ {prod.price.toFixed(2).replace('.', ',')} • {prod.category} • {prod.images?.length || 0} fotos
                              </p>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => openPhotoManager(prod)}
                                className={`p-2.5 font-bold rounded-xl transition-all shadow ${
                                  photoManagerId === prod.id
                                    ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                                    : 'bg-zinc-700 text-white hover:bg-zinc-600'
                                }`}
                                title="Gerenciar Fotos"
                              >
                                <Camera className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => startEdit(prod)}
                                className="p-2.5 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all shadow"
                                title="Editar Produto Completo"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Excluir ${prod.name}?`)) {
                                    onDeleteProduct(prod.id);
                                  }
                                }}
                                className="p-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-all shadow"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* ===== INLINE QUICK PHOTO MANAGER ===== */}
                          {photoManagerId === prod.id && (
                            <div className="p-4 bg-zinc-950 border border-zinc-800 border-t-0 rounded-b-2xl space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                                  <Camera className="w-3.5 h-3.5 text-yellow-400" />
                                  Gerenciar Fotos — {photoManagerImages.length} foto{photoManagerImages.length !== 1 ? 's' : ''}
                                </span>
                              </div>

                              {/* Photo Grid with subclass inputs */}
                              {photoManagerImages.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                  {photoManagerImages.map((imgUrl, idx) => (
                                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-700/80 bg-zinc-900 shadow-md flex flex-col">
                                      <div className="relative aspect-square">
                                        <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button
                                          type="button"
                                          onClick={() => pmRemoveImage(idx)}
                                          className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                          title="Remover"
                                        >
                                          ✕
                                        </button>
                                        <span className={`absolute bottom-1 left-1 text-[8px] font-black px-1.5 py-0.5 rounded-md shadow ${
                                          idx === 0 ? 'bg-yellow-400 text-black' : 'bg-black/80 text-white'
                                        }`}>
                                          {idx === 0 ? 'CAPA' : `#${idx + 1}`}
                                        </span>
                                      </div>
                                      <div className="p-1">
                                        <input
                                          type="text"
                                          placeholder="Cor..."
                                          value={photoManagerSubclasses[idx] || ''}
                                          onChange={(e) => setPhotoManagerSubclasses(prev => ({ ...prev, [idx]: e.target.value }))}
                                          className="w-full bg-zinc-900 border border-zinc-700/60 rounded-md px-1.5 py-0.5 text-[9px] text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Add photos controls */}
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Cole URL da imagem..."
                                  value={photoManagerUrlInput}
                                  onChange={(e) => setPhotoManagerUrlInput(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); pmAddUrl(); } }}
                                  className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-yellow-400 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={pmAddUrl}
                                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-xl text-[10px] font-bold text-white flex items-center gap-1 transition-all"
                                >
                                  <Plus className="w-3 h-3 text-yellow-400" /> URL
                                </button>
                                <label className={`px-3 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow ${
                                  photoManagerUploading ? 'opacity-50 pointer-events-none' : ''
                                }`}>
                                  {photoManagerUploading ? (
                                    <><Loader2 className="w-3 h-3 animate-spin" /> Subindo...</>
                                  ) : (
                                    <><Upload className="w-3 h-3" /> Foto</>
                                  )}
                                  <input type="file" accept="image/*" multiple disabled={photoManagerUploading} onChange={pmFileUpload} className="hidden" />
                                </label>
                              </div>

                              {/* Save button */}
                              <button
                                type="button"
                                onClick={pmSave}
                                className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow cursor-pointer ${
                                  photoManagerSaved
                                    ? 'bg-emerald-500 text-black'
                                    : 'bg-yellow-400 hover:bg-yellow-300 text-black'
                                }`}
                              >
                                {photoManagerSaved ? (
                                  <><CheckCircle className="w-4 h-4" /> FOTOS ATUALIZADAS!</>
                                ) : (
                                  <><Save className="w-4 h-4" /> SALVAR FOTOS</>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
