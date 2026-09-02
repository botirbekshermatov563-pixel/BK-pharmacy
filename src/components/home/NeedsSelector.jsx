import React from 'react';
import { useTranslation } from '../../i18n';
import { 
  Moon, 
  ShieldPlus, 
  Sparkles, 
  Activity, 
  Apple, 
  Heart, 
  Baby, 
  HeartPulse,
  ArrowRight
} from 'lucide-react';

export const NeedsSelector = ({ selectedCategory, onSelectCategory }) => {
  const { lang, t } = useTranslation();

  const NEEDS = [
    {
      id: 'sleep_stress',
      icon: Moon,
      title_ru: 'Сон и антистресс',
      title_uz: 'Uyqu va antistress',
      desc_ru: 'Глубокий отдых, снятие тревожности и спокойствие',
      desc_uz: 'Tiniq fikr, asabiylikni ketkazish va tinch uyqu',
      color: 'from-teal-500/10 to-emerald-500/10 text-emerald-800'
    },
    {
      id: 'immunity_energy',
      icon: ShieldPlus,
      title_ru: 'Иммунитет и энергия',
      title_uz: 'Immunitet va quvvat',
      desc_ru: 'Защита от вирусов, бодрость и поддержка сил',
      desc_uz: 'Mavsumiy himoya, tetiklik va immunitetni kuchaytirish',
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-800'
    },
    {
      id: 'vitamins_minerals',
      icon: Sparkles,
      title_ru: 'Витамины и минералы',
      title_uz: 'Vitaminlar va BFQ',
      desc_ru: 'Комплексы для сияния кожи, волос и тонуса',
      desc_uz: 'Teri, soch jilosi va kundalik salomatlik uchun',
      color: 'from-amber-500/10 to-emerald-500/10 text-emerald-800'
    },
    {
      id: 'joints_muscles',
      icon: Activity,
      title_ru: 'Суставы и мышцы',
      title_uz: 'Bo\'g\'imlar va mushaklar',
      desc_ru: 'Свобода движений, гибкость и снятие болей',
      desc_uz: 'Erkin harakat, egiluvchanlik va og\'riqni qoldirish',
      color: 'from-blue-500/10 to-emerald-500/10 text-emerald-800'
    },
    {
      id: 'gastro_digestion',
      icon: Apple,
      title_ru: 'Пищеварение и ЖКТ',
      title_uz: 'Oshqozon va ichak',
      desc_ru: 'Легкость в животе, баланс микрофлоры и антациды',
      desc_uz: 'Qorinda yengillik, foydali bakteriyalar va qulaylik',
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-800'
    },
    {
      id: 'women_health',
      icon: Heart,
      title_ru: 'Здоровье женщин',
      title_uz: 'Ayollar salomatligi',
      desc_ru: 'Планирование, материнство, фолаты и железо',
      desc_uz: 'Onalik nuri, homiladorlikka tayyorgarlik va go\'zallik',
      color: 'from-rose-500/10 to-emerald-500/10 text-emerald-800'
    },
    {
      id: 'kids_health',
      icon: Baby,
      title_ru: 'Детские товары',
      title_uz: 'Bolalar uchun',
      desc_ru: 'Сиропы, витамины для роста и спокойного сна',
      desc_uz: 'Sog\'lom o\'sish, ishtaha va bolalar immuniteti',
      color: 'from-pink-500/10 to-teal-500/10 text-emerald-800'
    },
    {
      id: 'veins_vessels',
      icon: HeartPulse,
      title_ru: 'Вены и сосуды',
      title_uz: 'Venalar va tomirlar',
      desc_ru: 'Легкость в ногах, тонус сосудистой стенки',
      desc_uz: 'Xushbichim yengil oyoqlar va tomir elastikligi',
      color: 'from-cyan-500/10 to-emerald-500/10 text-emerald-800'
    }
  ];

  const handleClick = (catId) => {
    onSelectCategory(catId);
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
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
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
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-lg scale-[1.02]'
                    : 'bg-[#fbfdfc] hover:bg-white border-slate-200/80 hover:border-emerald-400 hover:shadow-soft'
                }`}
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100/70 text-emerald-700'
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className={`text-base sm:text-lg font-bold font-display ${
                      isSelected ? 'text-white' : 'text-slate-900 group-hover:text-emerald-700'
                    }`}>
                      {lang === 'uz' ? item.title_uz : item.title_ru}
                    </h3>
                    <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-emerald-100' : 'text-slate-500'
                    }`}>
                      {lang === 'uz' ? item.desc_uz : item.desc_ru}
                    </p>
                  </div>
                </div>

                {/* Arrow hint */}
                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                  isSelected 
                    ? 'border-emerald-600 text-white' 
                    : 'border-slate-100 text-emerald-700 group-hover:text-emerald-800'
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
