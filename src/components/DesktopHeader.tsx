import React from 'react';
import { ShoppingCart, Search, MessageCircle, RotateCcw } from 'lucide-react';

interface DesktopHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onReplayVideo: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  onReplayVideo,
  activeSection,
  setActiveSection
}) => {
  const WHATSAPP_NUMBER = '554788498542';

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 shadow-2xl hidden md:block">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black text-xs font-extrabold py-1.5 px-4 text-center tracking-wide uppercase flex justify-center items-center gap-4">
        <span>⚡ FRETE GRÁTIS PARA BALNEÁRIO CAMBORIÚ E REGIÃO</span>
        <span>•</span>
        <span>🔥 PRODUTOS IMPORTADOS DE ALTÍSSIMA QUALIDADE</span>
        <span>•</span>
        <span>💬 ATENDIMENTO DIRETO NO WHATSAPP</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => {
            setActiveSection('inicio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative">
            <img
              src="/favicon.png"
              alt="LP Importados"
              className="w-12 h-12 rounded-full border border-yellow-400/60 object-cover shadow-[0_0_15px_rgba(250,204,21,0.4)] group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[9px] font-black text-black">
              ✓
            </div>
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight text-white group-hover:text-yellow-400 transition-colors">
              LP IMPORTADOS
            </h1>
            <p className="text-[10px] text-yellow-400 font-bold tracking-widest uppercase">
              MODA & EXCLUSIVIDADE
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar tênis, camisetas, bonés, perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-semibold text-zinc-300">
          <button
            onClick={() => {
              setActiveSection('inicio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`hover:text-yellow-400 transition-colors ${activeSection === 'inicio' ? 'text-yellow-400 font-bold' : ''}`}
          >
            Início
          </button>
          <button
            onClick={() => {
              setActiveSection('catalogo');
              document.getElementById('catalogo-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`hover:text-yellow-400 transition-colors ${activeSection === 'catalogo' ? 'text-yellow-400 font-bold' : ''}`}
          >
            Catálogo
          </button>
          <button
            onClick={() => {
              setActiveSection('contato');
              document.getElementById('contato-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`hover:text-yellow-400 transition-colors ${activeSection === 'contato' ? 'text-yellow-400 font-bold' : ''}`}
          >
            Contato
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Replay Video Intro */}
          <button
            onClick={onReplayVideo}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700 transition-all"
            title="Ver Vídeo de Apresentação"
          >
            <RotateCcw className="w-4 h-4 text-yellow-400" />
          </button>

          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20produtos%20da%20LP%20Importados`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg hover:shadow-emerald-900/40"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp</span>
          </a>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full transition-all hover:scale-105 shadow-[0_0_15px_rgba(250,204,21,0.4)]"
            title="Carrinho de Compras"
          >
            <ShoppingCart className="w-5 h-5 font-bold" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-yellow-400 border-2 border-yellow-400 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
