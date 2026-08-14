import React, { useState, useEffect } from 'react';
import { useData } from '../data/dataContext';
import { AppViewMode } from '../types';
import {
  Download,
  Calendar,
  MapPin,
  Filter,
  RotateCcw,
  Printer,
  ChevronDown,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const {
    activePage,
    setActivePage,
    viewMode,
    setViewMode,
    filters,
    updateFilter,
    resetFilters,
    isFiltered,
    filteredRecords,
    availableRegions,
    availableCategories,
  } = useData();

  const [regionOpen, setRegionOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.topnav-dropdown-container')) {
        setRegionOpen(false);
        setTimelineOpen(false);
        setCategoryOpen(false);
        setModeOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Compute selected region label
  const regionLabel = React.useMemo(() => {
    if (filters.regions.length === 0) return 'All Regions';
    if (filters.regions.length === 1) return filters.regions[0];
    return `${filters.regions.length} Regions`;
  }, [filters.regions]);

  // Compute selected timeline label
  const timelineLabel = React.useMemo(() => {
    if (filters.quarter !== 'All' && filters.year !== 'All') {
      return `${filters.quarter} ${filters.year}`;
    }
    if (filters.quarter !== 'All') return `${filters.quarter}`;
    if (filters.year !== 'All') return `${filters.year}`;
    return 'Q3 2023'; // Default stylish preset or All Time
  }, [filters.quarter, filters.year]);

  // Handle Region Selection
  const handleSelectRegion = (region: string) => {
    if (region === 'All') {
      updateFilter('regions', []);
    } else {
      // Toggle or single select
      if (filters.regions.includes(region)) {
        updateFilter(
          'regions',
          filters.regions.filter((r) => r !== region)
        );
      } else {
        updateFilter('regions', [region]);
      }
    }
  };

  // Handle Timeline Selection
  const handleSelectTimeline = (option: { year: string; quarter: string }) => {
    updateFilter('year', option.year);
    updateFilter('quarter', option.quarter);
    setTimelineOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;
    const headers = Object.keys(filteredRecords[0]).join(',');
    const rows = filteredRecords.map((r) =>
      Object.values(r)
        .map((val) => `"${val}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vantage_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF / Print
  const handleExportPDF = () => {
    window.print();
  };

  // Dynamic Title
  const pageTitle = React.useMemo(() => {
    switch (activePage) {
      case 'overview':
      case 'executive':
        return 'Performance Analytics';
      case 'sales':
        return 'Sales & Revenue Trajectory';
      case 'profitability':
        return 'Profitability & Margin Analysis';
      case 'customers':
        return 'Customer Analytics & Retention';
      case 'products':
        return 'Product Performance & Matrix';
      case 'geography':
        return 'Geographical Distribution';
      case 'operations':
        return 'Operational Logistics & SLAs';
      case 'targets':
        return 'Target vs Actual Quotas';
      case 'data_quality':
        return 'Data Quality Hub & ETL Pipeline';
      case 'portfolio_hub':
        return 'Portfolio & Interview Case Study';
      default:
        return 'Performance Analytics';
    }
  }, [activePage]);

  const timelineOptions = [
    { label: 'Q3 2023 (Baseline)', year: '2023', quarter: 'Q3' },
    { label: 'Q1 2023', year: '2023', quarter: 'Q1' },
    { label: 'Q2 2023', year: '2023', quarter: 'Q2' },
    { label: 'Q4 2023', year: '2023', quarter: 'Q4' },
    { label: 'Full Year 2024', year: '2024', quarter: 'All' },
    { label: 'Full Year 2023', year: '2023', quarter: 'All' },
    { label: 'Full Year 2025', year: '2025', quarter: 'All' },
    { label: 'All Historical Time', year: 'All', quarter: 'All' },
  ];

  return (
    <header className="h-20 border-b border-white/10 bg-[#0A0A0B]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Title & Timestamp */}
      <div>
        <h2 className="text-2xl font-serif italic font-semibold text-white tracking-tight">
          {pageTitle}
        </h2>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
          <span>LAST DATA SYNC: TODAY, 08:45 AM</span>
          <span>&bull;</span>
          <span className="text-blue-400 font-medium">LIVE TELEMETRY</span>
          <span>&bull;</span>
          <span className="text-emerald-400 font-medium lowercase first-letter:uppercase">Developed by Pramod Mahajan</span>
        </div>
      </div>

      {/* Slicers and Action Buttons */}
      <div className="flex items-center gap-3">
        {/* 1. Region Dropdown */}
        <div className="relative topnav-dropdown-container">
          <button
            id="topnav-dropdown-region"
            onClick={(e) => {
              e.stopPropagation();
              setRegionOpen(!regionOpen);
              setTimelineOpen(false);
              setCategoryOpen(false);
              setModeOpen(false);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filters.regions.length > 0
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-600/20'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{regionLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {regionOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-[#14141A] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1.5 tracking-wider border-b border-white/5 mb-1">
                Select Region
              </div>
              <button
                onClick={() => {
                  handleSelectRegion('All');
                  setRegionOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  filters.regions.length === 0 ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>All Regions (Global)</span>
                {filters.regions.length === 0 && <Check className="w-3.5 h-3.5" />}
              </button>

              {availableRegions.map((reg) => {
                const isSelected = filters.regions.includes(reg);
                return (
                  <button
                    key={reg}
                    onClick={() => {
                      handleSelectRegion(reg);
                      setRegionOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{reg} Region</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Timeline Dropdown */}
        <div className="relative topnav-dropdown-container">
          <div className="text-[9px] uppercase font-mono text-slate-500 absolute -top-4 left-1">Timeline</div>
          <button
            id="topnav-dropdown-timeline"
            onClick={(e) => {
              e.stopPropagation();
              setTimelineOpen(!timelineOpen);
              setRegionOpen(false);
              setCategoryOpen(false);
              setModeOpen(false);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filters.year !== 'All' || filters.quarter !== 'All'
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-600/20'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{timelineLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {timelineOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-[#14141A] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1.5 tracking-wider border-b border-white/5 mb-1">
                Select Time Horizon
              </div>
              {timelineOptions.map((opt) => {
                const isSelected = filters.year === opt.year && filters.quarter === opt.quarter;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectTimeline(opt)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Category Filter Dropdown */}
        <div className="relative topnav-dropdown-container">
          <button
            id="topnav-dropdown-category"
            onClick={(e) => {
              e.stopPropagation();
              setCategoryOpen(!categoryOpen);
              setRegionOpen(false);
              setTimelineOpen(false);
              setModeOpen(false);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filters.categories.length > 0
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-600/20'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {filters.categories.length === 0
                ? 'Category'
                : filters.categories.length === 1
                ? filters.categories[0]
                : `${filters.categories.length} Categories`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {categoryOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-[#14141A] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1.5 tracking-wider border-b border-white/5 mb-1">
                Filter Category
              </div>
              <button
                onClick={() => {
                  updateFilter('categories', []);
                  setCategoryOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  filters.categories.length === 0 ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>All Categories</span>
                {filters.categories.length === 0 && <Check className="w-3.5 h-3.5" />}
              </button>

              {availableCategories.map((cat) => {
                const isSelected = filters.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      if (isSelected) {
                        updateFilter(
                          'categories',
                          filters.categories.filter((c) => c !== cat)
                        );
                      } else {
                        updateFilter('categories', [cat]);
                      }
                      setCategoryOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Reset Filters Button */}
        {isFiltered && (
          <button
            id="topnav-btn-reset-filters"
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors cursor-pointer"
            title="Reset all active slicers and filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* 5. Export CSV Button */}
        <button
          id="topnav-btn-export-csv"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
          title="Download filtered dataset as CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">CSV</span>
        </button>

        {/* 6. Export PDF Button */}
        <button
          id="topnav-btn-export-pdf"
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          title="Export formatted executive PDF summary"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
};
