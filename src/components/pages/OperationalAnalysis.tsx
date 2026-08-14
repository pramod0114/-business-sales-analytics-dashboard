import React, { useMemo } from 'react';
import { useData } from '../../data/dataContext';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Truck,
  Clock,
  AlertTriangle,
  RotateCcw,
  Ban,
  CreditCard,
  CheckCircle2,
  Package,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#10b981',
  Shipped: '#3b82f6',
  'In Transit': '#06b6d4',
  Processing: '#8b5cf6',
  Cancelled: '#f43f5e',
  Returned: '#f59e0b',
};

const SHIPPING_COLORS: Record<string, string> = {
  'Standard Class': '#3b82f6',
  'Second Class': '#8b5cf6',
  'First Class': '#06b6d4',
  'Same Day': '#ec4899',
};

export const OperationalAnalysis: React.FC = () => {
  const { filteredRecords, daxKpis } = useData();

  // Order Status Distribution
  const orderStatusData = useMemo(() => {
    const map = new Map<string, { status: string; count: number; sales: number }>();
    ['Delivered', 'Shipped', 'In Transit', 'Processing', 'Cancelled', 'Returned'].forEach((st) => {
      map.set(st, { status: st, count: 0, sales: 0 });
    });
    filteredRecords.forEach((r) => {
      const entry = map.get(r.Order_Status);
      if (entry) {
        entry.count += 1;
        entry.sales += r.Sales;
      }
    });
    return Array.from(map.values()).map((s) => ({
      ...s,
      sales: Math.round(s.sales),
      pct: filteredRecords.length > 0 ? Math.round((s.count / filteredRecords.length) * 1000) / 10 : 0,
    }));
  }, [filteredRecords]);

  // Shipping Mode Breakdown & Average Lead Time
  const shippingModeData = useMemo(() => {
    const map = new Map<string, { mode: string; count: number; totalDays: number; sales: number }>();
    ['Standard Class', 'Second Class', 'First Class', 'Same Day'].forEach((m) => {
      map.set(m, { mode: m, count: 0, totalDays: 0, sales: 0 });
    });
    filteredRecords.forEach((r) => {
      const entry = map.get(r.Shipping_Mode);
      if (entry) {
        entry.count += 1;
        entry.totalDays += r.Shipping_Days;
        entry.sales += r.Sales;
      }
    });
    return Array.from(map.values()).map((m) => ({
      ...m,
      sales: Math.round(m.sales),
      avgDays: m.count > 0 ? Math.round((m.totalDays / m.count) * 10) / 10 : 0,
    }));
  }, [filteredRecords]);

  // Payment Mode Breakdown
  const paymentModeData = useMemo(() => {
    const map = new Map<string, { mode: string; count: number; sales: number }>();
    filteredRecords.forEach((r) => {
      const curr = map.get(r.Payment_Mode) || { mode: r.Payment_Mode, count: 0, sales: 0 };
      curr.count += 1;
      curr.sales += r.Sales;
      map.set(r.Payment_Mode, curr);
    });
    return Array.from(map.values()).map((p) => ({
      ...p,
      sales: Math.round(p.sales),
      pct: filteredRecords.length > 0 ? Math.round((p.count / filteredRecords.length) * 100) : 0,
    }));
  }, [filteredRecords]);

  return (
    <div id="page-operational-analysis" className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif italic font-semibold text-white tracking-tight flex items-center gap-2">
          Operational Logistics & Supply Chain SLAs
        </h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">
          Fulfillment Velocities &bull; Dispatch Pipeline &bull; Exception Ratios &bull; Payment Settlement
        </p>
      </div>

      {/* Top 4 Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avg Shipping Lead Time</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-serif text-white mt-1">{daxKpis.avgShippingDays} Days</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Order to dispatch SLA</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Delayed Orders (&gt;5 Days)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-serif text-amber-400 mt-1">{daxKpis.delayedOrdersPct}%</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Carrier logistics bottleneck</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Order Cancellation Rate</span>
            <Ban className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-serif text-rose-400 mt-1">{daxKpis.cancelledOrdersPct}%</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Pre-dispatch terminations</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Order Return Rate</span>
            <RotateCcw className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-serif text-purple-300 mt-1">{daxKpis.returnedOrdersPct}%</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Post-delivery RMAs</div>
        </div>
      </div>

      {/* Row 2: Order Status & Shipping Mode Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div id="chart-order-status" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                Fulfillment Status Distribution
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Delivered vs In-Transit vs Attrited orders</p>
            </div>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {orderStatusData.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#14141A', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '12px', color: '#E2E8F0' }}
                  formatter={(val: number) => [`${val.toLocaleString()} orders`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-white/5 text-xs">
            {orderStatusData.map((st) => (
              <div key={st.status} className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5 font-medium text-slate-200 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[st.status] }} />
                  <span>{st.status}</span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">{st.count.toLocaleString()} ({st.pct}%)</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Mode & SLA Performance */}
        <div id="chart-shipping-mode" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                Carrier Tier & Average Shipping Days
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Mean fulfillment transit turnaround time by speed class</p>
            </div>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shippingModeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="mode" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="d" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#14141A', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '12px', color: '#E2E8F0' }}
                  formatter={(val: number) => [`${val} Days`, 'Avg Transit Time']}
                />
                <Bar dataKey="avgDays" radius={[4, 4, 0, 0]}>
                  {shippingModeData.map((entry) => (
                    <Cell key={entry.mode} fill={SHIPPING_COLORS[entry.mode] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-3 pt-3 border-t border-white/5 text-xs">
            {shippingModeData.map((sm) => (
              <div key={sm.mode} className="flex items-center justify-between">
                <span className="text-slate-300">{sm.mode}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono">{sm.count.toLocaleString()} packages</span>
                  <span className="font-mono font-bold text-white">{sm.avgDays} Days SLA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Payment Modes Breakdown */}
      <div id="payment-methods-breakdown" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-400" />
            Payment Gateway & Tender Method Breakdown
          </h3>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Total volume processed</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {paymentModeData.map((pm) => (
            <div key={pm.mode} className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
              <div className="text-[11px] font-medium text-slate-300">{pm.mode}</div>
              <div className="text-sm font-serif font-bold text-white mt-1">${pm.sales.toLocaleString()}</div>
              <div className="text-[10px] text-blue-400 font-mono mt-0.5">{pm.count.toLocaleString()} tx ({pm.pct}%)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
