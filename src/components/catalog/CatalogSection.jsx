import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../i18n';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';
import { Search, SlidersHorizontal, X, ArrowUpDown, Sparkles } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export const CatalogSection = ({
  products = [],
  categories = [],
  selectedCategory,
  onSelectCategory
}) => {
  const { lang, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price_asc', 'price_desc', 'name_asc'
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all') {
        if (item.category_id !== selectedCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameRu = (item.name_ru || '').toLowerCase();
        const nameUz = (item.name_uz || '').toLowerCase();
        const descRu = (item.description_ru || '').toLowerCase();
        const descUz = (item.description_uz || '').toLowerCase();
        const compRu = (item.composition_ru || '').toLowerCase();
        const compUz = (item.composition_uz || '').toLowerCase();

        const matches =
          nameRu.includes(q) ||
          nameUz.includes(q) ||
          descRu.includes(q) ||
          descUz.includes(q) ||
          compRu.includes(q) ||
          compUz.includes(q);

        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        return Number(a.price) - Number(b.price);
      }
      if (sortBy === 'price_desc') {
        return Number(b.price) - Number(a.price);
      }
      if (sortBy === 'name_asc') {
        const nameA = lang === 'uz' ? a.name_uz : a.name_ru;
        const nameB = lang === 'uz' ? b.name_uz : b.name_ru;
        return nameA.localeCompare(nameB);
      }
      // 'popular' default
      return (b.rating * b.reviews_count) - (a.rating * a.reviews_count);
    });
  }, [products, selectedCategory, searchQuery, sortBy, lang]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (catId) => {
    onSelectCategory(catId);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    onSelectCategory('all');
    setSearchQuery('');
    setSortBy('popular');
    setCurrentPage(1);
  };

  return (
    <section id="catalog" className="py-16 sm:py-24 bg-[#f8faf9] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
            {t('nav_catalog')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
            {t('catalog_title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t('catalog_subtitle')}
          </p>
        </div>

        {/* Controls Bar: Search & Sort */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-soft mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t('search_placeholder')}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Count */}
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <div className="text-xs sm:text-sm text-slate-500 font-medium">
              {t('found_count')} <span className="font-bold text-slate-900">{filteredProducts.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="popular">{t('sort_popular')}</option>
                <option value="price_asc">{t('sort_price_asc')}</option>
                <option value="price_desc">{t('sort_price_desc')}</option>
                <option value="name_asc">{t('sort_name_asc')}</option>
              </select>
            </div>
          </div>

        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = (selectedCategory === cat.slug) || (selectedCategory === 'all' && cat.slug === 'all');
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/80'
                }`}
              >
                {lang === 'uz' ? cat.name_uz : cat.name_ru}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                const catalogEl = document.getElementById('catalog');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-display">
              {t('no_products')}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'uz'
                ? "Boshqa so'z bilan qidirib ko'ring yoki filtrlarni tozalang"
                : "Попробуйте изменить поисковый запрос или сбросить фильтры"}
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              {t('reset_filters')}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
