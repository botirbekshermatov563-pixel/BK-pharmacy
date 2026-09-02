import React from 'react';
import { useTranslation } from '../../i18n';
import { Phone, Send, ShieldCheck, UserCheck, MessageSquare, Award } from 'lucide-react';

export const DirectorCard = ({ settings }) => {
  const { lang, t } = useTranslation();
  const contacts = settings?.contacts || {};

  return (
    <section id="director" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          {/* Subtle decorative background patterns */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-10 -top-10 w-60 h-60 bg-teal-400/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Director Avatar / Badge icon */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-white/10 p-2 border-2 border-emerald-300/30 backdrop-blur-md shadow-inner flex items-center justify-center relative group">
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex flex-col items-center justify-center text-white">
                  <UserCheck className="w-14 h-14 text-white stroke-[1.8]" />
                  <span className="text-[11px] font-bold tracking-wider uppercase mt-1 text-emerald-200">BK Pharmacy</span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-xs text-emerald-300 font-semibold tracking-wide uppercase">
                {lang === 'uz' ? "Rasmiy rahbariyat" : "Официальное руководство"}
              </div>
            </div>

            {/* Director Bio & Actions */}
            <div className="md:col-span-8 space-y-4 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-700/80 text-emerald-200 border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t('director_section_title')}</span>
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                {contacts.director_name || "Шерматов Ботир Бахтиярович"}
              </h3>

              <p className="text-emerald-100/90 text-sm leading-relaxed">
                {lang === 'uz' ? contacts.director_title_uz : contacts.director_title_ru}
              </p>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-emerald-200 font-medium">{t('director_phone_label')}</span>
                  <a 
                    href={`tel:${contacts.phone}`} 
                    className="font-bold text-white hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{contacts.phone}</span>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/10">
                  <span className="text-emerald-200 font-medium">{t('director_tg_label')}</span>
                  <a 
                    href={contacts.telegram_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="font-bold text-emerald-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>@{contacts.telegram}</span>
                  </a>
                </div>
              </div>

              {/* Direct Telegram Chat Button */}
              <div className="pt-2">
                <a
                  href={contacts.telegram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'uz' ? "Direktor bilan Telegramda bog'lanish" : "Связаться с директором в Telegram"}</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
