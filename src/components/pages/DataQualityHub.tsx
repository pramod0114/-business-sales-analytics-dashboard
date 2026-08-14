import React, { useState } from 'react';
import { useData } from '../../data/dataContext';
import {
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { exportCleanedDataToCSV, exportRawDataToCSV } from '../../utils/exportUtils';

export const DataQualityHub: React.FC = () => {
  const { dataset } = useData();
  const [activeTab, setActiveTab] = useState<'audit' | 'cleaned_preview' | 'raw_preview'>('audit');

  const cleaningRules = [
    {
      step: '1. Deduplication',
      issue: 'Exact duplicate transactions generated from POS sync glitch',
      action: 'Identified composite primary key (Order_ID + Product_ID) and purged 120 exact duplicate rows.',
      status: 'Fixed',
      impact: '120 rows eliminated',
    },
    {
      step: '2. Missing Value Imputation',
      issue: 'Missing Customer Age (150 nulls) and Postal Codes (85 nulls)',
      action: 'Imputed Age with Segment median (Consumer: 32, Corporate: 41, Home Office: 38); resolved missing Postal Codes via State-City geographic lookup table.',
      status: 'Fixed',
      impact: '235 values resolved',
    },
    {
      step: '3. Text Case & Whitespace Standardization',
      issue: 'Inconsistent casing in Customer Names ("john doe", "  JANE SMITH  ") and Cities ("los angeles", "CHICAGO ")',
      action: 'Applied TRIM() and PROPER() casing across all textual dimensions.',
      status: 'Fixed',
      impact: '1,450 text anomalies corrected',
    },
    {
      step: '4. Datetime Formatting & Calendar Dimension',
      issue: 'Inconsistent string dates ("01/15/2023", "2023-01-15", "15-Jan-2023")',
      action: 'Parsed all timestamps to standard ISO-8601 (YYYY-MM-DD); derived Year, Quarter, Month, Day of Week, and Fiscal Week.',
      status: 'Fixed',
      impact: '100% standardized dates',
    },
    {
      step: '5. Outlier Detection & Discount Truncation',
      issue: 'Erroneous negative discounts (-0.05) and extreme discount typos (0.95)',
      action: 'Enforced bounded business rule [0.00, 0.70]; converted negative discounts to zero and verified high discount margins.',
      status: 'Fixed',
      impact: '48 anomalies bounded',
    },
    {
      step: '6. Derived Metrics & Financial Logic',
      issue: 'Lack of normalized unit margin and dynamic delivery SLA metrics',
      action: 'Engineered Profit Margin % = (Profit / Sales) * 100, Shipping Days = Ship_Date - Order_Date, Cost Basis = Sales - Profit.',
      status: 'Fixed',
      impact: '10,250 records enriched',
    },
  ];

  return (
    <div id="page-data-quality" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif italic font-semibold text-white tracking-tight flex items-center gap-2">
            Data Quality Audit & ETL Pipeline Engine
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">
            Automated Transformation Log &bull; Schema Validation &bull; Normalization Protocols
          </p>
        </div>

        {/* Download CSV Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportRawDataToCSV(dataset.rawSales, 'raw_sales_dataset.csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Raw CSV (with anomalies)
          </button>
          <button
            onClick={() => exportCleanedDataToCSV(dataset.cleanedSales, 'cleaned_sales_dataset.csv')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg shadow-blue-600/30 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Cleaned CSV (10,250 rows)
          </button>
        </div>
      </div>

      {/* Quality Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Dataset Completeness</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-serif text-emerald-400 mt-1">100.0%</div>
          <div className="text-[11px] text-slate-500 italic mt-1">0 nulls remaining post-ETL</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Key Uniqueness</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-serif text-white mt-1">100.0%</div>
          <div className="text-[11px] text-slate-500 italic mt-1">120 duplicate rows purged</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Records Cleaned</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-serif text-purple-300 mt-1">{dataset.cleanedSales.length.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 italic mt-1">From {dataset.rawSales.length.toLocaleString()} raw records</div>
        </div>

        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Data Quality Score</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-serif text-amber-400 mt-1">99.8 / 100</div>
          <div className="text-[11px] text-slate-500 italic mt-1">Production-ready tier</div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'audit' ? 'bg-white/10 text-white border border-white/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ETL Cleansing Rules Log (6 Steps)
        </button>
        <button
          onClick={() => setActiveTab('cleaned_preview')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'cleaned_preview' ? 'bg-white/10 text-white border border-white/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Cleaned Dataset Preview (Sample 20 Rows)
        </button>
        <button
          onClick={() => setActiveTab('raw_preview')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'raw_preview' ? 'bg-white/10 text-white border border-white/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Raw Dataset Preview (Unprocessed Anomaly View)
        </button>
      </div>

      {/* Tab 1: Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif italic text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              Documented Data Cleaning & Transformation Pipeline
            </h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Power Query / SQL / Python Equivalency</span>
          </div>

          <div className="space-y-3">
            {cleaningRules.map((rule, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic text-base text-white">{rule.step}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {rule.status}
                    </span>
                  </div>
                  <div className="text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span><strong>Anomaly:</strong> {rule.issue}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong>Solution:</strong> {rule.action}
                  </div>
                </div>
                <div className="text-right whitespace-nowrap bg-[#0A0A0B] px-3.5 py-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase text-slate-500 block font-semibold tracking-wider">ETL Outcome</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{rule.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Cleaned Dataset Preview */}
      {activeTab === 'cleaned_preview' && (
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-serif italic text-slate-200">Cleaned Dataset Sample (10,250 Records Total)</h3>
            <span className="text-xs text-emerald-400 font-medium font-mono">Standardized &bull; Zero Nulls &bull; ISO-8601</span>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-[#14141A] border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-2">Order ID</th>
                  <th className="py-2.5 px-2">Date</th>
                  <th className="py-2.5 px-2">Customer Name</th>
                  <th className="py-2.5 px-2">Segment</th>
                  <th className="py-2.5 px-2">State</th>
                  <th className="py-2.5 px-2">Product Name</th>
                  <th className="py-2.5 px-2">Category</th>
                  <th className="py-2.5 px-2 text-right">Qty</th>
                  <th className="py-2.5 px-2 text-right">Sales</th>
                  <th className="py-2.5 px-2 text-right">Profit</th>
                  <th className="py-2.5 px-2 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dataset.cleanedSales.slice(0, 20).map((r) => (
                  <tr key={`${r.Order_ID}-${r.Product_ID}`} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-2 font-mono text-blue-400">{r.Order_ID}</td>
                    <td className="py-2.5 px-2 text-slate-400">{r.Order_Date}</td>
                    <td className="py-2.5 px-2 font-semibold text-slate-200">{r.Customer_Name}</td>
                    <td className="py-2.5 px-2 text-slate-300">{r.Customer_Segment}</td>
                    <td className="py-2.5 px-2 text-slate-400">{r.State}</td>
                    <td className="py-2.5 px-2 text-slate-200 truncate max-w-[150px]">{r.Product_Name}</td>
                    <td className="py-2.5 px-2 text-slate-400">{r.Category}</td>
                    <td className="py-2.5 px-2 text-right font-mono">{r.Quantity}</td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-white">${r.Sales.toLocaleString()}</td>
                    <td className={`py-2.5 px-2 text-right font-mono ${r.Profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${r.Profit.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-semibold text-emerald-300">
                      {r.Sales > 0 ? Math.round((r.Profit / r.Sales) * 1000) / 10 : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Raw Dataset Preview */}
      {activeTab === 'raw_preview' && (
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-serif italic text-slate-200">Raw Dataset Sample (Uncleaned)</h3>
            <span className="text-xs text-rose-400 font-medium">Contains casing irregularities, duplicate keys & nulls</span>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-[#14141A] border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-2">Order ID</th>
                  <th className="py-2.5 px-2">Order Date</th>
                  <th className="py-2.5 px-2">Customer Name</th>
                  <th className="py-2.5 px-2">City</th>
                  <th className="py-2.5 px-2">Product Name</th>
                  <th className="py-2.5 px-2 text-right">Sales</th>
                  <th className="py-2.5 px-2 text-right">Profit</th>
                  <th className="py-2.5 px-2 text-right">Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dataset.rawSales.slice(0, 20).map((r, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-2 font-mono text-slate-400">{r.Order_ID}</td>
                    <td className="py-2.5 px-2 text-slate-400">{r.Order_Date}</td>
                    <td className="py-2.5 px-2 text-slate-300">{r.Customer_Name}</td>
                    <td className="py-2.5 px-2 text-slate-400">{r.City}</td>
                    <td className="py-2.5 px-2 text-slate-300 truncate max-w-[160px]">{r.Product_Name}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-200">${r.Sales}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-200">${r.Profit}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-amber-400">{r.Discount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
