import { SalesRecord, RawSalesRecord, DataDictionaryField, CleaningLogItem, MonthlyTarget } from '../types';

export function exportCleanedDataToCSV(data: SalesRecord[], filename = 'Cleaned_Sales_Data_10K.csv') {
  if (!data.length) return;
  const headers = [
    'Order_ID', 'Order_Date', 'Ship_Date', 'Customer_ID', 'Customer_Name', 'Customer_Segment',
    'Gender', 'Age_Group', 'Product_ID', 'Product_Name', 'Category', 'Sub_Category',
    'Region', 'State', 'City', 'Sales', 'Quantity', 'Discount', 'Cost', 'Profit',
    'Payment_Mode', 'Order_Status', 'Shipping_Mode', 'Customer_Rating'
  ];

  const rows = data.map(r => [
    `"${r.Order_ID}"`,
    `"${r.Order_Date}"`,
    `"${r.Ship_Date}"`,
    `"${r.Customer_ID}"`,
    `"${r.Customer_Name.replace(/"/g, '""')}"`,
    `"${r.Customer_Segment}"`,
    `"${r.Gender}"`,
    `"${r.Age_Group}"`,
    `"${r.Product_ID}"`,
    `"${r.Product_Name.replace(/"/g, '""')}"`,
    `"${r.Category}"`,
    `"${r.Sub_Category}"`,
    `"${r.Region}"`,
    `"${r.State}"`,
    `"${r.City}"`,
    r.Sales,
    r.Quantity,
    r.Discount,
    r.Cost,
    r.Profit,
    `"${r.Payment_Mode}"`,
    `"${r.Order_Status}"`,
    `"${r.Shipping_Mode}"`,
    r.Customer_Rating
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportRawDataToCSV(data: RawSalesRecord[], filename = 'Raw_Sales_Data_With_Quality_Issues.csv') {
  if (!data.length) return;
  const headers = [
    'Order_ID', 'Order_Date', 'Ship_Date', 'Customer_ID', 'Customer_Name', 'Customer_Segment',
    'Gender', 'Age_Group', 'Product_ID', 'Product_Name', 'Category', 'Sub_Category',
    'Region', 'State', 'City', 'Sales', 'Quantity', 'Discount', 'Cost', 'Profit',
    'Payment_Mode', 'Order_Status', 'Shipping_Mode', 'Customer_Rating', 'Data_Quality_Issue_Flag'
  ];

  const rows = data.map(r => [
    `"${r.Order_ID}"`,
    `"${r.Order_Date}"`,
    `"${r.Ship_Date}"`,
    `"${r.Customer_ID}"`,
    `"${String(r.Customer_Name).replace(/"/g, '""')}"`,
    `"${r.Customer_Segment}"`,
    `"${r.Gender}"`,
    `"${r.Age_Group}"`,
    `"${r.Product_ID}"`,
    `"${String(r.Product_Name).replace(/"/g, '""')}"`,
    `"${r.Category}"`,
    `"${r.Sub_Category}"`,
    `"${r.Region}"`,
    `"${r.State}"`,
    `"${r.City}"`,
    `"${r.Sales}"`,
    r.Quantity,
    r.Discount,
    r.Cost,
    r.Profit,
    `"${r.Payment_Mode}"`,
    `"${r.Order_Status}"`,
    `"${r.Shipping_Mode}"`,
    `"${r.Customer_Rating}"`,
    `"${r.Issue_Flag || 'None'}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportDataDictionaryToCSV(data: DataDictionaryField[], filename = 'Data_Dictionary.csv') {
  const headers = ['Field_Name', 'Data_Type', 'Description', 'Example_Value', 'Business_Rule', 'Source_Table'];
  const rows = data.map(d => [
    `"${d.fieldName}"`,
    `"${d.dataType}"`,
    `"${d.description.replace(/"/g, '""')}"`,
    `"${d.example}"`,
    `"${d.businessRule.replace(/"/g, '""')}"`,
    `"${d.sourceTable}"`
  ].join(','));
  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportTargetsToCSV(data: MonthlyTarget[], filename = 'Monthly_Sales_Profit_Targets_Vs_Actuals.csv') {
  const headers = ['Year', 'Month', 'Month_Num', 'Target_Sales', 'Actual_Sales', 'Sales_Variance', 'Sales_Achievement_Pct', 'Target_Profit', 'Actual_Profit', 'Profit_Variance', 'Profit_Achievement_Pct', 'Status'];
  const rows = data.map(t => [
    t.Year,
    `"${t.Month}"`,
    t.Month_Num,
    t.Target_Sales,
    t.Actual_Sales,
    t.Sales_Variance,
    `${t.Sales_Achievement_Pct}%`,
    t.Target_Profit,
    t.Actual_Profit,
    t.Profit_Variance,
    `${t.Profit_Achievement_Pct}%`,
    `"${t.Status}"`
  ].join(','));
  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
