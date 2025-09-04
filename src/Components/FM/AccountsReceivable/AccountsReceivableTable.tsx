// File: components/FM/AccountsReceivable/AccountsReceivableTable.tsx

import React from 'react';
import { Invoice } from '../../../types/accountsReceivable';
import { SortColumn } from '../../../Pages/Company/FM/AccountsReceivable/AccountsReceivable'; // Akan dibuat di file utama
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

interface Props {
    invoices: Invoice[];
    companyPrimaryColor?: string;
    selectedInvoices: Set<number>;
    onSort: (column: SortColumn) => void;
    sortColumn: SortColumn;
    sortDirection: 'asc' | 'desc';
    onSelect: (invoiceId: number) => void;
    onSelectAll: () => void;
}

// Komponen checkbox kustom untuk konsistensi visual
const CustomCheckbox: React.FC<{ checked: boolean; onChange: () => void; color?: string; disabled?: boolean; }> = ({ checked, onChange, color, disabled }) => {
    const boxStyle: React.CSSProperties = {
        backgroundColor: checked ? color : 'transparent',
        borderColor: checked ? color : '#a0aec0',
    };
    return (
        <div className={`relative flex items-center justify-center w-5 h-5 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} onClick={() => !disabled && onChange()}>
            <span className="w-full h-full border-2 rounded transition-colors" style={boxStyle}></span>
            {checked && <Check size={16} className="absolute text-white pointer-events-none" />}
        </div>
    );
};

const AccountsReceivableTable: React.FC<Props> = ({ invoices, selectedInvoices, companyPrimaryColor, onSort, sortColumn, sortDirection, onSelect, onSelectAll }) => {

    const formatCurrency = (amount: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const formatDate = (dateString: string): string => new Date(dateString).toLocaleDateString('en-GB');

    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'Awaiting Payment': return 'bg-yellow-100 text-yellow-800';
            case 'Partial Paid': return 'bg-blue-100 text-blue-800';
            case 'Paid': return 'bg-green-100 text-green-800';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const renderSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) return <ChevronUp size={14} className="text-slate-300" />;
        return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    const currentPageReceivableInvoices = invoices.filter(inv => inv.status === 'Awaiting Payment' || inv.status === 'Partial Paid');
    const allOnPageSelected = currentPageReceivableInvoices.length > 0 && currentPageReceivableInvoices.every(inv => selectedInvoices.has(inv.id));

    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="text-sm text-slate-500 uppercase tracking-wider">
                        <th className="w-12 text-center">
                            <CustomCheckbox checked={allOnPageSelected} onChange={onSelectAll} color={companyPrimaryColor} />
                        </th>
                        <th className="cursor-pointer hover:bg-slate-100 p-3" onClick={() => onSort('invoiceNumber')}>
                            <div className="flex items-center gap-2">Invoice #{renderSortIcon('invoiceNumber')}</div>
                        </th>
                        <th className="cursor-pointer hover:bg-slate-100 p-3" onClick={() => onSort('customerId')}>
                            <div className="flex items-center gap-2">Customer{renderSortIcon('customerId')}</div>
                        </th>
                        <th className="cursor-pointer hover:bg-slate-100 p-3" onClick={() => onSort('dueDate')}>
                            <div className="flex items-center gap-2">Due Date{renderSortIcon('dueDate')}</div>
                        </th>
                        <th className="text-right cursor-pointer hover:bg-slate-100 p-3" onClick={() => onSort('totalAmount')}>
                            <div className="flex items-center justify-end gap-2">Amount Due{renderSortIcon('totalAmount')}</div>
                        </th>
                        <th className="text-center cursor-pointer hover:bg-slate-100 p-3" onClick={() => onSort('status')}>
                            <div className="flex items-center justify-center gap-2">Status{renderSortIcon('status')}</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(invoice => {
                        const remaining = (invoice.totalAmount || 0) - (invoice.amountPaid || 0);
                        const isReceivable = invoice.status === 'Awaiting Payment' || invoice.status === 'Partial Paid';

                        return (
                            <tr key={invoice.id} className={`hover:bg-slate-50 transition-colors ${!isReceivable && 'opacity-60'}`}>
                                <td className="text-center">
                                    <CustomCheckbox checked={selectedInvoices.has(invoice.id)} onChange={() => onSelect(invoice.id)} disabled={!isReceivable} color={companyPrimaryColor} />
                                </td>
                                <td className="font-semibold text-slate-800 py-4">{invoice.invoiceNumber || '-'}</td>
                                <td>{invoice.customer?.name || `Customer ${invoice.customerId}`}</td>
                                <td>{formatDate(invoice.dueDate)}</td>
                                <td className="text-right font-mono font-medium text-slate-800">{formatCurrency(remaining)}</td>
                                <td className="text-center">
                                    <span className={`badge badge-lg ${getStatusBadgeClass(invoice.status)}`}>{invoice.status}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AccountsReceivableTable;