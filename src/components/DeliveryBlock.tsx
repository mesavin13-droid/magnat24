import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DeliveryBlock: React.FC = () => {
  const { currentCity } = useStore();
  const [addressInput, setAddressInput] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressInput.trim().length > 3) {
      setHasCalculated(true);
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
              Доставка стройматериалов
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Укажите адрес и узнайте стоимость доставки в {currentCity}е
            </p>
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleAddressSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Введите адрес доставки"
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
                if (e.target.value.length > 3) setHasCalculated(true);
              }}
              className="w-full bg-slate-100 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 font-medium outline-none transition-colors"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-colors"
          >
            Узнать
          </button>
        </form>

        {/* Calculation result when address is typed */}
        {hasCalculated && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Доставка от 490 ₽</span>
            </div>

            <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>Ближайшая доставка — сегодня</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
