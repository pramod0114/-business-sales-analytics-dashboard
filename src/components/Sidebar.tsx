import React from 'react';
import { useData } from '../data/dataContext';
import { DashboardPageId } from '../types';
import {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  Users,
  Globe2,
  Package,
  Truck,
  Target,
  Database,
  GraduationCap,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onSelect?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const { activePage, setActivePage, filteredRecords, filters } = useData();

  const navItems: { id: DashboardPageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'sales', label: 'Sales Performance', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'profitability', label: 'Profitability Matrix', icon: <PieChart className="w-4 h-4" /> },
    { id: 'customers', label: 'Customer Insights', icon: <Users className="w-4 h-4" /> },
    { id: 'geography', label: 'Geographical Analysis', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'products', label: 'Product Performance', icon: <Package className="w-4 h-4" /> },
    { id: 'operations', label: 'Operational Analysis', icon: <Truck className="w-4 h-4" /> },
    { id: 'targets', label: 'Target vs Actual', icon: <Target className="w-4 h-4" /> },
    { id: 'data_quality', label: 'Data Quality & ETL', icon: <Database className="w-4 h-4" /> },
    { id: 'portfolio_hub', label: 'Portfolio & Interview', icon: <GraduationCap className="w-4 h-4" />, badge: 'STAR' },
  ];

  // Dynamic strategy insight based on current region/category filters
  const currentStrategyText = React.useMemo(() => {
    if (filters.regions.length === 1) {
      return `Prioritizing margin expansion & logistics SLA in ${filters.regions[0]} Region.`;
    }
    if (filters.categories.length === 1) {
      return `Targeting high-margin enterprise bundles in ${filters.categories[0]}.`;
    }
    return "'Focusing on high-margin segments in Western Region Q3'";
  }, [filters.regions, filters.categories]);

  return (
    <aside
      id="app-sidebar"
      className="w-64 bg-[#0A0A0B] border-r border-white/10 flex flex-col justify-between shrink-0 select-none min-h-screen"
    >
      {/* Top Brand Logo */}
      <div>
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-serif italic font-bold text-white shadow-lg shadow-blue-600/30 text-lg">
            B
          </div>
          <div>
            <h1 className="font-serif italic font-semibold text-white tracking-tight text-lg leading-tight">
              Vantage Analytics
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              Enterprise BI Suite
            </p>
            <div className="text-[11px] text-blue-400 font-medium mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Dev: Pramod Mahajan</span>
            </div>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">
          {navItems.map((item) => {
            const isActive =
              (item.id === 'overview' && (activePage === 'overview' || activePage === 'executive')) ||
              activePage === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setActivePage(item.id);
                  onSelect?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#151a2d] text-white border border-blue-500/30 shadow-md shadow-blue-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full transition-all ${
                      isActive ? 'bg-blue-400 shadow-sm shadow-blue-400 animate-pulse' : 'bg-transparent group-hover:bg-slate-600'
                    }`}
                  />
                  <span className={`${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {item.icon}
                  </span>
                  <span className={`${isActive ? 'font-semibold text-white' : ''}`}>
                    {item.label}
                  </span>
                </div>

                {item.badge ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-bold">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-3 h-3 transition-transform ${
                      isActive ? 'text-blue-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Callout: Current Strategy Card */}
      <div className="p-4 space-y-3 border-t border-white/10 bg-[#0F0F12]/60">
        <div className="bg-[#121624] border border-blue-500/20 rounded-xl p-3.5 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Current Strategy</span>
          </div>
          <p className="text-xs text-slate-300 italic font-sans leading-relaxed">
            {currentStrategyText}
          </p>
          <div className="text-[10px] text-slate-500 font-mono pt-1">
            Active Dataset: {filteredRecords.length.toLocaleString()} rows
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-mono">
          <span>PIPELINE v2.4</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            SYSTEM HEALTHY
          </span>
        </div>
      </div>
    </aside>
  );
};
