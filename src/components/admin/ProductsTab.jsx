import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { db } from '../../services/db';
import { Plus, Edit2, Trash2, Search, Upload, X, Check, Image as ImageIcon, Star } from 'lucide-react';

export const ProductsTab = ({ products = [], categories = [], onReload }) => {
  const { lang, t } = useTranslation();
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: '',
    name_ru: '',
    name_uz: '',
    category_id: 'vitamins_minerals',
    form_ru: '',
    form_uz: '',
    dosage_ru: '',
    dosage_uz: '',
    price: '',
    old_price: '',
    image_url: '',
    description_ru: '',
    description_uz: '',
    composition_ru: '',
    composition_uz: '',
    usage_ru: '',
    usage_uz: '',
    rating: 5.0,
    reviews_count: 10,
    in_stock: true,
    badge_type: 'normal',
    badge_ru: '',
    badge_uz: ''
  });

  const handleOpenAdd = () => {
    setFormData({
      id: '',
      name_ru: '',
      name_uz: '',
      category_id: categories[0]?.slug || 'vitamins_minerals',
      form_ru: 'Капсулы',
      form_uz: 'Kapsulalar',
      dosage_ru: '30 капсул',
      dosage_uz: '30 kapsula',
      price: '',
      old_price: '',
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      description_ru: '',
      description_uz: '',
      composition_ru: '',
      composition_uz: '',
      usage_ru: '',
      usage_uz: '',
      rating: 5.0,
      reviews_count: 12,
      in_stock: true,
      badge_type: 'normal',
      badge_ru: '',
      badge_uz: ''
    });
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setFormData({ ...prod });
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await db.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (err) {
      alert('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name_ru || !formData.price) {
      alert('Заполните название и цену товара');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      old_price: formData.old_price ? Number(formData.old_price) : null,
      rating: Number(formData.rating) || 5.0,
      reviews_count: Number(formData.reviews_count) || 0
    };

    await db.saveProduct(payload);
    setIsModalOpen(false);
    onReload();
  };

  const handleDelete = async (id) => {
    if (confirm(lang === 'uz' ? "Ushbu preparatni o'chirishni tasdiqlaysizmi?" : "Удалить этот препарат?")) {
      await db.deleteProduct(id);
      onReload();
    }
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (
      (p.name_ru || '').toLowerCase().includes(q) ||
      (p.name_uz || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'uz' ? "Preparatni qidirish..." : "Поиск препарата..."}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white outline-none focus:border-emerald-500"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin_btn_add_product')}</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Фото</th>
                <th className="py-3.5 px-4">Название (RU / UZ)</th>
                <th className="py-3.5 px-4">Категория</th>
                <th className="py-3.5 px-4">Цена</th>
                <th className="py-3.5 px-4">Наличие</th>
                <th className="py-3.5 px-4">Рейтинг</th>
                <th className="py-3.5 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <img
                      src={prod.image_url}
                      alt={prod.name_ru}
                      className="w-12 h-12 rounded-lg object-contain bg-slate-50 p-1 border border-slate-100"
                    />
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{prod.name_ru}</div>
                    <div className="text-xs text-slate-400 font-normal">{prod.name_uz}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-xs">
                      {prod.category_id}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {Number(prod.price).toLocaleString()} {t('currency')}
                    {prod.old_price && (
                      <span className="block text-[11px] text-slate-400 font-normal line-through">
                        {Number(prod.old_price).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      prod.in_stock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {prod.in_stock ? t('in_stock') : t('out_of_stock')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-amber-600 font-bold">
                    ★ {prod.rating}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title={t('admin_edit')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={t('admin_delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT / ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900 font-display">
                {editingProduct ? (lang === 'uz' ? "Preparatni tahrirlash" : "Редактировать препарат") : (lang === 'uz' ? "Yangi preparat qo'shish" : "Добавить новый препарат")}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Название (RU) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name_ru}
                    onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Название (UZ) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name_uz}
                    onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Категория</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  >
                    {categories.filter(c => c.slug !== 'all').map(c => (
                      <option key={c.slug} value={c.slug}>
                        {lang === 'uz' ? c.name_uz : c.name_ru} ({c.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Статус наличия</label>
                  <select
                    value={formData.in_stock ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.value === 'true' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  >
                    <option value="true">В наличии (Mavjud)</option>
                    <option value="false">Под заказ (Buyurtma asosida)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Цена (сум) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Старая цена (необязательно)</label>
                  <input
                    type="number"
                    value={formData.old_price || ''}
                    onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Image URL & Upload */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700">Изображение товара</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="URL изображения..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none text-xs"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Загрузить файл'}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                {formData.image_url && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={formData.image_url} alt="Preview" className="w-12 h-12 object-contain bg-white rounded-lg p-1 border" />
                    <span className="text-xs text-slate-500">Предпросмотр изображения</span>
                  </div>
                )}
              </div>

              {/* Form & Dosage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Форма выпуска (RU / UZ)</label>
                  <input
                    type="text"
                    value={formData.form_ru}
                    onChange={(e) => setFormData({ ...formData, form_ru: e.target.value })}
                    placeholder="Таблетки / Kapsulalar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Дозировка (RU / UZ)</label>
                  <input
                    type="text"
                    value={formData.dosage_ru}
                    onChange={(e) => setFormData({ ...formData, dosage_ru: e.target.value })}
                    placeholder="30 капсул / 20 мл"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Описание (RU)</label>
                <textarea
                  rows="2"
                  value={formData.description_ru}
                  onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Описание (UZ)</label>
                <textarea
                  rows="2"
                  value={formData.description_uz}
                  onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              {/* Composition */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Состав (RU / UZ)</label>
                <input
                  type="text"
                  value={formData.composition_ru}
                  onChange={(e) => setFormData({ ...formData, composition_ru: e.target.value, composition_uz: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              {/* Usage */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Способ применения и дозы</label>
                <input
                  type="text"
                  value={formData.usage_ru}
                  onChange={(e) => setFormData({ ...formData, usage_ru: e.target.value, usage_uz: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              {/* Rating & Reviews */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Рейтинг (1 - 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Бейдж (напр. bestseller)</label>
                  <select
                    value={formData.badge_type}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      badge_type: e.target.value,
                      badge_ru: e.target.value === 'bestseller' ? 'Хит продаж' : e.target.value === 'natural' ? '100% Натурально' : e.target.value === 'premium' ? 'Премиум' : '',
                      badge_uz: e.target.value === 'bestseller' ? 'Hit sotuv' : e.target.value === 'natural' ? '100% Tabiiy' : e.target.value === 'premium' ? 'Premium' : ''
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  >
                    <option value="normal">Обычный</option>
                    <option value="bestseller">Хит продаж (Bestseller)</option>
                    <option value="natural">100% Натурально</option>
                    <option value="premium">Премиум</option>
                    <option value="kids">Для детей</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  {t('admin_cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
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
