import React from 'react';
import { useTranslation } from '../../i18n';
import { ArrowRight } from 'lucide-react';
import { HEALTH_NEEDS } from '../../data/healthNeeds';
import { useCart } from '../../context/CartContext';

export const NeedsSelector = ({ selectedCategory, onSelectCategory, products = [] }) => {
  const { lang, t } = useTranslation();
  const { setSelectedProduct } = useCart();

  // Shared with Anatomy3DGuide so the two homepage sections agree on which
  // color represents which health concern (damaar.uz-style color coding).
  const NEEDS = HEALTH_NEEDS;

  // damaar.uz-style click: go straight "inside" to the best-matching
  // medicine for that need (its quick-view modal) instead of just filtering
  // a list — the category filter is still synced underneath, so closing the
  // modal leaves the catalog scoped to that need.
  const handleClick = (catId) => {
    onSelectCategory(catId);

    const candidates = products.filter((p) => p.category_id === catId);
    if (candidates.length > 0) {
      const best = [...candidates].sort(
        (a, b) => (b.rating * b.reviews_count) - (a.rating * a.reviews_count)
      )[0];
      setSelectedProduct(best);
      return;
    }

    // No product loaded yet for this category — fall back to scrolling to
    // the (now filtered) catalog rather than opening an empty modal.
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="needs" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
            {lang === 'uz' ? "Sog'lom hayot yo'nalishlari" : "Индивидуальный подбор"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight font-editorial">
            {t('needs_title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t('needs_subtitle')}
          </p>
        </div>

        {/* 8 Needs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {NEEDS.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedCategory === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? `${item.selected} text-white shadow-lg scale-[1.02]`
                    : `bg-[#fbfdfc] hover:bg-white border-slate-200/80 ${item.accentBorder} hover:shadow-soft`
                }`}
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isSelected ? 'bg-white/20 text-white' : item.chip
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className={`text-base sm:text-lg font-bold font-display ${
                      isSelected ? 'text-white' : `text-slate-900 ${item.accentText}`
                    }`}>
                      {lang === 'uz' ? item.shortTitle_uz : item.shortTitle_ru}
                    </h3>
                    <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-white/85' : 'text-slate-500'
                    }`}>
                      {lang === 'uz' ? item.desc_uz : item.desc_ru}
                    </p>
                  </div>
                </div>

                {/* Arrow hint */}
                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                  isSelected
                    ? 'border-white/25 text-white'
                    : `border-slate-100 ${item.accentText}`
                }`}>
                  <span>{lang === 'uz' ? "Preparatlarni ko'rish" : "Подобрать"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
