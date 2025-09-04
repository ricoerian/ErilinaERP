import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Printer, FileText, XCircle, Table } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Journal, Account } from '../../../types/generalLedger';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';

interface ReportJournalEntry {
    transaction_date: string;
    journal_description: string;
    account_name: string;
    debit: number;
    credit: number;
    runningBalance?: number;
}

interface GeneralLedgerReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    journals: Journal[];
    accounts: Account[];
    mode: 'all' | 'single-account';
    selectedAccount?: Account | null;
    startDate?: string;
    endDate?: string;
}

const GeneralLedgerReportModal: React.FC<GeneralLedgerReportModalProps> = ({
    isOpen,
    onClose,
    journals,
    accounts,
    mode,
    selectedAccount,
    startDate,
    endDate,
}) => {
    const companyDetails = useCompanyDetails();
    const reportRef = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<ReportJournalEntry[]>([]);
    const [balance, setBalance] = useState(0);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: companyDetails?.currency_code || 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const getAccountName = (accountId: number) => {
        return accounts.find(acc => acc.ID === accountId)?.AccountName || 'N/A';
    };

    const getAccountType = (accountId: number) => {
        return accounts.find(acc => acc.ID === accountId)?.AccountType || 'N/A';
    };

    const reportTitle = useMemo(() => {
        if (mode === 'single-account' && selectedAccount) {
            return `General Ledger Report: ${selectedAccount.AccountName} (${selectedAccount.AccountNumber})`;
        }
        return 'General Ledger Report (All Accounts)';
    }, [mode, selectedAccount]);

    const reportPeriod = useMemo(() => {
        if (startDate && endDate) {
            const end = new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            return `For the Period Ended ${end}`;
        }
        return `As of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    }, [startDate, endDate]);


    useEffect(() => {
        if (isOpen) {
            const allReportEntries: ReportJournalEntry[] = [];
            let currentBalance = 0;

            const filteredJournals = journals.filter(journal => {
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    start.setHours(0, 0, 0, 0);
                    end.setHours(23, 59, 59, 999);
                    const journalDate = new Date(journal.TransactionDate);
                    return journalDate >= start && journalDate <= end;
                }
                return true;
            });

            filteredJournals.sort((a, b) => new Date(a.TransactionDate).getTime() - new Date(b.TransactionDate).getTime());

            filteredJournals.forEach(journal => {
                journal.JournalEntries.forEach(entry => {
                    const accountName = getAccountName(entry.AccountID);

                    if (mode === 'single-account' && selectedAccount && entry.AccountID !== selectedAccount.ID) {
                        return;
                    }

                    const reportEntry: ReportJournalEntry = {
                        transaction_date: journal.TransactionDate,
                        journal_description: journal.Description,
                        account_name: accountName,
                        debit: entry.Debit,
                        credit: entry.Credit,
                    };

                    if (mode === 'single-account' && selectedAccount) {
                        const debitNormalBalanceTypes = new Set([
                            "Asset", "Current Assets", "Cash", "Accounts Receivable", "Inventory", "Prepaid Expenses",
                            "Non-Current Assets", "Fixed Assets", "Machinery", "Buildings", "Vehicles",
                            "Drawings",
                            "Expense", "Cost of Goods Sold", "Rent Expense", "Wages Expense", "Utilities Expense",
                            "Depreciation Expense", "General and Administrative Expenses"
                        ]);
                        const accountType = getAccountType(selectedAccount.ID);
                        const isDebitNormal = debitNormalBalanceTypes.has(accountType);

                        if (isDebitNormal) {
                            currentBalance += entry.Debit - entry.Credit;
                        } else {
                            currentBalance += entry.Credit - entry.Debit;
                        }
                        reportEntry.runningBalance = currentBalance;
                    }

                    allReportEntries.push(reportEntry);
                });
            });

            setReportData(allReportEntries);
            setBalance(currentBalance);
        }
    }, [isOpen, journals, accounts, mode, selectedAccount, startDate, endDate, companyDetails?.currency_code]);

    const { totalDebit, totalCredit } = useMemo(() => {
        const debits = reportData.reduce((sum, item) => sum + item.debit, 0);
        const credits = reportData.reduce((sum, item) => sum + item.credit, 0);
        return { totalDebit: debits, totalCredit: credits };
    }, [reportData]);

    const isBalanced = useMemo(() => totalDebit === totalCredit, [totalDebit, totalCredit]);


    if (!isOpen) {
        return null;
    }

    const handlePrint = () => {
        if (reportRef.current) {
            const printContent = reportRef.current.outerHTML;
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                const head = `
                    <head>
                        <title>${reportTitle}</title>
                        <style>
                            /* Base styles from Tailwind */
                            .fixed { position: fixed; }
                            .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
                            .z-50 { z-index: 50; }
                            .flex { display: flex; }
                            .items-center { align-items: center; }
                            .justify-center { justify-content: center; }
                            .bg-gray-900 { background-color: #111827; }
                            .bg-opacity-50 { opacity: 0.5; }
                            .bg-white { background-color: #fff; }
                            .rounded-lg { border-radius: 0.5rem; }
                            .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
                            .w-full { width: 100%; }
                            .max-w-5xl { max-width: 64rem; }
                            .p-6 { padding: 1.5rem; }
                            .relative { position: relative; }
                            .h-[90vh] { height: 90vh; }
                            .flex-col { flex-direction: column; }
                            .justify-between { justify-content: space-between; }
                            .items-start { align-items: flex-start; }
                            .pb-4 { padding-bottom: 1rem; }
                            .border-b { border-bottom: 1px solid #e5e7eb; }
                            .border-gray-200 { border-color: #e5e7eb; }
                            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                            .font-bold { font-weight: 700; }
                            .text-gray-800 { color: #1f2937; }
                            .space-x-2 > :not([hidden]) ~ :not([hidden]) { margin-right: 0; margin-left: 0.5rem; }
                            .p-2 { padding: 0.5rem; }
                            .bg-blue-600 { background-color: #2563eb; }
                            .text-white { color: #fff; }
                            .rounded-md { border-radius: 0.375rem; }
                            .hover:bg-blue-700:hover { background-color: #1d4ed8; }
                            .transition-colors { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                            .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                            .bg-green-600 { background-color: #047857; }
                            .hover:bg-green-700:hover { background-color: #059669; }
                            .text-gray-400 { color: #9ca3af; }
                            .hover:text-gray-600:hover { color: #4b5563; }
                            .flex-grow { flex-grow: 1; }
                            .overflow-y-auto { overflow-y: auto; }
                            .mt-4 { margin-top: 1rem; }
                            .bg-gray-50 { background-color: #f9fafb; }
                            .mb-6 { margin-bottom: 1.5rem; }
                            .w-1/2 { width: 50%; }
                            .mb-2 { margin-bottom: 0.5rem; }
                            .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                            .font-extrabold { font-weight: 800; }
                            .text-gray-900 { color: #111827; }
                            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                            .text-gray-600 { color: #4b5563; }
                            .mt-1 { margin-top: 0.25rem; }
                            .overflow-x-auto { overflow-x: auto; }
                            .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                            .min-w-full { min-width: 100%; }
                            .divide-y > :not([hidden]) ~ :not([hidden]) { border-top-width: 1px; }
                            .divide-gray-200 > :not([hidden]) ~ :not([hidden]) { border-color: #e5e7eb; }
                            .bg-gray-100 { background-color: #f3f4f6; }
                            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
                            .px-4 { padding-left: 1rem; padding-right: 1rem; }
                            .text-left { text-align: left; }
                            .text-xs { font-size: 0.75rem; line-height: 1rem; }
                            .font-semibold { font-weight: 600; }
                            .uppercase { text-transform: uppercase; }
                            .tracking-wider { letter-spacing: 0.05em; }
                            .text-right { text-align: right; }
                            .bg-gray-100 { background-color: #f3f4f6; }
                            .whitespace-nowrap { white-space: nowrap; }
                            .text-gray-700 { color: #374151; }
                            .hover:bg-gray-50:hover { background-color: #f9fafb; }
                            .p-4 { padding: 1rem; }
                            .rounded-b-lg { border-bottom-right-radius: 0.5rem; border-bottom-left-radius: 0.5rem; }
                            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                            .gap-2 { gap: 0.5rem; }
                            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
                            .mt-4 { margin-top: 1rem; }
                            .text-green-600 { color: #059669; }
                            .text-red-600 { color: #ef4444; }
                            
                            /* Print-specific styles */
                            @media print {
                                body { 
                                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                                    color: #000; 
                                    -webkit-print-color-adjust: exact; 
                                    print-color-adjust: exact;
                                    margin: 0;
                                }
                                .no-print { display: none !important; }
                                .print-area { box-shadow: none !important; padding: 0 !important; margin: 0 !important; background-color: #fff !important; }
                                .flex-col { display: block; }
                                .flex-grow { flex-grow: 0; }
                                .h-[90vh] { height: auto; }
                                .w-full { width: 100% !important; }
                                .max-w-5xl { max-width: 100% !important; }
                                .report-header .w-1/2, .report-header .text-right { width: 48%; display: inline-block; vertical-align: top; }
                                table {
                                    width: 100% !important;
                                    page-break-inside: auto;
                                }
                                tr {
                                    page-break-inside: avoid !important;
                                    page-break-after: auto !important;
                                }
                                thead { display: table-header-group; }
                                .mb-8 { margin-bottom: 1rem; }
                                .px-6 { padding-left: 0.5rem; padding-right: 0.5rem; }
                                .py-3 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                                .text-sm { font-size: 0.8rem; }
                                .text-xs { font-size: 0.7rem; }
                                .text-lg { font-size: 1rem; }
                                .text-xl { font-size: 1.1rem; }
                                .text-3xl { font-size: 1.5rem; }
                            }
                        </style>
                    </head>
                `;
                printWindow.document.write(`
                    <html>
                    ${head}
                    <body>
                        <div class="print-area">
                            ${printContent}
                        </div>
                    </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(reportData.map(item => ({
            'Date': new Date(item.transaction_date).toLocaleDateString('en-US'),
            'Account': item.account_name,
            'Description': item.journal_description,
            'Debit': item.debit,
            'Credit': item.credit,
            ...(mode === 'single-account' ? { 'Balance': item.runningBalance } : {}),
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'General Ledger Report');
        XLSX.writeFile(wb, `${reportTitle.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 no-print">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-6 relative h-[90vh] flex flex-col">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 no-print">
                    <h2 className="text-xl font-bold text-gray-800">General Ledger Report</h2>
                    <div className="flex space-x-2">
                        <button onClick={handlePrint} className="flex items-center space-x-1 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                            <Printer size={18} />
                            <span className="hidden sm:inline">Print</span>
                        </button>
                        <button onClick={handleExportExcel} className="flex items-center space-x-1 p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm">
                            <Table size={18} />
                            <span className="hidden sm:inline">Export Excel</span>
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>

                <div ref={reportRef} className="flex-1 overflow-y-auto mt-4 p-6 print-area bg-gray-50 rounded-md">
                    <div className="report-header mb-6">
                        <div className="flex justify-between items-start">
                            <div className="w-1/2">
                                {companyDetails?.logo_url && (
                                    <img src={companyDetails.logo_url} alt="Company Logo" className="w-32 h-auto mb-2" />
                                )}
                                <h1 className="text-3xl font-extrabold text-gray-900">{companyDetails?.name || 'Your Company Name'}</h1>
                                <p className="text-sm text-gray-600">{companyDetails?.address || 'Your Company Address'}</p>
                                <p className="text-sm text-gray-600">Email: {companyDetails?.contact_email || 'company@example.com'}</p>
                                <p className="text-sm text-gray-600">Phone: {companyDetails?.phone || '0812-3456-7890'}</p>
                            </div>
                            <div className="text-right w-1/2">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">GENERAL LEDGER REPORT</h2>
                                <p className="text-sm"><strong>Report Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p className="text-sm mt-1"><strong>Period:</strong> {reportPeriod}</p>
                            </div>
                        </div>
                    </div>

                    {reportData.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Account</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Debit</th>
                                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Credit</th>
                                        {mode === 'single-account' && (
                                            <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider running-balance-col">Balance</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{new Date(item.transaction_date).toLocaleDateString('en-US')}</td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{item.account_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{item.journal_description}</td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-right text-gray-700">{formatCurrency(item.debit)}</td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-right text-gray-700">{formatCurrency(item.credit)}</td>
                                            {mode === 'single-account' && (
                                                <td className="py-3 px-4 whitespace-nowrap text-sm text-right text-gray-700 font-medium">{formatCurrency(item.runningBalance || 0)}</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {mode === 'single-account' ? (
                                <div className="mt-4 p-4 bg-gray-100 rounded-b-lg text-right font-bold text-gray-800">
                                    <p className="text-lg">Ending Balance: {formatCurrency(balance)}</p>
                                </div>
                            ) : (
                                <div className="mt-4 p-4 bg-gray-100 rounded-b-lg text-right">
                                    <div className="grid grid-cols-2 gap-2 text-lg font-bold">
                                        <p className="text-left text-gray-800">Total Debit:</p>
                                        <p className="text-right text-gray-800">{formatCurrency(totalDebit)}</p>
                                        <p className="text-left text-gray-800">Total Credit:</p>
                                        <p className="text-right text-gray-800">{formatCurrency(totalCredit)}</p>
                                    </div>
                                    <div className={`mt-4 font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                                        {isBalanced ? (
                                            <p className="text-2xl uppercase">BALANCED</p>
                                        ) : (
                                            <>
                                                <p className="text-2xl uppercase">NOT BALANCED</p>
                                                <p className="text-sm mt-1">Difference: {formatCurrency(totalDebit - totalCredit)}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            <FileText size={48} className="mx-auto text-gray-400" />
                            <p className="mt-4 text-lg font-medium">No transaction data available for this report.</p>
                            <p className="text-sm text-gray-400">Please check your date range or selected account.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeneralLedgerReportModal;