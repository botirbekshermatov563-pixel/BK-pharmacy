import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { db } from '../../services/db';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

export const CategoriesTab = ({ categories = [], onReload }) => {
  const { lang, t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    slug: '',
    name_ru: '',
    name_uz: '',
    icon: 'Pill'
  });

  const handleOpenAdd = () => {
    setFormData({
      slug: '',
      name_ru: '',
      name_uz: '',
      icon: 'Pill'
    });
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setFormData({ ...cat });
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.slug || !formData.name_ru) {
      alert('Заполните slug и название категории');
      return;
    }

    await db.saveCategory(formData);
    setIsModalOpen(false);
    onReload();
  };

  const handleDelete = async (id) => {
    if (id === 'all') {
      alert('Основную категорию "Все" нельзя удалить');
      return;
    }
    if (confirm(lang === 'uz' ? "Ushbu kategoriyani o'chirishni tasdiqlaysizmi?" : "Удалить категорию?")) {
      await db.deleteCategory(id);
      onReload();
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800 font-display">
          {lang === 'uz' ? "Kategoriyalar ro'yxati" : "Список категорий каталога"}
        </h3>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin_btn_add_category')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id || cat.slug}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-mono text-emerald-700 font-semibold uppercase">
                {cat.slug}
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5 font-display">
                {cat.name_ru}
              </h4>
              <div className="text-xs text-slate-400">
                {cat.name_uz}
              </div>
            </div>

            {cat.slug !== 'all' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                  title={t('admin_edit')}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id || cat.slug)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                  title={t('admin_delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">
                {editingCategory ? "Редактировать категорию" : "Новая категория"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug (код категории на латинице)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="vitamins_minerals"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Название (RU)</label>
                <input
                  type="text"
                  required
                  value={formData.name_ru}
                  onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                  placeholder="Витамины и БАД"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Название (UZ)</label>
                <input
                  type="text"
                  required
                  value={formData.name_uz}
                  onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                  placeholder="Vitaminlar va BFQ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 font-bold"
                >
                  {t('admin_cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  {t('admin_save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
