import React, { useRef } from 'react';
import { Printer, XCircle } from 'lucide-react';
import { PurchaseOrder } from '../../../types/purchaseOrder';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';

interface PurchaseOrderReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    purchaseOrder: PurchaseOrder | null;
}

const PurchaseOrderReportModal: React.FC<PurchaseOrderReportModalProps> = ({ isOpen, onClose, purchaseOrder }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const companyDetails = useCompanyDetails();

    if (!isOpen || !purchaseOrder) {
        return null;
    }

    const totalAmount = purchaseOrder.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    const handlePrint = () => {
        if (reportRef.current) {
            const printContent = reportRef.current.innerHTML;
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                const head = `
                    <head>
                        <title>Purchase Order #${purchaseOrder.po_number}</title>
                        <style>
                            body { font-family: 'Segoe UI', sans-serif; color: #333; }
                            .print-container { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
                            th { background-color: #f2f2f2; }
                            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                            .header div { width: 50%; }
                            .header .text-right { text-align: right; }
                            .grid-cols-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
                            @media print {
                                .no-print { display: none; }
                                .header { display: block; } /* Stack header on print */
                                .header div { width: 100%; text-align: left !important; margin-bottom: 1rem; }
                            }
                        </style>
                    </head>
                `;
                printWindow.document.write(`<html>${head}<body><div class="print-container">${printContent}</div></body></html>`);
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 no-print">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-4 sm:p-6 relative h-[90vh] flex flex-col">
                <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-lg sm:text-xl font-bold">Purchase Order Report</h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="btn btn-sm sm:btn-md flex items-center gap-1">
                            <Printer size={16} /> Print
                        </button>
                        <button onClick={onClose} className="btn btn-sm sm:btn-md btn-ghost btn-circle">
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto mt-4" ref={reportRef}>
                    <div className="p-2 sm:p-6 bg-white">
                        <div className="header">
                            <div>
                                {companyDetails?.logo_url && <img src={companyDetails.logo_url} alt="Logo" className="w-32 h-auto" />}
                                <h1 className="text-xl sm:text-2xl font-bold mt-2">{companyDetails?.name}</h1>
                                <p className="text-xs sm:text-sm text-gray-600">{companyDetails?.address}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-2xl sm:text-3xl font-bold">PURCHASE ORDER</h2>
                                <p><strong>PO #:</strong> {purchaseOrder.po_number}</p>
                                <p><strong>Date:</strong> {new Date(purchaseOrder.orderDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 border-t border-b py-4">
                            <div>
                                <h3 className="font-semibold mb-2">Supplier</h3>
                                <p><strong>Name:</strong> {purchaseOrder.supplier.name}</p>
                                <p><strong>Address:</strong> {purchaseOrder.supplier.address || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Ship To</h3>
                                <p><strong>Warehouse:</strong> {purchaseOrder.Warehouse?.name || 'N/A'}</p>
                                <p><strong>Delivery Date:</strong> {new Date(purchaseOrder.required_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4">SKU</th>
                                        <th className="py-2 px-4">Item Name</th>
                                        <th className="py-2 px-4 text-right">Qty</th>
                                        <th className="py-2 px-4 text-right">Price</th>
                                        <th className="py-2 px-4 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrder.items.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-2 px-4">{item.sku}</td>
                                            <td className="py-2 px-4">{item.itemName}</td>
                                            <td className="py-2 px-4 text-right">{item.quantity}</td>
                                            <td className="py-2 px-4 text-right">{item.unit_price.toLocaleString()}</td>
                                            <td className="py-2 px-4 text-right">{(item.quantity * item.unit_price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-100 font-bold">
                                        <td colSpan={4} className="py-2 px-4 text-right">Total Amount</td>
                                        <td className="py-2 px-4 text-right">{totalAmount.toLocaleString()} {companyDetails?.currency_code}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        {purchaseOrder.notes && (
                            <div className="mt-8">
                                <h3 className="font-semibold">Notes:</h3>
                                <p className="text-gray-600 italic p-2 bg-gray-50 rounded">{purchaseOrder.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderReportModal;