import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { useCart } from '../../context/CartContext';
import { ArrowRight, Send, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export const HeroSection = ({ heroContent, featuredProducts = [] }) => {
  const { lang, t } = useTranslation();
  const { setSelectedProduct } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto rotate showcase products
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % featuredProducts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const activeProduct = featuredProducts[activeIndex] || featuredProducts[0];

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-emerald-50/60 via-white to-[#f7faf8] border-b border-emerald-100/50">
      
      {/* Decorative ambient background orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headings & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 text-xs sm:text-sm font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>
                {lang === 'uz'
                  ? (heroContent?.badge_uz || t('hero_badge'))
                  : (heroContent?.badge_ru || t('hero_badge'))}
              </span>
            </div>

            {/* Main Slogan */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-display">
              {lang === 'uz' ? (
                <>
                  Sog'ligingiz — <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600">
                    bizning oliy qadriyatimiz
                  </span>
                </>
              ) : (
                <>
                  Ваше здоровье — <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600">
                    наша главная ценность
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {lang === 'uz'
                ? (heroContent?.subtitle_uz || t('hero_subtitle'))
                : (heroContent?.subtitle_ru || t('hero_subtitle'))}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#catalog"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>{t('hero_btn_catalog')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="https://t.me/Botirbek_Baxtiyarovich"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-emerald-200 text-slate-800 hover:text-emerald-700 font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-5 h-5 text-emerald-600" />
                <span>{t('hero_btn_consult')}</span>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">100%</div>
                <div className="text-xs text-slate-500 font-medium">{t('hero_stat_products')}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600 font-display">GMP / ISO</div>
                <div className="text-xs text-slate-500 font-medium">{lang === 'uz' ? "Sertifikatlangan" : "Сертификация"}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">15+</div>
                <div className="text-xs text-slate-500 font-medium">{lang === 'uz' ? "Yillik tajriba" : "Лет опыта"}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Featured Product Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {activeProduct && (
              <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-soft border border-emerald-100 relative group">
                
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'uz' ? activeProduct.badge_uz : activeProduct.badge_ru}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    ★ {activeProduct.rating} ({activeProduct.reviews_count})
                  </span>
                </div>

                {/* Product Image on soft pedestal */}
                <div 
                  onClick={() => setSelectedProduct(activeProduct)}
                  className="w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-slate-50 via-emerald-50/30 to-white flex items-center justify-center p-4 cursor-pointer overflow-hidden relative"
                >
                  <img
                    src={activeProduct.image_url}
                    alt={lang === 'uz' ? activeProduct.name_uz : activeProduct.name_ru}
                    className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-white text-emerald-800 text-xs font-bold shadow-md">
                      {t('btn_details')} →
                    </span>
                  </div>
                </div>

                {/* Info & Price */}
                <div className="mt-5 space-y-2">
                  <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    {lang === 'uz' ? activeProduct.dosage_uz : activeProduct.dosage_ru}
                  </div>
                  <h3 
                    onClick={() => setSelectedProduct(activeProduct)}
                    className="text-lg sm:text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    {lang === 'uz' ? activeProduct.name_uz : activeProduct.name_ru}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                    {lang === 'uz' ? activeProduct.description_uz : activeProduct.description_ru}
                  </p>

                  <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                        {Number(activeProduct.price).toLocaleString()} {t('currency')}
                      </span>
                      {activeProduct.old_price && (
                        <span className="ml-2 text-xs text-slate-400 line-through">
                          {Number(activeProduct.old_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedProduct(activeProduct)}
                      className="px-4 py-2 rounded-xl bg-emerald-100/80 hover:bg-emerald-600 text-emerald-800 hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      {t('btn_details')}
                    </button>
                  </div>
                </div>

                {/* Carousel Pagination Dots */}
                <div className="flex items-center justify-center gap-1.5 mt-5 pt-3 border-t border-slate-100">
                  {featuredProducts.slice(0, 6).map((prod, idx) => (
                    <button
                      key={prod.id || idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeIndex === idx ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
