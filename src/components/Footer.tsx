import React from 'react';
import { COMPANY_INFO, WAREHOUSES } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { 
  Boxes, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Send, 
  RefreshCw, 
  CreditCard, 
  QrCode,
  Truck
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategory, setIsTelegramOpen, setIsCalculatorOpen } = useStore();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Boxes className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                МАГНАТ<span className="text-amber-500">24</span>.РФ
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Оптово-розничный гипермаркет стройматериалов ООО «Магнат». Поставки керамзита всех фракций, рядового и лицевого кирпича, автоклавного газобетона, теплоизоляции и сухих смесей со складов в Красноярске и Новосибирске.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsTelegramOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#242f3d] hover:bg-[#2f3d4f] text-sky-400 border border-sky-500/30 font-semibold flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Telegram-бот оповещений</span>
              </button>

              <button
                onClick={() => setActiveTab('sync-api')}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>1С API</span>
              </button>
            </div>
          </div>

          {/* Col 2: Catalog categories */}
          <div className="space-y-3">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Каталог товаров</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => { setSelectedCategory('keramzit'); setActiveTab('catalog'); }} className="hover:text-amber-400 transition-colors">
                  Керамзит в мешках и МКР
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('brick'); setActiveTab('catalog'); }} className="hover:text-amber-400 transition-colors">
                  Кирпич М-150 и лицевой
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('aerated-concrete'); setActiveTab('catalog'); }} className="hover:text-amber-400 transition-colors">
                  Газобетон Силекс D500
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('insulation'); setActiveTab('catalog'); }} className="hover:text-amber-400 transition-colors">
                  Пеноплэкс и минвата
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('osb-plywood'); setActiveTab('catalog'); }} className="hover:text-amber-400 transition-colors">
                  OSB-3 влагостойкая
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('cement-mixes'); setActiveTab('catalog'); }} className="hover:text-amber-400 transition-colors">
                  Цемент ПЦ-500 и сухие смеси
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Tools */}
          <div className="space-y-3">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Сервис и расчеты</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setIsCalculatorOpen(true)} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Инженерный калькулятор</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('delivery-info')} className="hover:text-amber-400 transition-colors">
                  Доставка манипулятором
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('account')} className="hover:text-amber-400 transition-colors">
                  Личный кабинет и трекинг
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contacts')} className="hover:text-amber-400 transition-colors">
                  Склады и пункты самовывоза
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-amber-400 transition-colors">
                  Панель администратора
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts */}
          <div className="space-y-3">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Контакты</div>
            <div className="space-y-2 text-slate-400">
              <div>
                <span className="text-[10px] text-slate-500 block">Красноярск (Офис / Склад):</span>
                <a href={`tel:${COMPANY_INFO.phones.krasnoyarsk.replace(/\s+/g, '')}`} className="font-bold text-white hover:text-amber-400">
                  {COMPANY_INFO.phones.krasnoyarsk}
                </a>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Прямой номер / WhatsApp:</span>
                <a href={`tel:${COMPANY_INFO.phones.direct.replace(/\s+/g, '')}`} className="font-bold text-amber-400">
                  {COMPANY_INFO.phones.direct}
                </a>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Электронная почта:</span>
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-300 hover:underline">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Requisites, Payment Gateways & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} ООО «Магнат» (ИНН 2464132890). Официальный сайт магнат24.рф. Все права защищены.
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">
              СБП
            </span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">
              МИР
            </span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">
              Visa / MasterCard
            </span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">
              T-Pay / SberPay
            </span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">
              1C:Enterprise
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
