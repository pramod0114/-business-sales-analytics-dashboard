import React, { useMemo } from 'react';
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
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Award,
  TrendingUp,
} from 'lucide-react';

export const ExecutiveOverview: React.FC = () => {
  const { filteredRecords, daxKpis, openDrillThrough, filters } = useData();

  // Monthly Sales & Forecast data with peak identification
  const { trendData, peakMonth, totalRevFormatted, grossProfitFormatted, profitMarginFormatted, aovFormatted } = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map = new Map<string, { month: string; monthNum: number; sales: number; forecast: number; isForecast: boolean }>();

    months.forEach((m, idx) => {
      // Months after September in current baseline can be marked as forecast or run-rate
      const isForecast = idx >= 9;
      map.set(m, { month: m, monthNum: idx + 1, sales: 0, forecast: 0, isForecast });
    });

    filteredRecords.forEach((r) => {
      const entry = map.get(r.Month);
      if (entry) {
        entry.sales += r.Sales;
      }
    });

    let maxSales = 0;
    let peakM = 'Jun';

    // Calculate baseline forecast and find peak
    const list = Array.from(map.values()).sort((a, b) => a.monthNum - b.monthNum);
    const avgSales = list.reduce((acc, curr) => acc + curr.sales, 0) / (list.filter(x => !x.isForecast).length || 1);

    list.forEach((item) => {
      if (item.sales > maxSales && !item.isForecast) {
        maxSales = item.sales;
        peakM = item.month;
      }
      // Provide forecast projection for future months if zero
      if (item.isForecast && item.sales === 0) {
        item.forecast = Math.round(avgSales * (1 + (item.monthNum % 3) * 0.08));
      }
    });

    // Formatted KPIs
    const revM = daxKpis.totalSales >= 1000000 
      ? `$${(daxKpis.totalSales / 1000000).toFixed(2)}M` 
      : `$${(daxKpis.totalSales / 1000).toFixed(1)}K`;

    const gpK = daxKpis.totalProfit >= 1000000
      ? `$${(daxKpis.totalProfit / 1000000).toFixed(2)}M`
      : `$${(daxKpis.totalProfit / 1000).toFixed(1)}K`;

    return {
      trendData: list,
      peakMonth: peakM,
      totalRevFormatted: revM,
      grossProfitFormatted: gpK,
      profitMarginFormatted: `${daxKpis.profitMarginPct}%`,
      aovFormatted: `$${daxKpis.averageOrderValue.toFixed(2)}`,
    };
  }, [filteredRecords, daxKpis]);

  // Category Distribution & totals
  const categorySummary = useMemo(() => {
    const map = new Map<string, number>();
    map.set('Technology', 0);
    map.set('Furniture', 0);
    map.set('Office Supplies', 0);

    filteredRecords.forEach((r) => {
      map.set(r.Category, (map.get(r.Category) || 0) + r.Sales);
    });

    const total = Array.from(map.values()).reduce((a, b) => a + b, 0) || 1;
    const items = [
      { name: 'Technology', sales: map.get('Technology') || 0, color: '#3b82f6' },
      { name: 'Furniture', sales: map.get('Furniture') || 0, color: '#60a5fa' },
      { name: 'Office Supplies', sales: map.get('Office Supplies') || 0, color: '#93c5fd' },
    ];

    return {
      items: items.map((i) => ({
        ...i,
        percent: Math.round((i.sales / total) * 100),
        formatted: i.sales >= 1000000 ? `$${(i.sales / 1000000).toFixed(2)}M` : `$${(i.sales / 1000).toFixed(1)}K`,
      })),
      total,
    };
  }, [filteredRecords]);

  // Top 5 Products by Sales
  const topProducts = useMemo(() => {
    const map = new Map<string, { id: string; name: string; category: string; sales: number; profit: number }>();
    filteredRecords.forEach((r) => {
      const curr = map.get(r.Product_ID) || { id: r.Product_ID, name: r.Product_Name, category: r.Category, sales: 0, profit: 0 };
      curr.sales += r.Sales;
      curr.profit += r.Profit;
      map.set(r.Product_ID, curr);
    });
    return Array.from(map.values()).sort((a, b) => b.sales - a.sales).slice(0, 5);
  }, [filteredRecords]);

  // Bottom 5 Products (Loss Makers)
  const bottomProducts = useMemo(() => {
    const map = new Map<string, { id: string; name: string; category: string; sales: number; profit: number }>();
    filteredRecords.forEach((r) => {
      const curr = map.get(r.Product_ID) || { id: r.Product_ID, name: r.Product_Name, category: r.Category, sales: 0, profit: 0 };
      curr.sales += r.Sales;
      curr.profit += r.Profit;
      map.set(r.Product_ID, curr);
    });
    return Array.from(map.values()).sort((a, b) => a.profit - b.profit).slice(0, 5);
  }, [filteredRecords]);

  return (
    <div id="page-executive-overview" className="space-y-6 pb-12">
      {/* 4 Top Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Revenue */}
        <div
          id="kpi-total-revenue"
          className="bg-[#111116] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-blue-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Revenue</span>
            <Activity className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-serif text-white tracking-tight font-medium">
              {totalRevFormatted}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="font-semibold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{daxKpis.salesGrowthPct}%
              </span>
              <span className="text-slate-500 italic">vs Prev Period</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Gross Profit */}
        <div
          id="kpi-gross-profit"
          className="bg-[#111116] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-emerald-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Gross Profit</span>
            <DollarSign className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-serif text-white tracking-tight font-medium">
              {grossProfitFormatted}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="font-semibold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{daxKpis.profitGrowthPct}%
              </span>
              <span className="text-slate-500 italic">Target: $450K</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Profit Margin */}
        <div
          id="kpi-profit-margin"
          className="bg-[#111116] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-amber-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Profit Margin</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-mono">
              Benchmark
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-serif text-white tracking-tight font-medium">
              {profitMarginFormatted}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="font-semibold text-amber-400 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
                -1.1%
              </span>
              <span className="text-slate-500 italic">Margin compression</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Average Order */}
        <div
          id="kpi-average-order"
          className="bg-[#111116] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-purple-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Order</span>
            <span className="text-[10px] text-slate-500 font-mono">AOV</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-serif text-white tracking-tight font-medium">
              {aovFormatted}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="font-semibold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +4.6%
              </span>
              <span className="text-slate-500 italic">AOV Growth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Revenue & Forecast Trends + Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 cols): Revenue & Forecast Trends */}
        <div
          id="chart-revenue-forecast"
          className="lg:col-span-8 bg-[#111116] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-lg font-serif italic font-semibold text-white tracking-tight">
              Revenue & Forecast Trends
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Actual Sales</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full border border-dashed border-blue-400 bg-transparent"></span>
                <span>Forecast</span>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-72 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                  contentStyle={{
                    backgroundColor: '#14141A',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#E2E8F0',
                  }}
                  formatter={(val: number, name: string) => [
                    `$${val.toLocaleString()}`,
                    name === 'sales' ? 'Actual Sales' : 'Projected Forecast',
                  ]}
                />
                {/* Regular Bars for Actuals */}
                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                  {trendData.map((entry) => (
                    <Cell
                      key={`cell-${entry.month}`}
                      fill={entry.month === peakMonth ? '#3b82f6' : '#1e3a8a'}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
                {/* Dashed Bars for Forecast */}
                <Bar
                  dataKey="forecast"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Peak Tag Overlay */}
            <div className="absolute top-1 left-[43%] transform -translate-x-1/2 flex flex-col items-center">
              <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase font-mono">
                Peak
              </span>
            </div>
          </div>
        </div>

        {/* Right (4 cols): Category Distribution */}
        <div
          id="card-category-distribution"
          className="lg:col-span-4 bg-[#111116] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-serif italic font-semibold text-white tracking-tight mb-5">
              Category Distribution
            </h3>

            {/* Category Bars */}
            <div className="space-y-4">
              {categorySummary.items.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.name}</span>
                    <span className="font-mono text-white font-semibold">{cat.formatted}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percent}%`,
                        backgroundColor: '#3b82f6',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INSIGHT Box */}
          <div className="mt-6 p-4 rounded-xl bg-[#151a28] border border-blue-500/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Insight</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              Technology sector seeing 4.2% margin expansion due to high-value enterprise server sales and optimized discount governance.
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Top Performing & Loss-Making Products with 360° Drill-Through */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Products */}
        <div className="bg-[#111116] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-serif italic text-slate-200">Top Revenue Drivers (Drillable)</h3>
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Click to Inspect 360°</span>
          </div>
          <div className="divide-y divide-white/5">
            {topProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => openDrillThrough({ type: 'product', id: p.id, name: p.name })}
                className="py-3 flex items-center justify-between hover:bg-white/5 px-2 rounded-lg cursor-pointer transition-colors group"
              >
                <div>
                  <div className="text-xs font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{p.category} &bull; {p.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white">${p.sales.toLocaleString()}</div>
                  <div className="text-[10px] font-mono text-emerald-400">+${p.profit.toLocaleString()} Profit</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 5 Products (Loss Makers) */}
        <div className="bg-[#111116] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-serif italic text-slate-200">Margin Leakage / Loss Makers</h3>
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Action Required</span>
          </div>
          <div className="divide-y divide-white/5">
            {bottomProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => openDrillThrough({ type: 'product', id: p.id, name: p.name })}
                className="py-3 flex items-center justify-between hover:bg-white/5 px-2 rounded-lg cursor-pointer transition-colors group"
              >
                <div>
                  <div className="text-xs font-medium text-slate-200 group-hover:text-rose-400 transition-colors">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{p.category} &bull; {p.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-300">${p.sales.toLocaleString()}</div>
                  <div className="text-[10px] font-mono text-rose-400">-${Math.abs(p.profit).toLocaleString()} Loss</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
