import React from 'react';
import { DeliveryTrip } from '../../../../types/delivery';
import { Play, CheckCircle } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { CompanyDetails } from '../../../../Contexts/CompanyContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    trip: DeliveryTrip;
    onStartTrip: (tripId: number) => void;
    onCompleteTrip: (tripId: number) => void;
    onUpdateOrderStatus: (orderId: string, status: 'Delivered' | 'Failed') => void;
    companyDetails: CompanyDetails | null;
}

const TripDetailsModal: React.FC<Props> = ({ isOpen, onClose, trip, onStartTrip, onCompleteTrip, onUpdateOrderStatus, companyDetails }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Trip Details - {trip.trip_number}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-3">Trip Information</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Status:</span> <StatusBadge status={trip.status} /></p>
                            <p><span className="font-medium">Driver:</span> {trip.driver.name}</p>
                            <p><span className="font-medium">Phone:</span> {trip.driver.phone}</p>
                            <p><span className="font-medium">Vehicle:</span> {trip.vehicle.license_plate}</p>
                            <p><span className="font-medium">Vehicle Type:</span> {trip.vehicle.type} {trip.vehicle.model}</p>
                            <p><span className="font-medium">Created:</span> {new Date(trip.createdAt).toLocaleString()}</p>
                            {trip.start_date && (<p><span className="font-medium">Started:</span> {new Date(trip.start_date).toLocaleString()}</p>)}
                            {trip.end_date && (<p><span className="font-medium">Completed:</span> {new Date(trip.end_date).toLocaleString()}</p>)}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-3">Trip Actions</h3>
                        <div className="space-y-3">
                            {trip.status === 'Planned' && (<button onClick={() => { onStartTrip(trip.id); onClose(); }} className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"><Play size={16} className="mr-2" /> Start Trip</button>)}
                            {trip.status === 'In Progress' && (<button onClick={() => { onCompleteTrip(trip.id); onClose(); }} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"><CheckCircle size={16} className="mr-2" /> Complete Trip</button>)}
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Delivery Orders ({trip.delivery_orders.length})</h3>
                    <div className="space-y-3">
                        {trip.delivery_orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4 bg-white">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-medium text-gray-900">DO #{order.do_number}</h4>
                                        <p className="text-sm text-gray-600">{order.order_type.replace('_', ' ').toUpperCase()} - Order ID: {order.order_id}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <StatusBadge status={order.status} />
                                        {trip.status === 'In Progress' && order.status === 'On The Way' && (
                                            <div className="flex space-x-1">
                                                <button onClick={() => { onUpdateOrderStatus(order.id, 'Delivered'); onClose(); }} className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">Delivered</button>
                                                <button onClick={() => { onUpdateOrderStatus(order.id, 'Failed'); onClose(); }} className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700">Failed</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p><span className="font-medium">From:</span> {order.source_address}</p>
                                        <p><span className="font-medium">To:</span> {order.destination_address}</p>
                                    </div>
                                    <div>
                                        <p><span className="font-medium">Shipping Cost:</span> {order.shipping_cost.toLocaleString()} {companyDetails?.currency_code}</p>
                                        {order.notes && (<p><span className="font-medium">Notes:</span> {order.notes}</p>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetailsModal;