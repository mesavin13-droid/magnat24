import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Send, 
  X, 
  Settings, 
  CheckCheck, 
  Sparkles, 
  Bot, 
  Bell, 
  Check, 
  ShieldCheck,
  Phone,
  Truck
} from 'lucide-react';

export const TelegramBotModal: React.FC = () => {
  const { 
    isTelegramOpen, 
    setIsTelegramOpen, 
    telegramMessages, 
    sendTelegramMessage, 
    markTelegramMessagesRead,
    telegramSettings,
    updateTelegramSettings
  } = useStore();

  const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat');
  const [customMsgInput, setCustomMsgInput] = useState('');

  if (!isTelegramOpen) return null;

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsgInput.trim()) return;
    sendTelegramMessage(customMsgInput.trim(), 'system');
    setCustomMsgInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0e1621] text-white rounded-3xl shadow-2xl border border-slate-700/80 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 font-sans"
      >
        {/* Telegram Header */}
        <div className="bg-[#17212b] px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">Магнат24 | Бот заказов</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-[11px] text-sky-400">@{telegramSettings.botUsername} &bull; бот</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'chat' ? 'settings' : 'chat')}
              className={`p-2 rounded-xl transition-colors ${
                activeTab === 'settings' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Настройки бота"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                markTelegramMessagesRead();
                setIsTelegramOpen(false);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Live Chat Feed */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0e1621]">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {telegramMessages.map((msg) => {
                const time = new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={msg.id} className="flex flex-col items-start max-w-[90%] space-y-1">
                    <div className="bg-[#182533] p-3.5 rounded-2xl rounded-tl-xs border border-slate-700/50 text-xs text-slate-100 shadow-md whitespace-pre-line leading-relaxed">
                      {msg.text}
                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1.5">
                        <span>{time}</span>
                        <CheckCheck className="w-3 h-3 text-sky-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Test Buttons */}
            <div className="p-3 bg-[#17212b] border-t border-slate-800 space-y-2">
              <div className="flex gap-2 overflow-x-auto no-scrollbar text-[11px]">
                <button
                  onClick={() => sendTelegramMessage('🚚 Водитель КамАЗа прибыл на объект. Просьба встретить!', 'delivery_dispatched')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700"
                >
                  📍 Водитель на объекте
                </button>
                <button
                  onClick={() => sendTelegramMessage('💳 Поступила оплата по безналичному расчету (счет #84920). Отгрузка разрешена.', 'payment_confirmed')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700"
                >
                  💳 Оплата поступила
                </button>
              </div>

              {/* Input */}
              <form onSubmit={handleSendCustom} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Отправить сообщение в бот..."
                  value={customMsgInput}
                  onChange={(e) => setCustomMsgInput(e.target.value)}
                  className="flex-1 bg-[#242f3d] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-xl bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Settings */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs bg-[#0e1621]">
            <h3 className="font-bold text-sm text-white">Параметры Telegram Bot API</h3>

            <div>
              <label className="block text-slate-400 mb-1">Имя бота</label>
              <input
                type="text"
                value={telegramSettings.botUsername}
                onChange={(e) => updateTelegramSettings({ botUsername: e.target.value })}
                className="w-full bg-[#17212b] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Telegram Bot Token (HTTP API)</label>
              <input
                type="text"
                value={telegramSettings.botToken}
                onChange={(e) => updateTelegramSettings({ botToken: e.target.value })}
                className="w-full bg-[#17212b] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Chat ID клиента</label>
                <input
                  type="text"
                  value={telegramSettings.customerChatId}
                  onChange={(e) => updateTelegramSettings({ customerChatId: e.target.value })}
                  className="w-full bg-[#17212b] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Chat ID склада / админа</label>
                <input
                  type="text"
                  value={telegramSettings.adminChatId}
                  onChange={(e) => updateTelegramSettings({ adminChatId: e.target.value })}
                  className="w-full bg-[#17212b] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={telegramSettings.notificationsEnabled}
                  onChange={(e) => updateTelegramSettings({ notificationsEnabled: e.target.checked })}
                  className="w-4 h-4 accent-sky-500 rounded"
                />
                <span>Включить мгновенные Push-уведомления</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={telegramSettings.notifyOnStatusChange}
                  onChange={(e) => updateTelegramSettings({ notifyOnStatusChange: e.target.checked })}
                  className="w-4 h-4 accent-sky-500 rounded"
                />
                <span>Уведомлять при смене статуса заказа</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={telegramSettings.notifyOnPayment}
                  onChange={(e) => updateTelegramSettings({ notifyOnPayment: e.target.checked })}
                  className="w-4 h-4 accent-sky-500 rounded"
                />
                <span>Уведомлять при успешной онлайн-оплате</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('chat')}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-colors"
              >
                Сохранить настройки
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
