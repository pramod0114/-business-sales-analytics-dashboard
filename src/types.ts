export interface SalesRecord {
  Order_ID: string;
  Order_Date: string; // YYYY-MM-DD
  Ship_Date: string; // YYYY-MM-DD
  Customer_ID: string;
  Customer_Name: string;
  Customer_Segment: 'Consumer' | 'Corporate' | 'Home Office';
  Gender: 'Male' | 'Female' | 'Other';
  Age_Group: '18-25' | '26-35' | '36-50' | '51+';
  Product_ID: string;
  Product_Name: string;
  Category: 'Technology' | 'Furniture' | 'Office Supplies';
  Sub_Category: string;
  Region: 'East' | 'West' | 'Central' | 'South';
  State: string;
  City: string;
  Sales: number;
  Quantity: number;
  Discount: number; // 0.00 to 0.70
  Cost: number;
  Profit: number;
  Payment_Mode: 'Credit Card' | 'Debit Card' | 'Net Banking' | 'UPI/Wire' | 'COD' | 'PayPal';
  Order_Status: 'Delivered' | 'Shipped' | 'In Transit' | 'Processing' | 'Cancelled' | 'Returned';
  Shipping_Mode: 'Same Day' | 'First Class' | 'Second Class' | 'Standard Class';
  Customer_Rating: number; // 1 to 5
  // Calculated helpers
  Year: number;
  Quarter: string;
  Month: string;
  Month_Num: number;
  Shipping_Days: number;
  Is_Loss_Making: boolean;
  Unit_Price: number;
}

export interface RawSalesRecord {
  Order_ID: string;
  Order_Date: string;
  Ship_Date: string;
  Customer_ID: string;
  Customer_Name: string;
  Customer_Segment: string;
  Gender: string;
  Age_Group: string;
  Product_ID: string;
  Product_Name: string;
  Category: string;
  Sub_Category: string;
  Region: string;
  State: string;
  City: string;
  Sales: string | number;
  Quantity: string | number;
  Discount: string | number;
  Cost: string | number;
  Profit: string | number;
  Payment_Mode: string;
  Order_Status: string;
  Shipping_Mode: string;
  Customer_Rating: string | number;
  Issue_Flag?: string;
}

export interface CleaningLogItem {
  id: number;
  step: string;
  issueFound: string;
  affectedCount: number;
  actionTaken: string;
  excelFormulaOrTool: string;
  status: 'Completed' | 'Verified';
}

export interface DataDictionaryField {
  fieldName: string;
  dataType: string;
  description: string;
  example: string;
  businessRule: string;
  sourceTable: string;
}

export interface MonthlyTarget {
  Year: number;
  Month: string;
  Month_Num: number;
  Target_Sales: number;
  Actual_Sales: number;
  Target_Profit: number;
  Actual_Profit: number;
  Sales_Achievement_Pct: number;
  Profit_Achievement_Pct: number;
  Sales_Variance: number;
  Profit_Variance: number;
  Status: 'Exceeded' | 'Achieved' | 'Underperformed';
}

export interface FilterState {
  searchQuery: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  year: string; // 'All' or '2023', '2024', '2025'
  quarter: string; // 'All' or 'Q1', 'Q2', 'Q3', 'Q4'
  regions: string[];
  categories: string[];
  subCategories: string[];
  segments: string[];
  paymentModes: string[];
  orderStatuses: string[];
  shippingModes: string[];
  customerRatings: number[];
}

export interface DaxMeasureInfo {
  name: string;
  category: 'Sales' | 'Profitability' | 'Time Intelligence' | 'Customer' | 'Operational';
  formula: string;
  description: string;
  format: 'currency' | 'percent' | 'number' | 'rating';
  value: number;
  formattedValue: string;
  yoyGrowth?: number;
}

export interface DrillThroughSelection {
  type: 'product' | 'customer' | 'category' | 'region';
  id: string;
  name: string;
}

export type AppViewMode =
  | 'powerbi'
  | 'tableau'
  | 'excel'
  | 'data-model'
  | 'insights'
  | 'portfolio-interview';

export type DashboardPageId =
  | 'executive'
  | 'overview'
  | 'sales'
  | 'profitability'
  | 'customers'
  | 'products'
  | 'geography'
  | 'operations'
  | 'targets'
  | 'data_quality'
  | 'portfolio_hub';
