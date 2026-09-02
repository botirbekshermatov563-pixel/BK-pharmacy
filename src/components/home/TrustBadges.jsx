import React from 'react';
import { useTranslation } from '../../i18n';
import { ShieldCheck, Award, ThermometerSnowflake, Truck } from 'lucide-react';

export const TrustBadges = () => {
  const { t } = useTranslation();

  const BADGES = [
    {
      icon: ShieldCheck,
      title: t('trust_card1_title'),
      desc: t('trust_card1_desc')
    },
    {
      icon: Award,
      title: t('trust_card2_title'),
      desc: t('trust_card2_desc')
    },
    {
      icon: ThermometerSnowflake,
      title: t('trust_card3_title'),
      desc: t('trust_card3_desc')
    },
    {
      icon: Truck,
      title: t('trust_card4_title'),
      desc: t('trust_card4_desc')
    }
  ];

  return (
    <section id="trust" className="py-16 bg-[#f7faf8] border-y border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
            GMP & ISO
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
            {t('trust_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-soft hover:shadow-soft-hover transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
