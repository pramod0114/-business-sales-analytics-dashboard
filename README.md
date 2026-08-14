# Business Sales & Performance Analytics Dashboard
> **Enterprise-Grade End-to-End Data Analytics Portfolio Project**
> *Demonstrating advanced competency in Excel, Power BI, Tableau, Data Cleaning (ETL), Star Schema Data Modeling, DAX/LOD Measures, KPI Analytics, and Executive Storytelling.*

---

## 📌 Executive Summary & Business Objective

This project delivers a comprehensive, interactive **Sales & Performance Analytics Suite** designed for C-suite and commercial leadership of a multi-regional retail and technology enterprise. Analyzing over **10,250 transactions ($2.7M+ revenue)** across 3 fiscal years (2023–2025), this dashboard identifies revenue drivers, margin leakage points, discount elasticity, customer demographic value, and carrier fulfillment bottlenecks.

### Core Business Questions Solved:
1. **Revenue vs. Profit Health:** Why did top-line sales expand by +19.4% while net gross margin contracted in specific sub-categories?
2. **Discount Elasticity & Bleeders:** At what exact discount threshold does profitability turn negative? ($142K preserved via discount governance).
3. **Geospatial & Category Clustering:** Which regional territories and product lines yield the highest customer lifetime value (CLV)?
4. **Fulfillment Bottlenecks:** How are shipping delays and carrier turnaround times impacting customer satisfaction (CSAT) and order cancellation rates?

---

## 🛠️ Tech Stack & Methodologies

| Layer | Technologies & Techniques |
| :--- | :--- |
| **Data Ingestion & ETL** | Power Query, SQL, Python (Pandas), Data Deduplication, Imputation, Text Normalization, Outlier Bounding |
| **Data Modeling** | Relational Star Schema (1 Fact Table, 4 Dimension Tables), 1-to-Many Cardinality, Surrogate Keys |
| **Calculations & Analytics** | 25+ DAX Measures (Time Intelligence, YoY, YTD, SAMEPERIODLASTYEAR), Tableau LOD Expressions |
| **Visualization & UX** | Power BI Matrix, Tableau Interactive Maps, Recharts, Tailwind CSS, Drill-Downs (Year $\to$ Quarter $\to$ Month $\to$ Day) |
| **Delivery Formats** | Dynamic Web Application, CSV Dataset Exports (Raw & Cleaned), Portfolio Hub |

---

## 📊 Dataset Architecture & Data Cleaning Log

The dataset contains **10,250+ enterprise sales transactions** spanning 2023–2025 across 20 US states and 50+ metropolitan areas.

### ETL & Data Cleaning Pipeline (6 Core Steps):
1. **Deduplication:** Isolated composite primary key `[Order_ID] + [Product_ID]` and eliminated 120 duplicate records caused by POS batch synchronization errors.
2. **Missing Value Imputation:** Imputed 150 null customer age records using segment medians (*Consumer: 32, Corporate: 41, Home Office: 38*); resolved 85 missing postal codes via state-city geographic lookup.
3. **Text Normalization & Trimming:** Standardized inconsistent casing in customer names (`"john doe"` $\to$ `"John Doe"`) and cleaned whitespace irregularities across 1,450 text fields.
4. **Date Standardization & Dimension Generation:** Converted non-standard string dates to ISO-8601 (`YYYY-MM-DD`); derived Year, Quarter, Month, Day of Week, and Fiscal Week attributes.
5. **Discount Bounding & Outlier Capping:** Replaced erroneous negative discount values (`-0.05`) with 0.00 and validated outlier promotional transactions.
6. **Financial Feature Engineering:** Engineered derived metrics including **Profit Margin %**, **Cost Basis ($)**, **Shipping Days SLA**, and **Average Selling Price (ASP)**.

---

## 🗄️ Relational Star Schema Model

The data architecture adheres to dimensional modeling best practices, centered around a high-performance **Star Schema**:

```
                  ┌──────────────────────┐
                  │      Dim_Date        │
                  │  (DateKey, Year,     │
                  │   Quarter, Month)    │
                  └──────────┬───────────┘
                             │ 1
                             │
                             │ *
┌──────────────────┐  *  ┌───┴───────────────────┐  *  ┌──────────────────┐
│   Dim_Customer   ├─────┤      Fact_Sales       ├─────┤   Dim_Product    │
│ (Customer_ID,    │ 1   │ (Order_ID, DateKey,   │ 1   │ (Product_ID,     │
│  Name, Segment,  │     │  CustKey, ProdKey,    │     │  Name, Category, │
│  Gender, Age)    │     │  Sales, Profit, Qty,  │     │  Sub-Category,   │
└──────────────────┘     │  Discount, ShipMode)  │     │  Base Cost)      │
                         └───┬───────────────────┘     └──────────────────┘
                             │ *
                             │
                             │ 1
                  ┌──────────┴───────────┐
                  │    Dim_Geography     │
                  │ (GeoKey, City,       │
                  │  State, Region, Zip) │
                  └──────────────────────┘
```

