import React from 'react';
import { Bill } from '../../../types/accountsPayable';
import { SortColumn } from '../../../Pages/Company/FM/AccountsPayable/AccountsPayable';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

interface Props {
    bills: Bill[];
    companyPrimaryColor?: string;
    selectedBills: Set<number>;
    onSort: (column: SortColumn) => void;
    sortColumn: SortColumn;
    sortDirection: 'asc' | 'desc';
    onSelect: (billId: number) => void;
    onSelectAll: () => void;
}

// ==================================================================
// KEMBALI MENGGUNAKAN KOMPONEN CHECKBOX KUSTOM YANG VISUALNYA STABIL
// ==================================================================
interface CustomCheckboxProps {
    checked: boolean;
    onChange: () => void; // Disederhanakan karena event tidak lagi dibutuhkan
    color?: string;
    disabled?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, color, disabled }) => {
    // Style untuk kotak luar
    const boxStyle: React.CSSProperties = {
        backgroundColor: checked ? color : 'transparent',
        borderColor: checked ? color : '#a0aec0', // Abu-abu saat tidak diceklis
    };

    return (
        <div
            className={`relative flex items-center justify-center w-5 h-5 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={() => !disabled && onChange()} // Klik pada div akan memicu onChange
        >
            {/* Kotak visual yang kita kontrol penuh */}
            <span
                className="w-full h-full border-2 rounded transition-colors"
                style={boxStyle}
            ></span>
            {/* Ikon centang hanya muncul jika state `checked` adalah true */}
            {checked && (
                <Check size={16} className="absolute text-white pointer-events-none" />
            )}
        </div>
    );
};
// ==================================================================


const AccountsPayableTable: React.FC<Props> = ({ bills, selectedBills, companyPrimaryColor, onSort, sortColumn, sortDirection, onSelect, onSelectAll }) => {

    const formatCurrency = (amount: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const formatDate = (dateString: string): string => new Date(dateString).toLocaleDateString('en-GB');

    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'Awaiting Payment': return 'bg-blue-100 text-blue-800';
            case 'Partial Paid': return 'bg-orange-100 text-orange-800';
            case 'Paid': return 'bg-green-100 text-green-800';
            default: return 'bg-slate-100 text-slate-600';
        }
    };
    
    const renderSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) return <ChevronUp size={14} className="text-slate-300" />;
        return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    // Logika untuk menentukan status checkbox "select all" (sudah benar)
    const currentPagePayableBills = bills.filter(b => b.status === 'Awaiting Payment' || b.status === 'Partial Paid');
    const allOnPageSelected = currentPagePayableBills.length > 0 && currentPagePayableBills.every(b => selectedBills.has(b.ID));

    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="text-sm text-slate-500 uppercase tracking-wider">
                        <th className="w-12 text-center">
                            <CustomCheckbox
                                checked={allOnPageSelected}
                                onChange={onSelectAll}
                                color={companyPrimaryColor}
                            />
                        </th>
                        <th className="cursor-pointer hover:bg-slate-100 p-3" onClick={() => onSort('billNumber')}>
                            <div className="flex items-center gap-2">Bill #{renderSortIcon('billNumber')}</div>
                        </th>
                        <th className="cursor-pointer hover:bg-slate-100 p-3" onClick={() => onSort('supplierId')}>
                            <div className="flex items-center gap-2">Supplier{renderSortIcon('supplierId')}</div>
                        </th>
                        <th className="cursor-pointer hover:bg-slate-100 p-3" onClick={() => onSort('billDate')}>
                            <div className="flex items-center gap-2">Bill Date{renderSortIcon('billDate')}</div>
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
                    {bills.map(bill => {
                        const remaining = (bill.totalAmount || 0) - (bill.amountPaid || 0);
                        const isPayable = bill.status === 'Awaiting Payment' || bill.status === 'Partial Paid';
                        
                        return (
                            <tr key={bill.ID} className={`hover:bg-slate-50 transition-colors ${!isPayable && 'opacity-60'}`}>
                                <td className="text-center">
                                    <CustomCheckbox
                                        checked={selectedBills.has(bill.ID)}
                                        onChange={() => onSelect(bill.ID)}
                                        disabled={!isPayable}
                                        color={companyPrimaryColor}
                                    />
                                </td>
                                <td className="font-semibold text-slate-800 py-4">{bill.billNumber || '-'}</td>
                                <td>{bill.Supplier?.name || `Supplier ${bill.supplierId}`}</td>
                                <td>{formatDate(bill.billDate)}</td>
                                <td>{formatDate(bill.dueDate)}</td>
                                <td className="text-right font-mono font-medium text-slate-800">{formatCurrency(remaining)}</td>
                                <td className="text-center">
                                    <span className={`badge badge-lg ${getStatusBadgeClass(bill.status)}`}>{bill.status}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AccountsPayableTable;    