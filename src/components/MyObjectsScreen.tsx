import React from 'react';
import { useStore } from '../context/StoreContext';
import { Building2, CheckCircle2, Circle, ShoppingCart, ArrowLeft, Plus } from 'lucide-react';

export const MyObjectsScreen: React.FC = () => {
  const { user, addProjectPendingToCart, setActiveTab } = useStore();
  const project = user.objects[0];

  return (
    <div className="pb-28 bg-slate-50 min-h-screen animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center gap-3 sticky top-0 z-20">
        <button onClick={() => setActiveTab('profile')} className="p-1 -ml-1 text-slate-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">Мои объекты</h1>
          <p className="text-xs text-slate-500 font-semibold">Управление закупками для строительных площадок</p>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto text-xs">
        {project && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-sm text-slate-900">{project.title}</h2>
                  <p className="text-[11px] text-slate-500">{project.address}</p>
                </div>
              </div>
            </div>

            {/* Уже куплено */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Уже куплено для объекта:</span>
              </h3>
              <div className="bg-slate-50 rounded-xl p-3 divide-y divide-slate-100 border border-slate-100">
                {project.purchasedItems.map((item) => (
                  <div key={item.id} className="py-1.5 flex justify-between text-slate-700 first:pt-0 last:pb-0">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-slate-500 font-mono">{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Нужно купить */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-amber-800">
                <Circle className="w-4 h-4 text-amber-600" />
                <span>Нужно докупить на следующий этап:</span>
              </h3>
              <div className="bg-amber-50/50 rounded-xl p-3 divide-y divide-amber-100 border border-amber-200/60">
                {project.pendingItems.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center text-slate-900 first:pt-0 last:pb-0">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.quantity} шт / упак.</div>
                    </div>
                    <span className="font-black text-amber-800">
                      ~{item.estimatedPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Главная кнопка: «Продолжить закупку» */}
            <button
              onClick={() => addProjectPendingToCart(project.id)}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Продолжить закупку (добавить в корзину)</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
