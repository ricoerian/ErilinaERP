// src/Components/SCM/DeliveryManagement/DeliveryCards.tsx
import React from 'react';
import { DeliveryTrip } from '../../../types/delivery';
import { User, Car, PackageCheck, Calendar, Clock, Play, CheckCircle, Edit, FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Props {
    trips: DeliveryTrip[];
    onStartTrip: (tripId: number) => void;
    onCompleteTrip: (tripId: number) => void;
    onSelectTrip: (trip: DeliveryTrip) => void;
    onGenerateReport: (trip: DeliveryTrip) => void;
}

const DeliveryCards: React.FC<Props> = ({ trips, onStartTrip, onCompleteTrip, onSelectTrip, onGenerateReport }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 break-all">{trip.trip_number}</h3>
                    <StatusBadge status={trip.status} />
                </div>

                <div className="space-y-3 flex-grow">
                    <div className="flex items-center text-sm text-gray-600"><User size={16} className="mr-2 flex-shrink-0" /><span>{trip.driver.name}</span></div>
                    <div className="flex items-center text-sm text-gray-600"><Car size={16} className="mr-2 flex-shrink-0" /><span>{trip.vehicle.license_plate} - {trip.vehicle.type}</span></div>
                    <div className="flex items-center text-sm text-gray-600"><PackageCheck size={16} className="mr-2 flex-shrink-0" /><span>{trip.delivery_orders.length} Orders</span></div>
                    <div className="flex items-center text-sm text-gray-600"><Calendar size={16} className="mr-2 flex-shrink-0" /><span>{new Date(trip.createdAt).toLocaleDateString()}</span></div>
                    {trip.start_date && (<div className="flex items-center text-sm text-gray-600"><Clock size={16} className="mr-2" /><span>Started: {new Date(trip.start_date).toLocaleString()}</span></div>)}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Delivery Orders:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {trip.delivery_orders.map((order) => (
                            <div key={order.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-sm font-medium break-all">DO #{order.do_number}</span>
                                <StatusBadge status={order.status} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    {trip.status === 'Planned' && (
                        <button onClick={() => onStartTrip(trip.id)} className="btn btn-sm bg-green-600 text-white hover:bg-green-700">
                            <Play size={16} /> Start
                        </button>
                    )}
                    {trip.status === 'In Progress' && (
                        <button onClick={() => onCompleteTrip(trip.id)} className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700">
                            <CheckCircle size={16} /> Complete
                        </button>
                    )}
                    <button onClick={() => onGenerateReport(trip)} className="btn btn-sm bg-purple-600 text-white hover:bg-purple-700">
                        <FileText size={16} /> Report
                    </button>
                    <button onClick={() => onSelectTrip(trip)} className="btn btn-sm bg-gray-600 text-white hover:bg-gray-700 col-span-2">
                        <Edit size={16} /> Details
                    </button>
                </div>
            </div>
        ))}
    </div>
);

export default DeliveryCards;