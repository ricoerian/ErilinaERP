import { useState, useEffect } from 'react'; // Import useEffect
import { Printer, FileText, Table, XCircle, AlertCircle } from 'lucide-react'; // Added AlertCircle icon
import * as XLSX from 'xlsx';

// Existing interfaces
export interface ReportColumn<T> {
  header: string;
  key: keyof T;
  formatter?: (value: T[keyof T], item: T) => string | number;
  align?: 'left' | 'right' | 'center';
}

export interface ReportHeaderInfo {
  companyName: string;
  [key: string]: unknown;
}

export interface ReportFooterInfo {
  appName: string;
  [key: string]: unknown;
}

// Extended interface for Inventory Management specific data
// Now uses 'currentStock' to match the provided data structure
interface InventoryItem {
  id?: string; // Added optional id to match your data
  itemId?: string; // Kept for flexibility if itemId is used elsewhere
  name?: string; // Added optional name to match your data
  itemName?: string; // Kept for flexibility if itemName is used elsewhere
  currentStock: number; // Changed from 'quantity' to 'currentStock'
  averageCost: number; // Cost at which the item was acquired
  sellingPrice: number; // Price at which the item is sold
  // Add other relevant inventory fields as needed, e.g., lastSaleDate, reorderPoint, supplier
}

interface ReportGeneratorModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data: T[];
  columns: ReportColumn<T>[];
  title: string;
  fileName: string;
  headerInfo?: ReportHeaderInfo;
  footerInfo?: ReportFooterInfo;
  dateFilterKey?: keyof T;
  currencyCode?: string;
  exchangeRates?: unknown; // Not used in this version but kept for potential future use
  convertAndFormatCurrency?: (amount: number, targetCurrency: string) => string;
  getStockStatusClass?: (status: string) => string;
  // New parameter for Inventory Management
  inventoryManagement?: boolean; // Boolean to enable/disable inventory details
}

