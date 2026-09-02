import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { useCart } from '../../context/CartContext';
import { X, Plus, Minus, Check, Star, ShieldCheck, FileText, Pill, AlertCircle } from 'lucide-react';

export const ProductModal = () => {
  const { lang, t } = useTranslation();
  const { selectedProduct, setSelectedProduct, addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc', 'composition', 'usage'

  useEffect(() => {
    setQuantity(1);
    setActiveTab('desc');
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const inCartItem = cart.find(item => item.id === selectedProduct.id);
  const inCartCount = inCartItem ? inCartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  const name = lang === 'uz' ? selectedProduct.name_uz : selectedProduct.name_ru;
  const dosage = lang === 'uz' ? selectedProduct.dosage_uz : selectedProduct.dosage_ru;
  const form = lang === 'uz' ? selectedProduct.form_uz : selectedProduct.form_ru;
  const desc = lang === 'uz' ? selectedProduct.description_uz : selectedProduct.description_ru;
  const composition = lang === 'uz' ? selectedProduct.composition_uz : selectedProduct.composition_ru;
  const indications = lang === 'uz' ? selectedProduct.indications_uz : selectedProduct.indications_ru;
  const usage = lang === 'uz' ? selectedProduct.usage_uz : selectedProduct.usage_ru;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Image on soft pedestal */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 p-6 flex items-center justify-center border border-emerald-100/60">
              <img
                src={selectedProduct.image_url}
                alt={name}
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
            </div>

            {/* In stock and trust badges */}
            <div className="w-full mt-4 flex items-center justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{selectedProduct.in_stock ? t('in_stock') : t('out_of_stock')}</span>
              </span>
              <span className="text-slate-500 font-normal">
                GMP / ISO
              </span>
            </div>
          </div>

          {/* Right Column: Title, Details, Tabs & Actions */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  {dosage}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">
                  {form}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">
                {name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{selectedProduct.rating}</span>
                <span className="text-slate-400 font-normal">({selectedProduct.reviews_count} {t('reviews_count')})</span>
              </div>

              {/* Price Row */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                  {Number(selectedProduct.price).toLocaleString()} {t('currency')}
                </span>
                {selectedProduct.old_price && (
                  <span className="text-sm text-slate-400 line-through">
                    {Number(selectedProduct.old_price).toLocaleString()} {t('currency')}
                  </span>
                )}
              </div>
            </div>

            {/* Content Tabs */}
            <div className="pt-2">
              <div className="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-500">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === 'desc'
                      ? 'border-b-2 border-emerald-600 text-emerald-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {lang === 'uz' ? "Qo'llanilishi" : "Показания"}
                </button>
                <button
                  onClick={() => setActiveTab('composition')}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === 'composition'
                      ? 'border-b-2 border-emerald-600 text-emerald-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {t('modal_composition')}
                </button>
                <button
                  onClick={() => setActiveTab('usage')}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === 'usage'
                      ? 'border-b-2 border-emerald-600 text-emerald-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {lang === 'uz' ? "Qabul qilish tartibi" : "Инструкция"}
                </button>
              </div>

              {/* Tab Body */}
              <div className="py-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-36 overflow-y-auto pr-1">
                {activeTab === 'desc' && (
                  <div className="space-y-2">
                    <p className="text-slate-700 font-medium">{desc}</p>
                    {indications && (
                      <div className="mt-2 text-xs text-slate-500">
                        <strong className="text-slate-800">{t('modal_indications')}</strong> {indications}
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'composition' && (
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-xs">
                    {composition || (lang === 'uz' ? "Tarkib bo'yicha ma'lumot qadoqda keltirilgan." : "Информация о составе указана на заводской упаковке.")}
                  </p>
                )}
                {activeTab === 'usage' && (
                  <div className="space-y-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-emerald-950 text-xs">
                    <p><strong>{t('modal_usage')}</strong></p>
                    <p>{usage || (lang === 'uz' ? "Shifokor tavsiyasiga ko'ra qo'llanilsin." : "Применять по назначению врача или согласно вложенной инструкции.")}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stepper & Add to Cart */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-200 rounded-2xl p-1 bg-slate-50">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 shadow-2xs transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-900 font-display">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {t('btn_add_to_cart')} ({Number(selectedProduct.price * quantity).toLocaleString()} {t('currency')})
                </span>
              </button>
            </div>

            {inCartCount > 0 && (
              <div className="text-center text-xs font-semibold text-emerald-700">
                ✓ {lang === 'uz' ? `Savatingizda allaqachon: ${inCartCount} dona` : `Уже в корзине: ${inCartCount} шт.`}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
