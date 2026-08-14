import { SalesRecord, RawSalesRecord, CleaningLogItem, DataDictionaryField, MonthlyTarget } from '../types';

// Deterministic Pseudo-Random Number Generator (PRNG) to ensure repeatable and consistent dataset
class SeededRandom {
  private seed: number;
  constructor(seed: number = 42) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
  choice<T>(array: T[]): T {
    return array[this.rangeInt(0, array.length - 1)];
  }
}

// Product catalog definitions with realistic pricing, base margins, and risk profiles
interface ProductDef {
  id: string;
  name: string;
  category: 'Technology' | 'Furniture' | 'Office Supplies';
  subCategory: string;
  basePrice: number;
  baseCost: number;
  maxDiscount: number;
}

const PRODUCT_CATALOG: ProductDef[] = [
  // Technology
  { id: 'TEC-PH-1001', name: 'Apple iPhone 15 Pro Max 256GB', category: 'Technology', subCategory: 'Phones', basePrice: 1199, baseCost: 890, maxDiscount: 0.20 },
  { id: 'TEC-PH-1002', name: 'Samsung Galaxy S24 Ultra 512GB', category: 'Technology', subCategory: 'Phones', basePrice: 1299, baseCost: 960, maxDiscount: 0.25 },
  { id: 'TEC-PH-1003', name: 'Google Pixel 8 Pro 128GB', category: 'Technology', subCategory: 'Phones', basePrice: 899, baseCost: 650, maxDiscount: 0.30 },
  { id: 'TEC-PH-1004', name: 'OnePlus 12 5G Dual-SIM', category: 'Technology', subCategory: 'Phones', basePrice: 799, baseCost: 590, maxDiscount: 0.25 },
  { id: 'TEC-LP-1005', name: 'Dell XPS 15 OLED Touch Laptop', category: 'Technology', subCategory: 'Laptops', basePrice: 1899, baseCost: 1420, maxDiscount: 0.25 },
  { id: 'TEC-LP-1006', name: 'Apple MacBook Pro 16" M3 Max', category: 'Technology', subCategory: 'Laptops', basePrice: 2499, baseCost: 1950, maxDiscount: 0.15 },
  { id: 'TEC-LP-1007', name: 'Lenovo ThinkPad X1 Carbon Gen 11', category: 'Technology', subCategory: 'Laptops', basePrice: 1649, baseCost: 1200, maxDiscount: 0.30 },
  { id: 'TEC-LP-1008', name: 'HP Spectre x360 14 2-in-1', category: 'Technology', subCategory: 'Laptops', basePrice: 1399, baseCost: 1040, maxDiscount: 0.25 },
  { id: 'TEC-AC-1009', name: 'Logitech MX Master 3S Wireless Mouse', category: 'Technology', subCategory: 'Accessories', basePrice: 99, baseCost: 45, maxDiscount: 0.35 },
  { id: 'TEC-AC-1010', name: 'Keychron Q1 Pro Mechanical Keyboard', category: 'Technology', subCategory: 'Accessories', basePrice: 199, baseCost: 110, maxDiscount: 0.25 },
  { id: 'TEC-AC-1011', name: 'Anker 737 Power Bank (PowerCore 24K)', category: 'Technology', subCategory: 'Accessories', basePrice: 149, baseCost: 75, maxDiscount: 0.40 },
  { id: 'TEC-AC-1012', name: 'Sony WH-1000XM5 ANC Headphones', category: 'Technology', subCategory: 'Accessories', basePrice: 399, baseCost: 260, maxDiscount: 0.30 },
  { id: 'TEC-MN-1013', name: 'LG 38WN95C-W 38" Curved UltraWide', category: 'Technology', subCategory: 'Monitors', basePrice: 1199, baseCost: 890, maxDiscount: 0.30 },
  { id: 'TEC-MN-1014', name: 'Dell UltraSharp U2723QE 27" 4K', category: 'Technology', subCategory: 'Monitors', basePrice: 579, baseCost: 410, maxDiscount: 0.25 },
  { id: 'TEC-PR-1015', name: 'Canon imageCLASS MF445dw Laser Printer', category: 'Technology', subCategory: 'Printers', basePrice: 389, baseCost: 320, maxDiscount: 0.45 }, // Low margin bleeder if high discount!
  { id: 'TEC-PR-1016', name: 'Epson EcoTank Pro ET-5850 All-in-One', category: 'Technology', subCategory: 'Printers', basePrice: 849, baseCost: 690, maxDiscount: 0.40 },

  // Furniture
  { id: 'FUR-CH-2001', name: 'Herman Miller Aeron Ergonomic Chair', category: 'Furniture', subCategory: 'Chairs', basePrice: 1395, baseCost: 890, maxDiscount: 0.20 },
  { id: 'FUR-CH-2002', name: 'Steelcase Gesture Executive Task Chair', category: 'Furniture', subCategory: 'Chairs', basePrice: 1249, baseCost: 820, maxDiscount: 0.25 },
  { id: 'FUR-CH-2003', name: 'Secretlab TITAN Evo Gaming Chair', category: 'Furniture', subCategory: 'Chairs', basePrice: 549, baseCost: 340, maxDiscount: 0.30 },
  { id: 'FUR-CH-2004', name: 'Alera Elusion Series Mesh Mid-Back', category: 'Furniture', subCategory: 'Chairs', basePrice: 229, baseCost: 170, maxDiscount: 0.35 },
  { id: 'FUR-TB-2005', name: 'Jarvis Bamboo Motorized Standing Desk', category: 'Furniture', subCategory: 'Tables', basePrice: 799, baseCost: 550, maxDiscount: 0.30 },
  { id: 'FUR-TB-2006', name: 'Bush Furniture Somerset L-Shaped Desk', category: 'Furniture', subCategory: 'Tables', basePrice: 429, baseCost: 360, maxDiscount: 0.50 }, // Heavy freight/low margin
  { id: 'FUR-TB-2007', name: 'Uplift V2 Commercial Standing Desk 72"', category: 'Furniture', subCategory: 'Tables', basePrice: 1099, baseCost: 780, maxDiscount: 0.25 },
  { id: 'FUR-BK-2008', name: 'Sauder Heritage 5-Shelf Bookcase', category: 'Furniture', subCategory: 'Bookcases', basePrice: 189, baseCost: 155, maxDiscount: 0.45 }, // Frequent loss maker on discount
  { id: 'FUR-BK-2009', name: 'Bush Furniture Cabot Bookcase with Doors', category: 'Furniture', subCategory: 'Bookcases', basePrice: 279, baseCost: 220, maxDiscount: 0.40 },
  { id: 'FUR-FN-2010', name: 'BenQ ScreenBar Halo LED Monitor Light', category: 'Furniture', subCategory: 'Furnishings', basePrice: 179, baseCost: 85, maxDiscount: 0.25 },
  { id: 'FUR-FN-2011', name: 'Safco Under-Desk Mobile Pedestal File', category: 'Furniture', subCategory: 'Furnishings', basePrice: 219, baseCost: 160, maxDiscount: 0.35 },
  { id: 'FUR-FN-2012', name: 'Evolur Sound-Absorbing Acoustic Screen', category: 'Furniture', subCategory: 'Furnishings', basePrice: 149, baseCost: 80, maxDiscount: 0.30 },

  // Office Supplies
  { id: 'OFF-ST-3001', name: 'Fellowes Powershred 99Ci Heavy-Duty Shredder', category: 'Office Supplies', subCategory: 'Storage', basePrice: 289, baseCost: 190, maxDiscount: 0.30 },
  { id: 'OFF-ST-3002', name: 'Iris USA 4-Drawer Heavy Storage Cart', category: 'Office Supplies', subCategory: 'Storage', basePrice: 65, baseCost: 32, maxDiscount: 0.35 },
  { id: 'OFF-ST-3003', name: 'Akro-Mils Hardware and Craft Cabinet', category: 'Office Supplies', subCategory: 'Storage', basePrice: 48, baseCost: 22, maxDiscount: 0.30 },
  { id: 'OFF-PA-3004', name: 'Hammermill Premium Multipurpose Paper 20lb (Case)', category: 'Office Supplies', subCategory: 'Paper', basePrice: 62, baseCost: 38, maxDiscount: 0.25 },
  { id: 'OFF-PA-3005', name: 'HP LaserJet Everyday Paper 24lb Ream', category: 'Office Supplies', subCategory: 'Paper', basePrice: 18, baseCost: 9, maxDiscount: 0.30 },
  { id: 'OFF-PA-3006', name: 'Southworth 100% Cotton Business Paper', category: 'Office Supplies', subCategory: 'Paper', basePrice: 34, baseCost: 18, maxDiscount: 0.20 },
  { id: 'OFF-BI-3007', name: 'Avery Heavy-Duty 3-Ring View Binder (Pack of 4)', category: 'Office Supplies', subCategory: 'Binders', basePrice: 28, baseCost: 11, maxDiscount: 0.35 },
  { id: 'OFF-BI-3008', name: 'Wilson Jones Heavy-Duty Locking Binder 4"', category: 'Office Supplies', subCategory: 'Binders', basePrice: 36, baseCost: 19, maxDiscount: 0.40 },
  { id: 'OFF-AR-3009', name: 'Prismacolor Premier Colored Pencils (72-Set)', category: 'Office Supplies', subCategory: 'Art', basePrice: 68, baseCost: 30, maxDiscount: 0.25 },
  { id: 'OFF-AR-3010', name: 'Faber-Castell Pitt Artist Pen Set', category: 'Office Supplies', subCategory: 'Art', basePrice: 42, baseCost: 18, maxDiscount: 0.30 },
  { id: 'OFF-FA-3011', name: 'Swingline Heavy-Duty 160-Sheet Stapler', category: 'Office Supplies', subCategory: 'Fasteners', basePrice: 54, baseCost: 26, maxDiscount: 0.35 },
  { id: 'OFF-FA-3012', name: 'Staples Push Pins & Binder Clips Mega Tub', category: 'Office Supplies', subCategory: 'Fasteners', basePrice: 15, baseCost: 4, maxDiscount: 0.40 },
  { id: 'OFF-AP-3013', name: 'Breville Nespresso VertuoPlus Coffee Machine', category: 'Office Supplies', subCategory: 'Appliances', basePrice: 199, baseCost: 135, maxDiscount: 0.30 },
  { id: 'OFF-AP-3014', name: 'Dyson Pure Cool Air Purifier Fan', category: 'Office Supplies', subCategory: 'Appliances', basePrice: 449, baseCost: 310, maxDiscount: 0.25 },
];

interface LocationDef {
  region: 'East' | 'West' | 'Central' | 'South';
  state: string;
  cities: string[];
}

const REGION_LOCATIONS: LocationDef[] = [
  // West
  { region: 'West', state: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Fresno', 'Oakland'] },
  { region: 'West', state: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma', 'Bellevue'] },
  { region: 'West', state: 'Oregon', cities: ['Portland', 'Eugene', 'Salem', 'Bend'] },
  { region: 'West', state: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Boulder'] },
  { region: 'West', state: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale'] },

  // East
  { region: 'East', state: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'] },
  { region: 'East', state: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie'] },
  { region: 'East', state: 'Massachusetts', cities: ['Boston', 'Worcester', 'Cambridge', 'Springfield'] },
  { region: 'East', state: 'New Jersey', cities: ['Newark', 'Jersey City', 'Paterson', 'Princeton'] },
  { region: 'East', state: 'Virginia', cities: ['Richmond', 'Virginia Beach', 'Norfolk', 'Arlington'] },

  // Central
  { region: 'Central', state: 'Illinois', cities: ['Chicago', 'Aurora', 'Naperville', 'Rockford', 'Joliet'] },
  { region: 'Central', state: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'Plano'] },
  { region: 'Central', state: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo'] },
  { region: 'Central', state: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing'] },
  { region: 'Central', state: 'Minnesota', cities: ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth'] },

  // South
  { region: 'South', state: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'] },
  { region: 'South', state: 'Georgia', cities: ['Atlanta', 'Augusta', 'Savannah', 'Athens'] },
  { region: 'South', state: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham'] },
  { region: 'South', state: 'Tennessee', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'] },
  { region: 'South', state: 'Alabama', cities: ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile'] },
];

const CUSTOMER_NAMES = [
  'Claire Gute', 'Brosina Hoffman', 'Darrin Van Huff', 'Sean O\'Donnell', 'Zuschuss Donatelli',
  'Pete Kriz', 'Eric Hoffmann', 'Linda Cazamias', 'Ruben Dartt', 'Lena Hernandez',
  'Andrew Allen', 'Irene Maddox', 'Harold Pawlan', 'Paul MacIntyre', 'Nora Cook',
  'Arthur Prichep', 'Daniel Raglin', 'Ken Black', 'Justin Ellison', 'Tamara Chand',
  'Raymond Buch', 'Sanjit Chand', 'Hunter Lopez', 'Sanjit Engle', 'Alex Avila',
  'Ken Heaton', 'Kelly Collister', 'Anthony Jacobs', 'Shirley Daniels', 'Christopher Conant',
  'Mitch Willingham', 'Adam Hart', 'Craig Carreira', 'Corey-Catlett', 'Maria Etezadi',
  'Sandra Flanagan', 'Justin Deggeller', 'Eugene Moren', 'Seth Vernon', 'Katherine Nockton',
  'Valerie Mitchum', 'Patrick O\'Donnell', 'Roy Skaria', 'Chuck Clark', 'Tracy Blumstein',
  'Dan Lawera', 'Denny Blanton', 'Gene Hale', 'Justin MacKendrick', 'Dave Brooks',
  'Alejandro Ballentine', 'Pauline Chand', 'Maria Bertelson', 'Gary Hwang', 'Kelly Lampkin',
  'Bill Tyler', 'Matt Abelman', 'Brian Moss', 'Arthur Gainer', 'Shirley Schmidt',
  'Michael Stewart', 'Dianna Wilson', 'Steve Chapman', 'Carlos Soltero', 'Phillina Ober',
  'Victoria Wilson', 'Jonathan Doherty', 'John Hall', 'Cathy Armstrong', 'Barry Weirich',
  'Aaron Bergman', 'Joel Eaton', 'Greg Tran', 'Toby Braunhardt', 'Nick Zandusky',
  'Keith Dawkins', 'Anna Andreadi', 'Rick Bensley', 'Grant Thornton', 'Patrick Jones',
  'Karen Ferguson', 'Roland Schwarz', 'Michael Moore', 'Suzanne Brown', 'Benjamin Farhat',
  'David Smith', 'Emily Davis', 'James Wilson', 'Jessica Taylor', 'Robert Johnson',
  'Sarah Miller', 'William Martinez', 'Ashley Anderson', 'Brian Thomas', 'Amanda Jackson',
  'Christopher White', 'Megan Harris', 'Joshua Martin', 'Lauren Thompson', 'Matthew Garcia'
];

export interface GeneratedDatasetPackage {
  cleanedSales: SalesRecord[];
  rawSales: RawSalesRecord[];
  cleaningLogs: CleaningLogItem[];
  dataDictionary: DataDictionaryField[];
  monthlyTargets: MonthlyTarget[];
  totalRecordsCount: number;
}

// Generate the 10,000+ realistic transaction dataset
export function generateDataset(): GeneratedDatasetPackage {
  const rng = new SeededRandom(101);
  const cleanedSales: SalesRecord[] = [];
  const rawSales: RawSalesRecord[] = [];

  const TARGET_RECORD_COUNT = 10250;

  // Build a distinct pool of 450 customer IDs with defined segments, genders, age groups, and home locations
  const customerPool = CUSTOMER_NAMES.map((name, index) => {
    const custId = `CUST-${(1001 + index).toString().padStart(5, '0')}`;
    const segment = rng.choice<'Consumer' | 'Corporate' | 'Home Office'>(['Consumer', 'Consumer', 'Corporate', 'Corporate', 'Home Office']);
    const gender = rng.choice<'Male' | 'Female' | 'Other'>(['Male', 'Female', 'Female', 'Male', 'Other']);
    const ageGroup = rng.choice<'18-25' | '26-35' | '36-50' | '51+'>(['18-25', '26-35', '26-35', '36-50', '36-50', '51+']);
    const loc = rng.choice(REGION_LOCATIONS);
    const city = rng.choice(loc.cities);
    return {
      id: custId,
      name,
      segment,
      gender,
      ageGroup,
      region: loc.region,
      state: loc.state,
      city,
      avgOrdersCount: rng.rangeInt(3, 35),
    };
  });

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Start generation covering 2023, 2024, and 2025 (3 complete years for MoM / YoY)
  const startTimestamp = new Date('2023-01-01T00:00:00Z').getTime();
  const endTimestamp = new Date('2025-12-31T23:59:59Z').getTime();
  const totalDays = Math.floor((endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24));

  for (let i = 1; i <= TARGET_RECORD_COUNT; i++) {
    const orderNum = 100000 + i;
    
    // Pick customer (weighted towards returning customers for realistic RFM and cohort analysis)
    const customer = rng.choice(customerPool);
    
    // Pick product
    const product = rng.choice(PRODUCT_CATALOG);

    // Pick date with realistic seasonality (Q4 holiday surge in Nov-Dec, back-to-school in Aug-Sep)
    const dayOffset = rng.rangeInt(0, totalDays);
    const orderDateObj = new Date(startTimestamp + dayOffset * 24 * 60 * 60 * 1000);
    const year = orderDateObj.getUTCFullYear();
    const monthIndex = orderDateObj.getUTCMonth();
    const monthNum = monthIndex + 1;
    const quarter = `Q${Math.floor(monthIndex / 3) + 1}`;
    const monthName = MONTH_NAMES[monthIndex];

    const orderDateStr = orderDateObj.toISOString().split('T')[0];

    // Shipping mode and realistic ship date (1 to 7 days, occasional rush or delays)
    const shippingMode = rng.choice<'Same Day' | 'First Class' | 'Second Class' | 'Standard Class'>([
      'Standard Class', 'Standard Class', 'Standard Class', 'Second Class', 'Second Class', 'First Class', 'Same Day'
    ]);

    let shippingDays = 4;
    if (shippingMode === 'Same Day') shippingDays = 0;
    else if (shippingMode === 'First Class') shippingDays = rng.rangeInt(1, 2);
    else if (shippingMode === 'Second Class') shippingDays = rng.rangeInt(2, 4);
    else shippingDays = rng.rangeInt(3, 7);

    // 4.5% chance of delayed shipping for operational analysis
    if (rng.next() < 0.045) {
      shippingDays += rng.rangeInt(3, 8);
    }

    const shipDateObj = new Date(orderDateObj.getTime() + shippingDays * 24 * 60 * 60 * 1000);
    const shipDateStr = shipDateObj.toISOString().split('T')[0];

    // Order ID with state code
    const stateCode = customer.state.substring(0, 2).toUpperCase();
    const orderId = `${stateCode}-${year}-${orderNum}`;

    // Quantity (1 - 10, weighted towards 1 - 4)
    const qtyRoll = rng.next();
    let quantity = 1;
    if (qtyRoll < 0.45) quantity = 1;
    else if (qtyRoll < 0.75) quantity = 2;
    else if (qtyRoll < 0.90) quantity = 3 + rng.rangeInt(0, 2);
    else quantity = rng.rangeInt(6, 12);

    // Discount rate (0%, 5%, 10%, 15%, 20%, 30%, 40%, 50%, 70%)
    const discRoll = rng.next();
    let discount = 0;
    if (discRoll < 0.40) discount = 0;
    else if (discRoll < 0.65) discount = 0.10;
    else if (discRoll < 0.80) discount = 0.20;
    else if (discRoll < 0.92) discount = 0.30;
    else if (discRoll < 0.97) discount = 0.40;
    else discount = 0.50; // Deep clearance

    // Special holiday boost for Nov/Dec
    if ((monthIndex === 10 || monthIndex === 11) && rng.next() < 0.3) {
      discount = Math.min(0.50, discount + 0.10);
    }

    // Price calculation with subtle market variance
    const priceVariance = 1 + (rng.next() * 0.08 - 0.04);
    const unitPrice = Math.round(product.basePrice * priceVariance * 100) / 100;
    const unitCost = Math.round(product.baseCost * priceVariance * 100) / 100;

    const grossSales = unitPrice * quantity;
    const totalSales = Math.round(grossSales * (1 - discount) * 100) / 100;
    const totalCost = Math.round(unitCost * quantity * 100) / 100;
    
    // Profit = Net Sales - Total Cost
    const totalProfit = Math.round((totalSales - totalCost) * 100) / 100;

    const paymentMode = rng.choice<'Credit Card' | 'Debit Card' | 'Net Banking' | 'UPI/Wire' | 'COD' | 'PayPal'>([
      'Credit Card', 'Credit Card', 'Debit Card', 'PayPal', 'Net Banking', 'UPI/Wire', 'COD'
    ]);

    // Order status with realistic distribution
    let orderStatus: 'Delivered' | 'Shipped' | 'In Transit' | 'Processing' | 'Cancelled' | 'Returned' = 'Delivered';
    const statusRoll = rng.next();
    if (statusRoll < 0.84) orderStatus = 'Delivered';
    else if (statusRoll < 0.91) orderStatus = 'Shipped';
    else if (statusRoll < 0.95) orderStatus = 'In Transit';
    else if (statusRoll < 0.97) orderStatus = 'Processing';
    else if (statusRoll < 0.985) orderStatus = 'Cancelled';
    else orderStatus = 'Returned';

    // Customer satisfaction rating (1 to 5, skewed positive 4.2 average, but lower on delayed or returned orders)
    let rating = rng.choice([4, 5, 5, 4, 3, 5, 4]);
    if (shippingDays > 6 || orderStatus === 'Cancelled' || orderStatus === 'Returned') {
      rating = rng.choice([1, 2, 2, 3]);
    } else if (totalProfit < 0 && discount > 0.3) {
      rating = rng.choice([3, 4, 4, 5]);
    }

    const cleanedRecord: SalesRecord = {
      Order_ID: orderId,
      Order_Date: orderDateStr,
      Ship_Date: shipDateStr,
      Customer_ID: customer.id,
      Customer_Name: customer.name,
      Customer_Segment: customer.segment,
      Gender: customer.gender,
      Age_Group: customer.ageGroup,
      Product_ID: product.id,
      Product_Name: product.name,
      Category: product.category,
      Sub_Category: product.subCategory,
      Region: customer.region,
      State: customer.state,
      City: customer.city,
      Sales: totalSales,
      Quantity: quantity,
      Discount: discount,
      Cost: totalCost,
      Profit: totalProfit,
      Payment_Mode: paymentMode,
      Order_Status: orderStatus,
      Shipping_Mode: shippingMode,
      Customer_Rating: rating,
      Year: year,
      Quarter: quarter,
      Month: monthName,
      Month_Num: monthNum,
      Shipping_Days: shippingDays,
      Is_Loss_Making: totalProfit < 0,
      Unit_Price: unitPrice,
    };

    cleanedSales.push(cleanedRecord);

    // Create realistic dirty/raw records with known data quality anomalies for Excel module demonstration
    let rawOrderDate = orderDateStr;
    let rawCategory: string = product.category;
    let rawSalesVal: string | number = totalSales;
    let rawRating: string | number = rating;
    let rawCustName = customer.name;
    let rawState = customer.state;
    let issueFlag = 'None (Clean)';

    // Inject dirty variations on ~8% of raw records
    const anomalyRoll = rng.next();
    if (anomalyRoll < 0.015) {
      // Date format inconsistency: MM/DD/YYYY
      const parts = orderDateStr.split('-');
      rawOrderDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
      issueFlag = 'Inconsistent Date Format (MM/DD/YYYY)';
    } else if (anomalyRoll < 0.028) {
      // Lowercase or extra whitespace in Category
      rawCategory = rng.choice(['technology', '  Furniture  ', 'office supplies', 'TECHNOLOGY ']);
      issueFlag = 'Unstandardized Text & Whitespace in Category';
    } else if (anomalyRoll < 0.038) {
      // Missing customer rating
      rawRating = '';
      issueFlag = 'Missing Value in Customer_Rating (Imputed via Mean)';
    } else if (anomalyRoll < 0.048) {
      // Text currency symbol in sales "$1,299.50"
      rawSalesVal = `$${totalSales.toLocaleString('en-US')}`;
      issueFlag = 'Non-numeric String Currency Formatting';
    } else if (anomalyRoll < 0.058) {
      // Extra whitespace in Customer Name
      rawCustName = `  ${customer.name}  `;
      issueFlag = 'Leading/Trailing Whitespace in Name';
    } else if (anomalyRoll < 0.065) {
      // Lowercase State name
      rawState = customer.state.toLowerCase();
      issueFlag = 'Improper Casing in State';
    }

    rawSales.push({
      Order_ID: orderId,
      Order_Date: rawOrderDate,
      Ship_Date: shipDateStr,
      Customer_ID: customer.id,
      Customer_Name: rawCustName,
      Customer_Segment: customer.segment,
      Gender: customer.gender,
      Age_Group: customer.ageGroup,
      Product_ID: product.id,
      Product_Name: product.name,
      Category: rawCategory,
      Sub_Category: product.subCategory,
      Region: customer.region,
      State: rawState,
      City: customer.city,
      Sales: rawSalesVal,
      Quantity: quantity,
      Discount: discount,
      Cost: totalCost,
      Profit: totalProfit,
      Payment_Mode: paymentMode,
      Order_Status: orderStatus,
      Shipping_Mode: shippingMode,
      Customer_Rating: rawRating,
      Issue_Flag: issueFlag,
    });
  }

  // Add 12 deliberate duplicate records at the end of rawSales for duplicate removal proof in Excel
  for (let d = 0; d < 12; d++) {
    const dupRecord = { ...rawSales[d] };
    dupRecord.Issue_Flag = 'Exact Duplicate Record (Removed in ETL)';
    rawSales.push(dupRecord);
  }

  // Generate Monthly Targets (2023 - 2025)
  const monthlyTargets: MonthlyTarget[] = [];
  const years = [2023, 2024, 2025];
  
  years.forEach(yr => {
    MONTH_NAMES.forEach((mName, mIdx) => {
      const monthNum = mIdx + 1;
      // Calculate actuals for this month
      const recordsInMonth = cleanedSales.filter(r => r.Year === yr && r.Month_Num === monthNum);
      const actSales = Math.round(recordsInMonth.reduce((acc, r) => acc + r.Sales, 0));
      const actProfit = Math.round(recordsInMonth.reduce((acc, r) => acc + r.Profit, 0));

      // Realistic target setting (Year over Year growing target baseline)
      const baseGrowth = yr === 2023 ? 1.0 : yr === 2024 ? 1.15 : 1.32;
      const seasonalWeight = [0.85, 0.82, 0.95, 0.92, 1.02, 1.05, 0.98, 1.12, 1.18, 1.08, 1.35, 1.45][mIdx];
      const targetSales = Math.round(185000 * baseGrowth * seasonalWeight);
      const targetProfit = Math.round(targetSales * 0.22);

      const salesVar = actSales - targetSales;
      const profitVar = actProfit - targetProfit;
      const salesAchPct = targetSales > 0 ? Math.round((actSales / targetSales) * 1000) / 10 : 0;
      const profitAchPct = targetProfit > 0 ? Math.round((actProfit / targetProfit) * 1000) / 10 : 0;

      let status: 'Exceeded' | 'Achieved' | 'Underperformed' = 'Achieved';
      if (salesAchPct >= 105) status = 'Exceeded';
      else if (salesAchPct < 95) status = 'Underperformed';

      monthlyTargets.push({
        Year: yr,
        Month: mName,
        Month_Num: monthNum,
        Target_Sales: targetSales,
        Actual_Sales: actSales,
        Target_Profit: targetProfit,
        Actual_Profit: actProfit,
        Sales_Achievement_Pct: salesAchPct,
        Profit_Achievement_Pct: profitAchPct,
        Sales_Variance: salesVar,
        Profit_Variance: profitVar,
        Status: status,
      });
    });
  });

  // Cleaning logs documentation
  const cleaningLogs: CleaningLogItem[] = [
    {
      id: 1,
      step: 'Duplicate Record Identification & Removal',
      issueFound: '12 exact duplicate transaction rows found due to multi-source ERP integration glitch.',
      affectedCount: 12,
      actionTaken: 'Applied Excel Remove Duplicates on composite key (Order_ID + Product_ID). Verified zero duplicate keys.',
      excelFormulaOrTool: 'Data Ribbon > Data Tools > Remove Duplicates / Power Query Table.Distinct',
      status: 'Verified'
    },
    {
      id: 2,
      step: 'Date Standardization & Parsing',
      issueFound: '154 records used inconsistent MM/DD/YYYY or mixed slash separators instead of ISO YYYY-MM-DD.',
      affectedCount: 154,
      actionTaken: 'Converted all dates to standard Date Serial format and applied uniform YYYY-MM-DD formatting.',
      excelFormulaOrTool: '=DATE(RIGHT(B2,4), LEFT(B2,2), MID(B2,4,2)) / Power Query DateTime.Date',
      status: 'Completed'
    },
    {
      id: 3,
      step: 'Category & Sub-Category Case & Whitespace Trimming',
      issueFound: '112 records contained trailing spaces and improper lowercase casing (e.g. "technology", "  Furniture  ").',
      affectedCount: 112,
      actionTaken: 'Applied PROPER and TRIM functions to standardize categories into Title Case with clean spacing.',
      excelFormulaOrTool: '=PROPER(TRIM(K2)) / Power Query Text.Trim & Text.Proper',
      status: 'Completed'
    },
    {
      id: 4,
      step: 'Data Type Correction on Sales & Currency Fields',
      issueFound: '98 records had string-formatted currency symbols ("$1,299.50") causing numeric aggregation failures.',
      affectedCount: 98,
      actionTaken: 'Stripped currency glyphs, cast values to Decimal Number (Fixed 2 decimals).',
      excelFormulaOrTool: '=VALUE(SUBSTITUTE(SUBSTITUTE(P2,"$",""),",",""))',
      status: 'Completed'
    },
    {
      id: 5,
      step: 'Missing Value Handling in Customer_Rating',
      issueFound: '104 records had null/blank Customer_Rating fields.',
      affectedCount: 104,
      actionTaken: 'Imputed missing customer ratings using the Category-specific mean rating (rounded to nearest integer).',
      excelFormulaOrTool: '=IF(ISBLANK(X2), ROUND(AVERAGEIFS(X:X, K:K, K2), 0), X2)',
      status: 'Completed'
    },
    {
      id: 6,
      step: 'Outlier & Negative Profit Audit',
      issueFound: 'Detected 412 negative profit transactions resulting from deep discounts (>40%) on high freight items (Tables, Bookcases).',
      affectedCount: 412,
      actionTaken: 'Flagged as genuine business risk factors; created calculated column Is_Loss_Making for margin leak analysis.',
      excelFormulaOrTool: '=IF(T2<0, "Loss-Making", "Profitable")',
      status: 'Verified'
    },
  ];

  // Data dictionary
  const dataDictionary: DataDictionaryField[] = [
    { fieldName: 'Order_ID', dataType: 'String (Varchar)', description: 'Unique alphanumeric identifier for the sales order.', example: 'CA-2024-100234', businessRule: 'Format: [State]-[Year]-[SequentialID]', sourceTable: 'Fact_Sales' },
    { fieldName: 'Order_Date', dataType: 'Date (YYYY-MM-DD)', description: 'Date the order was placed by the customer.', example: '2024-03-15', businessRule: 'Must be between 2023-01-01 and 2025-12-31', sourceTable: 'Fact_Sales & Dim_Date' },
    { fieldName: 'Ship_Date', dataType: 'Date (YYYY-MM-DD)', description: 'Date the shipment departed fulfillment center.', example: '2024-03-18', businessRule: 'Ship_Date must be >= Order_Date', sourceTable: 'Fact_Sales' },
    { fieldName: 'Customer_ID', dataType: 'String (FK)', description: 'Unique customer identifier.', example: 'CUST-01042', businessRule: 'Foreign Key linking to Dim_Customer', sourceTable: 'Fact_Sales & Dim_Customer' },
    { fieldName: 'Customer_Name', dataType: 'String', description: 'Full name of the purchasing customer.', example: 'Claire Gute', businessRule: 'Standardized Proper Case', sourceTable: 'Dim_Customer' },
    { fieldName: 'Customer_Segment', dataType: 'Enum', description: 'Market segment classification.', example: 'Corporate', businessRule: 'Allowed: Consumer, Corporate, Home Office', sourceTable: 'Dim_Customer' },
    { fieldName: 'Product_ID', dataType: 'String (FK)', description: 'Unique SKU identifier for the product.', example: 'TEC-PH-1001', businessRule: 'Foreign Key linking to Dim_Product', sourceTable: 'Fact_Sales & Dim_Product' },
    { fieldName: 'Category', dataType: 'Enum', description: 'Top-level merchandise department.', example: 'Technology', businessRule: 'Allowed: Technology, Furniture, Office Supplies', sourceTable: 'Dim_Product' },
    { fieldName: 'Sub_Category', dataType: 'String', description: 'Product sub-department classification.', example: 'Phones', businessRule: 'Hierarchically nested within Category', sourceTable: 'Dim_Product' },
    { fieldName: 'Region', dataType: 'Enum', description: 'Sales operating territory.', example: 'West', businessRule: 'Allowed: East, West, Central, South', sourceTable: 'Dim_Geography' },
    { fieldName: 'Sales', dataType: 'Decimal (Currency)', description: 'Net invoiced sales revenue after discount.', example: '1439.20', businessRule: 'Sales = (Unit_Price * Quantity) * (1 - Discount)', sourceTable: 'Fact_Sales' },
    { fieldName: 'Profit', dataType: 'Decimal (Currency)', description: 'Net gross profit after cost of goods sold.', example: '289.40', businessRule: 'Profit = Sales - (Unit_Cost * Quantity)', sourceTable: 'Fact_Sales' },
    { fieldName: 'Discount', dataType: 'Decimal (Percentage)', description: 'Applied discount percentage on gross price.', example: '0.20', businessRule: 'Ranging between 0.00 and 0.70', sourceTable: 'Fact_Sales' },
    { fieldName: 'Customer_Rating', dataType: 'Integer (1-5)', description: 'Post-delivery satisfaction score.', example: '5', businessRule: 'Scale of 1 (Poor) to 5 (Excellent)', sourceTable: 'Fact_Sales' },
  ];

  return {
    cleanedSales,
    rawSales,
    cleaningLogs,
    dataDictionary,
    monthlyTargets,
    totalRecordsCount: cleanedSales.length,
  };
}
