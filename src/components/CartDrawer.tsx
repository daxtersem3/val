import React, { useState } from 'react';
import { CartItem, CustomerOrderDetails } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingCart, MessageCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const WHATSAPP_NUMBER = '554788498542';

  const [customer, setCustomer] = useState<CustomerOrderDetails>({
    name: '',
    phone: '',
    address: '',
    neighborhood: 'Nova Esperança',
    city: 'Balneário Camboriú / SC',
    paymentMethod: 'PIX',
    notes: ''
  });

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim() || !customer.address.trim()) {
      alert('Por favor, preencha seu Nome e Endereço para continuar.');
      return;
    }

    const CATEGORIES_WITH_SIZES = ['camisetas', 'tenis', 'conjuntos'];

    let itemsList = '';
    cartItems.forEach((item, index) => {
      const itemTotal = (item.product.price * item.quantity).toFixed(2).replace('.', ',');
      const sizeLine = CATEGORIES_WITH_SIZES.includes(item.product.category)
        ? `\n   • Tamanho: ${item.selectedSize}`
        : '';
      itemsList += `\n${index + 1}. *${item.product.name}*${sizeLine}\n   • Quantidade: ${item.quantity}x\n   • Valor: R$ ${itemTotal}\n`;
    });

    const formattedTotal = totalAmount.toFixed(2).replace('.', ',');

    const message = `🔥🚀 *NOVO PEDIDO — LP IMPORTADOS* 🚀🔥
-----------------------------------
👤 *CLIENTE:* ${customer.name}
📱 *WHATSAPP:* ${customer.phone || 'Não informado'}
📍 *ENDEREÇO:* ${customer.address} - ${customer.neighborhood}, ${customer.city}
💳 *PAGAMENTO:* ${customer.paymentMethod}
-----------------------------------
📋 *PRODUTOS SELECIONADOS:*
${itemsList}
-----------------------------------
💰 *TOTAL DO PEDIDO:* R$ ${formattedTotal}
🚚 *ENTREGA:* A combinar / Entrega Rápida
${customer.notes ? `📝 *OBSERVAÇÕES:* ${customer.notes}\n` : ''}-----------------------------------
Aguardando confirmação e chave PIX para envio!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-lg bg-zinc-950 border-l border-zinc-800 h-full flex flex-col justify-between shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black">
                <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  {step === 'cart' ? 'Seu Carrinho' : 'Dados da Entrega'}
                </h2>
                <p className="text-xs text-yellow-400 font-semibold">
                  {cartItems.length} {cartItems.length === 1 ? 'item selecionado' : 'itens selecionados'}
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

          {/* Cart Content or Checkout Step */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingCart className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400 font-bold text-base uppercase">Seu carrinho está vazio</p>
                <p className="text-xs text-zinc-500 mt-1">Adicione produtos do catálogo para finalizar seu pedido.</p>
              </div>
            ) : step === 'cart' ? (
              /* Step 1: Items List */
              cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex gap-4 items-center justify-between"
                >
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-zinc-700/60"
                  />

                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.product.name}</h4>
                    {['camisetas', 'tenis', 'conjuntos'].includes(item.product.category) && (
                      <span className="inline-block mt-1 text-[10px] font-extrabold bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded-md">
                        Tamanho: {item.selectedSize}
                      </span>
                    )}
                    <div className="text-sm font-black text-yellow-400 mt-1">
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveItem(item.cartId)}
                      className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-950 overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, -1)}
                        className="px-2 py-0.5 text-zinc-400 hover:text-white font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-black text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, 1)}
                        className="px-2 py-0.5 text-zinc-400 hover:text-white font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Step 2: Customer Details Form */
              <form id="checkout-form" onSubmit={handleSendWhatsApp} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                    WhatsApp para Contato
                  </label>
                  <input
                    type="tel"
                    placeholder="(47) 99999-9999"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                    Endereço de Entrega (Rua, Nº, Apto) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rua José Honorato da Silva, 267"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={customer.neighborhood}
                      onChange={(e) => setCustomer({ ...customer, neighborhood: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                      Cidade / UF
                    </label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={customer.paymentMethod}
                    onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="PIX">⚡ PIX (Desconto & Envio Imediato)</option>
                    <option value="Cartão de Crédito/Débito">💳 Cartão de Crédito / Débito na Entrega</option>
                    <option value="Dinheiro na Entrega">💵 Dinheiro na Entrega</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">
                    Observações Adicionais
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Deixar na portaria ou troco para R$ 100"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Footer Actions */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-zinc-400">
                <span>Subtotal:</span>
                <span>R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                <span>Frete:</span>
                <span>A Combinar (Balneário Camboriú)</span>
              </div>

              <div className="flex justify-between items-center text-xl font-black text-yellow-400 pt-2 border-t border-zinc-800">
                <span>TOTAL:</span>
                <span>R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                >
                  <span>AVANÇAR PARA ENTREGA</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="px-4 py-4 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-2xl hover:bg-zinc-700 transition-colors"
                  >
                    VOLTAR
                  </button>
                  <button
                    form="checkout-form"
                    type="submit"
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/40"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>ENVIAR NO WHATSAPP</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
