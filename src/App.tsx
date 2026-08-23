import React, { useState, useEffect, Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategorySection } from './components/CategorySection';
import { BestSellersCarousel } from './components/BestSellersCarousel';
import { CategoryLandingPage } from './components/CategoryLandingPage';
import { HomepageQuizBanner } from './components/HomepageQuizBanner';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AmbientSoundControl } from './components/AmbientSoundControl';
import { SeoSchemaInjector } from './components/SeoSchemaInjector';

// Dynamic / Lazy-loaded Below-the-fold sections
const BeforeAfterSlider = lazy(() => import('./components/BeforeAfterSlider').then(m => ({ default: m.BeforeAfterSlider })));
const BrandStory = lazy(() => import('./components/BrandStory').then(m => ({ default: m.BrandStory })));
const VideoTestimonials = lazy(() => import('./components/VideoTestimonials').then(m => ({ default: m.VideoTestimonials })));
const ShoppableReelsSection = lazy(() => import('./components/ShoppableReelsSection').then(m => ({ default: m.ShoppableReelsSection })));
const CustomerReviews = lazy(() => import('./components/CustomerReviews').then(m => ({ default: m.CustomerReviews })));
const BlogSection = lazy(() => import('./components/BlogSection').then(m => ({ default: m.BlogSection })));
const B2BSection = lazy(() => import('./components/B2BSection').then(m => ({ default: m.B2BSection })));
const B2BEnquiryPage = lazy(() => import('./pages/B2BEnquiryPage').then(m => ({ default: m.B2BEnquiryPage })));

// Dynamic Modals & Drawers
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal').then(m => ({ default: m.ProductDetailModal })));
const VideoPopupModal = lazy(() => import('./components/VideoPopupModal').then(m => ({ default: m.VideoPopupModal })));
const AIHairQuiz = lazy(() => import('./components/AIHairQuiz').then(m => ({ default: m.AIHairQuiz })));
const AIChatModal = lazy(() => import('./components/AIChatModal').then(m => ({ default: m.AIChatModal })));
const CartDrawer = lazy(() => import('./components/CartDrawer').then(m => ({ default: m.CartDrawer })));
const CheckoutModal = lazy(() => import('./components/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const CustomerPortal = lazy(() => import('./components/CustomerPortal').then(m => ({ default: m.CustomerPortal })));
const CountrySelectorModal = lazy(() => import('./components/CountrySelectorModal').then(m => ({ default: m.CountrySelectorModal })));

import { AdminErrorBoundary } from './components/AdminErrorBoundary';
import { getProductUrl } from './utils/productUtils';

// Product Detail Page Route
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));

// Private Admin Views
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));

const SectionSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
    <div className="bg-[var(--brand-primary-deep)]/40 border border-white/5 rounded-2xl p-8 animate-pulse flex flex-col items-center justify-center min-h-[180px]">
      <div className="h-4 w-32 bg-white/10 rounded-full mb-3" />
      <div className="h-6 w-64 bg-white/10 rounded-lg" />
    </div>
  </div>
);

