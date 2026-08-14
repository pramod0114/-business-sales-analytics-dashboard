import React, { useState, useMemo } from 'react';
import { useData } from '../../data/dataContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Layers,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  PackageCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

type DrillLevel = 'year' | 'quarter' | 'month' | 'day';

export const SalesAnalysis: React.FC = () => {
  const { filteredRecords, allCleanedRecords, openDrillThrough } = useData();

  // Drill-down State: Year -> Quarter -> Month -> Day
  const [drillLevel, setDrillLevel] = useState<DrillLevel>('year');
  const [selectedYearDrill, setSelectedYearDrill] = useState<number | null>(null);
  const [selectedQuarterDrill, setSelectedQuarterDrill] = useState<string | null>(null);
  const [selectedMonthDrill, setSelectedMonthDrill] = useState<string | null>(null);

  // Sub-Category Aggregation
  const subCategoryData = useMemo(() => {
    const map = new Map<string, { subCat: string; category: string; sales: number; profit: number; quantity: number }>();
    filteredRecords.forEach((r) => {
      const curr = map.get(r.Sub_Category) || {
        subCat: r.Sub_Category,
        category: r.Category,
        sales: 0,
        profit: 0,
        quantity: 0,
      };
      curr.sales += r.Sales;
      curr.profit += r.Profit;
      curr.quantity += r.Quantity;
      map.set(r.Sub_Category, curr);
    });
    return Array.from(map.values()).sort((a, b) => b.sales - a.sales);
  }, [filteredRecords]);

  // State Level Sales
  const stateData = useMemo(() => {
    const map = new Map<string, { state: string; region: string; sales: number; profit: number; orders: number }>();
    filteredRecords.forEach((r) => {
      const curr = map.get(r.State) || {
        state: r.State,
        region: r.Region,
        sales: 0,
        profit: 0,
        orders: 0,
      };
      curr.sales += r.Sales;
      curr.profit += r.Profit;
      curr.orders += 1;
      map.set(r.State, curr);
    });
    return Array.from(map.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }, [filteredRecords]);

  // Dynamic Drill-down Data Generator
  const drillDownChartData = useMemo(() => {
    if (drillLevel === 'year') {
      const yearMap = new Map<number, { period: string; sales: number; profit: number; rawKey: number }>();
      [2023, 2024, 2025].forEach((yr) => {
        yearMap.set(yr, { period: yr.toString(), sales: 0, profit: 0, rawKey: yr });
      });
      filteredRecords.forEach((r) => {
        const entry = yearMap.get(r.Year);
        if (entry) {
          entry.sales += r.Sales;
          entry.profit += r.Profit;
        }
      });
      return Array.from(yearMap.values()).sort((a, b) => a.rawKey - b.rawKey);
    }

    if (drillLevel === 'quarter') {
      const targetYear = selectedYearDrill || 2025;
      const qMap = new Map<string, { period: string; sales: number; profit: number; rawKey: string }>();
      ['Q1', 'Q2', 'Q3', 'Q4'].forEach((q) => {
        qMap.set(q, { period: `${targetYear} ${q}`, sales: 0, profit: 0, rawKey: q });
      });
      filteredRecords
        .filter((r) => r.Year === targetYear)
        .forEach((r) => {
          const entry = qMap.get(r.Quarter);
          if (entry) {
            entry.sales += r.Sales;
            entry.profit += r.Profit;
          }
        });
      return Array.from(qMap.values());
    }

    if (drillLevel === 'month') {
      const targetYear = selectedYearDrill || 2025;
      const targetQ = selectedQuarterDrill || 'Q1';
      const qMonthsMap: Record<string, string[]> = {
        Q1: ['Jan', 'Feb', 'Mar'],
        Q2: ['Apr', 'May', 'Jun'],
        Q3: ['Jul', 'Aug', 'Sep'],
        Q4: ['Oct', 'Nov', 'Dec'],
      };
      const allowedMonths = qMonthsMap[targetQ] || ['Jan', 'Feb', 'Mar'];
      const mMap = new Map<string, { period: string; sales: number; profit: number; rawKey: string }>();
      allowedMonths.forEach((m) => {
        mMap.set(m, { period: `${m} ${targetYear}`, sales: 0, profit: 0, rawKey: m });
      });
      filteredRecords
        .filter((r) => r.Year === targetYear && allowedMonths.includes(r.Month))
        .forEach((r) => {
          const entry = mMap.get(r.Month);
          if (entry) {
            entry.sales += r.Sales;
            entry.profit += r.Profit;
          }
        });
      return Array.from(mMap.values());
    }

    if (drillLevel === 'day') {
      const targetYear = selectedYearDrill || 2025;
      const targetMonth = selectedMonthDrill || 'Jan';
      const dayMap = new Map<string, { period: string; sales: number; profit: number; rawKey: string }>();
      filteredRecords
        .filter((r) => r.Year === targetYear && r.Month === targetMonth)
        .forEach((r) => {
          const day = r.Order_Date.split('-')[2];
          const curr = dayMap.get(day) || { period: `Day ${day}`, sales: 0, profit: 0, rawKey: day };
          curr.sales += r.Sales;
          curr.profit += r.Profit;
          dayMap.set(day, curr);
        });
      return Array.from(dayMap.values()).sort((a, b) => parseInt(a.rawKey) - parseInt(b.rawKey));
    }

    return [];
  }, [drillLevel, selectedYearDrill, selectedQuarterDrill, selectedMonthDrill, filteredRecords]);

  const handleBarClick = (data: any) => {
    if (drillLevel === 'year') {
      setSelectedYearDrill(data.rawKey);
      setDrillLevel('quarter');
    } else if (drillLevel === 'quarter') {
      setSelectedQuarterDrill(data.rawKey);
      setDrillLevel('month');
    } else if (drillLevel === 'month') {
      setSelectedMonthDrill(data.rawKey);
      setDrillLevel('day');
    }
  };

  const resetDrill = () => {
    setDrillLevel('year');
    setSelectedYearDrill(null);
    setSelectedQuarterDrill(null);
    setSelectedMonthDrill(null);
  };

  // YoY & MoM Metrics
  const yoySummary = useMemo(() => {
    const y2023 = allCleanedRecords.filter((r) => r.Year === 2023).reduce((s, r) => s + r.Sales, 0);
    const y2024 = allCleanedRecords.filter((r) => r.Year === 2024).reduce((s, r) => s + r.Sales, 0);
    const y2025 = allCleanedRecords.filter((r) => r.Year === 2025).reduce((s, r) => s + r.Sales, 0);

    const growth24 = y2023 > 0 ? Math.round(((y2024 - y2023) / y2023) * 1000) / 10 : 0;
    const growth25 = y2024 > 0 ? Math.round(((y2025 - y2024) / y2024) * 1000) / 10 : 0;

    return { y2023: Math.round(y2023), y2024: Math.round(y2024), y2025: Math.round(y2025), growth24, growth25 };
  }, [allCleanedRecords]);

  return (
    <div id="page-sales-analysis" className="space-y-6 pb-12">
      {/* Header & Drill Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif italic font-semibold text-white tracking-tight flex items-center gap-2">
            Sales Performance & Growth Hierarchy
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">
            Year-Over-Year Run-Rate &bull; Multi-Level Drill (Year &rarr; Quarter &rarr; Month &rarr; Day)
          </p>
        </div>

        {/* Drill-down Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-xl text-xs">
          <button
            onClick={resetDrill}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
              drillLevel === 'year' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Year
          </button>
          {selectedYearDrill && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <button
                onClick={() => {
                  setDrillLevel('quarter');
                  setSelectedQuarterDrill(null);
                  setSelectedMonthDrill(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                  drillLevel === 'quarter' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {selectedYearDrill} (Qtr)
              </button>
            </>
          )}
          {selectedQuarterDrill && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <button
                onClick={() => {
                  setDrillLevel('month');
                  setSelectedMonthDrill(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                  drillLevel === 'month' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {selectedQuarterDrill} (Mo)
              </button>
            </>
          )}
          {selectedMonthDrill && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-medium shadow-md shadow-blue-900/30">
                {selectedMonthDrill} (Day)
              </span>
            </>
          )}
          {drillLevel !== 'year' && (
            <button
              onClick={resetDrill}
              title="Reset Drill Level"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 ml-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* YoY Summary Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">2023 Total Revenue</div>
          <div className="text-3xl font-serif text-white mt-1">${yoySummary.y2023.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Base fiscal operating year</div>
        </div>
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">2024 Total Revenue</div>
          <div className="text-3xl font-serif text-white mt-1">${yoySummary.y2024.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +{yoySummary.growth24}% YoY Expansion
          </div>
        </div>
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">2025 Total Revenue</div>
          <div className="text-3xl font-serif text-white mt-1">${yoySummary.y2025.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +{yoySummary.growth25}% YoY Expansion
          </div>
        </div>
      </div>

      {/* Main Interactive Drill-down Chart */}
      <div id="hierarchical-drill-chart" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Hierarchical Drill: {drillLevel.toUpperCase()} View
              <span className="text-[10px] font-sans not-italic font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Click any bar to drill deeper
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
              Interactive temporal aggregation simulating Power BI / Tableau matrix navigation
            </p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={drillDownChartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length) {
                  handleBarClick(e.activePayload[0].payload);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#14141A', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '12px', color: '#E2E8F0' }}
                formatter={(val: number) => [`$${val.toLocaleString()}`, 'Sales Volume']}
              />
              <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} className="cursor-pointer">
                {drillDownChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sub-Category Performance & Top States */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sub-Category Breakdown Table */}
        <div id="table-subcategory-breakdown" className="lg:col-span-2 bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Sales & Profit by Sub-Category
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Granular performance ranking across all product lines</p>
            </div>
          </div>

          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-[#14141A] border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-2">Sub-Category</th>
                  <th className="py-2.5 px-2">Category</th>
                  <th className="py-2.5 px-2 text-right">Units</th>
                  <th className="py-2.5 px-2 text-right">Sales ($)</th>
                  <th className="py-2.5 px-2 text-right">Profit ($)</th>
                  <th className="py-2.5 px-2 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subCategoryData.map((sc) => {
                  const margin = sc.sales > 0 ? Math.round((sc.profit / sc.sales) * 1000) / 10 : 0;
                  return (
                    <tr key={sc.subCat} className="hover:bg-white/5 transition-colors">
                      <td className="py-2 px-2 font-medium text-slate-200">{sc.subCat}</td>
                      <td className="py-2 px-2 text-slate-400">{sc.category}</td>
                      <td className="py-2 px-2 text-right font-mono text-slate-400">{sc.quantity.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-mono font-semibold text-white">${sc.sales.toLocaleString()}</td>
                      <td className={`py-2 px-2 text-right font-mono font-medium ${sc.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${sc.profit.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          margin >= 20 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : margin >= 10 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {margin}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 10 States Ranking */}
        <div id="table-top-states" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Top 10 States by Sales
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Leading geographical markets</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {stateData.map((st, idx) => {
              const maxSales = stateData[0].sales || 1;
              const pctOfMax = Math.round((st.sales / maxSales) * 100);
              return (
                <div key={st.state} className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-1.5 font-medium text-slate-200">
                      <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                      <span>{st.state}</span>
                      <span className="text-[10px] text-slate-400">({st.region})</span>
                    </div>
                    <span className="font-mono font-bold text-white">${st.sales.toLocaleString()}</span>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pctOfMax}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
