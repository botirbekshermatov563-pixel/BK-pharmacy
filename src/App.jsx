import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { db } from './services/db';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { Anatomy3DGuide } from './components/home/Anatomy3DGuide';
import { NeedsSelector } from './components/home/NeedsSelector';
import { TrustBadges } from './components/home/TrustBadges';
import { DirectorCard } from './components/home/DirectorCard';
import { CatalogSection } from './components/catalog/CatalogSection';
import { ProductModal } from './components/modals/ProductModal';
import { CartDrawer } from './components/modals/CartDrawer';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';

export function App() {
  const { isAdmin, loading: authLoading } = useAuth();
  
  // App Data State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Router State: checks path or hash for '/admin'
  const [route, setRoute] = useState(() => {
    if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin') || window.location.search.includes('admin')) {
      return 'admin';
    }
    return 'home';
  });

  const loadData = async () => {
    try {
      const [prods, cats, sets] = await Promise.all([
        db.getProducts(),
        db.getCategories(),
        db.getSettings()
      ]);
      setProducts(prods);
      setCategories(cats);
      setSettings(sets);
    } catch (e) {
      console.error('Error loading initial data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to hash / history changes
    const handleLocationChange = () => {
      if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin') || window.location.search.includes('admin')) {
        setRoute('admin');
      } else {
        setRoute('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAdmin = () => {
    setRoute('admin');
    window.history.pushState(null, '', '#admin');
  };

  const navigateToHome = () => {
    setRoute('home');
    window.history.pushState(null, '', '#');
  };

  // ADMIN ROUTE VIEW
  if (route === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      );
    }

    if (!isAdmin) {
      return <AdminLogin onBackToSite={navigateToHome} />;
    }

    return (
      <AdminLayout
        products={products}
        categories={categories}
        settings={settings}
        onReload={loadData}
        onBackToSite={navigateToHome}
      />
    );
  }

  // CUSTOMER PUBLIC STOREFRONT
  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf8] text-slate-900">
      
      {/* Header */}
      <Header onNavigateAdmin={navigateToAdmin} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          heroContent={settings.hero_content}
          featuredProducts={products.filter(p => p.badge_type === 'bestseller' || p.badge_type === 'premium')}
        />

        {/* 1. Interactive 3D Human Anatomy & Symptoms Guide */}
        <Anatomy3DGuide
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 2. Needs Selector Cards */}
        <NeedsSelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 3. Full Catalog Section with Search, Filter, Sort & Pagination */}
        <CatalogSection
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 4. Trust Badges & Certificates (GMP, ISO) */}
        <TrustBadges />

        {/* 5. Executive Director Section (Шерматов Ботир Бахтиярович) */}
        <DirectorCard settings={settings} />
      </main>

      {/* Footer */}
      <Footer settings={settings} onNavigateAdmin={navigateToAdmin} />

      {/* Modals & Drawers */}
      <ProductModal />
      <CartDrawer />

    </div>
  );
}
export default App;
