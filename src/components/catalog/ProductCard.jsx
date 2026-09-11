import React from 'react';
import { useTranslation } from '../../i18n';
import { useCart } from '../../context/CartContext';
import { Plus, Check, Star, Eye, Heart } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { lang, t } = useTranslation();
  const { cart, addToCart, setSelectedProduct, isWishlisted, toggleWishlist } = useCart();

  const cartItem = cart.find(item => item.id === product.id);
  const inCartCount = cartItem ? cartItem.quantity : 0;
  const liked = isWishlisted(product.id);

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'bestseller':
        return 'bg-amber-100 text-amber-800';
      case 'natural':
        return 'bg-emerald-100 text-emerald-800';
      case 'premium':
        return 'bg-teal-100 text-teal-800';
      case 'kids':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const badgeText = lang === 'uz' ? product.badge_uz : product.badge_ru;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 flex flex-col justify-between product-card-hover group relative overflow-hidden">

      {/* Full-width benefit strip — the product's own tagline, not the
          category (e.g. "Плоский живот и детокс-сияние"), colored by
          badge_type. Edge-to-edge like the World Medicine reference. */}
      {badgeText && (
        <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wide ${getBadgeStyle(product.badge_type)}`}>
          {badgeText}
        </div>
      )}

      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 flex-1 flex flex-col">
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

          {/* Wishlist heart — toggles a locally-persisted "liked" list */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-pressed={liked}
            aria-label={liked ? (lang === 'uz' ? "Sevimlilardan olib tashlash" : "Убрать из избранного") : (lang === 'uz' ? "Sevimlilarga qo'shish" : "Добавить в избранное")}
            className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer ${
              liked
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
          </button>

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
        <div className="mt-4 space-y-1.5 flex-1">
          <div className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase">
            {lang === 'uz' ? product.dosage_uz : product.dosage_ru}
          </div>

          <h4
            onClick={() => setSelectedProduct(product)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1 font-display"
          >
            {lang === 'uz' ? product.name_uz : product.name_ru}
          </h4>

          {/* Rating + trust chip row */}
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>({product.rating}/5)</span>
            </div>
            <span className="text-slate-300 font-normal">{product.reviews_count} {t('reviews_count')}</span>
            <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
              GMP EU
            </span>
          </div>
        </div>

        {/* Bottom Action: Price & Cart Button */}
        <div className="pt-4 mt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900 font-display">
              {Number(product.price).toLocaleString()} {t('currency')}
            </span>
            {product.old_price && (
              <span className="text-[11px] text-slate-400 line-through">
                {Number(product.old_price).toLocaleString()} {t('currency')}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className={`w-full py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
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

    </div>
  );
};
