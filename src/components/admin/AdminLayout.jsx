import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { ProductsTab } from './ProductsTab';
import { CategoriesTab } from './CategoriesTab';
import { OrdersTab } from './OrdersTab';
import { SettingsTab } from './SettingsTab';
import { 
  Package, 
  Layers, 
  ShoppingBag, 
  Settings as SettingsIcon, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AdminLayout = ({ 
  products = [], 
  categories = [], 
  settings = {}, 
  onReload, 
  onBackToSite 
}) => {
  const { lang, setLang, t } = useTranslation();
  const { user, logout, isSupabaseConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'categories', 'orders', 'settings'

  const NAV_ITEMS = [
    { id: 'products', label_ru: 'Товары', label_uz: 'Preparatlar', icon: Package },
    { id: 'categories', label_ru: 'Категории', label_uz: 'Kategoriyalar', icon: Layers },
    { id: 'orders', label_ru: 'Заказы', label_uz: 'Buyurtmalar', icon: ShoppingBag },
    { id: 'settings', label_ru: 'Настройки сайта', label_uz: 'Sayt sozlamalari', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              BK
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 font-display flex items-center gap-1.5">
                <span>BK Pharmacy</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-sm font-semibold uppercase">
                  Admin
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {user?.email || 'admin@bk-pharmacy.uz'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase status badge */}
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1 ${
              isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-600' : 'bg-amber-600'}`} />
              {isSupabaseConfigured ? 'Supabase Connected' : 'Local Mock DB'}
            </span>

            {/* RU / UZ */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
              <button
                onClick={() => setLang('ru')}
                className={`px-2 py-1 rounded-md transition-all ${lang === 'ru' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-500'}`}
              >
                RU
              </button>
              <button
                onClick={() => setLang('uz')}
                className={`px-2 py-1 rounded-md transition-all ${lang === 'uz' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-500'}`}
              >
                UZ
              </button>
            </div>

            {/* Back to site */}
            <button
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'uz' ? "Saytga o'tish" : "Перейти на сайт"}</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title={t('admin_logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-8 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lang === 'uz' ? item.label_uz : item.label_ru}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              categories={categories}
              onReload={onReload}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesTab
              categories={categories}
              onReload={onReload}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              initialSettings={settings}
              onReload={onReload}
            />
          )}
        </div>

      </div>

    </div>
  );
};