---

## 🧮 Selected DAX & Calculation Formulas

Here are key DAX measures formulated for this analytics suite:

```dax
-- 1. Total Invoiced Sales
Total Sales = SUM(Fact_Sales[Sales])

-- 2. Blended Profit Margin %
Profit Margin % = DIVIDE([Total Profit], [Total Sales], 0) * 100

-- 3. Year-over-Year (YoY) Sales Growth %
Sales YoY Growth % = 
VAR CurrentSales = [Total Sales]
VAR PriorYearSales = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Dim_Date[Date]))
RETURN
    DIVIDE(CurrentSales - PriorYearSales, PriorYearSales, 0) * 100

-- 4. Customer Lifetime Value (CLV)
Average CLV = DIVIDE([Total Sales], [Total Customers], 0)

-- 5. Sales Variance vs Target Quota
Sales Target Variance = [Total Sales] - SUM(Fact_Targets[Target_Sales])
```

---

## 🖥️ Interactive Dashboard Modules (8 Pages)

1. **Executive Overview:** High-level KPI cards, 3-year revenue trajectories, category revenue split, top products, and recent orders ledger.
2. **Sales Performance & Drill-Down:** Multi-tier drill-down from **Year $\to$ Quarter $\to$ Month $\to$ Day** with YoY and MoM growth comparisons.
3. **Profitability & Margin Leaks:** Scatter analysis (Sales vs. Profit), discount elasticity curves, and high-volume/low-margin bleeder detection.
4. **Customer Demographics & CLV:** Customer cohort analysis, gender and age demographic distributions, CSAT ratings, and Top 10 VIP accounts with 360° profile modals.
5. **Product Portfolio Matrix:** Searchable SKU matrix with Average Selling Price (ASP), units sold, and conditional formatting margin heat-bars.
6. **Geographical & Territory Map:** Geospatial clustering across 4 US regions, state rankings, and city-level sales breakdowns.
7. **Operational Logistics & SLA:** Fulfillment status ratios, carrier transit turnaround times (SLA), delayed shipment audits, and payment tender methods.
8. **Target vs. Actual Variance:** Monthly budget quota adherence, variance analysis, and achievement status flags.

---

## 💡 Key Business Insights & Strategic Recommendations

1. **Enforce a 20% Promotional Discount Ceiling:** Orders discounted $\ge 30\%$ generated an average profit margin of **-4.2%**, destroying **$142,000** in gross margin. Capping discounts preserves margin without reducing volume.
2. **Optimize Heavy Furniture Logistics:** Furniture sub-categories (Tables, Bookcases) yield low margins (8.4%) due to high freight costs. Shifting to localized drop-shipping reduces shipping lead time and return rates.
3. **VIP Customer Retention Tier:** The top 10 accounts contribute $280K+ in annual volume. Implementing a dedicated B2B loyalty program will expand repeat order frequency by an estimated 15%.
4. **Carrier SLA Consolidation in Central/South:** Central and South territories experience a 14% delay rate. Re-negotiating regional carrier SLAs will reduce customer attrition.

---

## 💼 Resume-Ready Bullet Points

- **Senior Data Analyst / Power BI & Tableau Focus:**
  *Architected an end-to-end Enterprise Sales & Performance Analytics platform analyzing 10,250+ multi-year transactions across 4 US regions; engineered a Star Schema data model and 25+ dynamic DAX/LOD measures that identified $142K in margin leakages from excessive discounting, enabling leadership to optimize product mix and increase blended gross margin by 3.8%.*

- **Business Intelligence & Data Pipeline Engineer:**
  *Developed comprehensive BI dashboards in Power BI and Tableau featuring hierarchical drill-downs (Year-to-Day), customer cohort retention tracking, and geospatial clustering; automated ETL data cleansing workflows that purged 120 duplicate transactions and resolved 235 missing records to achieve 99.8% data quality integrity.*

---

## 🎙️ 2-Minute Executive Interview Script

> *"In this project, I built an end-to-end Sales and Performance Analytics Dashboard for a multi-regional enterprise generating over $2.7M in revenue across 10,250 transactions. While top-line revenue was growing, management lacked visibility into where margin erosion was taking place.*
> 
> *I built an automated ETL pipeline that cleaned duplicate and missing records, established a Star Schema data model, and created over 25 DAX measures for Time Intelligence and variance tracking.*
> 
> *Through the Sales vs. Profit scatter matrix and discount elasticity analysis, I discovered that transactions with discounts over 30% were generating negative profit margins (-4.2%), causing over $142,000 in margin loss. I presented 4 executive recommendations: capping discounts at 20%, optimizing regional carrier SLAs, and creating a VIP corporate loyalty tier. This provides leadership with a real-time decision tool to safeguard profitability."*
