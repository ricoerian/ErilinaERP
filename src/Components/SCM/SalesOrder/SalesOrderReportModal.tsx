import React, { useRef } from 'react';
import { Printer, XCircle } from 'lucide-react';
import { SalesOrder } from '../../../types/salesOrder';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';

interface SalesOrderReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    salesOrder: SalesOrder | null;
}

const SalesOrderReportModal: React.FC<SalesOrderReportModalProps> = ({ isOpen, onClose, salesOrder }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const companyDetails = useCompanyDetails();

    if (!isOpen || !salesOrder) {
        return null;
    }

    const totalAmount = salesOrder.items.reduce((sum, item) => sum + item.totalPrice, 0);

    const handlePrint = () => {
        if (reportRef.current) {
            const printContent = reportRef.current.innerHTML;
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                const head = `
                    <head>
                        <title>Sales Order #${salesOrder.so_number}</title>
                        <style>
                            body { font-family: 'Segoe UI', sans-serif; color: #333; }
                            .print-container { width: 100%; max-width: 800px; margin: auto; padding: 20px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
                            th, td { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
                            th { background-color: #f2f2f2; font-weight: bold; }
                            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                            .header div { width: 48%; }
                            .header .text-right { text-align: right; }
                            .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 1rem 0;}
                            @media print {
                                body { font-size: 10pt; }
                                .no-print { display: none; }
                                .header { display: block; }
                                .header div { width: 100%; text-align: left !important; margin-bottom: 1rem; }
                                .grid-info { grid-template-columns: 1fr 1fr; }
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
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl p-4 sm:p-6 relative h-[90vh] flex flex-col">
                <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-lg sm:text-xl font-bold">Sales Order Report</h2>
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
                                {companyDetails?.logo_url && <img src={companyDetails.logo_url} alt="Logo" className="w-32 h-auto mb-2" />}
                                <h1 className="text-xl sm:text-2xl font-bold">{companyDetails?.name}</h1>
                                <p className="text-xs sm:text-sm text-gray-600">{companyDetails?.address}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-2xl sm:text-3xl font-bold">SALES ORDER</h2>
                                <p><strong>SO #:</strong> {salesOrder.so_number}</p>
                                <p><strong>Date:</strong> {new Date(salesOrder.orderDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid-info">
                            <div>
                                <h3 className="font-semibold mb-2">Customer</h3>
                                <p><strong>Name:</strong> {salesOrder.customer?.name}</p>
                                <p><strong>Address:</strong> {salesOrder.customer?.address}</p>
                                <p><strong>Email:</strong> {salesOrder.customer?.email}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Ship From</h3>
                                <p><strong>Warehouse:</strong> {salesOrder.Warehouse?.name || 'N/A'}</p>
                                <p><strong>Ship Date:</strong> {new Date(salesOrder.ship_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th>SKU</th>
                                        <th>Item Name</th>
                                        <th className="text-right">Qty</th>
                                        <th className="text-right">Price</th>
                                        <th className="text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesOrder.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.sku}</td>
                                            <td>{item.item_name}</td>
                                            <td className="text-right">{item.quantity}</td>
                                            <td className="text-right">{item.unit_price.toLocaleString()}</td>
                                            <td className="text-right">{item.totalPrice.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-bold border-t-2">
                                        <td colSpan={4} className="text-right">Total Amount</td>
                                        <td className="text-right">{totalAmount.toLocaleString()} {companyDetails?.currency_code}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        {salesOrder.notes && (
                            <div className="mt-8">
                                <h3 className="font-semibold">Notes:</h3>
                                <p className="text-gray-600 italic p-2 bg-gray-50 rounded">{salesOrder.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesOrderReportModal;