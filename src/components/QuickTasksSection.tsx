import React from 'react';
import { QUICK_BUILD_TASKS } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { Layers, Home, Sparkles, Box, Shield, Trees, ArrowRight } from 'lucide-react';

export const QuickTasksSection: React.FC = () => {
  const { selectedTaskFilter, setSelectedTaskFilter, setActiveTab, setSearchQuery } = useStore();

  const getTaskIcon = (id: string) => {
    switch (id) {
      case 'foundation': return <Layers className="w-5 h-5 text-amber-500" />;
      case 'house': return <Home className="w-5 h-5 text-amber-500" />;
      case 'renovation': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'walls': return <Box className="w-5 h-5 text-amber-500" />;
      case 'roof': return <Shield className="w-5 h-5 text-amber-500" />;
      case 'dacha': return <Trees className="w-5 h-5 text-amber-500" />;
      default: return <Home className="w-5 h-5 text-amber-500" />;
    }
  };

  const handleSelectTask = (task: typeof QUICK_BUILD_TASKS[0]) => {
    setSelectedTaskFilter(task.id);
    setSearchQuery('');
    setActiveTab('catalog');
  };

  return (
    <div className="py-2.5">
      <div className="px-4 flex items-center justify-between mb-2.5">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Что строите?</h2>
          <p className="text-[11px] text-slate-500 font-medium">Готовые подборки материалов без лишнего поиска</p>
        </div>
      </div>

      {/* Grid 3x2 on mobile */}
      <div className="grid grid-cols-3 gap-2 px-4">
        {QUICK_BUILD_TASKS.map((task) => {
          const isSelected = selectedTaskFilter === task.id;

          return (
            <button
              key={task.id}
              onClick={() => handleSelectTask(task)}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all select-none active:scale-95 shadow-2xs ${
                isSelected
                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-black'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                isSelected ? 'bg-amber-400/50' : 'bg-slate-100'
              }`}>
                {getTaskIcon(task.id)}
              </div>
              <span className="text-xs font-bold leading-tight">{task.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
