import React from 'react';
import { PurchaseOrder } from '../../../types/purchaseOrder';
import { Edit3, Trash2, Calendar, User, Package, Printer, Warehouse } from 'lucide-react';

interface Props {
    purchaseOrders: PurchaseOrder[];
    currencyCode: string;
    onUpdateStatus: (po: PurchaseOrder) => void;
    onDelete: (po: PurchaseOrder) => void;
    onGenerateSingleReport: (po: PurchaseOrder) => void;
}

const statusMap: PurchaseOrder['status'][] = ['Pending', 'Approved', 'Delivered', 'Completed'];

const PurchaseOrderTimeline: React.FC<Props> = ({ purchaseOrders, currencyCode, onUpdateStatus, onDelete, onGenerateSingleReport }) => {
    return (
        <div className="space-y-6">
            {purchaseOrders.map(po => {
                const currentIndex = statusMap.indexOf(po.status);

                return (
                    <div key={po.id} className="card bg-white shadow-lg rounded-xl">
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                <div>
                                    <h2 className="card-title text-lg sm:text-xl font-bold text-gray-800">{po.po_number}</h2>
                                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-1">
                                        <User size={14} /> Supplier: <span className="font-medium">{po.supplier.name}</span>
                                    </p>
                                    {po.Warehouse && (
                                        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <Warehouse size={14} /> Warehouse: <span className="font-medium">{po.Warehouse.name}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col items-start sm:items-end">
                                    <span className="text-md sm:text-lg font-bold text-gray-700">{po.totalAmount.toLocaleString()} {currencyCode}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Calendar size={12} /> {new Date(po.orderDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <ul className="steps steps-vertical sm:steps-horizontal w-full">
                                {statusMap.map((status, index) => {
                                    const isCompleted = po.status === 'Cancelled' ? false : currentIndex >= index;
                                    return (
                                        <li key={status} className={`step ${isCompleted ? 'step-primary' : ''}`}>
                                            <span className="text-xs sm:text-sm">{status}</span>
                                        </li>
                                    );
                                })}
                            </ul>

                            {po.status === 'Completed' && (
                                <div className="alert alert-success mt-4 text-xs sm:text-sm">
                                    <span>This order has been received at {po.Warehouse.name}.</span>
                                </div>
                            )}

                            {po.status === 'Cancelled' && (
                                <div className="alert alert-error mt-4 text-xs sm:text-sm">
                                    <span>This order has been cancelled.</span>
                                </div>
                            )}

                            {po.items && po.items.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h3 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                        <Package size={16} /> Order Items ({po.items.length})
                                    </h3>
                                    <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                                        {po.items.map((item) => (
                                            <li key={item.id || item.inventoryItemId} className="flex justify-between">
                                                <span>{item.itemName} (x{item.quantity})</span>
                                                <span className="font-medium">{item.totalPrice?.toLocaleString()} {currencyCode}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="card-actions justify-end mt-4">
                                <button className="btn btn-xs sm:btn-sm btn-outline btn-info" onClick={() => onUpdateStatus(po)}><Edit3 size={14} /> Update</button>
                                <button className="btn btn-xs sm:btn-sm btn-outline btn-success" onClick={() => onGenerateSingleReport(po)}><Printer size={14} /> Report</button>
                                <button className="btn btn-xs sm:btn-sm btn-outline btn-error" onClick={() => onDelete(po)}><Trash2 size={14} /> Delete</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PurchaseOrderTimeline;