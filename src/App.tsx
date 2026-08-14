import React, { useState } from 'react';
import { DataProvider, useData } from './data/dataContext';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { ExecutiveOverview } from './components/pages/ExecutiveOverview';
import { SalesAnalysis } from './components/pages/SalesAnalysis';
import { ProfitabilityAnalysis } from './components/pages/ProfitabilityAnalysis';
import { CustomerAnalysis } from './components/pages/CustomerAnalysis';
import { ProductAnalysis } from './components/pages/ProductAnalysis';
import { GeographicalAnalysis } from './components/pages/GeographicalAnalysis';
import { OperationalAnalysis } from './components/pages/OperationalAnalysis';
import { TargetVsActual } from './components/pages/TargetVsActual';
import { DataQualityHub } from './components/pages/DataQualityHub';
import { PortfolioHub } from './components/pages/PortfolioHub';
import { DrillThroughModal } from './components/pages/DrillThroughModal';
import { Menu, X } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activePage } = useData();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E2E8F0] flex font-sans selection:bg-blue-600 selection:text-white">
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-50 w-72 h-full bg-[#0A0A0B] shadow-2xl">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar Toggle */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0A0A0B]">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg"
          >
            <Menu className="w-4 h-4 text-blue-400" />
            <span>Navigation Menu</span>
          </button>
          <div className="font-serif italic font-semibold text-white">Vantage Analytics</div>
        </div>

        {/* Global Top Nav & Slicers */}
        <TopNav />

        {/* Dynamic Page Views */}
        <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {(activePage === 'overview' || activePage === 'executive') && <ExecutiveOverview />}
          {activePage === 'sales' && <SalesAnalysis />}
          {activePage === 'profitability' && <ProfitabilityAnalysis />}
          {activePage === 'customers' && <CustomerAnalysis />}
          {activePage === 'products' && <ProductAnalysis />}
          {activePage === 'geography' && <GeographicalAnalysis />}
          {activePage === 'operations' && <OperationalAnalysis />}
          {activePage === 'targets' && <TargetVsActual />}
          {activePage === 'data_quality' && <DataQualityHub />}
          {activePage === 'portfolio_hub' && <PortfolioHub />}
        </main>

        {/* 360° Drill-Through Modal */}
        <DrillThroughModal />

        {/* Executive Footer */}
        <footer className="border-t border-white/10 bg-[#0F0F12]/80 backdrop-blur-md py-4 px-6 text-xs text-slate-500">
          <div className="max-w-[1680px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-serif italic font-semibold text-slate-400">
                &copy; 2024 Vantage Business Intelligence
              </span>
              <span className="text-slate-600 hidden sm:inline">&bull;</span>
              <span className="text-blue-400 font-medium text-xs bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                Developed by Pramod Mahajan
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="hover:text-slate-300 transition-colors">PRIVACY PROTOCOL</span>
              <span>&bull;</span>
              <span className="hover:text-slate-300 transition-colors">SECURITY STANDARD</span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM HEALTHY
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}
