import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  RefreshCw, 
  Terminal, 
  Send, 
  Download, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Database, 
  Play, 
  Sparkles,
  Server,
  ArrowRight
} from 'lucide-react';

export const StockSyncApiView: React.FC = () => {
  const { 
    products, 
    syncLogs, 
    triggerStockSync, 
    resetToDefaultData, 
    setActiveTab 
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [activeTab, setActiveSyncTab] = useState<'tester' | 'logs' | 'docs' | 'export'>('tester');

  // JSON payload editor
  const defaultSamplePayload = {
    source: "1C:Enterprise 8.3 (Управление торговлей)",
    warehouseIds: ["krsk-wh-1", "krsk-wh-2", "nsk-wh-1"],
    timestamp: new Date().toISOString(),
    items: [
      {
        sku: "KR-0510-M50",
        price: 245,
        bulkPrice: 215,
        stockKrasnoyarsk: 1480,
        stockNovosibirsk: 850
      },
      {
        sku: "BR-RED-M150",
        price: 18.5,
        bulkPrice: 16.8,
        stockKrasnoyarsk: 49500,
        stockNovosibirsk: 27000
      },
      {
        sku: "GB-SILEX-625-300",
        price: 6850,
        bulkPrice: 6500,
        stockKrasnoyarsk: 195,
        stockNovosibirsk: 110
      }
    ]
  };

  const [jsonPayload, setJsonPayload] = useState(JSON.stringify(defaultSamplePayload, null, 2));

  // Auto sync effect
  useEffect(() => {
    let interval: any;
    if (autoSyncEnabled) {
      interval = setInterval(() => {
        triggerStockSync(undefined, '1C:Enterprise 8.3');
      }, 20000);
    }
    return () => clearInterval(interval);
  }, [autoSyncEnabled]);

  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      const parsed = JSON.parse(jsonPayload);
      await triggerStockSync(parsed, 'REST Webhook');
    } catch {
      await triggerStockSync(undefined, '1C:Enterprise 8.3');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `magnat24_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Server className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">Шлюз интеграции 1С:Предприятие & МойСклад</h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                ONLINE API
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Двусторонняя автоматическая синхронизация остатков на складах Красноярска и Новосибирска, оптовых и розничных цен
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleManualSync}
            disabled={isLoading}
            className="flex-1 md:flex-none py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Синхронизация...' : 'Запустить 1С обмен'}</span>
          </button>
        </div>
      </div>

      {/* 2. Subtabs */}
      <div className="flex border-b border-slate-200 gap-4 text-sm font-bold mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSyncTab('tester')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'tester'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Тестирование API & Редактор JSON</span>
        </button>

        <button
          onClick={() => setActiveSyncTab('logs')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'logs'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Журнал транзакций ({syncLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSyncTab('docs')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'docs'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Документация REST Webhook</span>
        </button>
      </div>

      {/* 3. TAB 1: TESTER & JSON EDITOR */}
      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-600" />
                  <span>Пакет обновления CommerceML / JSON REST (POST /api/v1/sync-stock)</span>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">Content-Type: application/json</span>
              </div>

              <textarea
                value={jsonPayload}
                onChange={(e) => setJsonPayload(e.target.value)}
                rows={14}
                className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-2xl outline-none border border-slate-800 leading-relaxed shadow-inner"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setJsonPayload(JSON.stringify(defaultSamplePayload, null, 2))}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Сбросить к образцу
                </button>

                <button
                  onClick={handleManualSync}
                  disabled={isLoading}
                  className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Отправить JSON в базу данных</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar options */}
          <div className="space-y-4">
            {/* Auto sync scheduler card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Фоновый планировщик обмена</h3>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <div className="font-bold text-slate-800">Автоопрос 1С каждые 20 сек</div>
                  <div className="text-[11px] text-slate-500">Эмуляция динамических складских отгрузок</div>
                </div>

                <input
                  type="checkbox"
                  checked={autoSyncEnabled}
                  onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>✅ Синхронизация остатков по складам «Кутузова», «Борисевича» и «Петухова».</p>
                <p>✅ Автоматическое резервирование товаров при оформлении заказа на сайте.</p>
              </div>

              <button
                onClick={handleExportJSON}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Экспорт каталога товаров (JSON)</span>
              </button>

              <button
                onClick={resetToDefaultData}
                className="w-full py-2 px-4 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors"
              >
                Сбросить базу к эталонным данным
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          {syncLogs.map((log) => {
            const formatted = new Date(log.timestamp).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });

            return (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-900">{log.source}</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      200 OK &bull; {log.executionTimeMs} мс
                    </span>
                  </div>

                  <span className="text-slate-400 font-mono text-[11px]">{formatted}</span>
                </div>

                <div className="text-slate-700">{log.message}</div>

                {log.payloadPreview && (
                  <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                    {log.payloadPreview}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. TAB 3: API DOCS */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <h3 className="text-lg font-black text-slate-900">Интеграция по протоколу REST / CommerceML</h3>
          
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">1. Эндпоинт обновления остатков и цен</h4>
            <div className="bg-slate-900 text-white p-3 rounded-xl font-mono text-xs">
              <span className="text-amber-400 font-bold">POST</span> https://магнат24.рф/api/v1/sync-stock
            </div>
            <p>
              Передавайте массив объектов товаров с полями <code>sku</code>, <code>price</code>, <code>bulkPrice</code>, <code>stockKrasnoyarsk</code>, <code>stockNovosibirsk</code>.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">2. Вебхук событий резервирования</h4>
            <div className="bg-slate-900 text-white p-3 rounded-xl font-mono text-xs">
              <span className="text-sky-400 font-bold">EVENT:</span> order.created &bull; stock.reserved
            </div>
            <p>
              При каждом успешном заказе на сайте сервер отправляет webhook в 1С для мгновенного списания товара и формирования приходно-расходного ордера.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
