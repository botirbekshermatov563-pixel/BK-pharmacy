import React from 'react';
import { useTranslation } from '../../i18n';
import { useCart } from '../../context/CartContext';
import { Plus, Check, Star, ShieldCheck, Eye } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { lang, t } = useTranslation();
  const { cart, addToCart, setSelectedProduct } = useCart();

  const cartItem = cart.find(item => item.id === product.id);
  const inCartCount = cartItem ? cartItem.quantity : 0;

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'bestseller':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'natural':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'premium':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'kids':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const badgeText = lang === 'uz' ? product.badge_uz : product.badge_ru;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between product-card-hover group relative overflow-hidden">
      
      <div>
        {/* Top bar: Badge & Rating */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {badgeText ? (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getBadgeStyle(product.badge_type)}`}>
              {badgeText}
            </span>
          ) : <span />}

          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-300 font-normal">({product.reviews_count})</span>
          </div>
        </div>

        {/* Product Image on soft pedestal */}
        <div 
          onClick={() => setSelectedProduct(product)}
          className="w-full h-44 sm:h-48 rounded-xl bg-gradient-to-b from-slate-50 to-[#f3f9f5] flex items-center justify-center p-3 cursor-pointer relative overflow-hidden group-hover:bg-emerald-50/40 transition-colors"
        >
          <img
            src={product.image_url}
            alt={lang === 'uz' ? product.name_uz : product.name_ru}
            className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-106 transition-transform duration-300"
            loading="lazy"
          />

          {/* Quick View overlay */}
          <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(product);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md text-emerald-800 text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-white hover:scale-105 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('btn_details')}</span>
            </button>
          </div>
        </div>

        {/* Content Info */}
        <div className="mt-4 space-y-1.5">
          <div className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase">
            {lang === 'uz' ? product.dosage_uz : product.dosage_ru}
          </div>

          <h4 
            onClick={() => setSelectedProduct(product)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1 font-display"
          >
            {lang === 'uz' ? product.name_uz : product.name_ru}
          </h4>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8">
            {lang === 'uz' ? product.description_uz : product.description_ru}
          </p>
        </div>
      </div>

      {/* Bottom Action: Price & Cart Button */}
      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <div className="text-base sm:text-lg font-black text-slate-900 font-display">
            {Number(product.price).toLocaleString()} {t('currency')}
          </div>
          {product.old_price && (
            <div className="text-[11px] text-slate-400 line-through">
              {Number(product.old_price).toLocaleString()} {t('currency')}
            </div>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
            inCartCount > 0
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
          }`}
        >
          {inCartCount > 0 ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t('btn_in_cart')} ({inCartCount})</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>{t('btn_add_to_cart')}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
