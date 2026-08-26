import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, Heart, Sparkles, AtSign, FileText, Lock } from 'lucide-react';

interface FooterContactProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const FooterContact: React.FC<FooterContactProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const WHATSAPP_NUMBER = '554788498542';

  return (
    <footer id="contato-section" className="bg-zinc-950 border-t border-zinc-800 text-white pt-16 pb-24 md:pb-16 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="LP Importados"
              className="w-12 h-12 rounded-full border border-yellow-400/60 object-cover shadow-[0_0_15px_rgba(250,204,21,0.4)]"
            />
            <div>
              <h3 className="font-black text-xl tracking-tight text-white">LP IMPORTADOS</h3>
              <p className="text-[10px] text-yellow-400 font-bold tracking-widest uppercase">
                MODA & EXCLUSIVIDADE
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Sua referência em peças importadas selecionadas a dedo. Qualidade premium, caimento impecável e atendimento exclusivo em Balneário Camboriú / SC.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://www.instagram.com/lpimportadossss?igsi=MXZvaGY1NXJlcnNmeA=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-zinc-900 hover:bg-yellow-400 hover:text-black border border-zinc-800 text-yellow-400 rounded-full transition-all"
              title="Instagram @lpimportadossss"
            >
              <AtSign className="w-5 h-5" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all shadow-lg shadow-emerald-900/40"
              title="Falar no WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
            </a>
          </div>
        </div>

        {/* Col 2: Contato Details (As requested by user) */}
        <div>
          <h4 className="font-black text-sm uppercase tracking-wider text-yellow-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> CONTATO
          </h4>
          <ul className="space-y-3.5 text-xs text-zinc-300">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-white block">Endereço da Loja:</span>
                <a
                  href="https://maps.google.com/?q=Rua+Jos%C3%A9+Honorato+da+Silva,+267+-+Nova+Esperan%C3%A7a,+Balne%C3%A1rio+Cambori%C3%BA+-+SC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-yellow-400 transition-colors leading-relaxed block"
                >
                  Rua José Honorato da Silva, 267<br />
                  Nova Esperança — Balneário Camboriú / SC<br />
                  <span className="text-[11px] text-zinc-400">CEP: 88336-070</span>
                </a>
              </div>
            </li>

            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <span className="font-extrabold text-white block">WhatsApp Vendas:</span>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 underline decoration-yellow-400/40 font-semibold"
                >
                  +55 (47) 8849-8542
                </a>
              </div>
            </li>

            <li className="flex items-center gap-3">
              <AtSign className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <span className="font-extrabold text-white block">Instagram Oficial:</span>
                <a
                  href="https://www.instagram.com/lpimportadossss?igsi=MXZvaGY1NXJlcnNmeA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 underline decoration-yellow-400/40 font-semibold"
                >
                  @lpimportadossss
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Col 3: Horários & Entregas */}
        <div>
          <h4 className="font-black text-sm uppercase tracking-wider text-yellow-400 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> ATENDIMENTO
          </h4>
          <div className="space-y-2 text-xs text-zinc-300">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <p className="font-bold text-white">Segunda a Sábado:</p>
              <p className="text-zinc-400">09:00 às 20:00h</p>
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <p className="font-bold text-white">Balneário Camboriú & Região:</p>
              <p className="text-emerald-400 font-bold">Entrega no mesmo dia via Motoboy 🚀</p>
            </div>
          </div>
        </div>

        {/* Col 4: Garantia & Selos */}
        <div>
          <h4 className="font-black text-sm uppercase tracking-wider text-yellow-400 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> COMPRA 100% SEGURA
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Todos os produtos são conferidos antes do envio. Pagamento via PIX com confirmação imediata.
          </p>
          <div className="p-4 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-yellow-500/30 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black">
              ✓
            </div>
            <div>
              <p className="text-xs font-black text-white">QUALIDADE GARANTIDA</p>
              <p className="text-[10px] text-yellow-400 font-bold">LP IMPORTADOS BALNEÁRIO</p>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-zinc-800/80 text-xs text-zinc-500">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 LP Importados. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> para Balneário Camboriú/SC
            <a href="#admin" className="ml-2 text-zinc-700 hover:text-zinc-500 text-[10px]" title="Área Restrita">
              🔐 Admin
            </a>
          </p>
        </div>
        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 pb-2">
          <button
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-yellow-400 transition-colors font-semibold"
          >
            <Lock className="w-3 h-3" />
            Política de Privacidade
          </button>
          <span className="text-zinc-700">•</span>
          <button
            onClick={onOpenTerms}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-yellow-400 transition-colors font-semibold"
          >
            <FileText className="w-3 h-3" />
            Termos e Condições
          </button>
        </div>
      </div>
    </footer>
  );
};
