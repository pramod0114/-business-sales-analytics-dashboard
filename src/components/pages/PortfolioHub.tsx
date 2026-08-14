import React, { useState, useEffect } from 'react';
import { useData } from '../../data/dataContext';
import {
  Briefcase,
  Award,
  BookOpen,
  Layers,
  Code2,
  Lightbulb,
  CheckCircle,
  Copy,
  Check,
  TrendingUp,
  FileText,
  Workflow,
  Sparkles,
  Terminal,
  Database,
} from 'lucide-react';
import { STAR_SCHEMA_TABLES } from '../../utils/dataModel';

export const PortfolioHub: React.FC = () => {
  const { daxMeasureDefinitions, viewMode } = useData();
  const [activeSection, setActiveSection] = useState<'resume' | 'pitch' | 'dax' | 'model' | 'recommendations' | 'architecture'>('resume');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (viewMode === 'data-model') {
      setActiveSection('model');
    } else if (viewMode === 'insights') {
      setActiveSection('recommendations');
    } else if (viewMode === 'portfolio-interview') {
      setActiveSection('resume');
    }
  }, [viewMode]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const resumeBullets = [
    {
      title: 'Senior Data Analyst / Power BI & Tableau Focus',
      bullet:
        'Architected an end-to-end Enterprise Sales & Performance Analytics platform analyzing 10,250+ multi-year transactions across 4 US regions; engineered a Star Schema data model and 25+ dynamic DAX/LOD measures that identified $142K in margin leakages from excessive discounting, enabling leadership to optimize product mix and increase blended gross margin by 3.8%.',
    },
    {
      title: 'Business Intelligence & Data Pipeline Engineer',
      bullet:
        'Developed comprehensive BI dashboards in Power BI and Tableau featuring hierarchical drill-downs (Year-to-Day), customer cohort retention tracking, and geospatial clustering; automated ETL data cleansing workflows that purged 120 duplicate transactions and resolved 235 missing records to achieve 99.8% data quality integrity.',
    },
  ];

  return (
    <div id="page-portfolio-hub" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif italic font-semibold text-white tracking-tight flex items-center gap-2">
            Portfolio, Resume & Executive Interview Suite
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">
            Curated Case Study Artifacts &bull; Star Schema Blueprint &bull; DAX Enterprise Formula Library
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-blue-600/10 border border-blue-500/30 px-3.5 py-2 rounded-2xl">
          <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
            PM
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Pramod Mahajan</div>
            <div className="text-[10px] text-blue-400 font-mono">Lead BI & Analytics Developer</div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'resume', label: 'Resume Bullets', icon: Briefcase },
          { id: 'pitch', label: '2-Minute Interview Pitch', icon: Award },
          { id: 'recommendations', label: 'Business Insights & Strategy', icon: Lightbulb },
          { id: 'dax', label: 'DAX & Formula Library (25+)', icon: Code2 },
          { id: 'model', label: 'Star Schema Architecture', icon: Database },
          { id: 'architecture', label: 'End-to-End Pipeline Flow', icon: Workflow },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. Resume Bullets Section */}
      {activeSection === 'resume' && (
        <div className="space-y-4">
          <div className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-serif italic text-white mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              Resume-Ready Achievement Bullet Points (Action Verb + Context + Result)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste directly into your resume under your Experience or Projects section.
            </p>

            <div className="space-y-4">
              {resumeBullets.map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-5 relative group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">{item.title}</span>
                    <button
                      onClick={() => copyToClipboard(item.bullet, idx)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Bullet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono selection:bg-blue-600">{item.bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. 2-Minute Executive Interview Pitch */}
      {activeSection === 'pitch' && (
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              The 2-Minute Executive Interview Script
            </h3>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-0.5 rounded-full border border-amber-500/30 font-semibold">
              Memorize & Adapt for Interviews
            </span>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed bg-[#0A0A0B] p-6 rounded-2xl border border-white/5 font-sans">
            <p>
              <strong className="text-white font-serif italic text-sm block mb-1">1. Context & Business Problem:</strong>
              "In this project, I built an end-to-end Sales and Performance Analytics Dashboard for a multi-regional retail enterprise generating over $2.7M in revenue across 10,250 transactions. The company was experiencing revenue growth, but leadership lacked visibility into where margin erosion was occurring and why certain high-volume products were unprofitable."
            </p>

            <p>
              <strong className="text-white font-serif italic text-sm block mb-1">2. Technical Implementation & Modeling:</strong>
              "To solve this, I designed a robust Star Schema with a centralized <code className="text-blue-400">Fact_Sales</code> table connected to Date, Customer, Product, and Geography dimensions via 1-to-many relationships. In Power BI and Tableau, I wrote over 25 custom DAX measures and LOD expressions for Time Intelligence, such as YoY Growth, Same Period Last Year, and dynamic Target Variance."
            </p>

            <p>
              <strong className="text-white font-serif italic text-sm block mb-1">3. Key Discovery & Financial Impact:</strong>
              "Through the Sales vs. Profit scatter matrix and discount elasticity analysis, I discovered that orders with discounts over 30% had an average profit margin of -4.2%, effectively destroying over $142,000 in gross margin. Technology was our highest margin category at 28%, while Furniture bookcases were consistently losing money due to high shipping costs and aggressive markdowns."
            </p>

            <p>
              <strong className="text-white font-serif italic text-sm block mb-1">4. Actionable Business Outcome:</strong>
              "I presented 4 strategic recommendations: capping unapproved discounts at 20%, renegotiating carrier SLAs for delayed regions, bundling low-margin accessories with high-margin hardware, and prioritizing VIP customer retention. This gives executives an automated, single-pane-of-glass decision tool."
            </p>
          </div>
        </div>
      )}

      {/* 3. Strategic Business Recommendations */}
      {activeSection === 'recommendations' && (
        <div className="space-y-4">
          <div className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-serif italic text-white mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Data-Backed Strategic Recommendations for Executive Leadership
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Concrete business decisions derived directly from dashboard KPI analytics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300">1</span>
                  Cap Promotional Discounts at 20%
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Finding:</strong> 13.8% of orders are loss-making due to markdowns exceeding 30%. Capping discounts at 20% preserves $142K in operating margin without diminishing top-line demand.
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">2</span>
                  Optimize Furniture & Heavy SKU Logistics
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Finding:</strong> Tables and Bookcases exhibit an average profit margin of only 8.4% due to oversize carrier freight. Shift heavy furniture to regional drop-shipping fulfillment.
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">3</span>
                  VIP Customer Loyalty Program
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Finding:</strong> The top 10 VIP customers contribute over $280K in sales with a 4.7 CSAT. Creating a dedicated corporate account tier will increase repeat retention by 15%.
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">4</span>
                  Reduce Delayed Delivery in South & Central
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Finding:</strong> Shipping transit in Central and South averages 4.8 days with a 14% delay rate. Consolidating carrier contracts will improve CSAT and lower return rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DAX Formula Encyclopedia */}
      {activeSection === 'dax' && (
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Production DAX Measure Library (25+ Enterprise Measures)
              </h3>
              <p className="text-xs text-slate-400">
                Exact DAX and LOD calculations used in the Power BI & Tableau builds.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {daxMeasureDefinitions.map((dax) => (
              <div key={dax.name} className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 font-mono">{dax.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#0A0A0B] text-slate-400 border border-white/5 font-mono">
                    {dax.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{dax.description}</div>
                <div className="bg-[#0A0A0B] p-3 rounded-xl border border-white/5 font-mono text-[11px] text-emerald-300 overflow-x-auto selection:bg-blue-600 whitespace-pre-wrap">
                  {dax.formula}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Star Schema Architecture */}
      {activeSection === 'model' && (
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
          <div>
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              Relational Star Schema Data Model Architecture
            </h3>
            <p className="text-xs text-slate-400">
              Dimensional modeling with 1 Fact Table and 4 Dimension Tables connected via 1-to-Many cardinality.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {STAR_SCHEMA_TABLES.map((t) => (
              <div key={t.tableName} className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.tableType === 'Fact Table' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {t.tableType.toUpperCase()}
                    </span>
                    <span className="font-bold text-white font-mono text-sm">{t.tableName}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Schema Columns & Types</div>
                  <div className="flex flex-wrap gap-1.5">
                    {t.columns.map((col) => (
                      <span key={col.name} className="text-[10px] px-2 py-0.5 rounded bg-[#0A0A0B] text-slate-300 font-mono border border-white/5" title={col.description}>
                        {col.name} <span className="text-slate-500">({col.type})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. End-to-End Pipeline Flow */}
      {activeSection === 'architecture' && (
        <div className="bg-[#14141A] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-serif italic text-white flex items-center gap-2">
            <Workflow className="w-4 h-4 text-cyan-400" />
            End-to-End Analytics Engineering Pipeline Flow
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Stage 1: Raw Ingestion</div>
              <div className="text-sm font-semibold text-white">Multi-Source POS & ERP</div>
              <p className="text-xs text-slate-400">
                10,250 transaction rows collected from e-commerce checkouts, POS terminals, and retail partners.
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Stage 2: Power Query ETL</div>
              <div className="text-sm font-semibold text-white">Cleansing & Standardization</div>
              <p className="text-xs text-slate-400">
                Deduplication, missing value imputation, string trimming, ISO date conversion, and boundary checks.
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Stage 3: Star Modeling</div>
              <div className="text-sm font-semibold text-white">DAX & LOD Calculation</div>
              <p className="text-xs text-slate-400">
                Star schema deployment with 25+ DAX measures computing YoY, CLV, AOV, and Target Variances.
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Stage 4: Executive BI</div>
              <div className="text-sm font-semibold text-white">8-Page Analytics Suite</div>
              <p className="text-xs text-slate-400">
                Interactive drill-downs, dynamic slicers, portfolio matrices, and geospatial clustering for leadership.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

