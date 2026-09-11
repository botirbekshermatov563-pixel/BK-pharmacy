import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../../i18n';
import { ArrowRight, X } from 'lucide-react';
import { HEALTH_NEEDS } from '../../data/healthNeeds';
import { CatalogSection } from '../catalog/CatalogSection';

export const NeedsSelector = ({ selectedCategory, onSelectCategory, products = [], categories = [] }) => {
  const { lang, t } = useTranslation();

  // Shared with Anatomy3DGuide so the two homepage sections agree on which
  // color represents which health concern (damaar.uz-style color coding).
  const NEEDS = HEALTH_NEEDS;

  // damaar.uz-style click: filter the catalog to every medicine in this
  // need and scroll straight to it — like damaar's "recommended products"
  // grid per topic — rather than jumping into a single product's modal.
  // Clicking one specific product card there (ProductCard.jsx) is what
  // opens its full info + "В корзину" (that already works correctly).
  // The catalog now lives inside this same section (see below), so the
  // "scroll" is a short, smooth hop rather than a jump across the page.
  const handleClick = (catId) => {
    if (selectedCategory === catId) {
      onSelectCategory('all');
      return;
    }
    onSelectCategory(catId);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectedNeed = NEEDS.find((n) => n.id === selectedCategory);

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

          {/* Active-need chip + reset — mirrors the ring's "click again to
              back out" behavior for anyone arriving straight into this
              grid without having used the circle above it. */}
          {selectedNeed && (
            <div className="flex justify-center pt-1">
              <button
                onClick={() => onSelectCategory('all')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-transform hover:scale-105 cursor-pointer ${selectedNeed.solid}`}
              >
                <span>{lang === 'uz' ? selectedNeed.shortTitle_uz : selectedNeed.shortTitle_ru}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 8 Needs Grid — enters card by card as it scrolls into view,
            rather than popping in all at once. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {NEEDS.map((item, i) => {
            const Icon = item.icon;
            const isSelected = selectedCategory === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', stiffness: 260, damping: 24, delay: (i % 4) * 0.06 }}
                onClick={() => handleClick(item.id)}
                className={`p-5 sm:p-6 rounded-2xl border transition-colors duration-300 cursor-pointer group flex flex-col justify-between ${
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
              </motion.div>
            );
          })}
        </div>

        {/* Catalog: search, sort, category pills, results & pagination —
            moved in here from the top-level page (it used to be its own
            far-down section) so choosing a need flows straight into the
            matching medicines without leaving this part of the page. */}
        <div className="mt-14 sm:mt-16 pt-10 border-t border-slate-100">
          <CatalogSection
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        </div>

      </div>
    </section>
  );
};
