import React from 'react';
import { useTranslation } from '../../i18n';
import { HEALTH_NEEDS } from '../../data/healthNeeds';
import { HealthAdvisorCharacter } from './HealthAdvisorCharacter';

// 8 pill bubbles laid out on an ellipse around the character, starting at
// the top and going clockwise — the damaar.uz / "World Medicine"-style
// circular symptom picker, rebuilt for BK Pharmacy with the shared
// per-category colors from `healthNeeds.js`.
const RING_POSITIONS = HEALTH_NEEDS.map((_, i) => {
  const angle = (-90 + i * 45) * (Math.PI / 180);
  const rx = 47; // % — horizontal reach of the ellipse
  const ry = 41; // % — vertical reach of the ellipse
  return {
    left: 50 + rx * Math.cos(angle),
    top: 50 + ry * Math.sin(angle),
    align: Math.cos(angle) > 0.35 ? 'left' : Math.cos(angle) < -0.35 ? 'right' : 'center'
  };
});

export const Anatomy3DGuide = ({ selectedCategory, onSelectCategory }) => {
  const { lang } = useTranslation();

  const handleSelect = (id) => {
    onSelectCategory(id);
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="symptoms-guide" className="py-14 sm:py-20 relative overflow-hidden bg-gradient-to-b from-[#eaf6ee] via-[#f4faf6] to-[#f8faf9] border-b border-emerald-100/60">

      {/* Central medical spotlight behind the character */}
      <div
        className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(5,150,105,0.28) 0%, rgba(20,184,166,0.18) 45%, rgba(209,250,229,0) 75%)',
          filter: 'blur(36px)'
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <span className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-300">
            {lang === 'uz' ? "Shaxsiy tanlov" : "Индивидуальный подбор"}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold text-slate-900 tracking-tight font-editorial">
            {lang === 'uz' ? "O'z salomatlik va go'zallik formulangizni toping" : "Найдите свою формулу здоровья и красоты"}
          </h2>
        </div>

        {/* ---- Desktop: circular bubble ring around the character ---- */}
        <div className="hidden lg:block relative mx-auto" style={{ width: '100%', maxWidth: 900, height: 560 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <HealthAdvisorCharacter className="w-64 xl:w-72 h-auto" />
          </div>

          {HEALTH_NEEDS.map((item, i) => {
            const pos = RING_POSITIONS[i];
            const Icon = item.icon;
            const isSelected = selectedCategory === item.id;
            const justify = pos.align === 'left' ? 'flex-start' : pos.align === 'right' ? 'flex-end' : 'center';
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                style={{ top: `${pos.top}%`, left: `${pos.left}%`, transform: 'translate(-50%, -50%)', justifyContent: justify }}
                className={`absolute flex items-center gap-2 pl-2.5 pr-4 py-2 rounded-full border shadow-soft transition-all duration-300 cursor-pointer whitespace-nowrap group ${
                  isSelected
                    ? `${item.solid} border-transparent text-white shadow-lift scale-105`
                    : `bg-white/95 backdrop-blur-sm border-slate-200 hover:border-transparent hover:text-white ${item.solidHover} text-slate-800`
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-white/20 text-white' : `${item.chip} group-hover:bg-white/20 group-hover:text-white`
                }`}>
                  <Icon className="w-3.5 h-3.5 stroke-[2.4]" />
                </span>
                <span className="text-xs font-bold">
                  {lang === 'uz' ? item.title_uz : item.title_ru}
                </span>
              </button>
            );
          })}
        </div>

        {/* ---- Mobile / tablet: character + compact bubble grid ---- */}
        <div className="lg:hidden flex flex-col items-center">
          <HealthAdvisorCharacter className="w-44 sm:w-52 h-auto mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
            {HEALTH_NEEDS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-full border shadow-xs transition-all cursor-pointer ${
                    isSelected
                      ? `${item.solid} border-transparent text-white`
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : item.chip
                  }`}>
                    <Icon className="w-3.5 h-3.5 stroke-[2.4]" />
                  </span>
                  <span className="text-[11px] font-bold leading-tight text-left">
                    {lang === 'uz' ? item.shortTitle_uz : item.shortTitle_ru}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
