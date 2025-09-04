// src/Components/SCM/DeliveryManagement/DeliveryTable.tsx
import React from 'react';
import { DeliveryTrip, SortColumn } from '../../../types/delivery';
import { ChevronUp, ChevronDown, User, Car, Play, CheckCircle, Edit, FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Props {
    trips: DeliveryTrip[];
    onSort: (column: SortColumn) => void;
    sortColumn: SortColumn;
    sortDirection: 'asc' | 'desc';
    onStartTrip: (tripId: number) => void;
    onCompleteTrip: (tripId: number) => void;
    onSelectTrip: (trip: DeliveryTrip) => void;
    onGenerateReport: (trip: DeliveryTrip) => void;
}

const DeliveryTable: React.FC<Props> = ({ trips, onSort, sortColumn, sortDirection, onStartTrip, onCompleteTrip, onSelectTrip, onGenerateReport }) => {
    const getSortIcon = (key: SortColumn) => {
        if (sortColumn !== key) return null;
        return sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />;
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <table className="table table-zebra w-full min-w-[800px]">
                <thead>
                    <tr className="bg-gray-100 text-gray-700">
                        <th className="py-3 text-left font-bold cursor-pointer" onClick={() => onSort('trip_number')}>
                            <div className="flex items-center">Trip Number {getSortIcon('trip_number')}</div>
                        </th>
                        <th className="py-3 text-left font-bold cursor-pointer" onClick={() => onSort('driver')}>
                            Driver
                        </th>
                        <th className="py-3 text-left font-bold">Vehicle</th>
                        <th className="py-3 text-center font-bold">Orders</th>
                        <th className="py-3 text-center font-bold">Status</th>
                        <th className="py-3 text-left font-bold cursor-pointer" onClick={() => onSort('createdAt')}>
                            <div className="flex items-center">Created {getSortIcon('createdAt')}</div>
                        </th>
                        <th className="py-3 text-center font-bold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center py-4 text-gray-500">
                                No delivery trips found.
                            </td>
                        </tr>
                    ) : (
                        trips.map((trip) => (
                            <tr key={trip.id} className="hover">
                                <td className="py-3 font-medium">{trip.trip_number}</td>
                                <td className="py-3">
                                    <div className="flex items-center"><User size={16} className="mr-2 text-gray-400" />{trip.driver.name}</div>
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center"><Car size={16} className="mr-2 text-gray-400" />{trip.vehicle.license_plate} ({trip.vehicle.type})</div>
                                </td>
                                <td className="py-3 text-center">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{trip.delivery_orders.length}</span>
                                </td>
                                <td className="py-3 text-center"><StatusBadge status={trip.status} /></td>
                                <td className="py-3">{new Date(trip.createdAt).toLocaleDateString()}</td>
                                <td className="py-3">
                                    <div className="flex justify-center space-x-1">
                                        {trip.status === 'Planned' && (
                                            <button onClick={() => onStartTrip(trip.id)} className="btn btn-ghost btn-xs p-1 text-green-600 tooltip" data-tip="Start Trip"><Play size={16} /></button>
                                        )}
                                        {trip.status === 'In Progress' && (
                                            <button onClick={() => onCompleteTrip(trip.id)} className="btn btn-ghost btn-xs p-1 text-blue-600 tooltip" data-tip="Complete Trip"><CheckCircle size={16} /></button>
                                        )}
                                        <button onClick={() => onGenerateReport(trip)} className="btn btn-ghost btn-xs p-1 text-purple-600 tooltip" data-tip="Generate Report"><FileText size={16} /></button>
                                        <button onClick={() => onSelectTrip(trip)} className="btn btn-ghost btn-xs p-1 tooltip" data-tip="View Details"><Edit size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DeliveryTable;