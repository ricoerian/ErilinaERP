import React from 'react';
import { SalesOrder } from '../../../types/salesOrder';
import { Edit3, Trash2, Calendar, User, Package, Printer, Warehouse } from 'lucide-react';

interface Props {
    salesOrders: SalesOrder[];
    currencyCode: string
    onUpdateStatus: (so: SalesOrder) => void;
    onDelete: (so: SalesOrder) => void;
    onGenerateSingleReport: (so: SalesOrder) => void;
}

const statusMap: SalesOrder['status'][] = ['Pending', 'Approved', 'Delivered', 'Completed'];

const SalesOrderTimeline: React.FC<Props> = ({ salesOrders, currencyCode, onUpdateStatus, onDelete, onGenerateSingleReport }) => {
    return (
        <div className="space-y-6">
            {salesOrders.map(so => {
                const currentIndex = statusMap.indexOf(so.status);

                return (
                    <div key={so.id} className="card bg-white shadow-lg rounded-xl">
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                <div>
                                    <h2 className="card-title text-lg sm:text-xl font-bold text-gray-800">{so.so_number}</h2>
                                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-1">
                                        <User size={14} /> Customer: <span className="font-medium">{so.customer.name}</span>
                                    </p>
                                    {so.Warehouse && (
                                        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <Warehouse size={14} /> Warehouse: <span className="font-medium">{so.Warehouse.name}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col items-start sm:items-end">
                                    <span className="text-md sm:text-lg font-bold text-gray-700">{so.totalAmount.toLocaleString()} {currencyCode}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Calendar size={12} /> {new Date(so.orderDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <ul className="steps steps-vertical sm:steps-horizontal w-full">
                                {statusMap.map((status, index) => {
                                    const isCompleted = so.status === 'Cancelled' ? false : currentIndex >= index;
                                    return (
                                        <li key={status} className={`step ${isCompleted ? 'step-primary' : ''}`}>
                                            <span className="text-xs sm:text-sm">{status}</span>
                                        </li>
                                    );
                                })}
                            </ul>

                            {so.status === 'Completed' && (
                                <div className="alert alert-success mt-4 text-xs sm:text-sm">
                                    <span>This order has been delivered to the customer.</span>
                                </div>
                            )}

                            {so.status === 'Cancelled' && (
                                <div className="alert alert-error mt-4 text-xs sm:text-sm">
                                    <span>This order has been cancelled.</span>
                                </div>
                            )}

                            {so.items && so.items.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h3 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                        <Package size={16} /> Order Items ({so.items.length})
                                    </h3>
                                    <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                                        {so.items.map((item) => (
                                            <li key={item.id || item.inventory_item_id} className="flex justify-between">
                                                <span>{item.item_name} (x{item.quantity})</span>
                                                <span className="font-medium">{item.totalPrice?.toLocaleString()} {currencyCode}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="card-actions justify-end mt-4">
                                <button className="btn btn-xs sm:btn-sm btn-outline btn-info" onClick={() => onUpdateStatus(so)}><Edit3 size={14} /> Update</button>
                                <button className="btn btn-xs sm:btn-sm btn-outline btn-success" onClick={() => onGenerateSingleReport(so)}><Printer size={14} /> Report</button>
                                <button className="btn btn-xs sm:btn-sm btn-outline btn-error" onClick={() => onDelete(so)}><Trash2 size={14} /> Delete</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SalesOrderTimeline;