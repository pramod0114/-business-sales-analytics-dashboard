import React, { useMemo } from 'react';
import { useData } from '../../data/dataContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Users,
  UserCheck,
  UserPlus,
  Star,
  Receipt,
  HeartHandshake,
  ExternalLink,
  Crown,
} from 'lucide-react';

const SEGMENT_COLORS: Record<string, string> = {
  Consumer: '#3b82f6',
  Corporate: '#8b5cf6',
  'Home Office': '#10b981',
};

const AGE_COLORS: Record<string, string> = {
  '18-25': '#06b6d4',
  '26-35': '#3b82f6',
  '36-50': '#8b5cf6',
  '51+': '#ec4899',
};

export const CustomerAnalysis: React.FC = () => {
  const { filteredRecords, daxKpis, openDrillThrough } = useData();

  // Segment Breakdown
  const segmentData = useMemo(() => {
    const map = new Map<string, { segment: string; sales: number; profit: number; customers: Set<string>; orders: number }>();
    filteredRecords.forEach((r) => {
      const curr = map.get(r.Customer_Segment) || {
        segment: r.Customer_Segment,
        sales: 0,
        profit: 0,
        customers: new Set<string>(),
        orders: 0,
      };
      curr.sales += r.Sales;
      curr.profit += r.Profit;
      curr.customers.add(r.Customer_ID);
      curr.orders += 1;
      map.set(r.Customer_Segment, curr);
    });

    return Array.from(map.values()).map((s) => ({
      segment: s.segment,
      sales: Math.round(s.sales),
      profit: Math.round(s.profit),
      custCount: s.customers.size,
      aov: s.orders > 0 ? Math.round(s.sales / s.orders) : 0,
      margin: s.sales > 0 ? Math.round((s.profit / s.sales) * 1000) / 10 : 0,
    }));
  }, [filteredRecords]);

  // Gender Breakdown
  const genderData = useMemo(() => {
    const map = new Map<string, { gender: string; sales: number; profit: number }>();
    filteredRecords.forEach((r) => {
      const curr = map.get(r.Gender) || { gender: r.Gender, sales: 0, profit: 0 };
      curr.sales += r.Sales;
      curr.profit += r.Profit;
      map.set(r.Gender, curr);
    });
    return Array.from(map.values()).map((g) => ({
      ...g,
      sales: Math.round(g.sales),
    }));
  }, [filteredRecords]);

  // Age Group Breakdown
  const ageGroupData = useMemo(() => {
    const map = new Map<string, { ageGroup: string; sales: number; profit: number; orders: number }>();
    ['18-25', '26-35', '36-50', '51+'].forEach((ag) => {
      map.set(ag, { ageGroup: ag, sales: 0, profit: 0, orders: 0 });
    });
    filteredRecords.forEach((r) => {
      const entry = map.get(r.Age_Group);
      if (entry) {
        entry.sales += r.Sales;
        entry.profit += r.Profit;
        entry.orders += 1;
      }
    });
    return Array.from(map.values()).map((ag) => ({
      ...ag,
      sales: Math.round(ag.sales),
      profit: Math.round(ag.profit),
    }));
  }, [filteredRecords]);

  // Top 10 Customers by Revenue
  const topCustomers = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      segment: string;
      region: string;
      orders: number;
      sales: number;
      profit: number;
      avgRating: number;
      totalRating: number;
    }>();

    filteredRecords.forEach((r) => {
      const curr = map.get(r.Customer_ID) || {
        id: r.Customer_ID,
        name: r.Customer_Name,
        segment: r.Customer_Segment,
        region: r.Region,
        orders: 0,
        sales: 0,
        profit: 0,
        avgRating: 0,
        totalRating: 0,
      };
      curr.orders += 1;
      curr.sales += r.Sales;
      curr.profit += r.Profit;
      curr.totalRating += r.Customer_Rating;
      map.set(r.Customer_ID, curr);
    });

    return Array.from(map.values())
      .map((c) => ({
        ...c,
        sales: Math.round(c.sales),
        profit: Math.round(c.profit),
        avgRating: c.orders > 0 ? Math.round((c.totalRating / c.orders) * 10) / 10 : 5.0,
        margin: c.sales > 0 ? Math.round((c.profit / c.sales) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }, [filteredRecords]);

  // Average Customer Lifetime Value (CLV in dataset)
  const avgCLV = daxKpis.totalCustomers > 0 ? Math.round(daxKpis.totalSales / daxKpis.totalCustomers) : 0;

  return (
    <div id="page-customer-analysis" className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif italic font-semibold text-white tracking-tight flex items-center gap-2">
          Customer Cohorts & Lifetime Value (CLV)
        </h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">
          Account Segmentation &bull; Demographic Profiling &bull; VIP Account Ledger &bull; Retention Dynamics
        </p>
      </div>

      {/* Top Customer KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Accounts</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-serif text-white mt-1">{daxKpis.totalCustomers.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Unique customer entities</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Returning Accounts</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-serif text-emerald-400 mt-1">{daxKpis.returningCustomers}</div>
          <div className="text-[11px] text-emerald-400/80 font-medium mt-1">
            {Math.round((daxKpis.returningCustomers / (daxKpis.totalCustomers || 1)) * 100)}% repeat purchase rate
          </div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">New Acquisitions</span>
            <UserPlus className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-serif text-cyan-400 mt-1">{daxKpis.newCustomers}</div>
          <div className="text-[11px] text-slate-500 italic mt-1">First-time buyers</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avg Spend / Customer</span>
            <Receipt className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-serif text-purple-300 mt-1">${avgCLV.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Lifetime customer value (CLV)</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Customer CSAT</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-3xl font-serif text-amber-400 mt-1">{daxKpis.averageCustomerRating} / 5.0</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Satisfaction index</div>
        </div>
      </div>

      {/* Row 2: Customer Segments & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segment Breakdown */}
        <div id="chart-customer-segments" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <h3 className="text-sm font-serif italic text-slate-200 mb-0.5">Sales by Customer Segment</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-4">Consumer vs Corporate vs Home Office</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="sales"
                >
                  {segmentData.map((entry) => (
                    <Cell key={entry.segment} fill={SEGMENT_COLORS[entry.segment] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#14141A', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '12px', color: '#E2E8F0' }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-3 pt-3 border-t border-white/5 text-xs">
            {segmentData.map((s) => (
              <div key={s.segment} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[s.segment] }} />
                  <span className="text-slate-300 font-medium">{s.segment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white font-semibold">${s.sales.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">({s.margin}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age Group Distribution */}
        <div id="chart-age-distribution" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <h3 className="text-sm font-serif italic text-slate-200 mb-0.5">Sales by Age Cohort</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-4">Purchasing power across age brackets</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="ageGroup" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#14141A', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '12px', color: '#E2E8F0' }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Sales Volume']}
                />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                  {ageGroupData.map((entry) => (
                    <Cell key={entry.ageGroup} fill={AGE_COLORS[entry.ageGroup] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-[10px] text-slate-400 uppercase tracking-wider mt-3">
            Prime demographic: <span className="text-blue-400 font-semibold">26-35 & 36-50 Years</span>
          </div>
        </div>

        {/* Gender Breakdown */}
        <div id="chart-gender-distribution" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <h3 className="text-sm font-serif italic text-slate-200 mb-0.5">Sales by Gender</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-4">Distribution across buyer profiles</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="sales"
                >
                  <Cell fill="#06b6d4" />
                  <Cell fill="#ec4899" />
                  <Cell fill="#a855f7" />
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#14141A', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '12px', color: '#E2E8F0' }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Sales']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-3 pt-3 border-t border-white/5 text-xs">
            {genderData.map((g) => (
              <div key={g.gender} className="flex items-center justify-between">
                <span className="text-slate-300">{g.gender}</span>
                <span className="font-mono text-white font-semibold">${g.sales.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Top 10 VIP Customers */}
      <div id="table-top-customers" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif italic text-slate-200">Top 10 High-Value VIP Accounts</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Click any customer to open full 360° transaction history</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Customer Name</th>
                <th className="py-2.5 px-3">Segment</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3 text-right">Orders</th>
                <th className="py-2.5 px-3 text-right">Total Spend</th>
                <th className="py-2.5 px-3 text-right">Profit</th>
                <th className="py-2.5 px-3 text-right">Margin %</th>
                <th className="py-2.5 px-3 text-center">CSAT</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topCustomers.map((cust, idx) => (
                <tr
                  key={cust.id}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => openDrillThrough({ type: 'customer', id: cust.id, name: cust.name })}
                >
                  <td className="py-2.5 px-3 text-slate-500 font-mono">#{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-blue-400 hover:underline">{cust.name}</td>
                  <td className="py-2.5 px-3 text-slate-300">{cust.segment}</td>
                  <td className="py-2.5 px-3 text-slate-400">{cust.region}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{cust.orders}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">${cust.sales.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-400">${cust.profit.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-medium text-[10px]">
                      {cust.margin}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {cust.avgRating}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
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