export function AppContent() {
  const { adminAuthenticated, logoutAdmin, isCountryModalOpen, setIsCountryModalOpen, playSound, openQuickView, products, categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) return decodeURIComponent(cat);
    const hash = window.location.hash;
    if (hash.startsWith('#category=')) {
      return decodeURIComponent(hash.replace('#category=', ''));
    }
    return 'ALL';
  });
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname;
      setCurrentPath(pathname);

      // Handle category route
      if (pathname.startsWith('/categories/') && categories.length > 0) {
        const slug = pathname.replace('/categories/', '').toLowerCase();
        const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');
        const matched = categories.find(
          (c) => c.id === slug || (c.slug && c.slug.toLowerCase() === slug) || slugify(c.name) === slug
        );
        if (matched) {
          setSelectedCategory(matched.name);
        }
      }

      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) {
        setSelectedCategory(decodeURIComponent(cat));
      } else {
        const hash = window.location.hash;
        if (hash.startsWith('#category=')) {
          setSelectedCategory(decodeURIComponent(hash.replace('#category=', '')));
        } else if (!window.location.search && !pathname.startsWith('/categories/')) {
          setSelectedCategory('ALL');
        }
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [products, categories]);

  const handleSelectCategory = (catName: string, shouldScroll: boolean = true) => {
    playSound('nav_click');
    setSelectedCategory(catName);

    // Update URL history without page reload
    const searchParams = new URLSearchParams(window.location.search);
    if (catName === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    const newSearch = searchParams.toString() ? `?${searchParams.toString()}` : window.location.pathname;
    
    if (window.location.search !== (searchParams.toString() ? `?${searchParams.toString()}` : '')) {
      window.history.pushState({ category: catName }, '', newSearch);
    }

    if (shouldScroll) {
      setTimeout(() => {
        const el = document.getElementById('products');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 10);
    }
  };

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute) {
    if (adminAuthenticated) {
      return (
        <AdminErrorBoundary>
          <Suspense fallback={<SectionSkeleton />}>
            <AdminDashboard
              onLogoutAdmin={() => {
                logoutAdmin();
                navigate('/admin/login');
              }}
              onReturnToStoreFront={() => navigate('/')}
            />
          </Suspense>
        </AdminErrorBoundary>
      );
    }
    return (
      <AdminErrorBoundary>
        <Suspense fallback={<SectionSkeleton />}>
          <AdminLogin
            onLoginSuccess={() => navigate('/admin')}
            onReturnToStore={() => navigate('/')}
          />
        </Suspense>
      </AdminErrorBoundary>
    );
  }

  const isProductRoute = currentPath.startsWith('/products/');
  const isCategoryRoute = currentPath === '/hair-care' || currentPath === '/skin-care' || currentPath === '/tribal-wellness';
  const isB2BRoute = currentPath === '/b2b-enquiry' || currentPath === '/b2b' || currentPath === '/export-enquiry';

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex flex-col font-sans selection:bg-[var(--brand-gold)] selection:text-[var(--color-button-text)] transition-colors duration-300">
      {/* Schema.org Structured Data Injector */}
      <SeoSchemaInjector />

      {/* Customer Header */}
      <Header selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />

      <main className="flex-1">
        {isProductRoute ? (
          <Suspense fallback={<SectionSkeleton />}>
            <ProductDetailPage
              slug={currentPath.replace('/products/', '')}
              onNavigateHome={() => navigate('/')}
              onNavigateCategory={(catName) => {
                navigate('/');
                setTimeout(() => handleSelectCategory(catName, true), 50);
              }}
              onNavigateProduct={(product) => {
                navigate(getProductUrl(product));
              }}
            />
          </Suspense>
        ) : isCategoryRoute ? (
          <CategoryLandingPage
            categoryPath={currentPath}
            onReturnHome={() => navigate('/')}
          />
        ) : isB2BRoute ? (
          <Suspense fallback={<SectionSkeleton />}>
            <B2BEnquiryPage onReturnHome={() => navigate('/')} />
          </Suspense>
        ) : (
          <>
            {/* Hero Slider */}
            <HeroSlider />

            {/* Shop by Category Section */}
            <CategorySection
              selectedCategory={selectedCategory}
              onSelectCategory={(catName) => handleSelectCategory(catName, true)}
            />

            {/* Our Best Sellers Carousel */}
            <BestSellersCarousel />

            {/* AI Hair Quiz Banner */}
            <HomepageQuizBanner />

            <Suspense fallback={<SectionSkeleton />}>
              {/* Before & After Interactive Comparison */}
              <BeforeAfterSlider />

              {/* Brand Lore Story */}
              <BrandStory />

              {/* Video Testimonials */}
              <VideoTestimonials />

              {/* Shoppable Video Reels */}
              <ShoppableReelsSection onSelectProduct={(p) => navigate(getProductUrl(p))} />

              {/* Customer Reviews */}
              <CustomerReviews />

              {/* Blog & Tribal Journal */}
              <BlogSection />

              {/* B2B Wholesale Export */}
              <B2BSection />
            </Suspense>
          </>
        )}
      </main>

      {/* Customer Footer */}
      <Footer />

      {/* Customer Interactive Overlays (Lazy Loaded) */}
      <Suspense fallback={null}>
        <VideoPopupModal onSelectProduct={(p) => navigate(getProductUrl(p))} />
        <ProductDetailModal />
        <AIHairQuiz />
        <AIChatModal />
        <WhatsAppButton />
        <AmbientSoundControl />
        <CartDrawer />
        <CheckoutModal />
        <CustomerPortal />
        <CountrySelectorModal isOpen={isCountryModalOpen} onClose={() => setIsCountryModalOpen(false)} />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
