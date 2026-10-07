import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Calculator, Check, ArrowRight, Layers, Box, Grid, Shield, Sparkles } from 'lucide-react';

export const MaterialCalculatorScreen: React.FC = () => {
  const { products, addToCart, setActiveTab } = useStore();

  const [activeTask, setActiveTask] = useState<'wall' | 'foundation' | 'screed' | 'insulation' | 'roof' | 'house'>('wall');

  // Wall params
  const [wallLength, setWallLength] = useState<number>(8); // м
  const [wallHeight, setWallHeight] = useState<number>(2.7); // м
  const [wallThickness, setWallThickness] = useState<number>(200); // мм

  // Foundation params
  const [fundPerimeter, setFundPerimeter] = useState<number>(36); // м
  const [fundWidth, setFundWidth] = useState<number>(0.4); // м
  const [fundDepth, setFundDepth] = useState<number>(0.8); // м

  // Screed params
  const [screedArea, setScreedArea] = useState<number>(45); // м²
  const [screedLayer, setScreedLayer] = useState<number>(6); // см

  const [hasCalculated, setHasCalculated] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  // Calculations
  // 1. Wall (Gasblock)
  const wallArea = wallLength * wallHeight;
  const wallVolumeM3 = (wallArea * (wallThickness / 1000));
  const gasblockCount = Math.ceil(wallVolumeM3 * 26.6);
  const glueBags = Math.ceil(wallVolumeM3 * 1.2);
  const rebarRods = Math.ceil(wallLength * (wallHeight / 0.8) * 2 / 3);

  // 2. Foundation
  const fundVolumeM3 = fundPerimeter * fundWidth * fundDepth;
  const cementBags = Math.ceil(fundVolumeM3 * 7); // ~7 мешков цемента на 1м3 бетона
  const fundRebarRods = Math.ceil(fundPerimeter * 4 / 3);

  // 3. Screed
  const screedVolumeM3 = screedArea * (screedLayer / 100);
  const keramzitBags = Math.ceil(screedVolumeM3 * 20); // мешков 50л
  const peskobetonBags = Math.ceil(screedArea * (screedLayer / 10) * 20 / 40);

  const handleAddAllToCart = () => {
    if (activeTask === 'wall') {
      const gb = products.find(p => p.sku === 'GB-SILEX-625-300') || products[2];
      const glue = products.find(p => p.sku === 'KLEY-GB-VOLMA-25') || products[11];
      const arm = products.find(p => p.sku === 'FAST-ARM-12-3M') || products[16];
      addToCart(gb, Math.max(1, Math.ceil(wallVolumeM3)));
      addToCart(glue, glueBags);
      if (arm) addToCart(arm, rebarRods);
    } else if (activeTask === 'foundation') {
      const cem = products.find(p => p.sku === 'CEM-PC500-25') || products[0];
      const arm = products.find(p => p.sku === 'FAST-ARM-12-3M') || products[16];
      addToCart(cem, cementBags);
      if (arm) addToCart(arm, fundRebarRods);
    } else {
      const kr = products.find(p => p.sku === 'KR-0510-M50') || products[6];
      const pesk = products.find(p => p.sku === 'MIX-PESKOBETON-M300') || products[8];
      addToCart(kr, keramzitBags);
      addToCart(pesk, peskobetonBags);
    }

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setActiveTab('cart');
    }, 1200);
  };

  return (
    <div className="pb-28 bg-slate-50 min-h-screen animate-in fade-in duration-150">
      
      {/* Header bar */}
      <div className="px-4 py-4 bg-white border-b border-slate-200">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Рассчитать материалы
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Инженерный расчет без переплат и остатков
        </p>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Step: «Что строим?» */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Что строим?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'wall', label: 'Стена' },
              { id: 'foundation', label: 'Фундамент' },
              { id: 'screed', label: 'Стяжка' },
              { id: 'roof', label: 'Крыша' },
              { id: 'insulation', label: 'Утепление' },
              { id: 'house', label: 'Дом' },
            ].map(task => (
              <button
                key={task.id}
                onClick={() => { setActiveTask(task.id as any); setHasCalculated(true); }}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTask === task.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {task.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Parameters based on Task */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Параметры конструкции
          </h2>

          {activeTask === 'wall' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Длина стены (м)</label>
                <input
                  type="number"
                  value={wallLength}
                  onChange={(e) => setWallLength(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2.5 text-sm font-black text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Высота стены (м)</label>
                <input
                  type="number"
                  step="0.1"
                  value={wallHeight}
                  onChange={(e) => setWallHeight(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2.5 text-sm font-black text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Толщина блока</label>
                <select
                  value={wallThickness}
                  onChange={(e) => setWallThickness(Number(e.target.value))}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value={200}>200 мм (межкомнатные / перегородки)</option>
                  <option value={300}>300 мм (стандарт для Сибири D500)</option>
                  <option value={400}>400 мм (повышенное теплосбережение)</option>
                </select>
              </div>
            </div>
          )}

          {activeTask === 'foundation' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Периметр фундамента (м)</label>
                <input
                  type="number"
                  value={fundPerimeter}
                  onChange={(e) => setFundPerimeter(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2.5 text-sm font-black text-slate-900 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Ширина ленты (м)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fundWidth}
                    onChange={(e) => setFundWidth(Math.max(0.1, Number(e.target.value)))}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-sm font-black text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Глубина ленты (м)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fundDepth}
                    onChange={(e) => setFundDepth(Math.max(0.1, Number(e.target.value)))}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-sm font-black text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTask !== 'wall' && activeTask !== 'foundation' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Площадь (м²)</label>
                <input
                  type="number"
                  value={screedArea}
                  onChange={(e) => setScreedArea(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2.5 text-sm font-black text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Толщина слоя (см)</label>
                <input
                  type="number"
                  value={screedLayer}
                  onChange={(e) => setScreedLayer(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2.5 text-sm font-black text-slate-900 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Calculation Result */}
        {hasCalculated && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <h2 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Вам потребуется:</span>
            </h2>

            <div className="space-y-2 text-xs">
              {activeTask === 'wall' && (
                <>
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                    <span className="text-slate-800">Газоблок Силекс D500:</span>
                    <strong className="text-slate-900 font-black">{gasblockCount} шт. (~{wallVolumeM3.toFixed(1)} м³)</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                    <span className="text-slate-800">Клей для газобетона:</span>
                    <strong className="text-slate-900 font-black">{glueBags} мешков (по 25 кг)</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                    <span className="text-slate-800">Арматура рифленая 12 мм:</span>
                    <strong className="text-slate-900 font-black">{rebarRods} прутков</strong>
                  </div>
                </>
              )}

              {activeTask === 'foundation' && (
                <>
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                    <span className="text-slate-800">Цемент М500 (25 кг):</span>
                    <strong className="text-slate-900 font-black">{cementBags} мешков</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                    <span className="text-slate-800">Арматура 12 мм (3 м):</span>
                    <strong className="text-slate-900 font-black">{fundRebarRods} шт.</strong>
                  </div>
                </>
              )}

              {activeTask !== 'wall' && activeTask !== 'foundation' && (
                <>
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                    <span className="text-slate-800">Керамзит 5-10 мм:</span>
                    <strong className="text-slate-900 font-black">{keramzitBags} мешков</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                    <span className="text-slate-800">Пескобетон М300:</span>
                    <strong className="text-slate-900 font-black">{peskobetonBags} мешков</strong>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleAddAllToCart}
              className={`w-full mt-2 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Добавлено в корзину!</span>
                </>
              ) : (
                <>
                  <span>Добавить всё в корзину</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
