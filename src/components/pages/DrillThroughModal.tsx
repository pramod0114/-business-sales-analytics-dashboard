import React, { useMemo } from 'react';
import { useData } from '../../data/dataContext';
import {
  X,
  Package,
  User,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Calendar,
  Star,
  Receipt,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const DrillThroughModal: React.FC = () => {
  const { drillThrough, closeDrillThrough, dataset } = useData();

  if (!drillThrough) return null;

  // Filter all records for this specific product or customer
  const relatedRecords = useMemo(() => {
    if (drillThrough.type === 'product') {
      return dataset.cleanedSales.filter((r) => r.Product_ID === drillThrough.id);
    }
    if (drillThrough.type === 'customer') {
      return dataset.cleanedSales.filter((r) => r.Customer_ID === drillThrough.id);
    }
    return [];
  }, [drillThrough, dataset.cleanedSales]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalSales = Math.round(relatedRecords.reduce((s, r) => s + r.Sales, 0));
    const totalProfit = Math.round(relatedRecords.reduce((s, r) => s + r.Profit, 0));
    const totalQty = relatedRecords.reduce((s, r) => s + r.Quantity, 0);
    const orderCount = relatedRecords.length;
    const aov = orderCount > 0 ? Math.round(totalSales / orderCount) : 0;
    const margin = totalSales > 0 ? Math.round((totalProfit / totalSales) * 1000) / 10 : 0;
    const avgRating =
      orderCount > 0
        ? Math.round((relatedRecords.reduce((s, r) => s + r.Customer_Rating, 0) / orderCount) * 10) / 10
        : 5.0;

    return { totalSales, totalProfit, totalQty, orderCount, aov, margin, avgRating };
  }, [relatedRecords]);

  // Monthly trend for this entity
  const monthlyTrend = useMemo(() => {
    const map = new Map<string, { month: string; sales: number; profit: number }>();
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].forEach((m) => {
      map.set(m, { month: m, sales: 0, profit: 0 });
    });
    relatedRecords.forEach((r) => {
      const entry = map.get(r.Month);
      if (entry) {
        entry.sales += r.Sales;
        entry.profit += r.Profit;
      }
    });
    return Array.from(map.values());
  }, [relatedRecords]);

  const sampleRecord = relatedRecords[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#14141A] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#14141A]/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              {drillThrough.type === 'product' ? <Package className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {drillThrough.type === 'product' ? 'Product 360° View' : 'Customer 360° View'}
                </span>
                <span className="text-xs text-slate-500 font-mono">{drillThrough.id}</span>
              </div>
              <h2 className="text-lg font-serif italic font-semibold text-white mt-0.5">{drillThrough.name}</h2>
            </div>
          </div>
          <button
            onClick={closeDrillThrough}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Metadata & Sub-labels */}
          {sampleRecord && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Category / Segment:</span>
                <div className="font-medium text-slate-200 mt-1">
                  {drillThrough.type === 'product' ? sampleRecord.Category : sampleRecord.Customer_Segment}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Sub-Category / Region:</span>
                <div className="font-medium text-slate-200 mt-1">
                  {drillThrough.type === 'product' ? sampleRecord.Sub_Category : `${sampleRecord.City}, ${sampleRecord.State}`}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">First Order Date:</span>
                <div className="font-medium text-slate-200 mt-1">{sampleRecord.Order_Date}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Customer CSAT:</span>
                <div className="font-medium text-amber-400 flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {stats.avgRating} / 5.0
                </div>
              </div>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Total Revenue</div>
              <div className="text-2xl font-serif text-white font-mono mt-1">${stats.totalSales.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Gross Profit</div>
              <div className="text-2xl font-serif text-emerald-400 font-mono mt-1">${stats.totalProfit.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Profit Margin</div>
              <div className="text-2xl font-serif text-white font-mono mt-1">{stats.margin}%</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Orders / Tx</div>
              <div className="text-2xl font-serif text-purple-300 font-mono mt-1">{stats.orderCount}</div>
            </div>
          </div>

          {/* Monthly Trajectory Chart */}
          <div className="bg-white/5 p-5 rounded-xl border border-white/5">
            <h4 className="text-xs font-serif italic text-slate-200 mb-3">Monthly Sales Trajectory</h4>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#14141A', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '11px', color: '#E2E8F0' }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Sales']}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Related Orders Ledger */}
          <div className="bg-white/5 p-5 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-serif italic text-slate-200">
                Transaction Ledger ({relatedRecords.length} Verified Entries)
              </h4>
            </div>

            <div className="overflow-x-auto max-h-56">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-[#14141A] border-b border-white/10 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-2">Order ID</th>
                    <th className="py-2.5 px-2">Date</th>
                    <th className="py-2.5 px-2">Location</th>
                    <th className="py-2.5 px-2 text-right">Quantity</th>
                    <th className="py-2.5 px-2 text-right">Discount</th>
                    <th className="py-2.5 px-2 text-right">Sales</th>
                    <th className="py-2.5 px-2 text-right">Profit</th>
                    <th className="py-2.5 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {relatedRecords.slice(0, 20).map((r) => (
                    <tr key={`${r.Order_ID}-${r.Product_ID}`} className="hover:bg-white/5">
                      <td className="py-2 px-2 font-mono text-blue-400">{r.Order_ID}</td>
                      <td className="py-2 px-2 text-slate-400">{r.Order_Date}</td>
                      <td className="py-2 px-2 text-slate-300">{r.City}, {r.State}</td>
                      <td className="py-2 px-2 text-right font-mono text-slate-300">{r.Quantity}</td>
                      <td className="py-2 px-2 text-right font-mono text-amber-400">{Math.round(r.Discount * 100)}%</td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-white">${r.Sales.toLocaleString()}</td>
                      <td className={`py-2 px-2 text-right font-mono ${r.Profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${r.Profit.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-slate-300">
                          {r.Order_Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={closeDrillThrough}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-lg shadow-blue-900/30"
          >
            Close Drill-Through
          </button>
        </div>
      </div>
    </div>
  );
};
