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
  const { adminAuthenticated, logoutAdmin, isCountryModalOpen, setIsCountryModalOpen } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

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
      <Header />

      <main className="flex-1">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Categories Section */}
        <CategorySection
          selectedCategory={selectedCategory}
          onSelectCategory={(catName) => setSelectedCategory(catName)}
        />

        {/* Product Grid */}
        <ProductGrid selectedCategory={selectedCategory} />

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
