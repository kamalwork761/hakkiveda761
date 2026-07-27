import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategorySection } from './components/CategorySection';
import { ProductGrid } from './components/ProductGrid';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { BrandStory } from './components/BrandStory';
import { VideoTestimonials } from './components/VideoTestimonials';
import { CustomerReviews } from './components/CustomerReviews';
import { BlogSection } from './components/BlogSection';
import { B2BSection } from './components/B2BSection';
import { Footer } from './components/Footer';

// Modals & Drawers
import { ProductDetailModal } from './components/ProductDetailModal';
import { AIHairQuiz } from './components/AIHairQuiz';
import { AIChatModal } from './components/AIChatModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerPortal } from './components/CustomerPortal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CountrySelectorModal } from './components/CountrySelectorModal';
import { AmbientSoundControl } from './components/AmbientSoundControl';

// Private Admin Views
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';

export function AppContent() {
  const { adminAuthenticated, logoutAdmin, isCountryModalOpen, setIsCountryModalOpen, playSound } = useStore();
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
      setCurrentPath(window.location.pathname);
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) {
        setSelectedCategory(decodeURIComponent(cat));
      } else {
        const hash = window.location.hash;
        if (hash.startsWith('#category=')) {
          setSelectedCategory(decodeURIComponent(hash.replace('#category=', '')));
        } else if (!window.location.search) {
          setSelectedCategory('ALL');
        }
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

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
  };

  const isAdminRoute = currentPath === '/admin' || currentPath === '/admin/login';

  if (isAdminRoute) {
    if (adminAuthenticated) {
      return (
        <AdminDashboard
          onLogoutAdmin={() => {
            logoutAdmin();
            navigate('/admin/login');
          }}
          onReturnToStoreFront={() => navigate('/')}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={() => navigate('/admin')}
        onReturnToStore={() => navigate('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B3D2E] text-slate-100 flex flex-col font-sans selection:bg-[#C8A24A] selection:text-[#0B3D2E]">
      {/* Customer Header */}
      <Header selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />

      <main className="flex-1">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Categories Section */}
        <CategorySection
          selectedCategory={selectedCategory}
          onSelectCategory={(catName) => handleSelectCategory(catName, true)}
        />

        {/* Product Grid */}
        <ProductGrid
          selectedCategory={selectedCategory}
          onSelectCategory={(catName) => handleSelectCategory(catName, false)}
        />

        {/* Before & After Interactive Comparison */}
        <BeforeAfterSlider />

        {/* Brand Lore Story */}
        <BrandStory />

        {/* Video Testimonials */}
        <VideoTestimonials />

        {/* Customer Reviews */}
        <CustomerReviews />

        {/* Blog & Tribal Journal */}
        <BlogSection />

        {/* B2B Wholesale Export */}
        <B2BSection />
      </main>

      {/* Customer Footer */}
      <Footer />

      {/* Customer Interactive Overlays */}
      <ProductDetailModal />
      <AIHairQuiz />
      <AIChatModal />
      <WhatsAppButton />
      <AmbientSoundControl />
      <CartDrawer />
      <CheckoutModal />
      <CustomerPortal />
      <CountrySelectorModal isOpen={isCountryModalOpen} onClose={() => setIsCountryModalOpen(false)} />
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
