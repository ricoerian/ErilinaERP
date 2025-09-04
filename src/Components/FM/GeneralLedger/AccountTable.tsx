import React, { useState, useMemo } from 'react';
import { Account, Journal, SortColumn } from '../../../types/generalLedger';
import { ChevronUp, ChevronDown, ChevronRight, Edit, Trash2, FileText } from 'lucide-react';

interface Props {
    accounts: Account[];
    journals: Journal[];
    currencyCode: string;
    onSort: (column: SortColumn) => void;
    sortColumn: SortColumn;
    sortDirection: 'asc' | 'desc';
    onEditAccount: (account: Account) => void;
    onDeleteAccount: (id: number) => void;
    onGenerateReport: (account: Account) => void;
    primaryColor: string;
}

const ExpandedRow: React.FC<{ account: Account; journals: Journal[]; currencyCode: string; primaryColor: string; }> = ({ account, journals, currencyCode, primaryColor }) => {
    const { entries, balance } = useMemo(() => {
        const relevantEntries = journals
            .flatMap(j => j.JournalEntries)
            .filter(entry => entry.AccountID === account.ID);
        
        const totalDebit = relevantEntries.reduce((sum, entry) => sum + entry.Debit, 0);
        const totalCredit = relevantEntries.reduce((sum, entry) => sum + entry.Credit, 0);

        const debitNormalBalanceTypes = new Set([
            "Asset", "Current Assets", "Owner's Capital", "Cash", "Accounts Receivable", "Inventory", "Prepaid Expenses",
            "Non-Current Assets", "Fixed Assets", "Machinery", "Buildings", "Vehicles", 
            "Drawings",
            "Expense", "Cost of Goods Sold", "Rent Expense", "Wages Expense", "Utilities Expense", 
            "Depreciation Expense", "General and Administrative Expenses"
        ]);

        let calculatedBalance = 0;
        if (debitNormalBalanceTypes.has(account.AccountType)) {
            calculatedBalance = totalDebit - totalCredit;
        } else {
            calculatedBalance = totalCredit - totalDebit;
        }

        return { entries: relevantEntries, balance: calculatedBalance };
    }, [account, journals]);

    const formatBalance = (amount: number, currencyCode: string) => {
        const formatted = amount.toLocaleString(`${currencyCode}`, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (amount > 0) return `+${formatted}`;
        if (amount < 0) return formatted;
        return formatted;
    };

    return (
        <td colSpan={6} className="p-0">
            <div className="bg-slate-50 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                    <h4 className="font-bold text-lg text-slate-700">
                        Transactions for <span style={{ color: primaryColor }}>{account.AccountName}</span>
                    </h4>
                    <div className="text-right flex-shrink-0">
                        <p className="text-sm text-slate-500 font-medium">Current Balance</p>
                        <p className={`font-bold text-2xl ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatBalance(balance, currencyCode)} {currencyCode}
                        </p>
                    </div>
                </div>
                
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    {entries.length > 0 ? (
                        <table className="table table-compact w-full">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-3 text-slate-600 font-semibold text-left">Date</th>
                                    <th className="p-3 text-slate-600 font-semibold text-left">Reference ID</th>
                                    <th className="p-3 text-slate-600 font-semibold text-left">Description</th>
                                    <th className="p-3 text-right text-slate-600 font-semibold">Debit</th>
                                    <th className="p-3 text-right text-slate-600 font-semibold">Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map(entry => {
                                    const parentJournal = journals.find(j => j.ID === entry.JournalID);
                                    return (
                                    <tr key={entry.ID} className="border-b border-slate-200 last:border-0">
                                        <td className="p-3">{parentJournal ? new Date(parentJournal.TransactionDate).toLocaleDateString() : 'N/A'}</td>
                                        <td className="p-3 text-slate-500">{parentJournal?.ReferenceID || 'N/A'}</td>
                                        <td className="p-3">{entry.Description || parentJournal?.Description}</td>
                                        <td className="p-3 text-right font-mono">{entry.Debit > 0 ? new Intl.NumberFormat('id-ID').format(entry.Debit) : '-'}</td>
                                        <td className="p-3 text-right font-mono">{entry.Credit > 0 ? new Intl.NumberFormat('id-ID').format(entry.Credit) : '-'}</td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-slate-500 py-8">No transactions found for this account.</p>
                    )}
                </div>
            </div>
        </td>
    );
};


const AccountsTable: React.FC<Props> = ({ accounts, journals, currencyCode, onSort, sortColumn, sortDirection, onEditAccount, onDeleteAccount, onGenerateReport, primaryColor }) => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const getSortIcon = (key: SortColumn) => {
        if (sortColumn !== key) return null;
        return sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />;
    };

    const toggleRow = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="table w-full">
                <thead className="border-b border-slate-200">
                    <tr className="text-slate-500 uppercase text-xs tracking-wider">
                        <th className="w-12 p-4"></th>
                        <th className="p-4 text-left font-semibold cursor-pointer" onClick={() => onSort('AccountNumber')}>
                            <div className="flex items-center gap-1">Number {getSortIcon('AccountNumber')}</div>
                        </th>
                        <th className="p-4 text-left font-semibold cursor-pointer" onClick={() => onSort('AccountName')}>
                           <div className="flex items-center gap-1">Name {getSortIcon('AccountName')}</div>
                        </th>
                        <th className="p-4 text-left font-semibold cursor-pointer" onClick={() => onSort('AccountType')}>
                           <div className="flex items-center gap-1">Type {getSortIcon('AccountType')}</div>
                        </th>
                        <th className="p-4 text-center font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-10 text-slate-500">
                                No accounts found. Create one to get started!
                            </td>
                        </tr>
                    ) : (
                        accounts.map((account) => (
                           <React.Fragment key={account.ID}>
                                <tr className="hover:bg-slate-50 border-b border-slate-200 last:border-b-0 transition-colors">
                                    <td className="p-4">
                                        <button onClick={() => toggleRow(account.ID)} className="btn btn-ghost btn-xs p-1">
                                            <ChevronRight size={18} className={`transition-transform duration-200 ${expandedRow === account.ID ? 'rotate-90' : 'text-slate-400'}`} style={{ color: expandedRow === account.ID ? primaryColor : '' }} />
                                        </button>
                                    </td>
                                    <td className="p-4 font-mono text-slate-700">{account.AccountNumber}</td>
                                    <td className="p-4 font-medium text-slate-900">{account.AccountName}</td>
                                    <td className="p-4">
                                        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full text-xs font-semibold">{account.AccountType}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center items-center gap-1">
                                            <button onClick={() => onGenerateReport(account)} className="btn btn-ghost btn-xs text-slate-500 hover:text-blue-600" title="Generate Report">
                                                <FileText size={16} />
                                            </button>
                                            <button onClick={() => onEditAccount(account)} className="btn btn-ghost btn-xs text-slate-500" title="Edit Account" style={{'--hover-color': primaryColor} as React.CSSProperties} onMouseOver={e => e.currentTarget.style.color = primaryColor} onMouseOut={e => e.currentTarget.style.color = ''}>
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => onDeleteAccount(account.ID)} className="btn btn-ghost btn-xs text-slate-500 hover:text-red-600" title="Delete Account">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedRow === account.ID && (
                                   <tr>
                                        <ExpandedRow currencyCode={currencyCode} account={account} journals={journals} primaryColor={primaryColor} />
                                   </tr>
                                )}
                           </React.Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AccountsTable;