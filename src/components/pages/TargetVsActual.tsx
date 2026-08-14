import React, { useMemo, useState } from 'react';
import { useData } from '../../data/dataContext';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Target,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';

export const TargetVsActual: React.FC = () => {
  const { dataset, filters } = useData();
  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(2025);

  const targetsForYear = useMemo(() => {
    return dataset.monthlyTargets.filter((t) => t.Year === selectedTargetYear);
  }, [dataset.monthlyTargets, selectedTargetYear]);

  // Year aggregates
  const yearSummary = useMemo(() => {
    const totalTargetSales = targetsForYear.reduce((s, t) => s + t.Target_Sales, 0);
    const totalActualSales = targetsForYear.reduce((s, t) => s + t.Actual_Sales, 0);
    const totalTargetProfit = targetsForYear.reduce((s, t) => s + t.Target_Profit, 0);
    const totalActualProfit = targetsForYear.reduce((s, t) => s + t.Actual_Profit, 0);

    const salesAch = totalTargetSales > 0 ? Math.round((totalActualSales / totalTargetSales) * 1000) / 10 : 0;
    const profitAch = totalTargetProfit > 0 ? Math.round((totalActualProfit / totalTargetProfit) * 1000) / 10 : 0;
    const salesVar = totalActualSales - totalTargetSales;
    const profitVar = totalActualProfit - totalTargetProfit;

    return {
      totalTargetSales,
      totalActualSales,
      totalTargetProfit,
      totalActualProfit,
      salesAch,
      profitAch,
      salesVar,
      profitVar,
    };
  }, [targetsForYear]);

  return (
    <div id="page-target-vs-actual" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif italic font-semibold text-white tracking-tight flex items-center gap-2">
            Target vs Actual & Variance Analysis
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">
            Budget Realization &bull; Quota Fulfillment Index &bull; Margin Variance Variance Ledger
          </p>
        </div>

        {/* Year Filter for Targets */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-xs">
          {[2023, 2024, 2025].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedTargetYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedTargetYear === yr ? 'bg-white/10 text-white shadow border border-white/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fiscal Year {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Target KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Achievement */}
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sales Target Achievement</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-serif text-white mt-1">{yearSummary.salesAch}%</div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className={`font-mono font-semibold ${yearSummary.salesVar >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {yearSummary.salesVar >= 0 ? '+' : ''}${yearSummary.salesVar.toLocaleString()}
            </span>
            <span className="text-slate-500 text-[11px]">Variance</span>
          </div>
        </div>

        {/* Profit Achievement */}
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Profit Target Achievement</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-serif text-emerald-400 mt-1">{yearSummary.profitAch}%</div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className={`font-mono font-semibold ${yearSummary.profitVar >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {yearSummary.profitVar >= 0 ? '+' : ''}${yearSummary.profitVar.toLocaleString()}
            </span>
            <span className="text-slate-500 text-[11px]">Variance</span>
          </div>
        </div>

        {/* Total Actual vs Budget Sales */}
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Actual Revenue / Target</div>
          <div className="text-2xl font-serif text-white mt-1">
            ${yearSummary.totalActualSales.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 italic mt-1">Target: ${yearSummary.totalTargetSales.toLocaleString()}</div>
        </div>

        {/* Total Actual vs Budget Profit */}
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Actual Profit / Target</div>
          <div className="text-2xl font-serif text-emerald-400 mt-1">
            ${yearSummary.totalActualProfit.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 italic mt-1">Target: ${yearSummary.totalTargetProfit.toLocaleString()}</div>
        </div>
      </div>

      {/* Target vs Actual Chart */}
      <div id="chart-target-vs-actual-trend" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
              Monthly Invoiced Revenue vs Target Quota ({selectedTargetYear})
            </h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Bars represent actual invoiced sales; rose dashed line indicates monthly plan</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
              <span>Actual Sales</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-0.5 bg-rose-400"></span>
              <span>Target Quota</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={targetsForYear} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="Month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#14141A', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '12px', color: '#E2E8F0' }}
                formatter={(val: number, name: string) => [
                  `$${val.toLocaleString()}`,
                  name === 'Actual_Sales' ? 'Actual Sales' : 'Target Sales',
                ]}
              />
              <Bar dataKey="Actual_Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="Target_Sales" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#f43f5e' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Target vs Actual Detailed Breakdown Table */}
      <div id="table-target-breakdown" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Monthly Performance & Variance Ledger ({selectedTargetYear})
            </h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Full audit of monthly sales variance, profit achievement, and status flags</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3 text-right">Target Sales</th>
                <th className="py-2.5 px-3 text-right">Actual Sales</th>
                <th className="py-2.5 px-3 text-right">Sales Variance</th>
                <th className="py-2.5 px-3 text-right">Sales Ach %</th>
                <th className="py-2.5 px-3 text-right">Target Profit</th>
                <th className="py-2.5 px-3 text-right">Actual Profit</th>
                <th className="py-2.5 px-3 text-right">Profit Ach %</th>
                <th className="py-2.5 px-3 text-center">Status Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {targetsForYear.map((t) => (
                <tr key={t.Month} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{t.Month} {t.Year}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">${t.Target_Sales.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">${t.Actual_Sales.toLocaleString()}</td>
                  <td className={`py-2.5 px-3 text-right font-mono font-medium ${t.Sales_Variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.Sales_Variance >= 0 ? '+' : ''}${t.Sales_Variance.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] ${
                      t.Sales_Achievement_Pct >= 105
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : t.Sales_Achievement_Pct >= 95
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {t.Sales_Achievement_Pct}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">${t.Target_Profit.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">${t.Actual_Profit.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{t.Profit_Achievement_Pct}%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      t.Status === 'Exceeded'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : t.Status === 'Achieved'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {t.Status === 'Exceeded' && <CheckCircle className="w-2.5 h-2.5" />}
                      {t.Status === 'Underperformed' && <AlertTriangle className="w-2.5 h-2.5" />}
                      {t.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
