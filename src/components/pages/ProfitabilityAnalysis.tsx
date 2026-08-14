import React, { useMemo, useState } from 'react';
import { useData } from '../../data/dataContext';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  DollarSign,
  Percent,
  AlertOctagon,
  TrendingUp,
  Sliders,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Technology: '#3b82f6',
  Furniture: '#f59e0b',
  'Office Supplies': '#10b981',
};

export const ProfitabilityAnalysis: React.FC = () => {
  const { filteredRecords, daxKpis, openDrillThrough } = useData();
  const [selectedScatterCat, setSelectedScatterCat] = useState<string>('All');

  // Product Scatter Data (Sales vs Profit with Discount & Quantity)
  const productScatterData = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      category: string;
      subCategory: string;
      sales: number;
      profit: number;
      margin: number;
      avgDiscount: number;
      count: number;
    }>();

    filteredRecords.forEach((r) => {
      const curr = map.get(r.Product_ID) || {
        id: r.Product_ID,
        name: r.Product_Name,
        category: r.Category,
        subCategory: r.Sub_Category,
        sales: 0,
        profit: 0,
        margin: 0,
        avgDiscount: 0,
        count: 0,
      };
      curr.sales += r.Sales;
      curr.profit += r.Profit;
      curr.avgDiscount += r.Discount;
      curr.count += 1;
      map.set(r.Product_ID, curr);
    });

    return Array.from(map.values())
      .map((p) => {
        const avgDisc = p.count > 0 ? Math.round((p.avgDiscount / p.count) * 100) : 0;
        const margin = p.sales > 0 ? Math.round((p.profit / p.sales) * 1000) / 10 : 0;
        return {
          ...p,
          sales: Math.round(p.sales),
          profit: Math.round(p.profit),
          margin,
          avgDiscountPct: avgDisc,
        };
      })
      .filter((p) => selectedScatterCat === 'All' || p.category === selectedScatterCat);
  }, [filteredRecords, selectedScatterCat]);

  // Segment Profitability
  const segmentProfitData = useMemo(() => {
    const map = new Map<string, { segment: string; sales: number; profit: number; discountAvg: number; count: number }>();
    filteredRecords.forEach((r) => {
      const curr = map.get(r.Customer_Segment) || {
        segment: r.Customer_Segment,
        sales: 0,
        profit: 0,
        discountAvg: 0,
        count: 0,
      };
      curr.sales += r.Sales;
      curr.profit += r.Profit;
      curr.discountAvg += r.Discount;
      curr.count += 1;
      map.set(r.Customer_Segment, curr);
    });
    return Array.from(map.values()).map((s) => ({
      ...s,
      margin: s.sales > 0 ? Math.round((s.profit / s.sales) * 1000) / 10 : 0,
      avgDiscount: s.count > 0 ? Math.round((s.discountAvg / s.count) * 100) : 0,
    }));
  }, [filteredRecords]);

  // High Sales But Low Profit / Bleeders
  const highSalesLowProfitProducts = useMemo(() => {
    return productScatterData
      .filter((p) => p.sales > 15000 && p.margin < 12)
      .sort((a, b) => a.margin - b.margin);
  }, [productScatterData]);

  // Discount Sensitivity Breakdown
  const discountTierData = useMemo(() => {
    const tiers = [
      { tier: '0% (No Promo)', min: 0, max: 0.001, sales: 0, profit: 0, count: 0 },
      { tier: '1% - 10%', min: 0.001, max: 0.10, sales: 0, profit: 0, count: 0 },
      { tier: '11% - 20%', min: 0.101, max: 0.20, sales: 0, profit: 0, count: 0 },
      { tier: '21% - 30%', min: 0.201, max: 0.30, sales: 0, profit: 0, count: 0 },
      { tier: '31% - 50%+', min: 0.301, max: 1.00, sales: 0, profit: 0, count: 0 },
    ];

    filteredRecords.forEach((r) => {
      const match = tiers.find((t) => r.Discount >= t.min && r.Discount <= t.max);
      if (match) {
        match.sales += r.Sales;
        match.profit += r.Profit;
        match.count += 1;
      }
    });

    return tiers.map((t) => ({
      ...t,
      margin: t.sales > 0 ? Math.round((t.profit / t.sales) * 1000) / 10 : 0,
    }));
  }, [filteredRecords]);

  return (
    <div id="page-profitability-analysis" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif italic font-semibold text-white tracking-tight flex items-center gap-2">
            Profitability & Margin Integrity Analysis
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">
            Margin Erosion Diagnostics &bull; Discount Elasticity Curve &bull; Loss-Making SKU Interception
          </p>
        </div>
      </div>

      {/* Top Profitability KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Gross Profit Generated</div>
          <div className="text-3xl font-serif text-emerald-400 mt-1">${daxKpis.totalProfit.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Cost Basis: ${daxKpis.totalCost.toLocaleString()}</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Blended Profit Margin</div>
          <div className="text-3xl font-serif text-white mt-1">{daxKpis.profitMarginPct}%</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Corporate Target: &ge; 22.0%</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Loss-Making Orders</div>
          <div className="text-3xl font-serif text-rose-400 mt-1">{daxKpis.lossMakingOrders.toLocaleString()}</div>
          <div className="text-[11px] text-rose-400/80 font-medium mt-1">{daxKpis.lossMakingOrdersPct}% of all transactions</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avg Markdown Impact</div>
          <div className="text-3xl font-serif text-amber-400 mt-1">{daxKpis.averageDiscountPct}%</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Promotional discount rate</div>
        </div>
      </div>

      {/* Main Scatter Chart: Sales vs Profit */}
      <div id="scatter-sales-vs-profit" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Sales vs Profit Scatter Analysis (Product Portfolio Matrix)
            </h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
              Each bubble represents a unique SKU. Click any bubble to open full 360° modal
            </p>
          </div>

          {/* Category Filter for Scatter */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-xs">
            {['All', 'Technology', 'Furniture', 'Office Supplies'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedScatterCat(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedScatterCat === cat ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis
                type="number"
                dataKey="sales"
                name="Sales"
                unit="$"
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="number"
                dataKey="profit"
                name="Profit"
                unit="$"
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#14141A', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '12px', color: '#E2E8F0' }}
                formatter={(val: number, name: string) => [
                  `$${val.toLocaleString()}`,
                  name === 'sales' ? 'Revenue' : 'Profit',
                ]}
              />
              <Scatter
                name="Products"
                data={productScatterData}
                onClick={(item) => {
                  if (item && item.id) {
                    openDrillThrough({ type: 'product', id: item.id, name: item.name });
                  }
                }}
              >
                {productScatterData.map((entry, index) => {
                  const isNegative = entry.profit < 0;
                  return (
                    <Cell
                      key={`scatter-cell-${index}`}
                      fill={isNegative ? '#f43f5e' : CATEGORY_COLORS[entry.category] || '#3b82f6'}
                      fillOpacity={0.85}
                      className="cursor-pointer"
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Technology</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Furniture</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Office Supplies</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Loss-Making SKU</span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Top-Right = High Sales &bull; High Margin</span>
        </div>
      </div>

      {/* Row 3: Discount Elasticity & High-Sales Low-Profit Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discount Impact Curve */}
        <div id="chart-discount-elasticity" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-400" />
                Discount Impact on Profit Margin %
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Empirical proof of margin collapse at discount tiers &gt;30%</p>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={discountTierData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="tier" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#14141A', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '12px', color: '#E2E8F0' }}
                  formatter={(val: number) => [`${val}%`, 'Profit Margin']}
                />
                <Bar dataKey="margin" radius={[4, 4, 0, 0]}>
                  {discountTierData.map((entry) => (
                    <Cell
                      key={entry.tier}
                      fill={entry.margin > 20 ? '#10b981' : entry.margin > 10 ? '#f59e0b' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Sales But Low Profit Alert List */}
        <div id="table-margin-bleeders" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-serif italic text-slate-200">Margin Bleeders (High Volume / Low Margin)</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Priority candidates for price renegotiation or discount caps</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-2">Product Name</th>
                  <th className="py-2.5 px-2">Category</th>
                  <th className="py-2.5 px-2 text-right">Sales</th>
                  <th className="py-2.5 px-2 text-right">Profit</th>
                  <th className="py-2.5 px-2 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {highSalesLowProfitProducts.slice(0, 6).map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => openDrillThrough({ type: 'product', id: p.id, name: p.name })}
                  >
                    <td className="py-2.5 px-2 font-medium text-slate-200 truncate max-w-[180px]" title={p.name}>
                      {p.name}
                    </td>
                    <td className="py-2.5 px-2 text-slate-400">{p.category}</td>
                    <td className="py-2.5 px-2 text-right font-mono font-semibold text-white">${p.sales.toLocaleString()}</td>
                    <td className={`py-2.5 px-2 text-right font-mono font-medium ${p.profit < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                      ${p.profit.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold text-[10px]">
                        {p.margin}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
