import React from 'react';
import { Truck, ShieldCheck, Clock, CheckCircle2, MapPin, Scale } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DeliveryInfoView: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Условия доставки и оплаты</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Собственный автопарк манипуляторов, самосвалов и Газелей в Красноярске и Новосибирске
        </p>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Газель 1.5 т / 8 м³</h3>
            <div className="text-lg font-black text-amber-600 mt-1">от 1 500 ₽</div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Для мешков керамзита, смесей, пеноплэкса, профилей до 3 метров и штучных товаров.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Манипулятор 5 т / 16 м³</h3>
            <div className="text-lg font-black text-amber-600 mt-1">от 3 000 ₽</div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Стрела 3 тонны: разгрузка биг-бэгов, кирпича и блоков прямо на объект без грузчиков.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Самосвал 15 т / 25 м³</h3>
            <div className="text-lg font-black text-amber-600 mt-1">от 5 500 ₽</div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Для оптовых поставок керамзита навалом, угля, песка, щебня и тяжелых партий.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Шаланда 20 т / 40 м³</h3>
            <div className="text-lg font-black text-amber-600 mt-1">от 8 500 ₽</div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Поставки на крупные строительные объекты, до 20 поддонов газобетона и кирпича.
          </p>
        </div>
      </div>

      {/* Payment methods */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">Способы оплаты</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">1. СБП (QR-код)</strong>
            <span>Моментальная оплата через мобильный банк без комиссии.</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">2. Карты МИР, Visa, MC</strong>
            <span>Защищенный онлайн-эквайринг 3D Secure с отправкой чека на email.</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">3. Безналичный расчет с НДС 20%</strong>
            <span>Для юридических лиц и ИП с формированием счета и УПД.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
