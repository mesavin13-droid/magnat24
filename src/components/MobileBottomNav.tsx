import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Layers, Search, Package, ShoppingCart } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cart, isSearchModalOpen, setIsSearchModalOpen, searchQuery } = useStore();
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const isSearchActive = isSearchModalOpen || (activeTab === 'catalog' && !!searchQuery.trim());

  return (
    <nav className="fixed bottom-0 left-0 right-0 sm:max-w-[430px] sm:left-1/2 sm:-translate-x-1/2 z-40 bg-white/98 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] select-none">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        
        {/* 1. Главная */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-amber-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'stroke-[2.6]' : 'stroke-[2]'}`} />
          <span className="text-[10px] leading-tight">Главная</span>
        </button>

        {/* 2. Каталог */}
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'catalog'
              ? 'text-amber-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
        >
          <Layers className={`w-5 h-5 mb-0.5 ${activeTab === 'catalog' ? 'stroke-[2.6]' : 'stroke-[2]'}`} />
          <span className="text-[10px] leading-tight">Каталог</span>
        </button>

        {/* 3. Поиск */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isSearchActive
              ? 'text-amber-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
          title="Поиск стройматериалов"
        >
          <Search className={`w-5 h-5 mb-0.5 ${isSearchActive ? 'stroke-[2.6]' : 'stroke-[2]'}`} />
          <span className="text-[10px] leading-tight">Поиск</span>
        </button>

        {/* 4. Заказы */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'text-amber-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
        >
          <Package className={`w-5 h-5 mb-0.5 ${activeTab === 'orders' ? 'stroke-[2.6]' : 'stroke-[2]'}`} />
          <span className="text-[10px] leading-tight">Заказы</span>
        </button>

        {/* 5. Корзина */}
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl relative transition-all ${
            activeTab === 'cart' || activeTab === 'checkout'
              ? 'text-amber-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
        >
          <div className="relative mb-0.5">
            <ShoppingCart className={`w-5 h-5 ${activeTab === 'cart' || activeTab === 'checkout' ? 'stroke-[2.6]' : 'stroke-[2]'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight">Корзина</span>
        </button>

      </div>
    </nav>
  );
};
