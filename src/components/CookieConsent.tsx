import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, Shield, ChevronDown, ChevronUp, X } from 'lucide-react';

interface CookieConsentProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lp_cookie_consent');
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('lp_cookie_consent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      acceptedAt: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('lp_cookie_consent', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      acceptedAt: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="fixed bottom-0 left-0 right-0 z-[90] p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-[0_-10px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden">
          
          {/* Main Banner */}
          <div className="p-5 md:p-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-yellow-400" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-sm font-black text-white uppercase tracking-wide mb-1.5">
                  🍪 Utilizamos Cookies
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  A LP Importados utiliza cookies e tecnologias semelhantes para melhorar sua experiência de navegação, 
                  personalizar conteúdo, analisar tráfego e fornecer funcionalidades de redes sociais. 
                  Ao continuar navegando, você concorda com nossa{' '}
                  <button onClick={onOpenPrivacy} className="text-yellow-400 hover:underline font-bold">
                    Política de Privacidade
                  </button>{' '}
                  e{' '}
                  <button onClick={onOpenTerms} className="text-yellow-400 hover:underline font-bold">
                    Termos de Uso
                  </button>.
                </p>

                {/* Expand Details Toggle */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-2 text-[11px] text-zinc-500 hover:text-yellow-400 font-bold flex items-center gap-1 transition-colors"
                >
                  {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {showDetails ? 'Ocultar detalhes' : 'Ver detalhes dos cookies'}
                </button>
              </div>

              {/* Close (only dismiss, doesn't save consent) */}
              <button
                onClick={() => setIsVisible(false)}
                className="shrink-0 p-1.5 text-zinc-600 hover:text-zinc-400 transition-colors"
                title="Fechar (sem salvar preferência)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Essential */}
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-black text-white uppercase">Essenciais</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                          Sempre ativos
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">
                        Necessários para o funcionamento do site: carrinho, navegação e preferências.
                      </p>
                    </div>

                    {/* Analytics */}
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-black text-white uppercase">Analíticos</span>
                        <span className="text-[9px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded-full">
                          Google Analytics
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">
                        Nos ajudam a entender como você usa o site para melhorar produtos e serviços.
                      </p>
                    </div>

                    {/* Marketing */}
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-black text-white uppercase">Marketing</span>
                        <span className="text-[9px] bg-purple-500/20 text-purple-400 font-bold px-2 py-0.5 rounded-full">
                          Opcional
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">
                        Utilizados para exibir anúncios relevantes e medir campanhas publicitárias.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-yellow-500/20"
              >
                <Shield className="w-4 h-4" />
                ACEITAR TODOS OS COOKIES
              </button>
              <button
                onClick={handleAcceptEssential}
                className="py-3 px-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-700 transition-all"
              >
                SOMENTE ESSENCIAIS
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
