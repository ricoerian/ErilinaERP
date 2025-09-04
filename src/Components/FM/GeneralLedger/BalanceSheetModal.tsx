import React, { useMemo, useRef } from 'react';
import { Printer, XCircle, Download } from 'lucide-react';
import { Journal, Account } from '../../../types/generalLedger';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';
import * as XLSX from 'xlsx';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    journals: Journal[];
    accounts: Account[];
}

const BalanceSheetModal: React.FC<Props> = ({ isOpen, onClose, journals, accounts }) => {
    const companyDetails = useCompanyDetails();
    const reportRef = useRef<HTMLDivElement>(null);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: companyDetails?.currency_code || 'IDR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const balanceSheetData = useMemo(() => {
        const balances: { [key: number]: number } = {};
        const debitNormalTypes = new Set(["Asset", "Current Assets", "Cash", "Accounts Receivable", "Inventory", "Prepaid Expenses", "Non-Current Assets", "Fixed Assets", "Machinery", "Buildings", "Vehicles", "Drawings", "Expense", "Cost of Goods Sold", "Rent Expense", "Wages Expense", "Utilities Expense", "Depreciation Expense", "General and Administrative Expenses"]);

        accounts.forEach(acc => balances[acc.ID] = 0);

        journals.forEach(j => {
            j.JournalEntries.forEach(e => {
                const account = accounts.find(a => a.ID === e.AccountID);
                if (account) {
                    if (debitNormalTypes.has(account.AccountType)) {
                        balances[e.AccountID] += e.Debit - e.Credit;
                    } else {
                        balances[e.AccountID] += e.Credit - e.Debit;
                    }
                }
            });
        });

        let totalRevenue = 0;
        let totalExpense = 0;
        accounts.forEach(acc => {
            if (acc.AccountType.includes("Revenue") || acc.AccountType.includes("Sales")) {
                totalRevenue += balances[acc.ID];
            }
            if (acc.AccountType.includes("Expense") || acc.AccountType.includes("COGS")) {
                totalExpense += balances[acc.ID];
            }
        });
        const netIncome = totalRevenue - totalExpense;

        const assets = accounts.filter(a => (a.AccountType.includes("Asset") || a.AccountType.includes("Cash")) && !a.AccountType.includes("Accumulated Depreciation")).sort((a,b) => a.AccountNumber.localeCompare(b.AccountNumber));
        const contraAssets = accounts.filter(a => a.AccountType.includes("Accumulated Depreciation")).sort((a,b) => a.AccountNumber.localeCompare(b.AccountNumber));
        const liabilities = accounts.filter(a => a.AccountType.includes("Liability") || a.AccountType.includes("Payable")).sort((a,b) => a.AccountNumber.localeCompare(b.AccountNumber));
        const equity = accounts.filter(a => a.AccountType.includes("Equity") || a.AccountType.includes("Capital")).sort((a,b) => a.AccountNumber.localeCompare(b.AccountNumber));

        const totalAssets = assets.reduce((sum, a) => sum + balances[a.ID], 0) - contraAssets.reduce((sum, a) => sum + balances[a.ID], 0);
        const totalLiabilities = liabilities.reduce((sum, l) => sum + balances[l.ID], 0);
        const baseEquity = equity.reduce((sum, e) => sum + balances[e.ID], 0);
        const totalEquity = baseEquity + netIncome;

        return {
            assets, contraAssets, liabilities, equity, balances, netIncome,
            totalAssets, totalLiabilities, totalEquity,
        };
    }, [accounts, journals]);
    
    const handlePrint = () => {
        if (reportRef.current) {
            const printContent = reportRef.current.innerHTML;
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Balance Sheet - ${companyDetails?.name || ''}</title>
                            <style>
                                @page { size: A4; margin: 20mm; }
                                body { 
                                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                                    line-height: 1.6; 
                                    color: #1f2937;
                                    -webkit-print-color-adjust: exact !important; 
                                    print-color-adjust: exact !important;
                                }
                                .print-container { max-width: 100%; margin: auto; }
                                .report-header { display: flex !important; justify-content: space-between !important; align-items: flex-start !important; margin-bottom: 2rem !important; border-bottom: 2px solid #e5e7eb !important; padding-bottom: 1rem !important; }
                                .company-details, .report-title-section { width: 48% !important; }
                                .company-details img { max-width: 150px !important; height: auto !important; margin-bottom: 0.5rem !important; }
                                .company-details h1 { font-size: 1.5rem !important; font-weight: 700 !important; margin: 0 !important; color: #111827 !important; }
                                .company-details p { font-size: 0.875rem !important; color: #6b7280 !important; margin: 2px 0 !important; }
                                .report-title-section { text-align: right !important; }
                                .report-title-section h2 { font-size: 1.875rem !important; font-weight: 800 !important; color: #1f2937 !important; margin: 0 0 0.5rem 0 !important; }
                                .report-title-section p { font-size: 0.875rem !important; margin: 2px 0 !important; }
                                .grid-container { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 2.5rem !important; }
                                .section-title { font-size: 1.125rem !important; font-weight: 700 !important; border-bottom: 2px solid #a0aec0 !important; padding-bottom: 0.25rem !important; margin-bottom: 1rem !important; color: #111827 !important; }
                                .account-row { display: flex !important; justify-content: space-between !important; font-size: 0.875rem !important; padding: 0.3rem 0 !important; }
                                .total-row { display: flex !important; justify-content: space-between !important; font-weight: 700 !important; border-top: 1px solid #a0aec0 !important; padding-top: 0.5rem !important; margin-top: 0.5rem !important; }
                                .verification-footer { margin-top: 2rem; padding: 0.75rem; border-radius: 0.5rem; text-align: center; font-weight: 700; font-size: 0.9rem; }
                                .balanced { background-color: #dcfce7 !important; color: #166534 !important; }
                                .not-balanced { background-color: #fee2e2 !important; color: #991b1b !important; }
                                @media print { body { margin: 0; } .print-container { margin: 0; padding: 0; } }
                            </style>
                        </head>
                        <body>
                            <div class="print-container">${printContent}</div>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            }
        }
    };

    const handleExportExcel = () => {
        const { assets, contraAssets, liabilities, equity, balances, netIncome, totalAssets, totalLiabilities, totalEquity } = balanceSheetData;
        
        const dataToExport = [
            [`${companyDetails?.name || 'Company'} - Balance Sheet`],
            [`As of ${new Date().toLocaleDateString()}`],
            [],
            ["ASSETS", ""],
            ...assets.map(a => [a.AccountName, balances[a.ID]]),
            ...contraAssets.map(ca => [`  ${ca.AccountName}`, -balances[ca.ID]]),
            ["Total Assets", totalAssets],
            [],
            ["LIABILITIES & EQUITY", ""],
            ["Liabilities", ""],
            ...liabilities.map(l => [l.AccountName, balances[l.ID]]),
            ["Total Liabilities", totalLiabilities],
            [],
            ["Equity", ""],
            ...equity.map(e => [e.AccountName, balances[e.ID]]),
            ["Net Income for the Period", netIncome],
            ["Total Equity", totalEquity],
            [],
            ["Total Liabilities & Equity", totalLiabilities + totalEquity],
        ];

        const ws = XLSX.utils.aoa_to_sheet(dataToExport);
        ws['!cols'] = [{ wch: 40 }, { wch: 20 }];
        
        const currencyFormat = `_("${companyDetails?.currency_code || '$'}"* #,##0.00_);_("${companyDetails?.currency_code || '$'}"* (#,##0.00);_("${companyDetails?.currency_code || '$'}"* "-"??_);_(@_)`;
        
        for (let i = 4; i < dataToExport.length; i++) {
            if (typeof dataToExport[i][1] === 'number') {
                const cellAddress = XLSX.utils.encode_cell({ r: i, c: 1 });
                if(ws[cellAddress]) {
                    ws[cellAddress].z = currencyFormat;
                }
            }
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Balance Sheet");
        XLSX.writeFile(wb, "Balance_Sheet.xlsx");
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-4xl">
                <div className="flex justify-between items-center pb-4 border-b no-print">
                    <h3 className="font-bold text-xl">Balance Sheet</h3>
                    <div className="flex gap-2">
                        <button onClick={handleExportExcel} className="btn btn-sm btn-ghost text-green-600"><Download size={16}/> Export Excel</button>
                        <button onClick={handlePrint} className="btn btn-sm btn-ghost"><Printer size={16}/> Print</button>
                        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost"><XCircle size={20}/></button>
                    </div>
                </div>

                {/* KONTEN PREVIEW DAN PRINT */}
                <div className="py-4 overflow-y-auto max-h-[70vh] bg-gray-50 p-6 rounded-lg">
                    <div ref={reportRef}>
                        <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-200 report-header">
                            <div className="w-1/2 company-details">
                                {companyDetails?.logo_url && <img src={companyDetails.logo_url} alt="Company Logo" className="max-w-[150px] h-auto mb-2" />}
                                <h1 className="text-2xl font-bold text-gray-900">{companyDetails?.name}</h1>
                                <p className="text-sm text-gray-600">{companyDetails?.address}</p>
                                <p className="text-sm text-gray-600">Email: {companyDetails?.contact_email}</p>
                                <p className="text-sm text-gray-600">Phone: {companyDetails?.phone}</p>
                            </div>
                            <div className="w-1/2 text-right report-title-section">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">BALANCE SHEET</h2>
                                <p className="text-sm"><strong>Report Date:</strong> {new Date().toLocaleDateString()}</p>
                                <p className="text-sm mt-1"><strong>Period:</strong> As of {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 grid-container">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-2 section-title">Assets</h3>
                                {balanceSheetData.assets.map(acc => (
                                    <div key={acc.ID} className="flex justify-between text-sm py-1 account-row">
                                        <span>{acc.AccountName}</span>
                                        <span>{formatCurrency(balanceSheetData.balances[acc.ID])}</span>
                                    </div>
                                ))}
                                {balanceSheetData.contraAssets.map(acc => (
                                    <div key={acc.ID} className="flex justify-between text-sm py-1 account-row">
                                        <span className="pl-4">{acc.AccountName}</span>
                                        <span>({formatCurrency(balanceSheetData.balances[acc.ID])})</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold border-t pt-2 mt-2 total-row">
                                    <span>Total Assets</span>
                                    <span>{formatCurrency(balanceSheetData.totalAssets)}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-2 section-title">Liabilities & Equity</h3>
                                <h4 className="font-semibold pt-2 text-sm">Liabilities</h4>
                                {balanceSheetData.liabilities.map(acc => (
                                    <div key={acc.ID} className="flex justify-between text-sm py-1 account-row">
                                        <span>{acc.AccountName}</span>
                                        <span>{formatCurrency(balanceSheetData.balances[acc.ID])}</span>
                                    </div>
                                ))}
                                 <div className="flex justify-between font-semibold border-t pt-1 mt-1total-row">
                                    <span>Total Liabilities</span>
                                    <span>{formatCurrency(balanceSheetData.totalLiabilities)}</span>
                                </div>
                                
                                <h4 className="font-semibold pt-4 text-sm">Equity</h4>
                                 {balanceSheetData.equity.map(acc => (
                                    <div key={acc.ID} className="flex justify-between text-sm py-1 account-row">
                                        <span>{acc.AccountName}</span>
                                        <span>{formatCurrency(balanceSheetData.balances[acc.ID])}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-sm py-1 account-row">
                                    <span>Retained Earnings (Net Income)</span>
                                    <span>{formatCurrency(balanceSheetData.netIncome)}</span>
                                </div>
                                 <div className="flex justify-between font-semibold border-t pt-1 mt-1 total-row">
                                    <span>Total Equity</span>
                                    <span>{formatCurrency(balanceSheetData.totalEquity)}</span>
                                </div>

                                <div className="flex justify-between font-bold border-t pt-2 mt-2 total-row">
                                    <span>Total Liabilities & Equity</span>
                                    <span>{formatCurrency(balanceSheetData.totalLiabilities + balanceSheetData.totalEquity)}</span>
                                </div>
                            </div>
                        </div>

                         <div className={`mt-8 p-3 rounded-lg text-center font-bold text-sm ${Math.abs(balanceSheetData.totalAssets - (balanceSheetData.totalLiabilities + balanceSheetData.totalEquity)) < 0.01 ? 'bg-green-100 text-green-800 balanced' : 'bg-red-100 text-red-800 not-balanced'} verification-footer`}>
                            {Math.abs(balanceSheetData.totalAssets - (balanceSheetData.totalLiabilities + balanceSheetData.totalEquity)) < 0.01
                                ? '✓ BALANCED'
                                : '✗ NOT BALANCED'
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalanceSheetModal;