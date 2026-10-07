import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ConstructionBundle } from '../types';
import { Sparkles, ShoppingCart, Check, ArrowRight, X } from 'lucide-react';

export const BundlesSection: React.FC = () => {
  const { bundles, addBundleToCart, setActiveTab } = useStore();
  const [selectedBundleModal, setSelectedBundleModal] = useState<ConstructionBundle | null>(null);

  return (
    <div className="py-3">
      <div className="px-4 flex items-center justify-between mb-2.5">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Выгоднее комплектом</h2>
          <p className="text-[11px] text-slate-500 font-medium">Скидка до 12% при покупке готового набора</p>
        </div>
      </div>

      {/* Horizontal scroll of bundles */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className="w-72 shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden p-3.5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all select-none"
          >
            <div>
              {/* Photo + badge */}
              <div className="relative h-32 rounded-xl bg-slate-100 overflow-hidden mb-3">
                <img 
                  src={bundle.image} 
                  alt={bundle.title} 
                  className="w-full h-full object-cover" 
                  loading="lazy" 
                />
                <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                  -{bundle.discountPercent}% выгода
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  В комплекте {bundle.itemCount} товаров
                </div>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                {bundle.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {bundle.description}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-slate-900">
                    {bundle.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-[11px] text-slate-400 line-through">
                    {bundle.oldPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBundleModal(bundle)}
                className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 transition-all active:bg-amber-600 shadow-xs"
              >
                <span>Смотреть</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal inspection of Bundle */}
      {selectedBundleModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 max-w-md w-full p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-900">{selectedBundleModal.title}</h3>
                <span className="text-xs text-emerald-600 font-bold">Скидка {selectedBundleModal.discountPercent}% на весь набор</span>
              </div>
              <button 
                onClick={() => setSelectedBundleModal(null)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedBundleModal.description}
            </p>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Состав комплекта:</div>
              {selectedBundleModal.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-900">{item.product.name}</span>
                  <span className="font-bold text-amber-600">{item.quantity} {item.product.unit}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Цена за весь комплект:</div>
                <div className="text-xl font-black text-slate-900">
                  {selectedBundleModal.price.toLocaleString('ru-RU')} ₽
                </div>
              </div>

              <button
                onClick={() => {
                  addBundleToCart(selectedBundleModal);
                  setSelectedBundleModal(null);
                }}
                className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Добавить комплект</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
