/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import { Printer, XCircle } from 'lucide-react';
import { DeliveryTrip, DeliveryOrder } from '../../../types/delivery';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';
import { PurchaseOrder } from '../../../types/purchaseOrder';
import { SalesOrder } from '../../../types/salesOrder';

interface DeliveryReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    deliveryTrip: DeliveryTrip | null;
}

const DeliveryReportModal: React.FC<DeliveryReportModalProps> = ({ isOpen, onClose, deliveryTrip }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const companyDetails = useCompanyDetails();

    if (!isOpen || !deliveryTrip) {
        return null;
    }

    const handlePrint = () => {
        if (reportRef.current) {
            const printContent = reportRef.current.outerHTML;
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                const head = `
                    <head>
                        <title>Delivery Order Trip #${deliveryTrip.trip_number}</title>
                        <style>
                            /* Base styles for both screen and print */
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 0; padding: 0; }
                            .print-container { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; }
                            .flex { display: flex; }
                            .justify-between { justify-content: space-between; }
                            .items-start { align-items: flex-start; }
                            .grid { display: grid; }
                            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                            .gap-4 { gap: 1rem; }
                            .mb-8 { margin-bottom: 2rem; }
                            .mt-8 { margin-top: 2rem; }
                            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
                            .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                            .pb-4 { padding-bottom: 1rem; }
                            .border-b { border-bottom: 1px solid #e5e7eb; }
                            .border-t { border-top: 1px solid #e5e7eb; }
                            .text-right { text-align: right; }
                            .text-center { text-align: center; }
                            .text-sm { font-size: 0.875rem; }
                            .text-lg { font-size: 1.125rem; }
                            .text-xl { font-size: 1.25rem; }
                            .text-2xl { font-size: 1.5rem; }
                            .text-3xl { font-size: 1.875rem; }
                            .font-bold { font-weight: 700; }
                            .font-semibold { font-weight: 600; }
                            .text-gray-600 { color: #4b5563; }
                            .text-gray-800 { color: #1f2937; }
                            .uppercase { text-transform: uppercase; }
                            .tracking-wider { letter-spacing: 0.05em; }
                            .min-w-full { min-width: 100%; }
                            .w-32 { width: 8rem; }
                            .h-auto { height: auto; }
                            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
                            th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; word-wrap: break-word; }
                            th { background-color: #f2f2f2; font-weight: bold; }
                            
                            /* Print-specific styles */
                            @media print {
                                @page { size: A4; margin: 15mm; }
                                body { font-size: 10pt; }
                                .no-print { display: none; }
                                .print-container { box-shadow: none !important; padding: 0; }
                                .text-2xl { font-size: 1.2rem; }
                                .text-3xl { font-size: 1.5rem; }
                                h2, h3, p { color: black !important; }
                                table { page-break-inside: auto; table-layout: fixed; }
                                tr { page-break-inside: avoid; page-break-after: auto; }
                                thead { display: table-header-group; }
                                .grid { display: block; }
                                .grid-cols-2 > div { width: 48%; display: inline-block; vertical-align: top; }
                            }
                        </style>
                    </head>
                `;

                printWindow.document.write(`
                    <html>
                        ${head}
                        <body>
                            <div class="print-container">
                                ${printContent}
                            </div>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 no-print">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative h-[90vh] flex flex-col">
                <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-xl font-bold">Delivery Trip Report</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                            <Printer size={16} /> Print
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto mt-4 print-container" ref={reportRef}>
                    <div className="p-6 bg-white rounded-lg shadow-md print:shadow-none">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-1/2">
                                {companyDetails?.logo_url && (
                                    <img src={companyDetails.logo_url} alt="Company Logo" className="w-32 h-auto" />
                                )}
                                <h1 className="text-2xl font-bold mt-2">{companyDetails?.name || 'Your Company Name'}</h1>
                                <p className="text-sm text-gray-600">{companyDetails?.address || 'Your Company Address'}</p>
                                <p className="text-sm text-gray-600">Email: {companyDetails?.contact_email || 'company@example.com'}</p>
                            </div>
                            <div className="text-right w-1/2">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">DELIVERY NOTE</h2>
                                <p className="text-lg"><strong>Trip #:</strong> <span className="font-semibold text-gray-800">{deliveryTrip.trip_number}</span></p>
                                <p className="text-sm"><strong>Trip Date:</strong> {new Date(deliveryTrip.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm"><strong>Status:</strong> <span className="font-semibold">{deliveryTrip.status}</span></p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8 border-t border-b py-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Driver & Vehicle</h3>
                                <p className="text-sm"><strong>Driver Name:</strong> {deliveryTrip.driver?.name || 'N/A'}</p>
                                <p className="text-sm"><strong>License Plate:</strong> {deliveryTrip.vehicle?.license_plate || 'N/A'}</p>
                                <p className="text-sm"><strong>Vehicle Type:</strong> {deliveryTrip.vehicle?.type || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Delivery Details</h3>
                                <p className="text-sm"><strong>Start Date:</strong> {deliveryTrip.start_date ? new Date(deliveryTrip.start_date).toLocaleString() : 'N/A'}</p>
                                <p className="text-sm"><strong>End Date:</strong> {deliveryTrip.end_date ? new Date(deliveryTrip.end_date).toLocaleString() : 'N/A'}</p>
                                <p className="text-sm"><strong>Trip Status:</strong> {deliveryTrip.status || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            {deliveryTrip.delivery_orders?.map((deliveryOrder: DeliveryOrder) => {
                                const isSalesOrder = deliveryOrder.order_type === 'sales_order';
                                const orderDetails = deliveryOrder.order_details as PurchaseOrder | SalesOrder | undefined;

                                const recipient = isSalesOrder
                                    ? (orderDetails as SalesOrder)?.customer
                                    : (orderDetails as PurchaseOrder)?.supplier;

                                const email = isSalesOrder
                                    ? (orderDetails as SalesOrder)?.customer.email
                                    : (orderDetails as PurchaseOrder)?.supplier.contactPersons;
                                const emailDisplay = typeof email === 'string'
                                    ? email
                                    : email && email.length > 0
                                    ? email.map(cp => cp.email).join(', ')
                                    : 'N/A'
                                const orderNumber = isSalesOrder
                                    ? (orderDetails as SalesOrder)?.so_number
                                    : (orderDetails as PurchaseOrder)?.po_number;

                                const orderItems = orderDetails?.items || [];
                                const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

                                return (
                                    <div key={deliveryOrder.id} className="mb-8 p-4 border rounded-lg bg-gray-50">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-semibold text-lg">
                                                Delivery Order: {deliveryOrder.do_number}
                                                <span className="ml-4 text-base font-normal text-gray-600">
                                                    ({isSalesOrder ? `SO# ${orderNumber || 'N/A'}` : `PO# ${orderNumber || 'N/A'}`})
                                                </span>
                                            </h3>
                                            <p className="font-semibold text-sm">Status: <span className="font-normal">{deliveryOrder.status || 'N/A'}</span></p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <h4 className="font-semibold mb-1">Recipient Information</h4>
                                                <p className="text-sm"><strong>Name:</strong> {recipient?.name || 'N/A'}</p>
                                                <p className="text-sm"><strong>Address:</strong> {recipient?.address || 'N/A'}</p>
                                                <p className="text-sm"><strong>Email:</strong> {emailDisplay}</p>
                                                <p className="text-sm mt-2"><strong>Notes:</strong> {deliveryOrder.notes || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">Shipping Details</h4>
                                                <p className="text-sm"><strong>Source:</strong> {deliveryOrder.source_address || 'N/A'}</p>
                                                <p className="text-sm"><strong>Destination:</strong> {deliveryOrder.destination_address || 'N/A'}</p>
                                                <p className="text-sm"><strong>Shipping Cost:</strong> {companyDetails?.currency_code || 'IDR'} {(deliveryOrder.shipping_cost || 0).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {orderItems.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="font-semibold mb-2">Items</h4>
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                                            <th className="py-3 px-6 text-left">SKU</th>
                                                            <th className="py-3 px-6 text-left">Item Name</th>
                                                            <th className="py-3 px-6 text-right">Quantity</th>
                                                            <th className="py-3 px-6 text-right">Unit Price</th>
                                                            <th className="py-3 px-6 text-right">Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-gray-600 text-sm font-light">
                                                        {orderItems.map((item: any, itemIndex: number) => {
                                                            const subTotal = (item.quantity || 0) * (item.unit_price || 0);
                                                            return (
                                                                <tr key={itemIndex} className="border-b border-gray-200 hover:bg-gray-100">
                                                                    <td className="py-3 px-6">{item.sku || 'N/A'}</td>
                                                                    <td className="py-3 px-6">{item.itemName || item.item_name || 'N/A'}</td>
                                                                    <td className="py-3 px-6 text-right">{item.quantity || 0}</td>
                                                                    <td className="py-3 px-6 text-right">{(item.unit_price || 0).toLocaleString(`${companyDetails?.currency_code}`, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {companyDetails?.currency_code || 'IDR'}</td>
                                                                    <td className="py-3 px-6 text-right">{subTotal.toLocaleString(`${companyDetails?.currency_code}`, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {companyDetails?.currency_code || 'IDR'}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="bg-gray-50">
                                                            <td colSpan={5} className="px-6 py-3 text-base font-bold text-gray-700 uppercase tracking-wider">
                                                                <div className="flex flex-container justify-between">
                                                                    <span>Total Amount : </span>
                                                                    <span>{totalAmount.toLocaleString(`${companyDetails?.currency_code}`, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {companyDetails?.currency_code}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-center mt-8 text-sm text-gray-500">
                            <p>The goods receipt must be signed by the recipient.</p>
                            <p>Thank you for your cooperation.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryReportModal;