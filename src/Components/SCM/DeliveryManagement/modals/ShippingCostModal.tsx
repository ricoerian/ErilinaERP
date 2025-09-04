import React, { useState } from 'react';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { shippingCost: number }) => void;
    creationData: { orderNumber: string; orderType: string, shippingCost: number };
    loading: boolean;
}

const ShippingCostModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, creationData, loading }) => {
    const [shippingCost, setShippingCost] = useState(creationData.shippingCost || 0);
    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ shippingCost });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Shipping Cost</h2>
                    <p className="text-gray-600 mb-6">Creating a Delivery Order for {creationData.orderType === 'purchase_order' ? 'PO' : 'SO'}{' '}<span className="font-semibold">#{creationData.orderNumber}</span>.</p>
                    <div className="mb-6">
                        <label htmlFor="shipping_cost_do" className="block text-gray-700 text-sm font-bold mb-2">Shipping Cost:</label>
                        <input type="number" id="shipping_cost_do" className="shadow border rounded w-full py-2 px-3" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} required autoFocus />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="font-bold py-2 px-4 rounded-lg text-white flex items-center" style={{ backgroundColor: primaryColor }} disabled={loading}>{loading ? 'Creating...' : 'Confirm & Create DO'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShippingCostModal;