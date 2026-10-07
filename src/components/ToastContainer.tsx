import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-[390px] w-[92%] pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
            case 'error':
              return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
            case 'warning':
              return <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />;
            default:
              return <Info className="w-4 h-4 text-sky-600 shrink-0" />;
          }
        };

        const getBorder = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-300 bg-white/98 text-slate-900 shadow-xl';
            case 'error':
              return 'border-rose-300 bg-white/98 text-slate-900 shadow-xl';
            case 'warning':
              return 'border-amber-300 bg-white/98 text-slate-900 shadow-xl';
            default:
              return 'border-sky-300 bg-white/98 text-slate-900 shadow-xl';
          }
        };

        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto cursor-pointer flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-102 active:scale-98 ${getBorder()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0 text-xs">
              <span className="font-extrabold text-slate-900 mr-1.5">{toast.title}:</span>
              <span className="text-slate-600 truncate">{toast.message}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded-lg"
              aria-label="Закрыть уведомление"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
