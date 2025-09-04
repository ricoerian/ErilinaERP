import React from 'react';
import { PurchaseOrder } from '../../../types/purchaseOrder';
import { FileText, Inbox } from 'lucide-react';

interface Props {
    purchaseOrders: PurchaseOrder[];
    onCreateBill: (poId: string) => void;
    primaryColor?: string;
}

const PurchaseOrdersForBillingTable: React.FC<Props> = ({ purchaseOrders, onCreateBill, primaryColor }) => {
    if (purchaseOrders.length === 0) {
        return (
            <div className="text-center py-16 animate-fade-in">
                <Inbox size={48} className="mx-auto text-slate-300" />
                <h3 className="text-xl font-semibold text-slate-700 mt-4">Inbox is Clear</h3>
                <p className="text-slate-500 mt-2">There are no approved purchase orders waiting to be billed.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto animate-fade-in">
            <table className="table w-full">
                <thead>
                    <tr className="text-sm text-slate-500 uppercase tracking-wider">
                        <th>PO Number</th>
                        <th>Supplier</th>
                        <th>Order Date</th>
                        <th className="text-right">Amount</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseOrders.map(po => (
                        <tr key={po.id} className="hover:bg-slate-50 transition-colors duration-200 text-sm">
                            <td className="font-semibold text-slate-800 py-4">{po.po_number}</td>
                            <td>{po.supplier?.name || 'N/A'}</td>
                            <td>{new Date(po.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                            <td className="text-right font-mono font-medium text-slate-700">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(po.totalAmount)}
                            </td>
                            <td className="text-center">
                                <button 
                                    onClick={() => onCreateBill(po.id)} 
                                    className="btn btn-sm text-white transition-all duration-300"
                                    style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                                >
                                    <FileText size={16} className="mr-2"/>
                                    Create Bill
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PurchaseOrdersForBillingTable;