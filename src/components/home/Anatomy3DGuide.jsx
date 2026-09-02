import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { 
  Moon, 
  Activity, 
  Apple, 
  ShieldPlus, 
  Sparkles, 
  Heart, 
  HeartPulse, 
  Baby 
} from 'lucide-react';

export const Anatomy3DGuide = ({ selectedCategory, onSelectCategory }) => {
  const { lang, t } = useTranslation();

  const LEFT_SYMPTOMS = [
    {
      id: 'sleep_stress',
      icon: Moon,
      title_ru: 'Ясность ума и антистресс',
      title_uz: 'Tiniq fikr va antistress',
      organ_ru: 'Головной мозг и нервы',
      organ_uz: 'Bosh miya va asab',
      pathD: 'M 0 135 C 90 135, 120 138, 196 138'
    },
    {
      id: 'joints_muscles',
      icon: Activity,
      title_ru: 'Гибкость и суставы',
      title_uz: 'Bo\'g\'imlar va harakat',
      organ_ru: 'Суставы и хрящи',
      organ_uz: 'Bo\'g\'imlar va tog\'aylar',
      pathD: 'M 0 225 C 60 225, 90 255, 144 255'
    },
    {
      id: 'gastro_digestion',
      icon: Apple,
      title_ru: 'Легкость и пищеварение',
      title_uz: 'Oshqozon va yengillik',
      organ_ru: 'Желудок и кишечник',
      organ_uz: 'Oshqozon va ichak',
      pathD: 'M 0 315 C 90 315, 120 292, 196 292'
    },
    {
      id: 'immunity_energy',
      icon: ShieldPlus,
      title_ru: 'Свежесть дыхания и защита',
      title_uz: 'Nafas tozaligi va himoya',
      organ_ru: 'Дыхание и горло',
      organ_uz: 'Nafas yo\'llari va tomoq',
      pathD: 'M 0 405 C 90 405, 120 202, 196 202'
    }
  ];

  const RIGHT_SYMPTOMS = [
    {
      id: 'vitamins_minerals',
      icon: Sparkles,
      title_ru: 'Энергия и сияние молодости',
      title_uz: 'Energiya va yoshlik jilosi',
      organ_ru: 'Клетки и антиоксиданты',
      organ_uz: 'Hujayralar va tonus',
      pathD: 'M 400 135 C 310 135, 270 244, 196 244'
    },
    {
      id: 'women_health',
      icon: Heart,
      title_ru: 'Сияние материнства',
      title_uz: 'Onalik nuri va go\'zallik',
      organ_ru: 'Женское здоровье',
      organ_uz: 'Ayollar salomatligi',
      pathD: 'M 400 225 C 310 225, 280 340, 196 340'
    },
    {
      id: 'veins_vessels',
      icon: HeartPulse,
      title_ru: 'Стройные легкие ноги',
      title_uz: 'Xushbichim yengil oyoqlar',
      organ_ru: 'Вены и сосуды ног',
      organ_uz: 'Venalar va tomirlar',
      pathD: 'M 400 315 C 310 315, 280 419, 200 419'
    },
    {
      id: 'kids_health',
      icon: Baby,
      title_ru: 'Забота о детях и мамах',
      title_uz: 'Bolalar va onalar parvarishi',
      organ_ru: 'Иммунитет малыша',
      organ_uz: 'Bola salomatligi',
      pathD: 'M 400 405 C 310 405, 290 223, 224 223'
    }
  ];

  const HOTSPOTS = [
    { id: 'sleep_stress', top: '26%', left: '49%', title_ru: 'Ясность и сон', title_uz: 'Tiniq fikr' },
    { id: 'immunity_energy', top: '38%', left: '49%', title_ru: 'Свежесть дыхания', title_uz: 'Erkin nafas' },
    { id: 'vitamins_minerals', top: '46%', left: '49%', title_ru: 'Энергия и сияние', title_uz: 'Yoshlik nuri' },
    { id: 'joints_muscles', top: '48%', left: '36%', title_ru: 'Гибкость суставов', title_uz: 'Yengil harakat' },
    { id: 'kids_health', top: '42%', left: '56%', title_ru: 'Забота и развитие', title_uz: 'Bolalar parvarishi' },
    { id: 'gastro_digestion', top: '55%', left: '49%', title_ru: 'Легкость в животе', title_uz: 'Yengil hazm' },
    { id: 'women_health', top: '64%', left: '49%', title_ru: 'Сияние материнства', title_uz: 'Onalik nuri' },
    { id: 'veins_vessels', top: '79%', left: '50%', title_ru: 'Стройные ноги', title_uz: 'Yengil oyoqlar' }
  ];

  const handleSelect = (id) => {
    onSelectCategory(id);
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="symptoms-guide" className="py-12 sm:py-16 relative overflow-hidden bg-gradient-to-b from-[#eaf6ee] via-[#f4faf6] to-[#f8faf9] border-b border-emerald-100/60">
      
      {/* Central Medical Spotlight Directly Behind 3D Model */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(5,150,105,0.32) 0%, rgba(20,184,166,0.22) 45%, rgba(209,250,229,0) 75%)',
          filter: 'blur(36px)'
        }}
      />
      <div 
        className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(6,78,59,0.25) 55%, transparent 75%)',
          filter: 'blur(18px)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2">
          <span className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-300">
            3D Анатомия и симптомы
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
            {lang === 'uz' ? "Salomatlik va go'zallikning qaysi sohasini tanlaysiz?" : "Какую сферу красоты и здоровья вы хотите улучшить?"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'uz' ? "3D modeldagi tana nuqtasini yoki yon paneldagi sohani tanlang" : "Нажмите на анатомическую точку 3D модели или выберите интересующую зону"}
          </p>
        </div>

        {/* 3-Column Layout: Left Symptoms + Center 3D Model with Hotspots + Right Symptoms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-2 items-center relative">
          
          {/* Left Column: 4 Symptoms */}
          <div className="lg:col-span-4 flex flex-col gap-3 order-2 lg:order-1">
            {LEFT_SYMPTOMS.map((sym) => {
              const Icon = sym.icon;
              const isSelected = selectedCategory === sym.id;
              return (
                <div
                  key={sym.id}
                  onClick={() => handleSelect(sym.id)}
                  className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-200 cursor-pointer group select-none relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-xl scale-[1.02] ring-2 ring-emerald-300'
                      : 'bg-white/80 backdrop-blur-sm hover:bg-white text-slate-900 hover:text-emerald-700 border border-emerald-100 shadow-xs'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-emerald-200' : 'text-emerald-700'}`}>
                      {lang === 'uz' ? sym.organ_uz : sym.organ_ru}
                    </div>
                    <div className="text-sm sm:text-base font-black leading-tight tracking-tight font-display">
                      {lang === 'uz' ? sym.title_uz : sym.title_ru}
                    </div>
                  </div>

                  {/* Connector indicator dot */}
                  <div
                    className={`hidden lg:block ml-auto w-2.5 h-2.5 rounded-full transition-all ${
                      isSelected
                        ? 'bg-teal-300 scale-125 ring-2 ring-white'
                        : 'bg-emerald-600 opacity-60 group-hover:opacity-100 group-hover:scale-110'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Center Column: 3D Model with Hotspots and Connector Lines */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="w-full h-[460px] sm:h-[500px] lg:h-[530px] relative flex items-center justify-center select-none">
              
              {/* SVG Connector Lines */}
              <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 530" preserveAspectRatio="none">
                <defs>
                  <filter id="emeraldGlow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Left Connector Paths */}
                {LEFT_SYMPTOMS.map((sym) => {
                  const isSelected = selectedCategory === sym.id;
                  return (
                    <path
                      key={sym.id}
                      d={sym.pathD}
                      fill="none"
                      stroke={isSelected ? '#047857' : '#10b981'}
                      strokeWidth={isSelected ? '3.8' : '2.2'}
                      strokeDasharray={isSelected ? 'none' : '5 4'}
                      opacity={isSelected ? '1' : '0.85'}
                      filter={isSelected ? 'url(#emeraldGlow)' : 'none'}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Right Connector Paths */}
                {RIGHT_SYMPTOMS.map((sym) => {
                  const isSelected = selectedCategory === sym.id;
                  return (
                    <path
                      key={sym.id}
                      d={sym.pathD}
                      fill="none"
                      stroke={isSelected ? '#047857' : '#10b981'}
                      strokeWidth={isSelected ? '3.8' : '2.2'}
                      strokeDasharray={isSelected ? 'none' : '5 4'}
                      opacity={isSelected ? '1' : '0.85'}
                      filter={isSelected ? 'url(#emeraldGlow)' : 'none'}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>

              {/* 3D Model Viewer */}
              <model-viewer
                id="bodyViewer"
                src="public/human_anatomy.glb"
                alt="BK Pharmacy 3D Human Anatomy Map"
                loading="eager"
                reveal="auto"
                auto-rotate
                auto-rotate-delay="0"
                rotation-per-second="14deg"
                camera-orbit="0deg 78deg 105%"
                shadow-intensity="1.5"
                shadow-softness="0.8"
                exposure="1.15"
                class="w-full h-full pointer-events-none"
              ></model-viewer>

              {/* 8 Anatomical Static Interactive Hotspots */}
              <div className="absolute inset-0 pointer-events-auto z-20">
                {HOTSPOTS.map((hs) => {
                  const isSelected = selectedCategory === hs.id;
                  return (
                    <button
                      key={hs.id}
                      onClick={() => handleSelect(hs.id)}
                      style={{ top: hs.top, left: hs.left }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 hotspot-3d group cursor-pointer ${isSelected ? 'active' : ''}`}
                      title={lang === 'uz' ? hs.title_uz : hs.title_ru}
                    >
                      <div className="hotspot-point"></div>
                      <div className="hotspot-pulse"></div>
                      <span className="hotspot-tag">
                        {lang === 'uz' ? hs.title_uz : hs.title_ru}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Column: 4 Symptoms */}
          <div className="lg:col-span-4 flex flex-col gap-3 order-3">
            {RIGHT_SYMPTOMS.map((sym) => {
              const Icon = sym.icon;
              const isSelected = selectedCategory === sym.id;
              return (
                <div
                  key={sym.id}
                  onClick={() => handleSelect(sym.id)}
                  className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-200 cursor-pointer group select-none relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-800 to-emerald-700 text-white shadow-xl scale-[1.02] ring-2 ring-emerald-300'
                      : 'bg-white/80 backdrop-blur-sm hover:bg-white text-slate-900 hover:text-emerald-700 border border-emerald-100 shadow-xs'
                  }`}
                >
                  {/* Left connector dot */}
                  <div
                    className={`hidden lg:block w-2.5 h-2.5 rounded-full transition-all shrink-0 ${
                      isSelected
                        ? 'bg-teal-300 scale-125 ring-2 ring-white'
                        : 'bg-emerald-600 opacity-60 group-hover:opacity-100 group-hover:scale-110'
                    }`}
                  />

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-emerald-200' : 'text-emerald-700'}`}>
                      {lang === 'uz' ? sym.organ_uz : sym.organ_ru}
                    </div>
                    <div className="text-sm sm:text-base font-black leading-tight tracking-tight font-display">
                      {lang === 'uz' ? sym.title_uz : sym.title_ru}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
