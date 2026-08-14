import React, { useState } from 'react';
import { useData } from '../data/dataContext';
import { AppViewMode } from '../types';
import {
  BarChart3,
  Layers,
  FileSpreadsheet,
  Database,
  Lightbulb,
  GraduationCap,
  Download,
  RotateCcw,
  Search,
  CheckCircle2,
  Share2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import {
  exportCleanedDataToCSV,
  exportRawDataToCSV,
  exportDataDictionaryToCSV,
  exportTargetsToCSV,
} from '../utils/exportUtils';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    activePage,
    setActivePage,
    filteredRecords,
    dataset,
    filters,
    updateFilter,
    resetFilters,
    isFiltered,
    daxKpis
  } = useData();

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const viewModes: { id: AppViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'powerbi', label: 'Power BI Report', icon: <BarChart3 className="w-4 h-4 text-amber-400" /> },
    { id: 'tableau', label: 'Tableau Dashboard', icon: <Layers className="w-4 h-4 text-blue-400" /> },
    { id: 'excel', label: 'Excel Data Hub (5 Sheets)', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> },
    { id: 'data-model', label: 'Star Schema & DAX', icon: <Database className="w-4 h-4 text-purple-400" /> },
    { id: 'insights', label: 'Calculated Insights', icon: <Lightbulb className="w-4 h-4 text-yellow-400" />, badge: 'Live AI' },
    { id: 'portfolio-interview', label: 'Resume & Interview Hub', icon: <GraduationCap className="w-4 h-4 text-rose-400" />, badge: 'Portfolio' },
  ];

  const handleModeClick = (modeId: AppViewMode) => {
    setViewMode(modeId);
    if (modeId === 'excel') {
      setActivePage('data_quality');
    } else if (modeId === 'data-model' || modeId === 'insights' || modeId === 'portfolio-interview') {
      setActivePage('portfolio_hub');
    } else if (modeId === 'powerbi') {
      if (activePage === 'data_quality' || activePage === 'portfolio_hub') {
        setActivePage('overview');
      }
    } else if (modeId === 'tableau') {
      if (activePage === 'data_quality' || activePage === 'portfolio_hub') {
        setActivePage('sales');
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <header id="main-header" className="bg-[#0F0F12]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 shadow-2xl">
      {/* Top row: Brand & Status & Quick Tools */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Title and Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-lg shadow-blue-900/30 border border-blue-400/20">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-serif italic font-semibold text-white tracking-tight flex items-center gap-2">
                Vantage Analytics
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-sans font-semibold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full not-italic">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Enterprise Edition
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide hidden sm:block">
              Executive BI platform integrating Power BI, Tableau, Excel ETL & Star-Schema models.
            </p>
          </div>
        </div>

        {/* Global Live Stats */}
        <div className="hidden xl:flex items-center gap-4 bg-white/5 px-3.5 py-1.5 rounded-lg border border-white/10 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Records:</span>
            <span className="font-semibold text-white font-mono">{filteredRecords.length.toLocaleString()}</span>
            {isFiltered && (
              <span className="text-slate-500 font-mono text-[10px]">
                / {dataset.totalRecordsCount.toLocaleString()}
              </span>
            )}
          </div>
          <div className="h-3 w-px bg-white/10"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Total Revenue:</span>
            <span className="font-bold text-emerald-400 font-mono">${daxKpis.totalSales.toLocaleString()}</span>
          </div>
          <div className="h-3 w-px bg-white/10"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Margin:</span>
            <span className={`font-bold font-mono ${daxKpis.profitMarginPct >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {daxKpis.profitMarginPct}%
            </span>
          </div>
        </div>

        {/* Action Controls & Search */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search orders, customers, SKUs..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="bg-white/5 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500/70 focus:bg-white/10 w-44 sm:w-60 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              id="reset-filters-header-btn"
              onClick={resetFilters}
              title="Reset all active slicers and filters"
              className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Export Dataset Menu */}
          <div className="relative">
            <button
              id="export-data-dropdown-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 text-xs bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showExportMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-[#14141A] border border-white/10 rounded-xl shadow-2xl py-1 z-50 text-xs"
                onClick={() => setShowExportMenu(false)}
              >
                <div className="px-3 py-1.5 border-b border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Download Artifacts
                </div>
                <button
                  id="export-cleaned-csv-btn"
                  onClick={() => exportCleanedDataToCSV(dataset.cleanedSales)}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-medium">Cleaned Sales Dataset (CSV)</div>
                    <div className="text-[10px] text-slate-400">10,250 verified production records</div>
                  </div>
                </button>
                <button
                  id="export-raw-csv-btn"
                  onClick={() => exportRawDataToCSV(dataset.rawSales)}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Database className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-medium">Raw Dirty Dataset (CSV)</div>
                    <div className="text-[10px] text-slate-400">Includes deliberate quality flags & errors</div>
                  </div>
                </button>
                <button
                  id="export-dict-csv-btn"
                  onClick={() => exportDataDictionaryToCSV(dataset.dataDictionary)}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Layers className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-medium">Data Dictionary (CSV)</div>
                    <div className="text-[10px] text-slate-400">Schema descriptions & business rules</div>
                  </div>
                </button>
                <button
                  id="export-targets-csv-btn"
                  onClick={() => exportTargetsToCSV(dataset.monthlyTargets)}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-medium">Monthly Targets vs Actuals (CSV)</div>
                    <div className="text-[10px] text-slate-400">Budget vs actuals variance table</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Share/Copy link button */}
          <button
            id="share-dashboard-btn"
            onClick={handleShare}
            title="Copy Dashboard Link"
            className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-lg transition-all shadow-lg shadow-blue-900/20 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Navigation Tabs */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/5 bg-[#0A0A0B]/60 py-1.5">
        {viewModes.map((mode) => {
          const isActive = viewMode === mode.id;
          return (
            <button
              key={mode.id}
              id={`nav-mode-${mode.id}`}
              onClick={() => handleModeClick(mode.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/10 text-blue-400 border border-blue-400/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-400' : 'bg-transparent'}`}></div>
              {mode.icon}
              <span>{mode.label}</span>
              {mode.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}
                >
                  {mode.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
