import React, { useState, useEffect } from 'react';
import { DeliveryFormData, DeliveryOrder, Driver, Vehicle } from '../../../../types/delivery';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import { URL_BESMCDM } from '../../../../Utils/Constants';
import { useNotification } from '../../../NotificationProvider';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: any) => Promise<void>;
    unassignedOrders: DeliveryOrder[];
    drivers: Driver[];
    vehicles: Vehicle[];
    companyId: number;
}

const CreateTripModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, unassignedOrders, drivers, vehicles, companyId }) => {
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';

    const [formData, setFormData] = useState<DeliveryFormData>({ driver_id: 0, vehicle_id: 0, trip_number: '', order_ids: [], shipping_cost: 0, notes: '' });
    const [isCreatingDriver, setIsCreatingDriver] = useState(false);
    const [newDriverData, setNewDriverData] = useState({ name: '', phone: '' });
    const [isCreatingVehicle, setIsCreatingVehicle] = useState(false);
    const [newVehicleData, setNewVehicleData] = useState({ license_plate: '', type: '', model: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const generateTripNumber = () => `TRIP-${new Date().getTime().toString().slice(-6)}`;
        if (isOpen) {
            setFormData({ driver_id: 0, vehicle_id: 0, trip_number: generateTripNumber(), order_ids: [], shipping_cost: 0, notes: '' });
            setIsCreatingDriver(false);
            setNewDriverData({ name: '', phone: '' });
            setIsCreatingVehicle(false);
            setNewVehicleData({ license_plate: '', type: '', model: '' });
        }
    }, [isOpen]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let driverId = formData.driver_id;
            let vehicleId = formData.vehicle_id;

            if (isCreatingDriver) {
                const driverPayload = { ...newDriverData, status: 'available' };
                const driverResponse = await fetch(`${URL_BESMCDM}/api/companies/${companyId}/drivers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(driverPayload) });
                if (!driverResponse.ok) throw new Error((await driverResponse.json()).error || 'Failed to create new driver');
                driverId = (await driverResponse.json()).id;
            }
            if (isCreatingVehicle) {
                const vehicleResponse = await fetch(`${URL_BESMCDM}/api/companies/${companyId}/vehicles`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ ...newVehicleData, status: 'available', is_active: true }) });
                if (!vehicleResponse.ok) throw new Error((await vehicleResponse.json()).error || 'Failed to create new vehicle');
                vehicleId = (await vehicleResponse.json()).id;
            }

            if (formData.order_ids.length === 0) throw new Error('Please select at least one delivery order.');
            if (driverId === 0) throw new Error('Please select or create a driver.');
            if (vehicleId === 0) throw new Error('Please select or create a vehicle.');

            const tripData = { ...formData, driver_id: driverId, vehicle_id: vehicleId };
            await onSubmit(tripData);
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'Failed to create trip');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Delivery Trip</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label htmlFor="trip_number" className="block text-gray-700 text-sm font-bold mb-2">Trip Number:</label>
                        <input type="text" id="trip_number" className="shadow border rounded w-full py-2 px-3 text-gray-700" value={formData.trip_number} onChange={(e) => setFormData({ ...formData, trip_number: e.target.value })} required />
                    </div>
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-gray-700 text-sm font-bold">Driver:</label>
                            <label className="flex items-center text-sm"><input type="checkbox" checked={isCreatingDriver} onChange={(e) => { setIsCreatingDriver(e.target.checked); setFormData({ ...formData, driver_id: 0 }); }} className="mr-2" />Create New Driver</label>
                        </div>
                        {isCreatingDriver ? (
                            <div className="space-y-2">
                                <input type="text" placeholder="Driver Name" value={newDriverData.name} onChange={(e) => setNewDriverData({ ...newDriverData, name: e.target.value })} className="shadow border rounded w-full py-2 px-3" required />
                                <input type="text" placeholder="Driver Phone" value={newDriverData.phone} onChange={(e) => setNewDriverData({ ...newDriverData, phone: e.target.value })} className="shadow border rounded w-full py-2 px-3" required />
                            </div>
                        ) : (
                            <select id="driver_id" className="shadow border rounded w-full py-2 px-3" value={formData.driver_id} onChange={(e) => setFormData({ ...formData, driver_id: Number(e.target.value) })} required={!isCreatingDriver}><option value={0}>Select a driver</option>{drivers.filter(d => d.status === 'available').map(driver => (<option key={driver.id} value={driver.id}>{driver.name} - {driver.phone}</option>))}</select>
                        )}
                    </div>
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-gray-700 text-sm font-bold">Vehicle:</label>
                            <label className="flex items-center text-sm"><input type="checkbox" checked={isCreatingVehicle} onChange={(e) => { setIsCreatingVehicle(e.target.checked); setFormData({ ...formData, vehicle_id: 0 }); }} className="mr-2" />Create New Vehicle</label>
                        </div>
                        {isCreatingVehicle ? (
                            <div className="space-y-2">
                                <input type="text" placeholder="License Plate" value={newVehicleData.license_plate} onChange={(e) => setNewVehicleData({ ...newVehicleData, license_plate: e.target.value })} className="shadow border rounded w-full py-2 px-3" required />
                                <input type="text" placeholder="Vehicle Type" value={newVehicleData.type} onChange={(e) => setNewVehicleData({ ...newVehicleData, type: e.target.value })} className="shadow border rounded w-full py-2 px-3" required />
                                <input type="text" placeholder="Vehicle Model" value={newVehicleData.model} onChange={(e) => setNewVehicleData({ ...newVehicleData, model: e.target.value })} className="shadow border rounded w-full py-2 px-3" required />
                            </div>
                        ) : (
                            <select id="vehicle_id" className="shadow border rounded w-full py-2 px-3" value={formData.vehicle_id} onChange={(e) => setFormData({ ...formData, vehicle_id: Number(e.target.value) })} required={!isCreatingVehicle}><option value={0}>Select a vehicle</option>{vehicles.filter(v => v.status === 'available').map(vehicle => (<option key={vehicle.id} value={vehicle.id}>{vehicle.license_plate} - {vehicle.type} {vehicle.model}</option>))}</select>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Select Delivery Orders:</label>
                        <div className="max-h-40 overflow-y-auto border rounded p-3 bg-gray-50">
                            {unassignedOrders.length === 0 ? (<p className="text-gray-500 text-sm">No unassigned orders available.</p>) : (unassignedOrders.map(order => (<div key={order.id} className="flex items-center mb-2"><input type="checkbox" id={`order-${order.id}`} className="mr-2" checked={formData.order_ids.includes(order.id)} onChange={(e) => { setFormData(prev => ({ ...prev, order_ids: e.target.checked ? [...prev.order_ids, order.id] : prev.order_ids.filter(id => id !== order.id) })); }} /><label htmlFor={`order-${order.id}`} className="text-sm">DO #{order.do_number} - {order.order_type.replace('_', ' ').toUpperCase()}</label></div>)))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
                        <textarea id="notes" rows={3} className="shadow border rounded w-full py-2 px-3" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes..." />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="font-bold py-2 px-4 rounded-lg text-white" style={{ backgroundColor: primaryColor }} disabled={loading || formData.order_ids.length === 0}>{loading ? 'Creating...' : 'Create Trip'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTripModal;