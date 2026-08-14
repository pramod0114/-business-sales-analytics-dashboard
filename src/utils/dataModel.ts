export interface StarSchemaTable {
  tableName: string;
  tableType: 'Fact Table' | 'Dimension Table' | 'Measures Table';
  primaryKey?: string;
  foreignKeys?: { column: string; targetTable: string; targetColumn: string }[];
  columns: { name: string; type: string; isKey?: boolean; description: string }[];
  color: string;
}

export interface SchemaRelationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  cardinality: '1:N' | 'N:1' | '1:1';
  crossFilter: 'Single' | 'Both';
}

export const STAR_SCHEMA_TABLES: StarSchemaTable[] = [
  {
    tableName: 'Fact_Sales',
    tableType: 'Fact Table',
    color: 'border-blue-500 bg-blue-950/40 text-blue-300',
    primaryKey: 'Sales_Row_ID',
    foreignKeys: [
      { column: 'Order_Date', targetTable: 'Dim_Date', targetColumn: 'Date' },
      { column: 'Customer_ID', targetTable: 'Dim_Customer', targetColumn: 'Customer_ID' },
      { column: 'Product_ID', targetTable: 'Dim_Product', targetColumn: 'Product_ID' },
      { column: 'City_State_Key', targetTable: 'Dim_Geography', targetColumn: 'Geo_Key' },
    ],
    columns: [
      { name: 'Order_ID', type: 'VARCHAR(25)', description: 'Order business reference number' },
      { name: 'Order_Date', type: 'DATE (FK)', isKey: true, description: 'Order placement calendar date' },
      { name: 'Ship_Date', type: 'DATE', description: 'Actual dispatch date from fulfillment center' },
      { name: 'Customer_ID', type: 'VARCHAR(15) (FK)', isKey: true, description: 'Foreign key to Dim_Customer' },
      { name: 'Product_ID', type: 'VARCHAR(20) (FK)', isKey: true, description: 'Foreign key to Dim_Product' },
      { name: 'City_State_Key', type: 'VARCHAR(40) (FK)', isKey: true, description: 'Composite geographic key' },
      { name: 'Sales', type: 'DECIMAL(12,2)', description: 'Net revenue after applied discounts ($)' },
      { name: 'Quantity', type: 'INTEGER', description: 'Quantity of units purchased' },
      { name: 'Discount', type: 'DECIMAL(4,2)', description: 'Promotional discount rate (0.00 - 0.70)' },
      { name: 'Cost', type: 'DECIMAL(12,2)', description: 'Total cost of goods sold for line item ($)' },
      { name: 'Profit', type: 'DECIMAL(12,2)', description: 'Gross profit contribution ($)' },
      { name: 'Payment_Mode', type: 'VARCHAR(20)', description: 'Tender method used for checkout' },
      { name: 'Order_Status', type: 'VARCHAR(20)', description: 'Fulfillment status (Delivered, Cancelled, etc.)' },
      { name: 'Shipping_Mode', type: 'VARCHAR(20)', description: 'Selected carrier SLA speed tier' },
      { name: 'Customer_Rating', type: 'SMALLINT', description: 'Survey rating score (1 - 5)' },
    ],
  },
  {
    tableName: 'Dim_Date',
    tableType: 'Dimension Table',
    color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
    primaryKey: 'Date',
    columns: [
      { name: 'Date', type: 'DATE (PK)', isKey: true, description: 'Standard calendar date' },
      { name: 'Year', type: 'INTEGER', description: 'Calendar year (2023, 2024, 2025)' },
      { name: 'Quarter', type: 'VARCHAR(4)', description: 'Quarter identifier (Q1, Q2, Q3, Q4)' },
      { name: 'Month', type: 'VARCHAR(10)', description: 'Full month name (January - December)' },
      { name: 'Month_Num', type: 'INTEGER', description: 'Month number (1 - 12)' },
      { name: 'Day_Of_Week', type: 'VARCHAR(10)', description: 'Day name (Monday - Sunday)' },
      { name: 'Is_Weekend', type: 'BOOLEAN', description: 'Weekend binary flag' },
      { name: 'Fiscal_Year', type: 'VARCHAR(10)', description: 'Fiscal reporting period' },
    ],
  },
  {
    tableName: 'Dim_Customer',
    tableType: 'Dimension Table',
    color: 'border-purple-500 bg-purple-950/40 text-purple-300',
    primaryKey: 'Customer_ID',
    columns: [
      { name: 'Customer_ID', type: 'VARCHAR(15) (PK)', isKey: true, description: 'Unique customer identifier' },
      { name: 'Customer_Name', type: 'VARCHAR(100)', description: 'Customer full name' },
      { name: 'Customer_Segment', type: 'VARCHAR(30)', description: 'Consumer, Corporate, Home Office' },
      { name: 'Gender', type: 'VARCHAR(10)', description: 'Demographic gender' },
      { name: 'Age_Group', type: 'VARCHAR(15)', description: 'Age cohort (18-25, 26-35, 36-50, 51+)' },
      { name: 'First_Order_Date', type: 'DATE', description: 'Acquisition cohort start date' },
    ],
  },
  {
    tableName: 'Dim_Product',
    tableType: 'Dimension Table',
    color: 'border-amber-500 bg-amber-950/40 text-amber-300',
    primaryKey: 'Product_ID',
    columns: [
      { name: 'Product_ID', type: 'VARCHAR(20) (PK)', isKey: true, description: 'Unique SKU identifier' },
      { name: 'Product_Name', type: 'VARCHAR(150)', description: 'Standardized commercial merchandise name' },
      { name: 'Category', type: 'VARCHAR(50)', description: 'Technology, Furniture, Office Supplies' },
      { name: 'Sub_Category', type: 'VARCHAR(50)', description: 'Phones, Laptops, Chairs, Binders, etc.' },
      { name: 'Base_Unit_Price', type: 'DECIMAL(10,2)', description: 'MSRP Catalog unit price' },
      { name: 'Base_Unit_Cost', type: 'DECIMAL(10,2)', description: 'Standard inventory unit cost' },
    ],
  },
  {
    tableName: 'Dim_Geography',
    tableType: 'Dimension Table',
    color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300',
    primaryKey: 'Geo_Key',
    columns: [
      { name: 'Geo_Key', type: 'VARCHAR(40) (PK)', isKey: true, description: 'Composite key (City_State)' },
      { name: 'City', type: 'VARCHAR(60)', description: 'Municipal city location' },
      { name: 'State', type: 'VARCHAR(40)', description: 'US Federal State' },
      { name: 'Region', type: 'VARCHAR(20)', description: 'East, West, Central, South' },
      { name: 'Postal_Code', type: 'VARCHAR(10)', description: 'ZIP / Postal designation' },
      { name: 'Country', type: 'VARCHAR(30)', description: 'United States' },
    ],
  },
  {
    tableName: 'Measures_Table',
    tableType: 'Measures Table',
    color: 'border-rose-500 bg-rose-950/40 text-rose-300',
    columns: [
      { name: '[Total Sales]', type: 'DAX Measure', description: 'SUM(Fact_Sales[Sales])' },
      { name: '[Total Profit]', type: 'DAX Measure', description: 'SUM(Fact_Sales[Profit])' },
      { name: '[Profit Margin %]', type: 'DAX Measure', description: 'DIVIDE([Total Profit], [Total Sales], 0)' },
      { name: '[Sales Growth %]', type: 'DAX Measure', description: 'DIVIDE([Total Sales]-[PY Sales], [PY Sales], 0)' },
      { name: '[PY Sales]', type: 'DAX Measure', description: 'CALCULATE([Total Sales], SAMEPERIODLASTYEAR(...))' },
      { name: '[YTD Sales]', type: 'DAX Measure', description: 'TOTALYTD([Total Sales], Dim_Date[Date])' },
    ],
  },
];

export const STAR_SCHEMA_RELATIONSHIPS: SchemaRelationship[] = [
  { fromTable: 'Dim_Date', fromColumn: 'Date', toTable: 'Fact_Sales', toColumn: 'Order_Date', cardinality: '1:N', crossFilter: 'Single' },
  { fromTable: 'Dim_Customer', fromColumn: 'Customer_ID', toTable: 'Fact_Sales', toColumn: 'Customer_ID', cardinality: '1:N', crossFilter: 'Single' },
  { fromTable: 'Dim_Product', fromColumn: 'Product_ID', toTable: 'Fact_Sales', toColumn: 'Product_ID', cardinality: '1:N', crossFilter: 'Single' },
  { fromTable: 'Dim_Geography', fromColumn: 'Geo_Key', toTable: 'Fact_Sales', toColumn: 'City_State_Key', cardinality: '1:N', crossFilter: 'Single' },
];
