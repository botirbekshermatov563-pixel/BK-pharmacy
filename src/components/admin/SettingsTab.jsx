import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { db } from '../../services/db';
import { Save, Check, ShieldCheck, UserCheck, Phone, Send, MapPin, Sparkles } from 'lucide-react';

export const SettingsTab = ({ initialSettings = {}, onReload }) => {
  const { lang, t } = useTranslation();
  const [settings, setSettings] = useState(initialSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleContactChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      contacts: {
        ...(prev.contacts || {}),
        [field]: value,
        ...(field === 'telegram' ? { telegram_url: `https://t.me/${value.replace('@', '')}` } : {})
      }
    }));
  };

  const handleHeroChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      hero_content: {
        ...(prev.hero_content || {}),
        [field]: value
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await db.updateSettings(settings);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onReload();
  };

  const contacts = settings.contacts || {};
  const hero = settings.hero_content || {};

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      
      {/* Toast alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>
            {lang === 'uz' ? "Barcha sozlamalar muvaffaqiyatli saqlandi!" : "Все настройки успешно сохранены и обновлены на сайте!"}
          </span>
        </div>
      )}

      {/* SECTION 1: Leadership & Direct Contacts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base font-display">
              {lang === 'uz' ? "Rahbariyat va rasmiy kontaktlar" : "Руководство и официальные контакты"}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'uz' ? "Saytda, buyurtmalarda va Telegram integratsiyasida aks etadigan ma'lumotlar" : "Отображаются в шапке, подвале, карточке директора и используются для пересылки заказов в Telegram"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">ФИО Директора</label>
            <input
              type="text"
              value={contacts.director_name || ''}
              onChange={(e) => handleContactChange('director_name', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Должность (RU)</label>
            <input
              type="text"
              value={contacts.director_title_ru || ''}
              onChange={(e) => handleContactChange('director_title_ru', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Должность (UZ)</label>
            <input
              type="text"
              value={contacts.director_title_uz || ''}
              onChange={(e) => handleContactChange('director_title_uz', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Телефон приемной / горячей линии</label>
            <input
              type="text"
              value={contacts.phone || ''}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Telegram username (для приема заказов)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
              <input
                type="text"
                value={(contacts.telegram || '').replace('@', '')}
                onChange={(e) => handleContactChange('telegram', e.target.value.replace('@', ''))}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={contacts.email || ''}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Адрес офиса (RU)</label>
            <input
              type="text"
              value={contacts.address_ru || ''}
              onChange={(e) => handleContactChange('address_ru', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Адрес офиса (UZ)</label>
            <input
              type="text"
              value={contacts.address_uz || ''}
              onChange={(e) => handleContactChange('address_uz', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Фарм. лицензия (RU)</label>
            <input
              type="text"
              value={contacts.license_info_ru || ''}
              onChange={(e) => handleContactChange('license_info_ru', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Фарм. лицензия (UZ)</label>
            <input
              type="text"
              value={contacts.license_info_uz || ''}
              onChange={(e) => handleContactChange('license_info_uz', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Hero & Banners CMS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base font-display">
              {lang === 'uz' ? "Bosh sahifa matnlari va bannerlar" : "Тексты главного экрана (Hero-блок)"}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'uz' ? "Bosh sahifadagi shiorlar va tavsiflarni to'g'ridan-to'g'ri o'zgartirish" : "Редактируйте заголовки, бейджи и описания без изменения программного кода"}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Бейдж над заголовком (RU)</label>
            <input
              type="text"
              value={hero.badge_ru || ''}
              onChange={(e) => handleHeroChange('badge_ru', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Бейдж над заголовком (UZ)</label>
            <input
              type="text"
              value={hero.badge_uz || ''}
              onChange={(e) => handleHeroChange('badge_uz', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Подзаголовок / Описание каталога (RU)</label>
            <textarea
              rows="2"
              value={hero.subtitle_ru || ''}
              onChange={(e) => handleHeroChange('subtitle_ru', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Подзаголовок / Описание каталога (UZ)</label>
            <textarea
              rows="2"
              value={hero.subtitle_uz || ''}
              onChange={(e) => handleHeroChange('subtitle_uz', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Сохранение...' : t('admin_save')}</span>
        </button>
      </div>

    </form>
  );
};
