import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  SalesRecord,
  RawSalesRecord,
  CleaningLogItem,
  DataDictionaryField,
  MonthlyTarget,
  FilterState,
  AppViewMode,
  DashboardPageId,
  DrillThroughSelection,
  DaxMeasureInfo,
} from '../types';
import { generateDataset, GeneratedDatasetPackage } from './generator';
import { computeDaxMeasures, CalculatedDaxKpis } from '../utils/daxMeasures';

interface DataContextType {
  // Raw and cleaned data
  dataset: GeneratedDatasetPackage;
  filteredRecords: SalesRecord[];
  allCleanedRecords: SalesRecord[];
  
  // Navigation & Modes
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  activePage: DashboardPageId;
  setActivePage: (page: DashboardPageId) => void;
  
  // Drill-through
  drillThrough: DrillThroughSelection | null;
  openDrillThrough: (item: DrillThroughSelection) => void;
  closeDrillThrough: () => void;

  // Filters & Slicers
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  isFiltered: boolean;

  // Real-time calculated DAX measures
  daxKpis: CalculatedDaxKpis;
  daxMeasures: DaxMeasureInfo[];
  daxMeasureDefinitions: DaxMeasureInfo[];
  
  // Available filter options
  availableYears: string[];
  availableRegions: string[];
  availableCategories: string[];
  availableSubCategories: string[];
  availableSegments: string[];
  availablePaymentModes: string[];
  availableOrderStatuses: string[];
  availableShippingModes: string[];
}

const initialFilters: FilterState = {
  searchQuery: '',
  dateRange: {
    startDate: '2023-01-01',
    endDate: '2025-12-31',
  },
  year: 'All',
  quarter: 'All',
  regions: [],
  categories: [],
  subCategories: [],
  segments: [],
  paymentModes: [],
  orderStatuses: [],
  shippingModes: [],
  customerRatings: [],
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Generate once in module scope so it's instantly available and cached
const staticDataset = generateDataset();

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataset] = useState<GeneratedDatasetPackage>(staticDataset);
  const [viewMode, setViewMode] = useState<AppViewMode>('powerbi');
  const [activePage, setActivePage] = useState<DashboardPageId>('overview');
  const [drillThrough, setDrillThrough] = useState<DrillThroughSelection | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Extract distinct filter options
  const availableYears = useMemo(() => ['All', '2025', '2024', '2023'], []);
  const availableRegions = useMemo(() => ['West', 'East', 'Central', 'South'], []);
  const availableCategories = useMemo(() => ['Technology', 'Furniture', 'Office Supplies'], []);
  const availableSubCategories = useMemo(() => {
    const set = new Set(dataset.cleanedSales.map(r => r.Sub_Category));
    return Array.from(set).sort();
  }, [dataset]);
  const availableSegments = useMemo(() => ['Consumer', 'Corporate', 'Home Office'], []);
  const availablePaymentModes = useMemo(() => ['Credit Card', 'Debit Card', 'Net Banking', 'UPI/Wire', 'COD', 'PayPal'], []);
  const availableOrderStatuses = useMemo(() => ['Delivered', 'Shipped', 'In Transit', 'Processing', 'Cancelled', 'Returned'], []);
  const availableShippingModes = useMemo(() => ['Standard Class', 'Second Class', 'First Class', 'Same Day'], []);

  // Filter application engine
  const filteredRecords = useMemo(() => {
    return dataset.cleanedSales.filter(record => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          record.Order_ID.toLowerCase().includes(q) ||
          record.Customer_Name.toLowerCase().includes(q) ||
          record.Product_Name.toLowerCase().includes(q) ||
          record.City.toLowerCase().includes(q) ||
          record.State.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Year & Quarter filter
      if (filters.year !== 'All') {
        if (record.Year.toString() !== filters.year) return false;
      }
      if (filters.quarter !== 'All') {
        if (record.Quarter !== filters.quarter) return false;
      }

      // 3. Date Range
      if (filters.dateRange.startDate && record.Order_Date < filters.dateRange.startDate) return false;
      if (filters.dateRange.endDate && record.Order_Date > filters.dateRange.endDate) return false;

      // 4. Multi-select categorical slicers
      if (filters.regions.length > 0 && !filters.regions.includes(record.Region)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(record.Category)) return false;
      if (filters.subCategories.length > 0 && !filters.subCategories.includes(record.Sub_Category)) return false;
      if (filters.segments.length > 0 && !filters.segments.includes(record.Customer_Segment)) return false;
      if (filters.paymentModes.length > 0 && !filters.paymentModes.includes(record.Payment_Mode)) return false;
      if (filters.orderStatuses.length > 0 && !filters.orderStatuses.includes(record.Order_Status)) return false;
      if (filters.shippingModes.length > 0 && !filters.shippingModes.includes(record.Shipping_Mode)) return false;
      if (filters.customerRatings.length > 0 && !filters.customerRatings.includes(record.Customer_Rating)) return false;

      return true;
    });
  }, [dataset.cleanedSales, filters]);

  // Compute DAX metrics in real-time
  const { kpis: daxKpis, measureDefinitions: daxMeasures } = useMemo(() => {
    return computeDaxMeasures(filteredRecords, dataset.cleanedSales, filters.year);
  }, [filteredRecords, dataset.cleanedSales, filters.year]);

  const isFiltered = useMemo(() => {
    return (
      filters.searchQuery !== '' ||
      filters.year !== 'All' ||
      filters.quarter !== 'All' ||
      filters.regions.length > 0 ||
      filters.categories.length > 0 ||
      filters.subCategories.length > 0 ||
      filters.segments.length > 0 ||
      filters.paymentModes.length > 0 ||
      filters.orderStatuses.length > 0 ||
      filters.shippingModes.length > 0 ||
      filters.customerRatings.length > 0 ||
      filters.dateRange.startDate !== '2023-01-01' ||
      filters.dateRange.endDate !== '2025-12-31'
    );
  }, [filters]);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const openDrillThrough = useCallback((item: DrillThroughSelection) => {
    setDrillThrough(item);
  }, []);

  const closeDrillThrough = useCallback(() => {
    setDrillThrough(null);
  }, []);

  const value = {
    dataset,
    filteredRecords,
    allCleanedRecords: dataset.cleanedSales,
    viewMode,
    setViewMode,
    activePage,
    setActivePage,
    drillThrough,
    openDrillThrough,
    closeDrillThrough,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    isFiltered,
    daxKpis,
    daxMeasures,
    daxMeasureDefinitions: daxMeasures,
    availableYears,
    availableRegions,
    availableCategories,
    availableSubCategories,
    availableSegments,
    availablePaymentModes,
    availableOrderStatuses,
    availableShippingModes,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
