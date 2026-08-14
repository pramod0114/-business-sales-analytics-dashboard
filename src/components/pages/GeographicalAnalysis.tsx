import React, { useMemo, useState } from 'react';
import { useData } from '../../data/dataContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  Globe2,
  MapPin,
  TrendingUp,
  Building,
  Navigation,
  CheckCircle2,
} from 'lucide-react';

const REGION_COLORS: Record<string, string> = {
  West: '#6366f1',
  East: '#06b6d4',
  Central: '#8b5cf6',
  South: '#ec4899',
};

export const GeographicalAnalysis: React.FC = () => {
  const { filteredRecords, filters, updateFilter } = useData();
  const [selectedGeoRegion, setSelectedGeoRegion] = useState<string>('All');

  // Regional Sales & Profit
  const regionalSummary = useMemo(() => {
    const map = new Map<string, { region: string; sales: number; profit: number; orders: number; states: Set<string> }>();
    ['West', 'East', 'Central', 'South'].forEach((reg) => {
      map.set(reg, { region: reg, sales: 0, profit: 0, orders: 0, states: new Set<string>() });
    });

    filteredRecords.forEach((r) => {
      const entry = map.get(r.Region);
      if (entry) {
        entry.sales += r.Sales;
        entry.profit += r.Profit;
        entry.orders += 1;
        entry.states.add(r.State);
      }
    });

    return Array.from(map.values()).map((r) => ({
      ...r,
      sales: Math.round(r.sales),
      profit: Math.round(r.profit),
      stateCount: r.states.size,
      margin: r.sales > 0 ? Math.round((r.profit / r.sales) * 1000) / 10 : 0,
    }));
  }, [filteredRecords]);

  // State Breakdown
  const stateSummary = useMemo(() => {
    const map = new Map<string, { state: string; region: string; sales: number; profit: number; orders: number }>();
    filteredRecords
      .filter((r) => selectedGeoRegion === 'All' || r.Region === selectedGeoRegion)
      .forEach((r) => {
        const curr = map.get(r.State) || { state: r.State, region: r.Region, sales: 0, profit: 0, orders: 0 };
        curr.sales += r.Sales;
        curr.profit += r.Profit;
        curr.orders += 1;
        map.set(r.State, curr);
      });

    return Array.from(map.values())
      .map((s) => ({
        ...s,
        sales: Math.round(s.sales),
        profit: Math.round(s.profit),
        margin: s.sales > 0 ? Math.round((s.profit / s.sales) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.sales - a.sales);
  }, [filteredRecords, selectedGeoRegion]);

  // Top Cities Breakdown
  const citySummary = useMemo(() => {
    const map = new Map<string, { city: string; state: string; region: string; sales: number; profit: number }>();
    filteredRecords
      .filter((r) => selectedGeoRegion === 'All' || r.Region === selectedGeoRegion)
      .forEach((r) => {
        const key = `${r.City}, ${r.State}`;
        const curr = map.get(key) || { city: r.City, state: r.State, region: r.Region, sales: 0, profit: 0 };
        curr.sales += r.Sales;
        curr.profit += r.Profit;
        map.set(key, curr);
      });

    return Array.from(map.values())
      .map((c) => ({
        ...c,
        sales: Math.round(c.sales),
        profit: Math.round(c.profit),
        margin: c.sales > 0 ? Math.round((c.profit / c.sales) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }, [filteredRecords, selectedGeoRegion]);

  const handleRegionSelect = (reg: string) => {
    setSelectedGeoRegion(reg);
    if (reg === 'All') {
      updateFilter('regions', []);
    } else {
      updateFilter('regions', [reg]);
    }
  };

  return (
    <div id="page-geographical-analysis" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif italic font-semibold text-white tracking-tight flex items-center gap-2">
            Geographical Distribution & Territory Intelligence
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">
            Territory Cartography &bull; State-Level Clustering &bull; Metropolitan Ledger
          </p>
        </div>

        {/* Territory Selector Pills */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-xs">
          {['All', 'West', 'East', 'Central', 'South'].map((reg) => (
            <button
              key={reg}
              id={`geo-region-btn-${reg}`}
              onClick={() => handleRegionSelect(reg)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedGeoRegion === reg ? 'bg-white/10 text-white shadow border border-white/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {reg === 'All' ? 'All Territories' : `${reg} Territory`}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Territory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regionalSummary.map((reg) => {
          const isSelected = selectedGeoRegion === reg.region;
          return (
            <div
              key={reg.region}
              onClick={() => handleRegionSelect(isSelected ? 'All' : reg.region)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-lg ${
                isSelected
                  ? 'bg-[#181822] border-blue-500/50 shadow-blue-900/20'
                  : 'bg-[#14141A] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: REGION_COLORS[reg.region] }} />
                  {reg.region} Region
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{reg.orders.toLocaleString()} orders</span>
              </div>
              <div className="text-2xl font-serif text-white mt-2">${reg.sales.toLocaleString()}</div>
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/5">
                <span className="text-slate-400 text-[11px]">Profit: <span className="text-emerald-400 font-mono font-semibold">${reg.profit.toLocaleString()}</span></span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-semibold">
                  {reg.margin}% margin
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Visual Map & State Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* US Interactive Territory Hub Visual */}
        <div id="interactive-us-territory-map" className="lg:col-span-2 bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-400" />
                US Regional Geospatial Clustering
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Interactive node clusters representing state sales volume and margin efficiency</p>
            </div>
          </div>

          {/* SVG Map / Interactive Geographic Canvas */}
          <div className="relative bg-[#0A0A0B] rounded-xl p-6 border border-white/5 flex items-center justify-center min-h-[300px] overflow-hidden">
            <svg viewBox="0 0 800 450" className="w-full h-auto max-h-[320px]">
              {/* Background US Grid Guidelines */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
              </pattern>
              <rect width="800" height="450" fill="url(#grid)" />

              {/* Geographic Territory Regions Layout */}
              {/* WEST REGION */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleRegionSelect('West')}
              >
                <circle cx="180" cy="180" r="75" fill="#6366f1" fillOpacity={selectedGeoRegion === 'West' ? 0.35 : 0.15} stroke="#6366f1" strokeWidth="2" />
                <circle cx="140" cy="190" r="28" fill="#6366f1" fillOpacity="0.8" />
                <text x="140" y="194" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">CA</text>
                <circle cx="160" cy="110" r="18" fill="#6366f1" fillOpacity="0.8" />
                <text x="160" y="114" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">WA</text>
                <circle cx="210" cy="220" r="16" fill="#6366f1" fillOpacity="0.8" />
                <text x="210" y="224" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">AZ</text>
                <text x="180" y="275" textAnchor="middle" fill="#a5b4fc" fontSize="12" fontWeight="bold">WEST REGION</text>
              </g>

              {/* CENTRAL REGION */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleRegionSelect('Central')}
              >
                <circle cx="410" cy="210" r="85" fill="#8b5cf6" fillOpacity={selectedGeoRegion === 'Central' ? 0.35 : 0.15} stroke="#8b5cf6" strokeWidth="2" />
                <circle cx="420" cy="280" r="26" fill="#8b5cf6" fillOpacity="0.8" />
                <text x="420" y="284" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">TX</text>
                <circle cx="430" cy="160" r="22" fill="#8b5cf6" fillOpacity="0.8" />
                <text x="430" y="164" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">IL</text>
                <circle cx="480" cy="175" r="18" fill="#8b5cf6" fillOpacity="0.8" />
                <text x="480" y="179" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">OH</text>
                <text x="410" y="320" textAnchor="middle" fill="#c4b5fd" fontSize="12" fontWeight="bold">CENTRAL REGION</text>
              </g>

              {/* EAST REGION */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleRegionSelect('East')}
              >
                <circle cx="630" cy="160" r="70" fill="#06b6d4" fillOpacity={selectedGeoRegion === 'East' ? 0.35 : 0.15} stroke="#06b6d4" strokeWidth="2" />
                <circle cx="640" cy="150" r="28" fill="#06b6d4" fillOpacity="0.8" />
                <text x="640" y="154" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">NY</text>
                <circle cx="610" cy="190" r="20" fill="#06b6d4" fillOpacity="0.8" />
                <text x="610" y="194" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">PA</text>
                <circle cx="670" cy="120" r="16" fill="#06b6d4" fillOpacity="0.8" />
                <text x="670" y="124" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">MA</text>
                <text x="630" y="245" textAnchor="middle" fill="#67e8f9" fontSize="12" fontWeight="bold">EAST REGION</text>
              </g>

              {/* SOUTH REGION */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleRegionSelect('South')}
              >
                <circle cx="580" cy="300" r="65" fill="#ec4899" fillOpacity={selectedGeoRegion === 'South' ? 0.35 : 0.15} stroke="#ec4899" strokeWidth="2" />
                <circle cx="610" cy="330" r="24" fill="#ec4899" fillOpacity="0.8" />
                <text x="610" y="334" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">FL</text>
                <circle cx="560" cy="280" r="18" fill="#ec4899" fillOpacity="0.8" />
                <text x="560" y="284" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">GA</text>
                <circle cx="540" cy="240" r="16" fill="#ec4899" fillOpacity="0.8" />
                <text x="540" y="244" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">NC</text>
                <text x="580" y="380" textAnchor="middle" fill="#f472b6" fontSize="12" fontWeight="bold">SOUTH REGION</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Top States & Top Cities List */}
        <div className="space-y-6">
          {/* Top Cities */}
          <div id="table-top-cities" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" />
                Top Cities ({selectedGeoRegion})
              </h3>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {citySummary.map((c, idx) => (
                <div key={`${c.city}-${c.state}`} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-slate-200">{c.city}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{c.state} &bull; {c.region}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white">${c.sales.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{c.margin}% margin</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
