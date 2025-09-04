import React, { useState } from 'react';
import { PurchaseOrder } from '../../../types/purchaseOrder';
import { Edit3, Printer, Trash2, ChevronDown, ChevronUp, ChevronUp as ChevronUpLucide, ChevronDown as ChevronDownLucide } from 'lucide-react';
import { SortColumn } from '../../../Pages/Company/SCM/PurchaseOrder/PurchaseOrder';

interface Props {
    purchaseOrders: PurchaseOrder[];
    onSort: (column: SortColumn) => void;
    sortColumn: SortColumn;
    currencyCode: string;
    sortDirection: 'asc' | 'desc';
    onUpdateStatus: (po: PurchaseOrder) => void;
    onDelete: (po: PurchaseOrder) => void;
    onGenerateSingleReport: (po: PurchaseOrder) => void;
}

const getStatusBadge = (status: string) => {
    const statusClasses: { [key: string]: string } = {
        Pending: 'badge-warning',
        Approved: 'badge-info',
        Delivered: 'badge-primary',
        Completed: 'badge-success',
        Received: 'badge-accent',
        Cancelled: 'badge-error',
    };
    return `badge ${statusClasses[status] || 'badge-ghost'}`;
};

const PurchaseOrderTable: React.FC<Props> = ({ purchaseOrders, onSort, sortColumn, sortDirection, currencyCode, onUpdateStatus, onDelete, onGenerateSingleReport }) => {
    const [expandedPO, setExpandedPO] = useState<string | null>(null);

    const getSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? <ChevronUpLucide size={16} className="ml-1" /> : <ChevronDownLucide size={16} className="ml-1" />;
    };

    const toggleExpand = (poId: string) => {
        setExpandedPO(expandedPO === poId ? null : poId);
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <table className="table table-zebra w-full min-w-[1000px]">
                <thead>
                    <tr className="bg-gray-100 text-gray-700">
                        <th className="w-[15%] cursor-pointer" onClick={() => onSort('po_number')}>
                            <div className="flex items-center">PO Number {getSortIcon('po_number')}</div>
                        </th>
                        <th className="w-[15%] cursor-pointer" onClick={() => onSort('supplier.name')}>
                            <div className="flex items-center">Supplier {getSortIcon('supplier.name')}</div>
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
                    {purchaseOrders.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="text-center py-4 text-gray-500">
                                No purchase orders found.
                            </td>
                        </tr>
                    ) : (
                        purchaseOrders.map((po) => (
                            <React.Fragment key={po.id}>
                                <tr className="hover">
                                    <td className="font-medium text-gray-800 py-3 whitespace-nowrap overflow-hidden text-ellipsis">{po.po_number}</td>
                                    <td className="py-3 whitespace-nowrap overflow-hidden text-ellipsis">{po.supplier.name}</td>
                                    <td className="py-3 whitespace-nowrap overflow-hidden text-ellipsis">{new Date(po.orderDate).toLocaleDateString()}</td>
                                    <td className="py-3 whitespace-nowrap overflow-hidden text-ellipsis">{po.totalAmount.toLocaleString()} {currencyCode}</td>
                                    <td className="py-3 whitespace-nowrap overflow-hidden text-ellipsis">{po.Warehouse?.name || 'N/A'}</td>
                                    <td className="py-3 text-center">
                                        <span className={`${getStatusBadge(po.status)} font-semibold text-xs`}>{po.status}</span>
                                    </td>
                                    <td className="py-3 flex space-x-1 justify-center items-center">
                                        <button className="btn btn-ghost btn-xs p-1 tooltip" data-tip="Update Status" onClick={() => onUpdateStatus(po)}>
                                            <Edit3 size={16} />
                                        </button>
                                        <button className="btn btn-ghost btn-xs p-1 tooltip" data-tip="Generate Report" onClick={() => onGenerateSingleReport(po)}>
                                            <Printer size={16} />
                                        </button>
                                        <button className="btn btn-ghost btn-xs p-1 text-error tooltip" data-tip="Delete" onClick={() => onDelete(po)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        {po.items && po.items.length > 0 && (
                                            <button className="btn btn-xs btn-ghost p-1" onClick={() => toggleExpand(po.id)}>
                                                {expandedPO === po.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {expandedPO === po.id && po.items && po.items.length > 0 && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={8}>
                                            <div className="p-4 border-t border-gray-200">
                                                <h4 className="font-semibold mb-2">Order Items:</h4>
                                                <table className="table table-compact w-full text-sm">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-left">SKU</th>
                                                            <th className="text-left">Item Name</th>
                                                            <th className="text-right">Quantity</th>
                                                            <th className="text-right">Unit Price</th>
                                                            <th className="text-right">Total Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {po.items.map((item) => (
                                                            <tr key={item.id || item.inventoryItemId}>
                                                                <td>{item.sku}</td>
                                                                <td>{item.itemName}</td>
                                                                <td className="text-right">{item.quantity}</td>
                                                                <td className="text-right">{item.unit_price.toLocaleString()} {currencyCode}</td>
                                                                <td className="text-right">{(item.totalPrice || (item.quantity * item.unit_price)).toLocaleString()} {currencyCode}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
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

export default PurchaseOrderTable;