const ReportGeneratorModal = <T extends Record<string, unknown>>({
  isOpen,
  onClose,
  data,
  columns,
  title,
  fileName,
  headerInfo,
  footerInfo,
  dateFilterKey,
  currencyCode = 'USD', // Default currency code
  convertAndFormatCurrency,
  getStockStatusClass,
  inventoryManagement, // New prop
}: ReportGeneratorModalProps<T>) => {
  const [printStartDate, setPrintStartDate] = useState<string>('');
  const [printEndDate, setPrintEndDate] = useState<string>('');
  const [showZeroValueWarning, setShowZeroValueWarning] = useState<boolean>(false); // New state for warning
  const primaryColor = '#3b82f6';
  const textColor = '#ffffff';

  /**
   * Formats a number as currency based on the provided currencyCode or default 'USD'.
   * Uses a custom formatter if `convertAndFormatCurrency` prop is provided.
   * @param amount The number to format.
   * @returns Formatted currency string.
   */
  const formatCurrency = (amount: number): string => {
    if (convertAndFormatCurrency) {
      // If a custom formatter is provided (e.g., for multi-currency support)
      return convertAndFormatCurrency(amount, currencyCode);
    }
    // Default formatting using Intl.NumberFormat
    // Ensure two decimal places and prevent scientific notation for large numbers
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true, // Ensure thousands separators are used
    }).format(amount);
  };

  /**
   * Filters the data array by a specified date range if `dateFilterKey` and dates are provided.
   * @param items The array of data items to filter.
   * @returns The filtered array of data items.
   */
  const filterDataByDate = (items: T[]): T[] => {
    if (!dateFilterKey || (!printStartDate && !printEndDate)) {
      return items;
    }

    return items.filter(item => {
      const itemDateString = item[dateFilterKey] as unknown as string;
      if (!itemDateString) return false;

      const itemDate = new Date(itemDateString);
      const start = printStartDate ? new Date(printStartDate) : null;
      if (start) start.setHours(0, 0, 0, 0); // Set start date to beginning of the day
      const end = printEndDate ? new Date(printEndDate) : null;
      if (end) end.setHours(23, 59, 59, 999); // Set end date to end of the day

      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      return true;
    });
  };

  const filteredData = filterDataByDate(data);

  /**
   * Calculates various inventory management metrics.
   * This function assumes that items in `filteredData` have `currentStock`, `averageCost`,
   * `sellingPrice`, `itemId`, and `itemName` properties for meaningful calculations.
   * @returns An object containing calculated inventory metrics or null if inventoryManagement is false or no data.
   */
  const calculateInventoryMetrics = () => {
    if (!inventoryManagement || filteredData.length === 0) {
      return null;
    }

    let totalInventoryValueCost = 0;
    let totalInventoryValueSelling = 0;
    let totalUniqueItems = 0;
    let totalQuantity = 0;

    // Array to store item values for ABC Analysis
    const itemValues: { item: T, value: number }[] = [];

    filteredData.forEach(item => {
      // Type assertion for inventory-specific properties
      // Ensure these are numbers, default to 0 if not present or invalid
      // Now using 'currentStock' from the data
      const currentStock = typeof (item as unknown as InventoryItem).currentStock === 'number' ? (item as unknown as InventoryItem).currentStock : 0;
      const averageCost = typeof (item as unknown as InventoryItem).averageCost === 'number' ? (item as unknown as InventoryItem).averageCost : 0;
      const sellingPrice = typeof (item as unknown as InventoryItem).sellingPrice === 'number' ? (item as unknown as InventoryItem).sellingPrice : 0;

      if (currentStock > 0) { // Only count items with positive currentStock
        totalUniqueItems++;
        totalQuantity += currentStock; // Use currentStock for totalQuantity
        totalInventoryValueCost += currentStock * averageCost;
        totalInventoryValueSelling += currentStock * sellingPrice;
        itemValues.push({ item, value: currentStock * averageCost });
      }
    });

    // Sort items by value in descending order for ABC Analysis
    itemValues.sort((a, b) => b.value - a.value);

    // Perform ABC Analysis
    const totalValueForABC = itemValues.reduce((sum, { value }) => sum + value, 0);
    let cumulativeValue = 0;
    const abcCategories: { A: T[], B: T[], C: T[] } = { A: [], B: [], C: [] };

    itemValues.forEach(({ item, value }) => {
      cumulativeValue += value;
      const percentage = (totalValueForABC > 0) ? (cumulativeValue / totalValueForABC) * 100 : 0; // Avoid division by zero
      if (percentage <= 80) { // A-items: top 80% of value
        abcCategories.A.push(item);
      } else if (percentage <= 95) { // B-items: next 15% (80-95%)
        abcCategories.B.push(item);
      } else { // C-items: remaining 5% (95-100%)
        abcCategories.C.push(item);
      }
    });

    // Simple Demand Insights (identifying low/high stock items)
    // Sort by currentStock to find lowest and highest stock items
    const itemsByQuantity = [...filteredData].sort((a, b) => {
      const qtyA = typeof (a as unknown as InventoryItem).currentStock === 'number' ? (a as unknown as InventoryItem).currentStock : 0;
      const qtyB = typeof (b as unknown as InventoryItem).currentStock === 'number' ? (b as unknown as InventoryItem).currentStock : 0;
      return qtyA - qtyB;
    });
    const lowStockItems = itemsByQuantity.slice(0, Math.min(5, itemsByQuantity.length)); // Get top 5 lowest stock items
    const highStockItems = itemsByQuantity.slice(Math.max(0, itemsByQuantity.length - 5), itemsByQuantity.length).reverse(); // Get top 5 highest stock items

    return {
      totalInventoryValueCost,
      totalInventoryValueSelling,
      totalUniqueItems,
      totalQuantity,
      abcCategories,
      lowStockItems,
      highStockItems,
      // Note: True Stock Turnover and accurate Demand Forecasting require historical sales transaction data over a period.
      // This report only uses current inventory data for simplified insights.
    };
  };

  const inventoryMetrics = calculateInventoryMetrics();

  // Effect to check if inventory metrics are all zero when inventoryManagement is true
  useEffect(() => {
    if (isOpen && inventoryManagement && inventoryMetrics) { // Only show warning if modal is open and inventory management is active
      const { totalInventoryValueCost, totalInventoryValueSelling, totalUniqueItems, totalQuantity } = inventoryMetrics;
      // Check if all relevant metrics are zero AND there is actual data being processed
      if (filteredData.length > 0 && totalInventoryValueCost === 0 && totalInventoryValueSelling === 0 && totalUniqueItems === 0 && totalQuantity === 0) {
        setShowZeroValueWarning(true);
      } else {
        setShowZeroValueWarning(false);
      }
    } else {
      setShowZeroValueWarning(false);
    }
  }, [isOpen, inventoryManagement, inventoryMetrics, filteredData.length]); // Re-run when these props change


  /**
   * Generates the HTML content for the printable report, including main data table
   * and optional inventory management details.
   * @returns A string containing the complete HTML for the report.
   */
  const generatePrintContent = () => {
    let tableHeaders = '';
    columns.forEach(col => {
      tableHeaders += `<th style="text-align: ${col.align || 'left'};">${col.header}</th>`;
    });

    let tableRows = '';
    if (filteredData.length === 0) {
      tableRows += `<tr><td colspan="${columns.length}" style="text-align: center; padding: 20px; color: #6b7280;">No data available for this period.</td></tr>`;
    } else {
      filteredData.forEach(item => {
        tableRows += '<tr>';
        columns.forEach(col => {
          const rawValue: unknown = item[col.key];
          let displayValue: string | number | unknown = rawValue;

          if (col.formatter) {
            displayValue = col.formatter(rawValue as T[keyof T], item);
          }

          // Apply status badge styling if applicable
          if (col.key === 'Status' && getStockStatusClass) {
            const statusClass = getStockStatusClass(String(displayValue)).replace('badge ', ''); // Remove 'badge ' prefix if present
            tableRows += `<td style="text-align: ${col.align || 'left'};"><span class="badge ${statusClass}">${displayValue}</span></td>`;
          } else {
            tableRows += `<td style="text-align: ${col.align || 'left'};">${displayValue}</td>`;
          }
        });
        tableRows += '</tr>';
      });
    }

    const reportPeriodText = (printStartDate && printEndDate)
      ? `Report Period: ${new Date(printStartDate).toLocaleDateString('en-US')} - ${new Date(printEndDate).toLocaleDateString('en-US')}`
      : 'Report Period: All Time';

    const currentDateTime = new Date();
    const generatedDate = currentDateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const generatedTime = currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // --- Inventory Management HTML Section ---
    let inventoryDetailsHtml = '';
    if (inventoryManagement && inventoryMetrics) {
      const { totalInventoryValueCost, totalInventoryValueSelling, totalUniqueItems, totalQuantity, abcCategories, lowStockItems, highStockItems } = inventoryMetrics;

      inventoryDetailsHtml = `
        <div class="inventory-section">
          <h3 class="section-title">Inventory Management Summary</h3>
          <div class="summary-grid">
            <div class="summary-card">
              <h4>Total Unique Items</h4>
              <p>${totalUniqueItems}</p>
            </div>
            <div class="summary-card">
              <h4>Total Quantity in Stock</h4>
              <p>${totalQuantity}</p>
            </div>
            <div class="summary-card">
              <h4>Inventory Value (Cost)</h4>
              <p>${formatCurrency(totalInventoryValueCost)}</p>
            </div>
            <div class="summary-card">
              <h4>Inventory Value (Selling Price)</h4>
              <p>${formatCurrency(totalInventoryValueSelling)}</p>
            </div>
          </div>

          <h4 class="subsection-title">ABC Analysis (by Cost Value)</h4>
          <p class="analysis-note">Classifies inventory items based on their value contribution. 'A' items are high-value (top 80% of cumulative value), 'B' are medium (next 15%), and 'C' are low-value (remaining 5%).</p>
          <div class="abc-summary">
            <div class="abc-category">
              <h5>Category A (${abcCategories.A.length} items)</h5>
              <ul>
                ${abcCategories.A.map(item => `<li>${(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId}: ${formatCurrency(((item as unknown as InventoryItem).currentStock || 0) * ((item as unknown as InventoryItem).averageCost || 0))}</li>`).join('')}
                ${abcCategories.A.length === 0 ? '<li>No A-items found.</li>' : ''}
              </ul>
            </div>
            <div class="abc-category">
              <h5>Category B (${abcCategories.B.length} items)</h5>
              <ul>
                ${abcCategories.B.map(item => `<li>${(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId}: ${formatCurrency(((item as unknown as InventoryItem).currentStock || 0) * ((item as unknown as InventoryItem).averageCost || 0))}</li>`).join('')}
                ${abcCategories.B.length === 0 ? '<li>No B-items found.</li>' : ''}
              </ul>
            </div>
            <div class="abc-category">
              <h5>Category C (${abcCategories.C.length} items)</h5>
              <ul>
                ${abcCategories.C.map(item => `<li>${(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId}: ${formatCurrency(((item as unknown as InventoryItem).currentStock || 0) * ((item as unknown as InventoryItem).averageCost || 0))}</li>`).join('')}
                ${abcCategories.C.length === 0 ? '<li>No C-items found.</li>' : ''}
              </ul>
            </div>
          </div>

          <h4 class="subsection-title">Stock Insights</h4>
          <p class="analysis-note">Identifies potential low-stock and high-stock items based on current quantities.</p>
          <div class="stock-insights-grid">
            <div class="insight-card">
              <h5>Top 5 Lowest Stock Items</h5>
              <ul>
                ${lowStockItems.map(item => `<li>${(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId} (Qty: ${(item as unknown as InventoryItem).currentStock || 0})</li>`).join('')}
                ${lowStockItems.length === 0 ? '<li>No low stock items found.</li>' : ''}
              </ul>
            </div>
            <div class="insight-card">
              <h5>Top 5 Highest Stock Items</h5>
              <ul>
                ${highStockItems.map(item => `<li>${(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId} (Qty: ${(item as unknown as InventoryItem).currentStock || 0})</li>`).join('')}
                ${highStockItems.length === 0 ? '<li>No high stock items found.</li>' : ''}
              </ul>
            </div>
          </div>

          <h4 class="subsection-title">Stock Turnover & Demand Forecast (Conceptual)</h4>
          <p class="analysis-note">
            <strong style="color: #e53e3e;">Note:</strong> True Stock Turnover and accurate Demand Forecasting require historical sales transaction data over a specific period (e.g., Cost of Goods Sold, Sales Quantity per item). This report is based on current inventory levels only.
            For a comprehensive analysis, integrate with sales and purchase order modules.
          </p>
          <div class="conceptual-insights">
            <p><strong>Stock Turnover Ratio:</strong> Requires Cost of Goods Sold / Average Inventory Value. (Data not available in current report scope)</p>
            <p><strong>Simple Demand Forecast:</strong> Requires historical sales patterns. (Data not available in current report scope)</p>
          </div>
        </div>
      `;
    }

    return `
      <html>
      <head>
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; margin: 30px; color: #333; display: flex; flex-direction: column; min-height: 95vh; line-height: 1.6; }
          .report-header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e0e0e0; padding-bottom: 20px; }
          .report-header h1 { font-size: 2.8em; color: #2d3748; margin-bottom: 8px; font-weight: 700; }
          .report-header h2 { font-size: 1.4em; color: #4a5568; margin-top: 0; font-weight: 600; }
          .report-header p { font-size: 1em; color: #718096; margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; flex-grow: 1; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;}
          th, td { border: 1px solid #e2e8f0; padding: 14px 18px; font-size: 0.95em; }
          th { background-color: #edf2f7; font-weight: 700; color: #2d3748; text-transform: uppercase; letter-spacing: 0.05em; }
          tr:nth-child(even) { background-color: #f7fafc; }
          tr:hover { background-color: #ebf8ff; }
          .badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.4em 0.8em;
            font-size: 0.85em;
            font-weight: 600;
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            border-radius: 9999px;
            color: #fff;
            min-width: 60px;
          }
          .badge-success { background-color: #48bb78; }
          .badge-warning { background-color: #f6e05e; color: #333; }
          .badge-error { background-color: #ef4444; }
          .badge-neutral { background-color: #a0aec0; }
          .report-footer {
            margin-top: auto;
            padding-top: 25px;
            border-top: 2px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            font-size: 0.9em;
            color: #718096;
            text-align: center;
          }
          .report-footer span { flex: 1; }
          .report-footer span:first-child { text-align: left; }
          .report-footer span:last-child { text-align: right; }

          /* Inventory Management Specific Styles */
          .inventory-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
          }
          .section-title {
            font-size: 2.2em;
            color: #2d3748;
            margin-bottom: 25px;
            font-weight: 700;
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
          }
          .subsection-title {
            font-size: 1.6em;
            color: #4a5568;
            margin-top: 30px;
            margin-bottom: 15px;
            font-weight: 600;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 5px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .summary-card, .insight-card {
            background-color: #f0f4f8;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            text-align: center;
            min-width: 250px; /* Added to prevent content from collapsing on print */
          }
          .summary-card h4, .insight-card h5 {
            color: #2d3748;
            font-size: 1.2em;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .summary-card p {
            font-size: 1.8em;
            font-weight: 700;
            color: ${primaryColor};
            word-wrap: break-word; /* Ensure long numbers break if necessary */
          }
          .abc-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .abc-category {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .abc-category h5 {
            font-size: 1.1em;
            color: #2d3748;
            margin-bottom: 10px;
            font-weight: 600;
            border-bottom: 1px solid #ebf8ff;
            padding-bottom: 5px;
          }
          .abc-category ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .abc-category li {
            padding: 5px 0;
            border-bottom: 1px dotted #edf2f7;
            font-size: 0.9em;
            color: #4a5568;
          }
          .abc-category li:last-child {
            border-bottom: none;
          }
          .stock-insights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .insight-card ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .insight-card li {
            padding: 5px 0;
            border-bottom: 1px dotted #e2e8f0;
            font-size: 0.9em;
            color: #4a5568;
          }
          .insight-card li:last-child {
            border-bottom: none;
          }
          .analysis-note {
            font-size: 0.95em;
            color: #6b7280;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #fffbe6;
            border-left: 4px solid #fbd38d;
            border-radius: 4px;
          }
          .conceptual-insights p {
            font-size: 0.9em;
            color: #4a5568;
            margin-bottom: 8px;
          }


          @media print {
            .no-print { display: none; }
            body { margin: 0; }
            table { page-break-after: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            td, th { page-break-inside: avoid; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            .inventory-section { page-break-before: always; } /* Start new page for inventory section */
            /* Ensure grid items don't collapse on print */
            .summary-grid, .abc-summary, .stock-insights-grid {
              display: block; /* Force block layout in print to avoid side-by-side issues */
            }
            .summary-card, .abc-category, .insight-card {
              width: 100%; /* Take full width when in block layout */
              margin-bottom: 20px; /* Add spacing between cards when stacked */
              box-sizing: border-box; /* Include padding and border in the element's total width and height */
            }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>${title}</h1>
          <h2>${headerInfo?.companyName || ''}</h2>
          <p>${reportPeriodText}</p>
          <p>Generated On: ${generatedDate} ${generatedTime}</p>
        </div>
        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        ${inventoryDetailsHtml} <div class="report-footer">
          <span>${footerInfo?.appName || ''}</span>
          <span>${headerInfo?.companyName || ''}</span>
        </div>
      </body>
      </html>
    `;
  };

  /**
   * Handles printing the report by opening a new window and injecting the generated HTML content.
   */
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatePrintContent());
      printWindow.document.close();
      printWindow.focus();
      // Use a timeout to ensure content is rendered before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
    onClose();
  };

  /**
   * Handles exporting the report data to a CSV file.
   * Includes inventory management details if enabled.
   */
  const handleExportCsv = () => {
    let csvContent = columns.map(col => `"${col.header}"`).join(',') + '\n';

    filteredData.forEach(item => {
      const row = columns.map(col => {
        let value: unknown = item[col.key];
        if (col.formatter) {
          value = col.formatter(value as T[keyof T], item);
        }
        // Escape double quotes in CSV values
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',');
      csvContent += row + '\n';
    });

    // Add inventory details to CSV if enabled
    if (inventoryManagement && inventoryMetrics) {
      const { totalInventoryValueCost, totalInventoryValueSelling, totalUniqueItems, totalQuantity, abcCategories, lowStockItems, highStockItems } = inventoryMetrics;

      csvContent += '\n\n"Inventory Management Summary"\n';
      csvContent += `"Total Unique Items","${totalUniqueItems}"\n`;
      csvContent += `"Total Quantity in Stock","${totalQuantity}"\n`;
      csvContent += `"Inventory Value (Cost)","${formatCurrency(totalInventoryValueCost)}"\n`;
      csvContent += `"Inventory Value (Selling Price)","${formatCurrency(totalInventoryValueSelling)}"\n`;

      csvContent += '\n"ABC Analysis (by Cost Value)"\n';
      csvContent += '"Category A"\n';
      abcCategories.A.forEach(item => csvContent += `"${(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId}","${formatCurrency(((item as unknown as InventoryItem).currentStock || 0) * ((item as unknown as InventoryItem).averageCost || 0))}"\n`);
      csvContent += '"Category B"\n';
      abcCategories.B.forEach(item => csvContent += `"${(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId}","${formatCurrency(((item as unknown as InventoryItem).currentStock || 0) * ((item as unknown as InventoryItem).averageCost || 0))}"\n`);
      csvContent += '"Category C"\n';
      abcCategories.C.forEach(item => csvContent += `"${(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId}","${formatCurrency(((item as unknown as InventoryItem).currentStock || 0) * ((item as unknown as InventoryItem).averageCost || 0))}"\n`);

      csvContent += '\n"Stock Insights"\n';
      csvContent += '"Top 5 Lowest Stock Items"\n';
      lowStockItems.forEach(item => csvContent += `"${(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId}","Qty: ${(item as unknown as InventoryItem).currentStock || 0}"\n`);
      csvContent += '"Top 5 Highest Stock Items"\n';
      highStockItems.forEach(item => csvContent += `"${(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId}","Qty: ${(item as unknown as InventoryItem).currentStock || 0}"\n`);

      csvContent += '\n"Stock Turnover & Demand Forecast (Conceptual)"\n';
      csvContent += '"Note: True Stock Turnover and accurate Demand Forecasting require historical sales transaction data over a specific period (e.g., Cost of Goods Sold, Sales Quantity per item). This report is based on current inventory levels only. For a comprehensive analysis, integrate with sales and purchase order modules."\n';
    }


    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  /**
   * Handles exporting the report data to an Excel (XLSX) file.
   * Creates a main sheet for the report data and a separate sheet for inventory management details if enabled.
   */
  const handleExportExcel = () => {
    const headerRow = columns.map(col => col.header);

    const dataForSheet = filteredData.map(item => {
      const row: Record<string, unknown> = {};
      columns.forEach(col => {
        const value = item[col.key];

        // Special handling for currency and date fields for Excel formatting
        if (col.key === 'SellingPrice' || col.key === 'AverageCost') {
          row[col.header] = value;
        } else if (col.key === 'CreatedAt' || col.key === 'UpdatedAt' || col.key === 'timestamp') {
          row[col.header] = new Date(value as string);
        } else if (col.formatter) {
          row[col.header] = col.formatter(value as T[keyof T], item);
        } else {
          row[col.header] = value;
        }
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(dataForSheet, { header: headerRow });

    const headerStyle = { font: { bold: true } };
    const currencyFormat = `_(${currencyCode || '$'}* #,##0.00_);_(${currencyCode || '$'}* (#,##0.00);_(${currencyCode || '$'}* "-"??_);_(@_)`;
    const dateFormat = 'yyyy-mm-dd hh:mm:ss';

    // Apply styles and formats to the main report sheet
    columns.forEach((col, colIndex) => {
      const headerCellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      if (ws[headerCellAddress]) {
        ws[headerCellAddress].s = headerStyle; // Bold header
      }

      for (let rowIndex = 1; rowIndex <= filteredData.length; ++rowIndex) {
        const dataCellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
        const cell = ws[dataCellAddress];

        if (cell) {
          if (col.key === 'SellingPrice' || col.key === 'AverageCost') {
            cell.t = 'n'; // Set type to number
            cell.z = currencyFormat; // Apply currency format
          } else if (col.key === 'CreatedAt' || col.key === 'UpdatedAt' || col.key === 'timestamp') {
            if (cell && cell.v instanceof Date) {
              cell.t = 'n'; // Set type to number (Excel stores dates as numbers)
              cell.z = dateFormat; // Apply date format
            }
          }
        }
      }
    });

    // Set column widths for better readability
    const colWidths = columns.map(col => ({ wch: col.header.length + 5 }));
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report"); // Add main report sheet

    // Add Inventory Management Summary to a separate sheet in Excel if enabled
    if (inventoryManagement && inventoryMetrics) {
      const { totalInventoryValueCost, totalInventoryValueSelling, totalUniqueItems, totalQuantity, abcCategories, lowStockItems, highStockItems } = inventoryMetrics;

      // Prepare data for the inventory summary sheet
      const inventorySummaryData = [
        ["Inventory Management Summary"],
        [], // Empty row for spacing
        ["Total Unique Items", totalUniqueItems],
        ["Total Quantity in Stock", totalQuantity],
        ["Inventory Value (Cost)", totalInventoryValueCost],
        ["Inventory Value (Selling Price)", totalInventoryValueSelling],
        [], // Empty row for separation
        ["ABC Analysis (by Cost Value)"],
        ["Category A"],
        ...abcCategories.A.map(item => [(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId, ((item as unknown as InventoryItem).currentStock || 0) * ((item as unknown as InventoryItem).averageCost || 0)]),
        ["Category B"],
        ...abcCategories.B.map(item => [(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId, ((item as unknown as InventoryItem).currentStock || 0) * ((item as unknown as InventoryItem).averageCost || 0)]),
        ["Category C"],
        ...abcCategories.C.map(item => [(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId, ((item as unknown as InventoryItem).currentStock || 0) * ((item as unknown as InventoryItem).averageCost || 0)]),
        [],
        ["Stock Insights"],
        ["Top 5 Lowest Stock Items"],
        ...lowStockItems.map(item => [(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId, `Qty: ${(item as unknown as InventoryItem).currentStock || 0}`]),
        ["Top 5 Highest Stock Items"],
        ...highStockItems.map(item => [(item as unknown as InventoryItem).name || (item as unknown as InventoryItem).itemName || (item as unknown as InventoryItem).id || (item as unknown as InventoryItem).itemId, `Qty: ${(item as unknown as InventoryItem).currentStock || 0}`]),
        [],
        ["Stock Turnover & Demand Forecast (Conceptual)"],
        ["Note: True Stock Turnover and accurate Demand Forecasting require historical sales transaction data over a specific period (e.g., Cost of Goods Sold, Sales Quantity per item). This report is based on current inventory levels only. For a comprehensive analysis, integrate with sales and purchase order modules."],
      ];

      const wsInventory = XLSX.utils.aoa_to_sheet(inventorySummaryData);

      // Apply currency format to relevant cells in inventory summary sheet
      // Adjust row indices based on the `inventorySummaryData` structure
      const currencyCells = [
        { row: 4, col: 1 }, // Inventory Value (Cost)
        { row: 5, col: 1 }, // Inventory Value (Selling Price)
        ...abcCategories.A.map((_, i) => ({ row: 9 + i, col: 1 })), // Category A items start from row 9
        // The following row calculations are tricky if data is dynamic. Assuming fixed rows for headers.
        { row: 9 + abcCategories.A.length + 1, col: 0 }, // Position of "Category B" header + 1 for content
        ...abcCategories.B.map((_, i) => ({ row: 9 + abcCategories.A.length + 2 + i, col: 1 })), // Category B items
        { row: 9 + abcCategories.A.length + 2 + abcCategories.B.length + 1, col: 0 }, // Position of "Category C" header + 1 for content
        ...abcCategories.C.map((_, i) => ({ row: 9 + abcCategories.A.length + 2 + abcCategories.B.length + 2 + i, col: 1 })), // Category C items
      ].filter(cell => cell.col === 1); // Filter to only target cells that hold the value

      currencyCells.forEach(({ row, col }) => {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (wsInventory[cellAddress]) {
          wsInventory[cellAddress].t = 'n';
          wsInventory[cellAddress].z = currencyFormat;
        }
      });

      // Adjust column widths for the inventory summary sheet for better readability
      const wsInventoryColWidths = [
        { wch: 40 }, // For the first column (labels)
        { wch: 20 }, // For the second column (values)
      ];
      wsInventory['!cols'] = wsInventoryColWidths;


      XLSX.utils.book_append_sheet(wb, wsInventory, "Inventory Summary"); // Add inventory summary sheet
    }

    // Write the workbook to an XLSX file
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);

    onClose();
  };

  // If the modal is not open, return null to render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Close"
        >
          <XCircle size={24} />
        </button>

        <h3 className="font-bold text-3xl mb-6 text-gray-800 text-center">Generate {title}</h3>

        {/* Warning message for zero inventory values */}
        {showZeroValueWarning && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md flex items-center gap-2" role="alert">
            <AlertCircle size={20} />
            <div>
              <p className="font-bold">Informasi Penting:</p>
              <p className="text-sm">Detail inventaris menunjukkan nilai nol. Pastikan data yang Anda berikan memiliki nilai numerik positif untuk 'currentStock', 'averageCost', dan 'sellingPrice'.</p>
            </div>
          </div>
        )}

        {/* Date filter section, conditionally rendered if dateFilterKey is provided */}
        {dateFilterKey && (
          <div className="space-y-4 mb-6">
            <label className="block">
              <span className="text-gray-700 text-sm font-medium mb-1 block">Start Date</span>
              <input
                type="date"
                className="input input-bordered w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                value={printStartDate}
                onChange={(e) => setPrintStartDate(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-gray-700 text-sm font-medium mb-1 block">End Date</span>
              <input
                type="date"
                className="input input-bordered w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                value={printEndDate}
                onChange={(e) => setPrintEndDate(e.target.value)}
              />
            </label>
          </div>
        )}
        {/* Action buttons for generating different report formats */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            style={{ backgroundColor: primaryColor, color: textColor }}
            onClick={handlePrintReport}
          >
            <Printer size={22} /> Generate & Print Report
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            style={{ backgroundColor: '#28a745', color: textColor }}
            onClick={handleExportCsv}
          >
            <FileText size={22} /> Export to CSV
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            style={{ backgroundColor: '#1e7e34', color: textColor }}
            onClick={handleExportExcel}
          >
            <Table size={22} /> Export to Excel
          </button>
          <button
            type="button"
            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold text-lg shadow-sm hover:shadow-md transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneratorModal;