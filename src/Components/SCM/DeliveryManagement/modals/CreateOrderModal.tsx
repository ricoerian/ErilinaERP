import React from 'react';
import { PurchaseOrder } from '../../../../types/purchaseOrder';
import { SalesOrder } from '../../../../types/salesOrder';
import { TruckIcon, ShoppingCart } from 'lucide-react';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    openPurchaseOrders: PurchaseOrder[];
    openSalesOrders: SalesOrder[];
    onSelectOrder: (orderId: string, orderType: 'purchase_order' | 'sales_order', orderNumber: string) => void;
}

const CreateOrderModal: React.FC<Props> = ({ isOpen, onClose, openPurchaseOrders, openSalesOrders, onSelectOrder }) => {
    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Delivery Order</h2>
                <p className="text-gray-600 mb-4">Select an approved Purchase or Sales Order to create a Delivery Order.</p>
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold text-lg flex items-center text-gray-700 mb-3"><TruckIcon size={20} className="mr-2 text-purple-500" />Open Purchase Orders</h3>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                            {openPurchaseOrders.length === 0 ? (<p className="text-gray-500 text-sm">No approved Purchase Orders available.</p>) : (
                                openPurchaseOrders.map(po => (
                                    <div key={po.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border">
                                        <div><p className="font-medium">PO #{po.po_number}</p><p className="text-sm text-gray-600">Supplier: {po.supplier.name}</p></div>
                                        <button onClick={() => onSelectOrder(po.id, 'purchase_order', po.po_number)} className="btn btn-sm btn-primary" style={{ backgroundColor: primaryColor }}>Create DO</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold text-lg flex items-center text-gray-700 mb-3"><ShoppingCart size={20} className="mr-2 text-amber-500" />Open Sales Orders</h3>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                            {openSalesOrders.length === 0 ? (<p className="text-gray-500 text-sm">No approved Sales Orders available.</p>) : (
                                openSalesOrders.map(so => (
                                    <div key={so.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border">
                                        <div><p className="font-medium">SO #{so.so_number}</p><p className="text-sm text-gray-600">Customer: {so.customer.name}</p></div>
                                        <button onClick={() => onSelectOrder(so.id, 'sales_order', so.so_number)} className="btn btn-sm btn-primary" style={{ backgroundColor: primaryColor }}>Create DO</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg">Close</button>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderModal;