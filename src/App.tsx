import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { MobileHeader } from './components/MobileHeader';
import { DesktopHeader } from './components/DesktopHeader';
import { CategoriesScroll } from './components/CategoriesScroll';
import { MainBanner } from './components/MainBanner';
import { QuickTasksSection } from './components/QuickTasksSection';
import { PopularProductsSection } from './components/PopularProductsSection';
import { BundlesSection } from './components/BundlesSection';
import { DeliveryBlock } from './components/DeliveryBlock';
import { CatalogScreen } from './components/CatalogScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { MaterialCalculatorScreen } from './components/MaterialCalculatorScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { MyObjectsScreen } from './components/MyObjectsScreen';
import { AdminPanel } from './components/AdminPanel';
import { StockSyncApiView } from './components/StockSyncApiView';
import { FilterDrawer } from './components/FilterDrawer';
import { TelegramBotModal } from './components/TelegramBotModal';
import { ToastContainer } from './components/ToastContainer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { SEOManager } from './components/SEOManager';
import { WelcomeSplash } from './components/WelcomeSplash';
import { BrandIntroLoader } from './components/BrandIntroLoader';
import { SearchModal } from './components/SearchModal';

const AppContent: React.FC = () => {
  const { activeTab, deviceMode } = useStore();

  const isMobile = deviceMode === 'mobile';

  return (
    <div className={`min-h-screen bg-[#F4F5F7] text-[#18191B] font-sans antialiased selection:bg-amber-500 selection:text-white ${isMobile ? 'py-0 sm:py-4 flex justify-center' : ''}`}>
      
      {/* Container: If mobile, authentic 390-430px smartphone shell; if desktop, full width */}
      <div className={`w-full bg-[#F8F9FA] flex flex-col relative transition-all duration-300 ${
        isMobile 
          ? 'max-w-[430px] min-h-[100dvh] shadow-2xl sm:rounded-[36px] sm:border-[6px] sm:border-slate-800 overflow-hidden' 
          : 'min-h-screen'
      }`}>
        
        {/* Header */}
        {isMobile ? <MobileHeader /> : <DesktopHeader />}

        {/* Dynamic Route View */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <div className="space-y-1 pb-24">
              <CategoriesScroll />
              <MainBanner />
              <QuickTasksSection />
              <PopularProductsSection />
              <BundlesSection />
              <DeliveryBlock />
            </div>
          )}

          {activeTab === 'catalog' && <CatalogScreen />}
          {activeTab === 'product-detail' && <ProductDetailScreen />}
          {activeTab === 'calculator' && <MaterialCalculatorScreen />}
          {activeTab === 'cart' && <CartScreen />}
          {activeTab === 'checkout' && <CheckoutScreen />}
          {activeTab === 'orders' && <OrdersScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
          {activeTab === 'objects' && <MyObjectsScreen />}
          {activeTab === 'admin' && <AdminPanel />}
          {activeTab === 'sync-api' && <StockSyncApiView />}
        </main>

        {/* Mobile Bottom Navigation (only on mobile device and NOT in cart or checkout flows) */}
        {isMobile && activeTab !== 'cart' && activeTab !== 'checkout' && <MobileBottomNav />}

        {/* Desktop Footer (when in desktop view or on sub-pages) */}
        {!isMobile && <Footer />}

        {/* Global Drawers, Modals & SEO */}
        <BrandIntroLoader />
        <WelcomeSplash />
        <SearchModal />
        <SEOManager />
        <FilterDrawer />
        <TelegramBotModal />
        <ToastContainer />

      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
