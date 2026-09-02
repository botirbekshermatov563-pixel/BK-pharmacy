import React from 'react';
import { useTranslation } from '../../i18n';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ShieldCheck, Phone, Send, ShieldAlert } from 'lucide-react';

export const Header = ({ onNavigateAdmin }) => {
  const { lang, setLang, t } = useTranslation();
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 glass-header transition-all duration-300 shadow-xs">
      {/* Top micro bar with director contact & phone */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t('gmp_certified')}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+998974904665" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+998 97 490 46 65</span>
            </a>
            <a 
              href="https://t.me/Botirbek_Baxtiyarovich" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-white transition-colors text-emerald-300 font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>@Botirbek_Baxtiyarovich</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
                  BK <span className="text-emerald-600">Pharmacy</span>
                </span>
              </div>
              <span className="hidden sm:block text-[10.5px] font-semibold text-emerald-700 tracking-wider uppercase">
                {t('brand_tagline')}
              </span>
            </div>
          </a>

          {/* Nav links on desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#catalog" className="hover:text-emerald-600 transition-colors">{t('nav_catalog')}</a>
            <a href="#needs" className="hover:text-emerald-600 transition-colors">{t('nav_needs')}</a>
            <a href="#trust" className="hover:text-emerald-600 transition-colors">{t('nav_trust')}</a>
            <a href="#director" className="hover:text-emerald-600 transition-colors">{t('nav_director')}</a>
            <a href="#contacts" className="hover:text-emerald-600 transition-colors">{t('nav_contacts')}</a>
          </nav>

          {/* Right controls: RU/UZ Switcher + Admin link + Cart */}
          <div className="flex items-center gap-3">
            
            {/* RU / UZ Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-bold text-slate-600">
              <button
                onClick={() => setLang('ru')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'ru'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLang('uz')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'uz'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                UZ
              </button>
            </div>

            {/* Admin shortcut button */}
            <button
              onClick={onNavigateAdmin}
              title={t('nav_admin')}
              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors hidden sm:flex items-center gap-1 text-xs font-semibold"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">{t('nav_admin')}</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-emerald-600/30 transition-all transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t('cart_title')}</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center bg-white text-emerald-700 text-[11px] font-black rounded-full h-5 min-w-[20px] px-1 shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
