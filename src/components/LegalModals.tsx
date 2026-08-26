import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, Lock, Eye, Database, Phone, MapPin, RefreshCw, Scale } from 'lucide-react';

interface LegalModalsProps {
  activeModal: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-3xl max-h-[85vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black">
                {activeModal === 'privacy' ? <Lock className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-tight">
                  {activeModal === 'privacy' ? 'Política de Privacidade' : 'Termos e Condições de Uso'}
                </h2>
                <p className="text-[10px] text-yellow-400 font-bold">LP IMPORTADOS — Última atualização: Agosto 2026</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-zinc-800 hover:bg-yellow-400 text-zinc-300 hover:text-black rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-300 text-sm leading-relaxed legal-scroll">
            {activeModal === 'privacy' ? <PrivacyContent /> : <TermsContent />}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02]"
            >
              ENTENDIDO — FECHAR
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ============================== */
/* PRIVACY POLICY CONTENT         */
/* ============================== */
const PrivacyContent: React.FC = () => (
  <>
    <SectionBlock
      icon={<Shield className="w-4 h-4 text-yellow-400" />}
      title="1. Introdução"
    >
      <p>
        A <strong>LP Importados</strong> ("nós", "nosso" ou "empresa"), com sede em Balneário Camboriú/SC, 
        valoriza a privacidade dos seus clientes e visitantes. Esta Política de Privacidade descreve como 
        coletamos, utilizamos, armazenamos e protegemos suas informações pessoais quando você acessa nosso 
        site, realiza compras ou interage conosco através do WhatsApp e redes sociais.
      </p>
      <p>
        Esta política está em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong> do Brasil 
        e com o <strong>Marco Civil da Internet (Lei nº 12.965/2014)</strong>.
      </p>
    </SectionBlock>

    <SectionBlock
      icon={<Database className="w-4 h-4 text-yellow-400" />}
      title="2. Dados que Coletamos"
    >
      <p>Podemos coletar os seguintes tipos de informações:</p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
        <li><strong>Dados de identificação:</strong> Nome completo, número de telefone/WhatsApp</li>
        <li><strong>Dados de entrega:</strong> Endereço completo (rua, número, bairro, cidade, CEP)</li>
        <li><strong>Dados de navegação:</strong> Páginas visitadas, tempo de permanência, dispositivo utilizado, endereço IP (via Google Analytics)</li>
        <li><strong>Dados de compra:</strong> Produtos selecionados, tamanhos, quantidades, forma de pagamento preferida</li>
        <li><strong>Cookies e tecnologias similares:</strong> Dados armazenados localmente no seu navegador para funcionamento do carrinho e preferências</li>
      </ul>
    </SectionBlock>

    <SectionBlock
      icon={<Eye className="w-4 h-4 text-yellow-400" />}
      title="3. Como Utilizamos seus Dados"
    >
      <p>Utilizamos seus dados pessoais para as seguintes finalidades:</p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
        <li>Processar e entregar seus pedidos</li>
        <li>Entrar em contato via WhatsApp para confirmação de pedidos e atualizações de entrega</li>
        <li>Melhorar a experiência de navegação e personalização do site</li>
        <li>Analisar o desempenho do site e comportamento do usuário (Google Analytics)</li>
        <li>Enviar promoções e novidades (somente com seu consentimento)</li>
        <li>Cumprir obrigações legais e regulatórias</li>
      </ul>
    </SectionBlock>

    <SectionBlock
      icon={<Lock className="w-4 h-4 text-yellow-400" />}
      title="4. Cookies e Google Analytics"
    >
      <p>
        Nosso site utiliza <strong>cookies essenciais</strong> para o funcionamento do carrinho de compras e 
        preferências de navegação, além de <strong>cookies analíticos</strong> fornecidos pelo Google Analytics 
        para entender como os visitantes usam o site.
      </p>
      <p>Os cookies utilizados incluem:</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse mt-2">
          <thead>
            <tr className="bg-zinc-900 text-yellow-400 font-black uppercase">
              <th className="p-2 border border-zinc-800 text-left">Cookie</th>
              <th className="p-2 border border-zinc-800 text-left">Tipo</th>
              <th className="p-2 border border-zinc-800 text-left">Finalidade</th>
              <th className="p-2 border border-zinc-800 text-left">Duração</th>
            </tr>
          </thead>
          <tbody className="text-zinc-400">
            <tr>
              <td className="p-2 border border-zinc-800">lp_cookie_consent</td>
              <td className="p-2 border border-zinc-800">Essencial</td>
              <td className="p-2 border border-zinc-800">Armazena sua preferência de cookies</td>
              <td className="p-2 border border-zinc-800">Permanente</td>
            </tr>
            <tr>
              <td className="p-2 border border-zinc-800">lp_importados_cart</td>
              <td className="p-2 border border-zinc-800">Essencial</td>
              <td className="p-2 border border-zinc-800">Salva itens do carrinho de compras</td>
              <td className="p-2 border border-zinc-800">Permanente</td>
            </tr>
            <tr>
              <td className="p-2 border border-zinc-800">lp_importados_products</td>
              <td className="p-2 border border-zinc-800">Essencial</td>
              <td className="p-2 border border-zinc-800">Cache local de produtos</td>
              <td className="p-2 border border-zinc-800">Permanente</td>
            </tr>
            <tr>
              <td className="p-2 border border-zinc-800">_ga, _gid</td>
              <td className="p-2 border border-zinc-800">Analítico</td>
              <td className="p-2 border border-zinc-800">Google Analytics — identificação de visitantes</td>
              <td className="p-2 border border-zinc-800">2 anos / 24h</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2">
        Você pode desativar cookies analíticos e de marketing a qualquer momento através do banner de cookies 
        ou nas configurações do seu navegador.
      </p>
    </SectionBlock>

    <SectionBlock
      icon={<Shield className="w-4 h-4 text-yellow-400" />}
      title="5. Compartilhamento de Dados"
    >
      <p>Seus dados pessoais <strong>não são vendidos</strong> a terceiros. Podemos compartilhar dados com:</p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
        <li><strong>Google Analytics:</strong> Dados anonimizados de navegação para análise de tráfego</li>
        <li><strong>WhatsApp / Meta:</strong> Quando você nos contata ou finaliza um pedido</li>
        <li><strong>Serviço de entrega:</strong> Endereço para envio do pedido</li>
        <li><strong>Autoridades competentes:</strong> Quando exigido por lei</li>
      </ul>
    </SectionBlock>

    <SectionBlock
      icon={<RefreshCw className="w-4 h-4 text-yellow-400" />}
      title="6. Seus Direitos (LGPD)"
    >
      <p>De acordo com a LGPD, você tem direito a:</p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
        <li>Confirmar a existência de tratamento dos seus dados</li>
        <li>Acessar, corrigir ou solicitar a exclusão dos seus dados pessoais</li>
        <li>Solicitar a portabilidade dos seus dados</li>
        <li>Revogar o consentimento a qualquer momento</li>
        <li>Solicitar informações sobre compartilhamento com terceiros</li>
      </ul>
      <p className="mt-2">
        Para exercer esses direitos, entre em contato conosco pelo WhatsApp: <strong>+55 (47) 8849-8542</strong> 
        ou pelo Instagram <strong>@lpimportadossss</strong>.
      </p>
    </SectionBlock>

    <SectionBlock
      icon={<Phone className="w-4 h-4 text-yellow-400" />}
      title="7. Contato do Encarregado de Dados (DPO)"
    >
      <p>
        Para questões relacionadas à privacidade e proteção de dados, entre em contato com nosso responsável:
      </p>
      <ul className="text-zinc-400 text-xs space-y-1 mt-2">
        <li><strong>Empresa:</strong> LP Importados</li>
        <li><strong>Endereço:</strong> Rua José Honorato da Silva, 267 — Nova Esperança, Balneário Camboriú/SC, CEP: 88336-070</li>
        <li><strong>WhatsApp:</strong> +55 (47) 8849-8542</li>
        <li><strong>Instagram:</strong> @lpimportadossss</li>
      </ul>
    </SectionBlock>
  </>
);

/* ============================== */
/* TERMS & CONDITIONS CONTENT     */
/* ============================== */
const TermsContent: React.FC = () => (
  <>
    <SectionBlock
      icon={<FileText className="w-4 h-4 text-yellow-400" />}
      title="1. Aceitação dos Termos"
    >
      <p>
        Ao acessar e utilizar o site da <strong>LP Importados</strong> (doravante "Site"), você declara que leu, 
        compreendeu e concorda com estes Termos e Condições de Uso. Caso não concorde com qualquer 
        disposição, recomendamos que não utilize nossos serviços.
      </p>
    </SectionBlock>

    <SectionBlock
      icon={<Shield className="w-4 h-4 text-yellow-400" />}
      title="2. Sobre a LP Importados"
    >
      <p>
        A LP Importados é uma loja especializada em roupas, tênis, perfumes e acessórios importados, 
        localizada em Balneário Camboriú/SC. Operamos através deste Site e atendimento direto via WhatsApp, 
        oferecendo produtos selecionados de marcas internacionais como Nike, Jordan, Gucci, Trapstar e outras.
      </p>
    </SectionBlock>

    <SectionBlock
      icon={<Database className="w-4 h-4 text-yellow-400" />}
      title="3. Produtos e Preços"
    >
      <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
        <li>Todos os produtos exibidos estão sujeitos à disponibilidade de estoque</li>
        <li>Os preços são expressos em <strong>Reais (R$)</strong> e podem ser alterados sem aviso prévio</li>
        <li>As imagens dos produtos são meramente ilustrativas e podem apresentar variações de cor conforme a tela do dispositivo</li>
        <li>Promoções e descontos possuem prazo determinado e são válidos enquanto durarem os estoques</li>
        <li>A LP Importados reserva-se o direito de corrigir eventuais erros de preços ou informações</li>
      </ul>
    </SectionBlock>

    <SectionBlock
      icon={<Phone className="w-4 h-4 text-yellow-400" />}
      title="4. Processo de Compra"
    >
      <p>O processo de compra na LP Importados funciona da seguinte forma:</p>
      <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 text-xs">
        <li>Selecione os produtos desejados e adicione ao carrinho</li>
        <li>Preencha seus dados de entrega no checkout</li>
        <li>O pedido será enviado automaticamente ao nosso WhatsApp</li>
        <li>Nossa equipe confirmará a disponibilidade, valor final e forma de pagamento</li>
        <li>Após confirmação do pagamento, o pedido será preparado para envio</li>
      </ol>
      <p className="mt-2">
        <strong>Importante:</strong> A adição de produtos ao carrinho não garante reserva de estoque. 
        A compra só é considerada efetivada após confirmação e pagamento via WhatsApp.
      </p>
    </SectionBlock>

    <SectionBlock
      icon={<Lock className="w-4 h-4 text-yellow-400" />}
      title="5. Formas de Pagamento"
    >
      <p>Aceitamos as seguintes formas de pagamento:</p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
        <li><strong>PIX:</strong> Pagamento instantâneo com confirmação imediata (recomendado)</li>
        <li><strong>Cartão de Crédito/Débito:</strong> Na entrega, através de maquininha</li>
        <li><strong>Dinheiro:</strong> Na entrega (troco sujeito a disponibilidade)</li>
      </ul>
    </SectionBlock>

    <SectionBlock
      icon={<MapPin className="w-4 h-4 text-yellow-400" />}
      title="6. Entrega"
    >
      <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
        <li>Entregas em <strong>Balneário Camboriú e região</strong> são realizadas via motoboy, geralmente no mesmo dia ou dia seguinte</li>
        <li>O prazo e valor do frete serão informados no momento da confirmação do pedido via WhatsApp</li>
        <li>A LP Importados não se responsabiliza por atrasos causados por fatores externos (trânsito, clima, etc.)</li>
        <li>O destinatário deve estar disponível para receber o produto no endereço informado</li>
      </ul>
    </SectionBlock>

    <SectionBlock
      icon={<RefreshCw className="w-4 h-4 text-yellow-400" />}
      title="7. Trocas e Devoluções"
    >
      <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
        <li>Trocas podem ser solicitadas em até <strong>7 (sete) dias</strong> após o recebimento do produto, conforme o Código de Defesa do Consumidor</li>
        <li>O produto deve estar em perfeitas condições, sem uso, com etiquetas e embalagem original</li>
        <li>Solicitações de troca ou devolução devem ser feitas pelo WhatsApp: +55 (47) 8849-8542</li>
        <li>O custo do envio para troca poderá ser de responsabilidade do cliente, exceto em casos de defeito ou erro da loja</li>
        <li>Perfumes e itens de uso pessoal não são elegíveis para troca, exceto em caso de defeito de fabricação</li>
      </ul>
    </SectionBlock>

    <SectionBlock
      icon={<Shield className="w-4 h-4 text-yellow-400" />}
      title="8. Propriedade Intelectual"
    >
      <p>
        Todo o conteúdo deste Site — incluindo textos, imagens, logotipos, layout, design e código-fonte — 
        é de propriedade exclusiva da LP Importados ou licenciado para uso. É proibida a reprodução, 
        distribuição ou modificação sem autorização prévia por escrito.
      </p>
      <p>
        As marcas de terceiros (Nike, Jordan, Gucci, Trapstar, etc.) mencionadas são de propriedade de seus 
        respectivos titulares e são utilizadas apenas para fins de identificação dos produtos comercializados.
      </p>
    </SectionBlock>

    <SectionBlock
      icon={<Scale className="w-4 h-4 text-yellow-400" />}
      title="9. Limitação de Responsabilidade"
    >
      <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
        <li>A LP Importados não se responsabiliza por indisponibilidade temporária do Site</li>
        <li>Não garantimos que o Site estará livre de erros, vírus ou interrupções</li>
        <li>O uso do Site é por sua conta e risco</li>
        <li>Não nos responsabilizamos por danos indiretos decorrentes do uso do Site</li>
      </ul>
    </SectionBlock>

    <SectionBlock
      icon={<FileText className="w-4 h-4 text-yellow-400" />}
      title="10. Legislação Aplicável"
    >
      <p>
        Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer litígio será submetido 
        ao foro da comarca de <strong>Balneário Camboriú/SC</strong>, com exclusão de qualquer outro, 
        por mais privilegiado que seja.
      </p>
    </SectionBlock>

    <SectionBlock
      icon={<Phone className="w-4 h-4 text-yellow-400" />}
      title="11. Contato"
    >
      <p>Em caso de dúvidas sobre estes Termos, entre em contato:</p>
      <ul className="text-zinc-400 text-xs space-y-1 mt-2">
        <li><strong>LP Importados</strong></li>
        <li>Rua José Honorato da Silva, 267 — Nova Esperança, Balneário Camboriú/SC</li>
        <li>CEP: 88336-070</li>
        <li>WhatsApp: +55 (47) 8849-8542</li>
        <li>Instagram: @lpimportadossss</li>
      </ul>
    </SectionBlock>
  </>
);

/* ============================== */
/* REUSABLE SECTION BLOCK         */
/* ============================== */
interface SectionBlockProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const SectionBlock: React.FC<SectionBlockProps> = ({ icon, title, children }) => (
  <div>
    <h3 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-wide mb-2">
      {icon}
      {title}
    </h3>
    <div className="space-y-2 text-xs text-zinc-400 leading-relaxed pl-6">
      {children}
    </div>
  </div>
);
