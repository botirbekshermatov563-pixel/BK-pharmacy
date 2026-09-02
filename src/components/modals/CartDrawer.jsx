import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useCart } from '../../context/CartContext';
import { db } from '../../services/db';
import { X, Plus, Minus, Trash2, Send, ShoppingBag, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

export const CartDrawer = () => {
  const { lang, t } = useTranslation();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartTotal, 
    cartCount,
    isFreeDelivery,
    freeDeliveryRemaining
  } = useCart();

  const [step, setStep] = useState('cart'); // 'cart', 'checkout', 'success'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Ташкент',
    address: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedCheckout = () => {
    setStep('checkout');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert(lang === 'uz' ? "Iltimos, ismingiz va telefon raqamingizni kiriting" : "Пожалуйста, укажите имя и телефон");
      return;
    }

    setSubmitting(true);

    // 1. Save order to database (Supabase or LocalStorage)
    const orderItems = cart.map(item => ({
      id: item.id,
      name_ru: item.name_ru,
      name_uz: item.name_uz,
      dosage: item.dosage_ru,
      price: item.price,
      quantity: item.quantity,
      sum: item.price * item.quantity
    }));

    try {
      await db.createOrder({
        customer_name: formData.name,
        customer_phone: formData.phone,
        delivery_city: formData.city,
        delivery_address: formData.address,
        notes: formData.notes,
        total_amount: cartTotal,
        items: orderItems
      });
    } catch (err) {
      console.warn('Order save error:', err);
    }

    // 2. Format Telegram message for Director Botirbek Baxtiyarovich
    const title = lang === 'uz'
      ? `💊 *Yangi buyurtma — BK Pharmacy:*\n\n`
      : `💊 *Новый заказ — BK Pharmacy:*\n\n`;

    let itemsText = "";
    cart.forEach((item, index) => {
      const name = lang === 'uz' ? item.name_uz : item.name_ru;
      const dosage = lang === 'uz' ? item.dosage_uz : item.dosage_ru;
      itemsText += `${index + 1}. *${name}* (${dosage})\n   ${item.quantity} dona x ${Number(item.price).toLocaleString()} = ${Number(item.price * item.quantity).toLocaleString()} ${t('currency')}\n`;
    });

    const totalText = `\n💰 *${t('cart_total')}:* ${Number(cartTotal).toLocaleString()} ${t('currency')}\n`;
    const clientInfo = `\n👤 *${lang === 'uz' ? "Mijoz" : "Покупатель"}:* ${formData.name}\n📞 *${lang === 'uz' ? "Telefon" : "Телефон"}:* ${formData.phone}\n📍 *${lang === 'uz' ? "Manzil" : "Адрес"}:* ${formData.city}, ${formData.address || 'Yetkazib berishda aniqlanadi'}\n${formData.notes ? `📝 *${lang === 'uz' ? "Izoh" : "Комментарий"}:* ${formData.notes}\n` : ''}`;

    const fullMessage = encodeURIComponent(title + itemsText + totalText + clientInfo);

    // Direct Telegram link
    const telegramUrl = `https://t.me/Botirbek_Baxtiyarovich?text=${fullMessage}`;

    // Open Telegram in new tab
    window.open(telegramUrl, '_blank');

    setSubmitting(false);
    setStep('success');
    clearCart();
  };

  const handleClose = () => {
    setIsCartOpen(false);
    // Reset step after closing
    setTimeout(() => {
      setStep('cart');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                {step === 'cart' ? t('cart_title') : step === 'checkout' ? t('checkout_title') : t('order_success_title')}
              </h3>
              <span className="text-xs text-slate-500">
                {cartCount} {lang === 'uz' ? 'ta preparat' : 'товаров'}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Bar (only in cart & checkout steps) */}
        {step !== 'success' && cart.length > 0 && (
          <div className="p-4 bg-emerald-50/80 border-b border-emerald-100 text-xs">
            <div className="flex items-center justify-between font-semibold text-emerald-800 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>
                  {isFreeDelivery 
                    ? t('cart_free_delivery_active') 
                    : t('cart_free_delivery_progress', { amount: freeDeliveryRemaining.toLocaleString() })}
                </span>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-emerald-200 overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (cartTotal / 150000) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#fbfdfc] border border-slate-200/80 flex items-center justify-between gap-3 group"
                    >
                      <img
                        src={item.image_url}
                        alt={lang === 'uz' ? item.name_uz : item.name_ru}
                        className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-slate-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {lang === 'uz' ? item.name_uz : item.name_ru}
                        </h4>
                        <div className="text-[11px] text-emerald-700 font-semibold truncate">
                          {lang === 'uz' ? item.dosage_uz : item.dosage_ru}
                        </div>
                        <div className="text-xs font-black text-slate-900 font-display mt-1">
                          {Number(item.price).toLocaleString()} {t('currency')}
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900 font-display">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title={t('admin_delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-500 hover:text-rose-700 font-medium py-1 transition-colors"
                  >
                    {t('cart_btn_clear')}
                  </button>
                </div>
              ) : (
                /* Empty Cart */
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 font-display">
                    {t('cart_empty_title')}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    {t('cart_empty_desc')}
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    {t('hero_btn_catalog')}
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('checkout_desc')}
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('field_name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('field_name_placeholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('field_phone')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('field_city')}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Ташкент"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('field_address')}
                </label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={t('field_address_placeholder')}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('field_notes')}
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={t('field_notes_placeholder')}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('btn_submit_order')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-full mt-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  ← {lang === 'uz' ? "Savatga qaytish" : "Назад в корзину"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 font-display">
                {t('order_success_title')}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs leading-relaxed">
                {t('order_success_desc')}
              </p>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div>Директор: <strong>Шерматов Ботир Бахтиярович</strong></div>
                <div>Telegram: <strong className="text-emerald-700">@Botirbek_Baxtiyarovich</strong></div>
              </div>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
              >
                {lang === 'uz' ? "Katalogga qaytish" : "Продолжить покупки"}
              </button>
            </div>
          )}

        </div>

        {/* Footer Summary (Cart Step) */}
        {step === 'cart' && cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('cart_subtotal')}</span>
                <span className="font-bold text-slate-800">
                  {Number(cartTotal).toLocaleString()} {t('currency')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart_delivery')}</span>
                <span className={`font-bold ${isFreeDelivery ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {isFreeDelivery ? t('cart_delivery_free') : `25 000 ${t('currency')}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200 font-display">
                <span>{t('cart_total')}</span>
                <span>
                  {Number(cartTotal + (isFreeDelivery ? 0 : 25000)).toLocaleString()} {t('currency')}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('cart_btn_checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
