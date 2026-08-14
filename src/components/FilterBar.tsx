import React, { useState, useEffect } from 'react';
import { useData } from '../data/dataContext';
import { DashboardPageId } from '../types';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Globe2,
  Truck,
  Target,
  Filter,
  X,
  ChevronDown,
  Calendar,
  Database,
  GraduationCap,
} from 'lucide-react';

export const FilterBar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    filters,
    updateFilter,
    resetFilters,
    isFiltered,
    availableYears,
    availableRegions,
    availableCategories,
    availableSegments,
    availablePaymentModes,
    availableOrderStatuses,
  } = useData();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.slicer-dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const pages: { id: DashboardPageId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: '1. Executive Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'sales', label: '2. Sales Analysis', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'profitability', label: '3. Profitability', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'customers', label: '4. Customers', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'products', label: '5. Products', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'geography', label: '6. Geography', icon: <Globe2 className="w-3.5 h-3.5" /> },
    { id: 'operations', label: '7. Operations', icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'targets', label: '8. Target vs Actual', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'data_quality', label: '9. Data Quality & ETL', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'portfolio_hub', label: '10. Portfolio Hub', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  ];

  const toggleMultiSelect = (key: 'regions' | 'categories' | 'segments' | 'paymentModes' | 'orderStatuses', value: string) => {
    const current = filters[key];
    const exists = current.includes(value);
    const updated = exists ? current.filter((item) => item !== value) : [...current, value];
    updateFilter(key, updated);
  };

  return (
    <div id="filter-slicer-pane" className="bg-[#0F0F12] border-b border-white/10 text-xs">
      {/* Top row: Page Navigation tabs */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto border-b border-white/5 no-scrollbar">
        <div className="flex items-center gap-1.5 py-2">
          {pages.map((p) => {
            const isActive = (p.id === 'overview' && (activePage === 'overview' || activePage === 'executive')) || activePage === p.id;
            return (
              <button
                key={p.id}
                id={`dashboard-page-tab-${p.id}`}
                onClick={() => setActivePage(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-blue-400 border border-blue-400/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-400' : 'bg-transparent'}`}></div>
                {p.icon}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slicers row */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Interactive Slicer Dropdowns & Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium mr-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Slicers:</span>
          </div>

          {/* Year Pills Slicer */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
            {availableYears.map((yr) => {
              const isSelected = filters.year === yr;
              return (
                <button
                  key={yr}
                  id={`slicer-year-${yr}`}
                  onClick={() => updateFilter('year', yr)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {yr === 'All' ? 'All Years' : yr}
                </button>
              );
            })}
          </div>

          {/* Region Slicer Dropdown */}
          <div className="relative slicer-dropdown-container">
            <button
              id="slicer-dropdown-region"
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'region' ? null : 'region');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                filters.regions.length > 0
                  ? 'bg-blue-600/15 border-blue-500/30 text-blue-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>Region {filters.regions.length > 0 ? `(${filters.regions.length})` : ''}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === 'region' && (
              <div
                className="absolute left-0 mt-1.5 w-44 bg-[#14141A] border border-white/10 rounded-xl shadow-2xl p-2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">Filter Region</div>
                {availableRegions.map((reg) => (
                  <label
                    key={reg}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-md cursor-pointer text-slate-200 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.regions.includes(reg)}
                      onChange={() => toggleMultiSelect('regions', reg)}
                      className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{reg}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Category Slicer Dropdown */}
          <div className="relative slicer-dropdown-container">
            <button
              id="slicer-dropdown-category"
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'category' ? null : 'category');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                filters.categories.length > 0
                  ? 'bg-blue-600/15 border-blue-500/30 text-blue-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>Category {filters.categories.length > 0 ? `(${filters.categories.length})` : ''}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === 'category' && (
              <div
                className="absolute left-0 mt-1.5 w-48 bg-[#14141A] border border-white/10 rounded-xl shadow-2xl p-2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">Filter Category</div>
                {availableCategories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-md cursor-pointer text-slate-200 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat)}
                      onChange={() => toggleMultiSelect('categories', cat)}
                      className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Segment Slicer Dropdown */}
          <div className="relative slicer-dropdown-container">
            <button
              id="slicer-dropdown-segment"
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'segment' ? null : 'segment');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                filters.segments.length > 0
                  ? 'bg-blue-600/15 border-blue-500/30 text-blue-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>Segment {filters.segments.length > 0 ? `(${filters.segments.length})` : ''}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === 'segment' && (
              <div
                className="absolute left-0 mt-1.5 w-44 bg-[#14141A] border border-white/10 rounded-xl shadow-2xl p-2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">Customer Segment</div>
                {availableSegments.map((seg) => (
                  <label
                    key={seg}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-md cursor-pointer text-slate-200 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.segments.includes(seg)}
                      onChange={() => toggleMultiSelect('segments', seg)}
                      className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{seg}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Mode Dropdown */}
          <div className="relative slicer-dropdown-container">
            <button
              id="slicer-dropdown-payment"
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'payment' ? null : 'payment');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                filters.paymentModes.length > 0
                  ? 'bg-blue-600/15 border-blue-500/30 text-blue-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>Payment {filters.paymentModes.length > 0 ? `(${filters.paymentModes.length})` : ''}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === 'payment' && (
              <div
                className="absolute left-0 mt-1.5 w-48 bg-[#14141A] border border-white/10 rounded-xl shadow-2xl p-2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">Payment Method</div>
                {availablePaymentModes.map((pm) => (
                  <label
                    key={pm}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-md cursor-pointer text-slate-200 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.paymentModes.includes(pm)}
                      onChange={() => toggleMultiSelect('paymentModes', pm)}
                      className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{pm}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Order Status Dropdown */}
          <div className="relative slicer-dropdown-container">
            <button
              id="slicer-dropdown-status"
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'status' ? null : 'status');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                filters.orderStatuses.length > 0
                  ? 'bg-blue-600/15 border-blue-500/30 text-blue-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>Status {filters.orderStatuses.length > 0 ? `(${filters.orderStatuses.length})` : ''}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === 'status' && (
              <div
                className="absolute left-0 mt-1.5 w-44 bg-[#14141A] border border-white/10 rounded-xl shadow-2xl p-2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">Order Status</div>
                {availableOrderStatuses.map((st) => (
                  <label
                    key={st}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-md cursor-pointer text-slate-200 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.orderStatuses.includes(st)}
                      onChange={() => toggleMultiSelect('orderStatuses', st)}
                      className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{st}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Active filter badges & Clear button */}
        {isFiltered && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Active filters:</span>
            {filters.regions.map((r) => (
              <span
                key={r}
                className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1"
              >
                {r}
                <X className="w-2.5 h-2.5 cursor-pointer hover:text-white" onClick={() => toggleMultiSelect('regions', r)} />
              </span>
            ))}
            {filters.categories.map((c) => (
              <span
                key={c}
                className="bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1"
              >
                {c}
                <X className="w-2.5 h-2.5 cursor-pointer hover:text-white" onClick={() => toggleMultiSelect('categories', c)} />
              </span>
            ))}
            {filters.segments.map((s) => (
              <span
                key={s}
                className="bg-purple-600/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1"
              >
                {s}
                <X className="w-2.5 h-2.5 cursor-pointer hover:text-white" onClick={() => toggleMultiSelect('segments', s)} />
              </span>
            ))}
            <button
              onClick={resetFilters}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer ml-1 underline underline-offset-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
