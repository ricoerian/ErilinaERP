import React, { useState } from 'react';
import { SalesOrder, SortColumn } from '../../../types/salesOrder';
import { Edit3, Printer, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
    salesOrders: SalesOrder[];
    onSort: (column: SortColumn) => void;
    sortColumn: SortColumn;
    sortDirection: 'asc' | 'desc';
    currencyCode: string;
    onUpdateStatus: (so: SalesOrder) => void;
    onDelete: (so: SalesOrder) => void;
    onGenerateSingleReport: (so: SalesOrder) => void;
}

const getStatusBadge = (status: string) => {
    const statusClasses: { [key: string]: string } = {
        Pending: 'badge-info',
        Approved: 'badge-primary',
        Delivered: 'badge-success',
        Closed: 'badge-accent',
        Cancelled: 'badge-error',
    };
    return `badge ${statusClasses[status] || 'badge-ghost'}`;
};

const SalesOrderTable: React.FC<Props> = ({ salesOrders, onSort, sortColumn, sortDirection, currencyCode, onUpdateStatus, onDelete, onGenerateSingleReport }) => {
    const [expandedSO, setExpandedSO] = useState<string | null>(null);

    const getSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />;
    };

    const toggleExpand = (soId: string) => {
        setExpandedSO(expandedSO === soId ? null : soId);
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <table className="table table-zebra w-full min-w-[1000px]">
                <thead>
                    <tr className="bg-gray-100 text-gray-700">
                        <th className="w-[15%] cursor-pointer" onClick={() => onSort('so_number')}>
                            <div className="flex items-center">SO Number {getSortIcon('so_number')}</div>
                        </th>
                        <th className="w-[15%] cursor-pointer" onClick={() => onSort('customer.name')}>
                            <div className="flex items-center">Customer {getSortIcon('customer.name')}</div>
                        </th>
                        <th className="w-[10%] cursor-pointer" onClick={() => onSort('orderDate')}>
                            <div className="flex items-center">Order Date {getSortIcon('orderDate')}</div>
                        </th>
                        <th className="w-[15%] cursor-pointer" onClick={() => onSort('totalAmount')}>
                            <div className="flex items-center">Total Amount {getSortIcon('totalAmount')}</div>
                        </th>
                        <th className="w-[15%]">Warehouse</th>
                        <th className="w-[10%] cursor-pointer" onClick={() => onSort('status')}>
                            <div className="flex items-center justify-center">Status {getSortIcon('status')}</div>
                        </th>
                        <th className="w-[10%] text-center">Actions</th>
                        <th className="w-[10%] text-center">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {salesOrders.map((so) => (
                        <React.Fragment key={so.id}>
                            <tr className="hover">
                                <td className="font-medium text-gray-800 py-3 whitespace-nowrap overflow-hidden text-ellipsis">{so.so_number}</td>
                                <td className="py-3 whitespace-nowrap overflow-hidden text-ellipsis">{so.customer.name}</td>
                                <td className="py-3 whitespace-nowrap overflow-hidden text-ellipsis">{new Date(so.orderDate).toLocaleDateString()}</td>
                                <td className="py-3 whitespace-nowrap overflow-hidden text-ellipsis">{so.totalAmount.toLocaleString()} {currencyCode}</td>
                                <td className="py-3 whitespace-nowrap overflow-hidden text-ellipsis">{so.Warehouse?.name || 'N/A'}</td>
                                <td className="py-3 text-center">
                                    <span className={`${getStatusBadge(so.status)} font-semibold text-xs`}>{so.status}</span>
                                </td>
                                <td className="py-3 flex space-x-1 justify-center items-center">
                                    <button className="btn btn-ghost btn-xs p-1 tooltip" data-tip="Update Status" onClick={() => onUpdateStatus(so)}><Edit3 size={16} /></button>
                                    <button className="btn btn-ghost btn-xs p-1 tooltip" data-tip="Generate Report" onClick={() => onGenerateSingleReport(so)}><Printer size={16} /></button>
                                    <button className="btn btn-ghost btn-xs p-1 text-error tooltip" data-tip="Delete" onClick={() => onDelete(so)}><Trash2 size={16} /></button>
                                </td>
                                <td className="text-center">
                                    {so.items && so.items.length > 0 && (
                                        <button className="btn btn-xs btn-ghost p-1" onClick={() => toggleExpand(so.id)}>
                                            {expandedSO === so.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                    )}
                                </td>
                            </tr>
                            {expandedSO === so.id && so.items && so.items.length > 0 && (
                                <tr className="bg-gray-50"><td colSpan={8}>
                                    <div className="p-4">
                                        <h4 className="font-semibold mb-2">Order Items:</h4>
                                        <table className="table table-compact w-full text-sm">
                                            <thead><tr><th>SKU</th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                                            <tbody>
                                                {so.items.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{item.sku}</td>
                                                        <td>{item.item_name}</td>
                                                        <td className="text-right">{item.quantity}</td>
                                                        <td className="text-right">{item.unit_price.toLocaleString()}</td>
                                                        <td className="text-right">{item.totalPrice.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </td></tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesOrderTable;