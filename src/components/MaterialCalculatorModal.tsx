import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Calculator, 
  Layers, 
  Box, 
  Grid, 
  ShieldAlert, 
  ShoppingCart, 
  Check, 
  Sparkles,
  Info,
  ArrowRight
} from 'lucide-react';

export const MaterialCalculatorModal: React.FC = () => {
  const { isCalculatorOpen, setIsCalculatorOpen, products, addToCart, setActiveTab } = useStore();
  const [activeTab, setActiveCalcTab] = useState<'keramzit' | 'brick' | 'gasblock' | 'insulation'>('keramzit');
  const [isAdded, setIsAdded] = useState(false);

  // 1. Keramzit states
  const [kArea, setKArea] = useState<number>(30); // м²
  const [kThickness, setKThickness] = useState<number>(8); // см
  const [kCompactionFactor, setKCompactionFactor] = useState<number>(1.15); // коэффициент усадки
  const [kPackaging, setKPackaging] = useState<'bag' | 'bigbag'>('bag');

  // 2. Brick states
  const [bLength, setBLength] = useState<number>(10); // м
  const [bHeight, setBHeight] = useState<number>(3); // м
  const [bWallThickness, setBWallThickness] = useState<'0.5' | '1' | '1.5' | '2'>('1'); // в кирпичах
  const [bOpeningsArea, setBOpeningsArea] = useState<number>(4); // м² окон и дверей

  // 3. Gasblock states
  const [gPerimeter, setGPerimeter] = useState<number>(40); // м
  const [gHeight, setGHeight] = useState<number>(3); // м
  const [gThickness, setGThickness] = useState<number>(0.3); // 300 мм
  const [gOpeningsArea, setGOpeningsArea] = useState<number>(12); // м²

  // 4. Insulation states
  const [iArea, setIArea] = useState<number>(45); // м²
  const [iLayers, setILayers] = useState<number>(1); // слоев по 50мм

  if (!isCalculatorOpen) return null;

  // Keramzit calculations
  const rawKVolumeM3 = (kArea * (kThickness / 100)) * kCompactionFactor;
  const kVolumeM3 = Math.max(0.1, Number(rawKVolumeM3.toFixed(2)));
  const kBagCount = Math.ceil(kVolumeM3 / 0.05);
  const kBigBagCount = Math.ceil(kVolumeM3);
  const keramzitProductBag = products.find(p => p.sku === 'KR-0510-M50') || products[0];
  const keramzitProductBigBag = products.find(p => p.sku === 'KR-1020-MKR1') || products[2];
  const kEstimatedCost = kPackaging === 'bag' 
    ? (kBagCount >= keramzitProductBag.bulkThreshold ? keramzitProductBag.bulkPrice : keramzitProductBag.price) * kBagCount
    : keramzitProductBigBag.price * kBigBagCount;

  // Brick calculations
  const netWallArea = Math.max(1, (bLength * bHeight) - bOpeningsArea);
  const brickPerM2Map: Record<string, number> = {
    '0.5': 51,
    '1': 102,
    '1.5': 153,
    '2': 204,
  };
  const bricksNeeded = Math.ceil(netWallArea * brickPerM2Map[bWallThickness] * 1.05); // 5% запас
  const brickPalletCount = Math.ceil(bricksNeeded / 330);
  const brickProduct = products.find(p => p.sku === 'BR-RED-M150') || products[4];
  const brickCost = Math.round(bricksNeeded * (bricksNeeded >= brickProduct.bulkThreshold ? brickProduct.bulkPrice : brickProduct.price));
  const cementBagsForBrick = Math.ceil(bricksNeeded * 0.23 / 50); // примерный расход цемента

  // Gasblock calculations
  const gWallArea = Math.max(1, (gPerimeter * gHeight) - gOpeningsArea);
  const gVolumeM3 = Number((gWallArea * gThickness).toFixed(2));
  const gBlocksCount = Math.ceil(gVolumeM3 * 26.6);
  const gPalletsCount = Math.ceil(gVolumeM3 / 1.875);
  const gGlueBags = Math.ceil(gVolumeM3 * 1.2); // ~1.2 мешка клея на 1 м3
  const gasblockProduct = products.find(p => p.sku === 'GB-SILEX-625-300') || products[7];
  const gasblockCost = Math.round(gVolumeM3 * (gVolumeM3 >= gasblockProduct.bulkThreshold ? gasblockProduct.bulkPrice : gasblockProduct.price));

  // Insulation calculations
  const iTotalArea = iArea * iLayers;
  const penoplexPacks = Math.ceil(iTotalArea / 4.85); // 1 пачка = 4.85 м2 при толщине 50мм
  const insulProduct = products.find(p => p.sku === 'INS-PENOPLEX-50') || products[9];
  const insulCost = penoplexPacks * (penoplexPacks >= insulProduct.bulkThreshold ? insulProduct.bulkPrice : insulProduct.price);

  const handleAddCalculatedToCart = () => {
    if (activeTab === 'keramzit') {
      if (kPackaging === 'bag') {
        addToCart(keramzitProductBag, kBagCount);
      } else {
        addToCart(keramzitProductBigBag, kBigBagCount);
      }
    } else if (activeTab === 'brick') {
      addToCart(brickProduct, bricksNeeded);
    } else if (activeTab === 'gasblock') {
      addToCart(gasblockProduct, Math.ceil(gVolumeM3));
    } else if (activeTab === 'insulation') {
      addToCart(insulProduct, penoplexPacks);
    }

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setIsCalculatorOpen(false);
      setActiveTab('cart');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Инженерный калькулятор стройматериалов</h2>
              <p className="text-xs text-slate-500">Точный расчет потребности, объемов и стоимости по ГОСТу</p>
            </div>
          </div>
          <button
            onClick={() => setIsCalculatorOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveCalcTab('keramzit')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'keramzit'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Керамзит</span>
          </button>

          <button
            onClick={() => setActiveCalcTab('brick')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'brick'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Кирпич</span>
          </button>

          <button
            onClick={() => setActiveCalcTab('gasblock')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'gasblock'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">Газобетон</span>
          </button>

          <button
            onClick={() => setActiveCalcTab('insulation')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'insulation'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Пеноплэкс</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: KERAMZIT */}
          {activeTab === 'keramzit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Площадь засыпки ($S$, м²)</label>
                  <input
                    type="number"
                    min={1}
                    value={kArea}
                    onChange={(e) => setKArea(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Толщина слоя ($h$, см)</label>
                  <input
                    type="number"
                    min={1}
                    value={kThickness}
                    onChange={(e) => setKThickness(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Коэффициент уплотнения</label>
                  <select
                    value={kCompactionFactor}
                    onChange={(e) => setKCompactionFactor(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500"
                  >
                    <option value={1.15}>1.15 (Сухая стяжка Кнауф)</option>
                    <option value={1.10}>1.10 (Утепление перекрытий)</option>
                    <option value={1.20}>1.20 (Засыпка фундамента)</option>
                  </select>
                </div>
              </div>

              {/* Packaging select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Предпочтительная тара</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setKPackaging('bag')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      kPackaging === 'bag'
                        ? 'border-amber-500 bg-amber-50/80 text-slate-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">Мешки по 50 литров</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Удобно для ручного подъема на этажи</div>
                  </button>

                  <button
                    onClick={() => setKPackaging('bigbag')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      kPackaging === 'bigbag'
                        ? 'border-amber-500 bg-amber-50/80 text-slate-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">Биг-Бэги (МКР 1 м³)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Экономично для выгрузки манипулятором</div>
                  </button>
                </div>
              </div>

              {/* Results box */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-900">Результаты расчета:</span>
                  <span className="text-xs font-mono font-bold text-amber-800">Объем: {kVolumeM3} м³</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <div className="text-slate-500">Потребность:</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                      {kPackaging === 'bag' ? `${kBagCount} мешков` : `${kBigBagCount} биг-бэгов`}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <div className="text-slate-500">Ориентировочный вес:</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                      ~{(kVolumeM3 * 420).toFixed(0)} кг
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 sm:col-span-1 col-span-2">
                    <div className="text-slate-500">Примерная стоимость:</div>
                    <div className="text-base font-extrabold text-amber-600 mt-0.5">
                      {kEstimatedCost.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRICK */}
          {activeTab === 'brick' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Длина стен ($L$, м)</label>
                  <input
                    type="number"
                    min={1}
                    value={bLength}
                    onChange={(e) => setBLength(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Высота стен ($H$, м)</label>
                  <input
                    type="number"
                    min={1}
                    value={bHeight}
                    onChange={(e) => setBHeight(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Толщина стены</label>
                  <select
                    value={bWallThickness}
                    onChange={(e) => setBWallThickness(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="0.5">В 0.5 кирпича (120 мм) — перегородки</option>
                    <option value="1">В 1.0 кирпич (250 мм) — внутренние несущие</option>
                    <option value="1.5">В 1.5 кирпича (380 мм) — наружные стены</option>
                    <option value="2">В 2.0 кирпича (510 мм) — капитальные стены</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Вычет проемов окон/дверей (м²)</label>
                  <input
                    type="number"
                    min={0}
                    value={bOpeningsArea}
                    onChange={(e) => setBOpeningsArea(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Results box */}
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-rose-900">Результаты расчета кирпича:</span>
                  <span className="text-xs font-mono font-bold text-rose-800">Чистая площадь: {netWallArea} м²</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-rose-200">
                    <div className="text-slate-500">Кирпич М-150:</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">{bricksNeeded} шт</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-rose-200">
                    <div className="text-slate-500">Поддонов (по 330 шт):</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">{brickPalletCount} подд.</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-rose-200">
                    <div className="text-slate-500">Цемент для раствора:</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">{cementBagsForBrick} меш.</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-rose-200">
                    <div className="text-slate-500">Стоимость кирпича:</div>
                    <div className="text-base font-extrabold text-rose-600 mt-0.5">{brickCost.toLocaleString('ru-RU')} ₽</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GASBLOCK */}
          {activeTab === 'gasblock' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Периметр стен ($P$, м)</label>
                  <input
                    type="number"
                    min={1}
                    value={gPerimeter}
                    onChange={(e) => setGPerimeter(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Высота стен ($H$, м)</label>
                  <input
                    type="number"
                    min={1}
                    value={gHeight}
                    onChange={(e) => setGHeight(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Толщина блоков Силекс</label>
                  <select
                    value={gThickness}
                    onChange={(e) => setGThickness(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value={0.3}>300 мм (625х300х200) — стандарт для Сибири</option>
                    <option value={0.4}>400 мм (625х400х200) — повышенное теплосбережение</option>
                    <option value={0.1}>100 мм (625х100х200) — межкомнатные перегородки</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Площадь проемов (м²)</label>
                  <input
                    type="number"
                    min={0}
                    value={gOpeningsArea}
                    onChange={(e) => setGOpeningsArea(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Results box */}
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-blue-900">Результаты расчета газобетона:</span>
                  <span className="text-xs font-mono font-bold text-blue-800">Объем: {gVolumeM3} м³</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <div className="text-slate-500">Кол-во блоков:</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">{gBlocksCount} шт</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <div className="text-slate-500">Поддонов:</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">{gPalletsCount} подд.</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <div className="text-slate-500">Клей для блоков:</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">{gGlueBags} мешков</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <div className="text-slate-500">Стоимость блоков:</div>
                    <div className="text-base font-extrabold text-blue-600 mt-0.5">{gasblockCost.toLocaleString('ru-RU')} ₽</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INSULATION */}
          {activeTab === 'insulation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Площадь утепления ($S$, м²)</label>
                  <input
                    type="number"
                    min={1}
                    value={iArea}
                    onChange={(e) => setIArea(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Количество слоев по 50 мм</label>
                  <select
                    value={iLayers}
                    onChange={(e) => setILayers(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value={1}>1 слой (50 мм) — полы по грунту, балконы</option>
                    <option value={2}>2 слоя (100 мм) — цоколь, фундамент, кровля</option>
                    <option value={3}>3 слоя (150 мм) — энергоэффективные дома</option>
                  </select>
                </div>
              </div>

              {/* Results box */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-emerald-900">Результаты расчета Пеноплэкс XPS:</span>
                  <span className="text-xs font-mono font-bold text-emerald-800">Общая площадь: {iTotalArea} м²</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <div className="text-slate-500">Упаковок (по 4.85 м²):</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">{penoplexPacks} упак.</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <div className="text-slate-500">Объем плит:</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">{(penoplexPacks * 0.243).toFixed(2)} м³</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200 col-span-2 sm:col-span-1">
                    <div className="text-slate-500">Итоговая сумма:</div>
                    <div className="text-base font-extrabold text-emerald-600 mt-0.5">{insulCost.toLocaleString('ru-RU')} ₽</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-amber-500" />
            <span>Расчет включает нормативный запас на подрезку и усадку</span>
          </div>

          <button
            onClick={handleAddCalculatedToCart}
            className={`py-3 px-6 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Добавлено в заказ!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Добавить весь расчет в корзину</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
