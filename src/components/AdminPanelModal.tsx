import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Edit, Trash2, Save, Upload, CheckCircle, ShieldCheck, Lock, Database, ImagePlus } from 'lucide-react';
import { uploadProductImage, isSupabaseConfigured } from '../lib/supabase';

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

  // Security Auth Gate (PIN protection)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<boolean>(false);

  const DEFAULT_PIN = '1234'; // Default Secret Admin PIN

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === DEFAULT_PIN || pinInput === 'lp2026') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Multi-image form data
  const [formData, setFormData] = useState({
    name: '',
    category: 'camisetas',
    price: '',
    originalPrice: '',
    discountPercent: '',
    images: [] as string[],
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

  // File Upload Handler — adds to images array
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadProductImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      alert('Erro ao carregar a imagem. Tente novamente.');
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
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || formData.images.length === 0) {
      alert('Por favor, preencha o Nome, Preço e ao menos 1 Foto do produto.');
      return;
    }

    const priceNum = parseFloat(formData.price.replace(',', '.'));
    const origPriceNum = formData.originalPrice ? parseFloat(formData.originalPrice.replace(',', '.')) : undefined;
    const discountNum = formData.discountPercent ? parseInt(formData.discountPercent, 10) : undefined;
    const sizesArray = formData.sizes.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: formData.name,
        category: formData.category,
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercent: discountNum,
        images: formData.images,
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  PAINEL DE ADMINISTRAÇÃO
                </h2>
                <p className="text-xs text-yellow-400 font-semibold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  {isSupabaseConfigured ? '🟢 Conectado ao Supabase (Nuvem)' : '🟡 Banco Local (Base64/Storage)'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-zinc-800 hover:bg-yellow-400 text-zinc-300 hover:text-black rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* If NOT Authenticated: PIN Login Screen */}
          {!isAuthenticated ? (
            <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto w-full">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-yellow-400/40 text-yellow-400 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white uppercase">Acesso Restrito</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-6">
                Digite a senha para acessar o painel de produtos. (PIN: <code className="text-yellow-400 font-bold">1234</code>)
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <input
                  type="password"
                  required
                  placeholder="Digite o PIN de Acesso"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:border-yellow-400 focus:outline-none"
                />

                {authError && (
                  <p className="text-xs text-red-500 font-bold">PIN incorreto. Tente novamente.</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg"
                >
                  DESBLOQUEAR PAINEL
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated Admin Dashboard */
            <>
              {/* Navigation Tabs */}
              <div className="flex border-b border-zinc-800 bg-zinc-900/40">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    resetForm();
                    setActiveTab('add');
                  }}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
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
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
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
              <div className="p-6 overflow-y-auto flex-1">
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

                    {/* ============================== */}
                    {/* MULTI-IMAGE UPLOAD SECTION     */}
                    {/* ============================== */}
                    <div>
                      <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-2">
                        <ImagePlus className="w-4 h-4 inline mr-1 text-yellow-400" />
                        Fotos do Produto ({formData.images.length} adicionada{formData.images.length !== 1 ? 's' : ''}) *
                      </label>

                      {/* Image Previews Grid */}
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-3">
                          {formData.images.map((imgUrl, idx) => (
                            <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-700 aspect-square bg-zinc-950">
                              <img
                                src={imgUrl}
                                alt={`Foto ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remover foto"
                              >
                                ✕
                              </button>
                              <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-white font-bold px-1.5 py-0.5 rounded">
                                {idx === 0 ? 'CAPA' : `#${idx + 1}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add by URL */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2">
                        <div className="sm:col-span-8">
                          <input
                            type="text"
                            placeholder="Cole a URL de uma imagem aqui..."
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddImageUrl();
                              }
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
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
                          <label className="flex-1 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                            <Upload className="w-3.5 h-3.5 text-yellow-400" />
                            {uploadingImage ? '...' : 'Arquivo'}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-500">
                        A primeira foto será a capa do produto. Adicione várias fotos para criar uma galeria com swipe.
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
                      className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
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
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={prod.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'} alt={prod.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
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
                            onClick={() => startEdit(prod)}
                            className="p-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Excluir ${prod.name}?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="p-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
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
