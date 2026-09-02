import React from 'react';
import { useTranslation } from '../../i18n';
import { Phone, Send, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer = ({ settings, onNavigateAdmin }) => {
  const { lang, t } = useTranslation();
  const contacts = settings?.contacts || {};

  return (
    <footer id="contacts" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & License */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                BK <span className="text-emerald-400">Pharmacy</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === 'uz'
                ? "O'zbekistondagi zamonaviy, ishonchli va sertifikatlangan dori vositalari, vitaminlar va biologik faol qo'shimchalar katalogi."
                : "Сеть современных сертифицированных аптек в Узбекистане. Только проверенные препараты, строгий контроль условий хранения и забота о каждом клиенте."}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {lang === 'uz' ? contacts.license_info_uz : contacts.license_info_ru}
              </span>
            </div>
          </div>

          {/* Column 2: Direct Leadership & Contacts */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase font-display">
              {t('contacts_title')}
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>{lang === 'uz' ? contacts.address_uz : contacts.address_ru}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'uz' ? contacts.working_hours_uz : contacts.working_hours_ru}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${contacts.phone}`} className="hover:text-emerald-400 transition-colors font-semibold text-white">
                  {contacts.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Send className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={contacts.telegram_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-emerald-400 transition-colors text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>@{contacts.telegram}</span>
                  <span className="text-xs text-slate-400 font-normal">({lang === 'uz' ? "Direktor telegrami" : "Telegram директора"})</span>
                </a>
              </div>

              {contacts.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`mailto:${contacts.email}`} className="hover:text-emerald-400 transition-colors">
                    {contacts.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Quick Navigation & Admin */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase font-display">
              {lang === 'uz' ? "Bo'limlar" : "Разделы"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#catalog" className="hover:text-emerald-400 transition-colors">{t('nav_catalog')}</a></li>
              <li><a href="#needs" className="hover:text-emerald-400 transition-colors">{t('nav_needs')}</a></li>
              <li><a href="#trust" className="hover:text-emerald-400 transition-colors">{t('nav_trust')}</a></li>
              <li><a href="#director" className="hover:text-emerald-400 transition-colors">{t('nav_director')}</a></li>
              <li>
                <button onClick={onNavigateAdmin} className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-1">
                  <span>{t('nav_admin')}</span>
                  <span className="text-xs bg-emerald-950 px-1.5 py-0.5 rounded-sm border border-emerald-800">/admin</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Warning & Copyright */}
        <div className="pt-8 space-y-4 text-xs text-slate-400 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="max-w-2xl text-slate-400 leading-relaxed italic">
            {t('footer_warning')}
          </p>
          <div className="text-slate-400 shrink-0">
            © {new Date().getFullYear()} {t('footer_rights')}
          </div>
        </div>

      </div>
    </footer>
  );
};
