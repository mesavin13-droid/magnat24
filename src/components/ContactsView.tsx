import React from 'react';
import { COMPANY_INFO, WAREHOUSES } from '../data/mockData';
import { MapPin, Phone, Mail, Clock, Building2, ShieldCheck, FileText } from 'lucide-react';

export const ContactsView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Контакты и склады ООО «Магнат»</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Официальные пункты отгрузки стройматериалов и офис продаж в Красноярске и Новосибирске
        </p>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WAREHOUSES.map((wh) => (
          <div key={wh.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{wh.name}</h3>
                <span className="text-[11px] text-amber-700 font-semibold">{wh.city}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{wh.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`tel:${wh.phone.replace(/\s+/g, '')}`} className="font-bold text-slate-900 hover:text-amber-600">
                  {wh.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{wh.workHours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Requisites Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileText className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold">Карточка предприятия и реквизиты</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div>
            <span className="text-slate-400 block">Полное наименование:</span>
            <strong className="text-white">{COMPANY_INFO.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">ИНН / КПП:</span>
            <strong className="text-white font-mono">{COMPANY_INFO.requisites.inn} / {COMPANY_INFO.requisites.kpp}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">ОГРН:</span>
            <strong className="text-white font-mono">{COMPANY_INFO.requisites.ogrn}</strong>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-400 block">Юридический адрес:</span>
            <span className="text-white">{COMPANY_INFO.requisites.legalAddress}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Банк:</span>
            <span className="text-white">{COMPANY_INFO.requisites.bank}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Расчетный счет:</span>
            <span className="text-white font-mono">{COMPANY_INFO.requisites.rs}</span>
          </div>
          <div>
            <span className="text-slate-400 block">БИК:</span>
            <span className="text-white font-mono">{COMPANY_INFO.requisites.bik}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Email для счетов:</span>
            <a href={`mailto:${COMPANY_INFO.email}`} className="text-amber-400 underline">{COMPANY_INFO.email}</a>
          </div>
        </div>
      </div>
    </div>
  );
};
