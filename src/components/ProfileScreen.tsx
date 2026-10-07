import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  RotateCcw, 
  Settings, 
  Building2, 
  ChevronRight, 
  Phone, 
  ShieldCheck,
  Award
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, orders, repeatOrder, setActiveTab } = useStore();
  const lastOrder = orders[0];

  return (
    <div className="pb-28 bg-slate-50 min-h-screen animate-in fade-in duration-150">
      
      {/* Profile Header */}
      <div className="px-4 py-5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-xs">
            {user.name.charAt(0) || 'И'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 leading-tight">{user.name}</h1>
              <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded">
                {user.tier}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">{user.phone}</p>
          </div>
        </div>

        {/* Bonus status */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-100 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-700">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Бонусы «Магнат»:</span>
          </div>
          <strong className="text-slate-900 font-black">{user.bonusPoints} баллов</strong>
        </div>
      </div>

      <div className="p-4 space-y-3 max-w-lg mx-auto">
        
        {/* ESPECIALLY HIGHLIGHTED: «🔄 Повторить прошлый заказ» */}
        {lastOrder && (
          <div className="bg-amber-500 rounded-2xl p-4 text-slate-950 shadow-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-900/80">
                Быстрый заказ в 1 клик
              </span>
              <span className="font-mono text-xs font-black">
                №{lastOrder.orderNumber}
              </span>
            </div>
            <h2 className="text-base font-black leading-tight">
              Повторить прошлый заказ
            </h2>
            <p className="text-xs font-semibold text-slate-900/80 mt-1 line-clamp-1">
              {lastOrder.items.map(i => i.product.name).join(', ')}
            </p>
            <button
              onClick={() => repeatOrder(lastOrder.id)}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-slate-950 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs active:bg-slate-900"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Повторить закупку ({lastOrder.totalAmount.toLocaleString('ru-RU')} ₽)</span>
            </button>
          </div>
        )}

        {/* Menu Sections */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-2xs text-xs font-bold text-slate-900">
          
          <button
            onClick={() => setActiveTab('orders')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-amber-600" />
              <span>Мои заказы ({orders.length})</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('objects')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-amber-600" />
              <div>
                <span>Мои объекты</span>
                <span className="block text-[10px] text-slate-400 font-normal">Списки покупок для строек</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-amber-600" />
              <span>Избранное ({user.favorites.length})</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <div className="p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-600" />
              <div>
                <span>Мои адреса</span>
                <span className="block text-[11px] text-slate-500 font-normal mt-0.5">
                  {user.savedAddresses[0]}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('admin')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-slate-600" />
              <span>Панель управления и 1С</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

        </div>

      </div>

    </div>
  );
};
