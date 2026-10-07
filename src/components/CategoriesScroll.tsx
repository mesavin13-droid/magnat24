import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { 
  Layers, 
  Home, 
  Trees, 
  Box, 
  Grid, 
  ShieldAlert, 
  Sparkles, 
  Wrench, 
  Hammer, 
  Zap, 
  Droplet 
} from 'lucide-react';

export const CategoriesScroll: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setActiveTab } = useStore();

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'building-materials': return <Layers className="w-5 h-5 text-amber-600" />;
      case 'roofing': return <Home className="w-5 h-5 text-amber-600" />;
      case 'timber': return <Trees className="w-5 h-5 text-amber-600" />;
      case 'brick': return <Box className="w-5 h-5 text-amber-600" />;
      case 'aerated-concrete': return <Grid className="w-5 h-5 text-amber-600" />;
      case 'insulation': return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'dry-mixes': return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'fasteners': return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'tools': return <Hammer className="w-5 h-5 text-amber-600" />;
      case 'electrical': return <Zap className="w-5 h-5 text-amber-600" />;
      case 'plumbing': return <Droplet className="w-5 h-5 text-amber-600" />;
      default: return <Layers className="w-5 h-5 text-amber-600" />;
    }
  };

  const handleCategoryClick = (catId: string) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(catId);
    }
    setActiveTab('catalog');
  };

  return (
    <div className="py-2">
      <div className="px-4 flex items-center justify-between mb-2.5">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Категории</h2>
        <button
          onClick={() => { setSelectedCategory(null); setActiveTab('catalog'); }}
          className="text-xs font-bold text-amber-600 hover:text-amber-700"
        >
          Все в каталоге &rarr;
        </button>
      </div>

      {/* Horizontal scroll of neat categories */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-4 pb-2 pt-0.5">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-2xs select-none active:scale-95 ${
                isSelected
                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-amber-400/50' : 'bg-slate-100'
              }`}>
                {getCategoryIcon(cat.id)}
              </div>
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
