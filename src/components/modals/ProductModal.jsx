import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { useCart } from '../../context/CartContext';
import { X, Plus, Minus, Star, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const ProductModal = () => {
  const { lang, t } = useTranslation();
  const { selectedProduct, setSelectedProduct, addToCart, cart, isWishlisted, toggleWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const inCartItem = cart.find(item => item.id === selectedProduct.id);
  const inCartCount = inCartItem ? inCartItem.quantity : 0;
  const liked = isWishlisted(selectedProduct.id);

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
        
        {/* Wishlist + Close Buttons */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(selectedProduct.id)}
            aria-pressed={liked}
            aria-label={liked ? (lang === 'uz' ? "Sevimlilardan olib tashlash" : "Убрать из избранного") : (lang === 'uz' ? "Sevimlilarga qo'shish" : "Добавить в избранное")}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              liked ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-slate-100 text-slate-500 hover:text-rose-500 hover:bg-rose-50'
            }`}
          >
            <Heart className={`w-4.5 h-4.5 ${liked ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={() => setSelectedProduct(null)}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Image on soft pedestal (trust badges now live
              as chips in the right column, so they're not duplicated) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 p-6 flex items-center justify-center border border-emerald-100/60">
              <img
                src={selectedProduct.image_url}
                alt={name}
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* Right Column: Title, Purchase & Details — all info shown
              directly (no tab-clicking) like the reference layout. */}
          <div className="md:col-span-7 flex flex-col space-y-4">

            <div className="space-y-1.5">
              {/* Eyebrow: the product's own benefit tagline, falling back
                  to dosage/form if it doesn't have one */}
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                {(lang === 'uz' ? selectedProduct.badge_uz : selectedProduct.badge_ru) || `${dosage} • ${form}`}
              </div>

              <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">
                {name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>({selectedProduct.rating}/5)</span>
                <span className="text-slate-400 font-normal">{selectedProduct.reviews_count} {t('reviews_count')}</span>
              </div>
            </div>

            {/* Price + Quantity + Add to Cart, grouped together up top */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                  {Number(selectedProduct.price).toLocaleString()} {t('currency')}
                </span>
                {selectedProduct.old_price && (
                  <span className="text-sm text-slate-400 line-through">
                    {Number(selectedProduct.old_price).toLocaleString()} {t('currency')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center border border-slate-200 rounded-2xl p-1 bg-white shrink-0">
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

            {/* Trust chips — only claims we can actually stand behind
                site-wide (GMP/ISO, in-stock); no fabricated certifications. */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                GMP / ISO
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'uz' ? "100% Original" : "100% Оригинал"}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                selectedProduct.in_stock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {selectedProduct.in_stock ? t('in_stock') : t('out_of_stock')}
              </span>
            </div>

            {/* Description + structured sections — always shown, nothing
                hidden behind a tab click. */}
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 max-h-64 overflow-y-auto pr-1 border-t border-slate-100 pt-4">
              <p className="text-slate-700 font-medium">{desc}</p>

              {composition && (
                <div>
                  <strong className="block text-slate-900 mb-1">{t('modal_composition')}:</strong>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-xs">
                    {composition}
                  </p>
                </div>
              )}

              {indications && (
                <div>
                  <strong className="block text-slate-900 mb-1">
                    {lang === 'uz' ? "Qo'llanilishi bo'yicha tavsiyalar:" : "Рекомендации к применению:"}
                  </strong>
                  <p>{indications}</p>
                </div>
              )}

              {usage && (
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-emerald-950">
                  <strong className="block mb-1">{t('modal_usage')}:</strong>
                  <p>{usage}</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
