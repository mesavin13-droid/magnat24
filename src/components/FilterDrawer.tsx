import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Check } from 'lucide-react';

export const FilterDrawer: React.FC = () => {
  const { isFilterOpen, setIsFilterOpen, products } = useStore();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedThickness, setSelectedThickness] = useState<string[]>([]);

  if (!isFilterOpen) return null;

  const brandsList = ['Knauf', 'Искитимцемент', 'Силекс (Silex)', 'ЗСК', 'ПЕНОПЛЭКС', 'Kronospan', 'Волма', 'Магнат'];
  const unitsList = ['мешок', 'шт', 'м³', 'упак', 'рулон'];
  const thicknessList = ['9 мм', '12 мм', '50 мм', '100 мм', '200 мм', '300 мм'];

  const toggleBrand = (b: string) => {
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const toggleUnit = (u: string) => {
    setSelectedUnits(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u]);
  };

  const toggleThickness = (t: string) => {
    setSelectedThickness(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  // Dynamically calculate matching products count
  const matchingCount = products.filter(p => {
    if (onlyInStock && (!p.stockNovosibirsk && !p.stockKrasnoyarsk)) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
    if (selectedUnits.length > 0 && !selectedUnits.includes(p.unit)) return false;
    return true;
  }).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-base text-slate-900">Фильтры</h2>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter options body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          
          {/* 1. Price */}
          <div>
            <label className="block font-bold text-slate-900 mb-2">Цена (₽)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="от 0"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full bg-slate-100 rounded-xl px-3 py-2 font-bold text-slate-900 outline-none"
              />
              <span className="text-slate-400">—</span>
              <input
                type="number"
                placeholder="до 10 000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full bg-slate-100 rounded-xl px-3 py-2 font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* 2. Availability */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between cursor-pointer py-1 font-bold text-slate-800">
              <span>Только в наличии</span>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded"
              />
            </label>
          </div>

          {/* 3. Manufacturer / Brand */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-900 mb-2">Производитель</label>
            <div className="grid grid-cols-2 gap-2">
              {brandsList.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBrand(b)}
                  className={`py-2 px-3 rounded-xl border text-left font-semibold flex items-center justify-between transition-colors ${
                    selectedBrands.includes(b)
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate">{b}</span>
                  {selectedBrands.includes(b) && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Unit */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-900 mb-2">Единица измерения</label>
            <div className="flex flex-wrap gap-2">
              {unitsList.map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => toggleUnit(u)}
                  className={`py-1.5 px-3 rounded-xl border font-semibold ${
                    selectedUnits.includes(u)
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Thickness */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-900 mb-2">Толщина</label>
            <div className="flex flex-wrap gap-2">
              {thicknessList.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleThickness(t)}
                  className={`py-1.5 px-3 rounded-xl border font-semibold ${
                    selectedThickness.includes(t)
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Pinned bottom button: «Показать 126 товаров» */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
          >
            <span>Показать {matchingCount} товаров</span>
          </button>
        </div>
      </div>
    </div>
  );
};
