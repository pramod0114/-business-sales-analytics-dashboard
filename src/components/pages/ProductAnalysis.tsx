import React, { useMemo, useState } from 'react';
import { useData } from '../../data/dataContext';
import {
  Package,
  ArrowUpDown,
  Search,
  ExternalLink,
  Award,
  AlertTriangle,
  Layers,
  Percent,
} from 'lucide-react';

export const ProductAnalysis: React.FC = () => {
  const { filteredRecords, openDrillThrough } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'sales' | 'profit' | 'quantity' | 'margin'>('sales');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Comprehensive Product Catalog Matrix
  const productMatrix = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      category: string;
      subCategory: string;
      sales: number;
      profit: number;
      quantity: number;
      orders: number;
      totalDiscount: number;
    }>();

    filteredRecords.forEach((r) => {
      const curr = map.get(r.Product_ID) || {
        id: r.Product_ID,
        name: r.Product_Name,
        category: r.Category,
        subCategory: r.Sub_Category,
        sales: 0,
        profit: 0,
        quantity: 0,
        orders: 0,
        totalDiscount: 0,
      };
      curr.sales += r.Sales;
      curr.profit += r.Profit;
      curr.quantity += r.Quantity;
      curr.orders += 1;
      curr.totalDiscount += r.Discount;
      map.set(r.Product_ID, curr);
    });

    return Array.from(map.values()).map((p) => {
      const margin = p.sales > 0 ? Math.round((p.profit / p.sales) * 1000) / 10 : 0;
      const asp = p.quantity > 0 ? Math.round(p.sales / p.quantity) : 0;
      const avgDiscount = p.orders > 0 ? Math.round((p.totalDiscount / p.orders) * 100) : 0;
      return {
        ...p,
        sales: Math.round(p.sales),
        profit: Math.round(p.profit),
        margin,
        asp,
        avgDiscount,
      };
    });
  }, [filteredRecords]);

  // Filtered & Sorted Product Matrix
  const filteredProducts = useMemo(() => {
    return productMatrix
      .filter((p) => {
        if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          return p.name.toLowerCase().includes(q) || p.subCategory.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        const factor = sortOrder === 'desc' ? -1 : 1;
        return (a[sortBy] - b[sortBy]) * factor;
      });
  }, [productMatrix, categoryFilter, searchTerm, sortBy, sortOrder]);

  const maxSales = useMemo(() => Math.max(...productMatrix.map((p) => p.sales), 1), [productMatrix]);
  const maxProfit = useMemo(() => Math.max(...productMatrix.map((p) => p.profit), 1), [productMatrix]);

  const handleSort = (field: 'sales' | 'profit' | 'quantity' | 'margin') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div id="page-product-analysis" className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif italic font-semibold text-white tracking-tight flex items-center gap-2">
          Product Portfolio & SKU Unit Economics
        </h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">
          Conditional Performance Matrix &bull; ASP Index &bull; Margin Gradients &bull; Discount Sensitivity
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Active SKUs</div>
            <div className="text-2xl font-serif text-white mt-0.5">{productMatrix.length} Products</div>
          </div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Top Margin Sub-Category</div>
            <div className="text-2xl font-serif text-emerald-400 mt-0.5">Technology &bull; Phones (28%)</div>
          </div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Loss-Prone Categories</div>
            <div className="text-2xl font-serif text-rose-400 mt-0.5">Furniture &bull; Bookcases</div>
          </div>
        </div>
      </div>

      {/* Product Matrix & Conditional Formatting Table */}
      <div id="product-performance-matrix" className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by SKU or Product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 text-xs text-slate-200 pl-9 pr-3 py-1.5 rounded-xl border border-white/10 w-64 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#14141A] text-xs text-slate-200 px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Furniture">Furniture</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>

          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-white">{filteredProducts.length}</span> products &bull; Sorted by{' '}
            <span className="text-blue-400 font-semibold uppercase">{sortBy} ({sortOrder})</span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Product Name / SKU</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Sub-Category</th>
                <th
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('sales')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sales ($)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Units</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">ASP ($)</th>
                <th className="py-2.5 px-3 text-right">Avg Disc</th>
                <th
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('profit')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Profit ($)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('margin')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Margin %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">Drill-Through</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p) => {
                const salesBarPct = Math.round((p.sales / maxSales) * 100);
                const profitBarPct = p.profit > 0 ? Math.round((p.profit / maxProfit) * 100) : 0;
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                    onClick={() => openDrillThrough({ type: 'product', id: p.id, name: p.name })}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors max-w-[240px] truncate" title={p.name}>
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.id}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{p.category}</td>
                    <td className="py-2.5 px-3 text-slate-400">{p.subCategory}</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="font-mono font-bold text-white">${p.sales.toLocaleString()}</div>
                      <div className="w-20 ml-auto bg-white/10 h-1 rounded-full overflow-hidden mt-1">
                        <div className="bg-blue-500 h-full" style={{ width: `${salesBarPct}%` }} />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{p.quantity.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">${p.asp}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-400">{p.avgDiscount}%</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className={`font-mono font-bold ${p.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${p.profit.toLocaleString()}
                      </div>
                      {p.profit > 0 && (
                        <div className="w-20 ml-auto bg-white/10 h-1 rounded-full overflow-hidden mt-1">
                          <div className="bg-emerald-500 h-full" style={{ width: `${profitBarPct}%` }} />
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] ${
                        p.margin >= 20 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : p.margin >= 10 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {p.margin}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
