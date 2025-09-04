// src/pages/DeliveryManagement/hooks/useDeliveryData.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCompanyDetails } from '../Contexts/CompanyContext';
import { useNotification } from '../Components/NotificationProvider';
import { URL_BESMCDM, URL_BESMCPO, URL_BESMCSO } from '../Utils/Constants';
import { DeliveryTrip, Driver, Vehicle, DeliveryOrder, SortColumn, SortDirection, DeliveryTripFormData, DOCreationData } from './delivery';
import { PurchaseOrder } from './purchaseOrder';
import { SalesOrder } from './salesOrder';

export const useDeliveryData = (
    searchTerm: string,
    filterStatus: string,
    sortColumn: SortColumn,
    sortDirection: SortDirection
) => {
    const companyDetails = useCompanyDetails();
    const { showNotification } = useNotification();

    const [deliveryTrips, setDeliveryTrips] = useState<DeliveryTrip[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [unassignedOrders, setUnassignedOrders] = useState<DeliveryOrder[]>([]);
    const [openPurchaseOrders, setOpenPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [openSalesOrders, setOpenSalesOrders] = useState<SalesOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async (url: string, errorMessage: string) => {
        try {
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) throw new Error(errorMessage);
            return await response.json();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : errorMessage, 'error');
            return [];
        }
    }, [showNotification]);

    const refreshAllData = useCallback(async () => {
        if (!companyDetails?.id) return;
        setLoading(true);
        const companyId = companyDetails.id;
        
        const [trips, drvs, vhcls, unassigned, pos, sos] = await Promise.all([
            fetchData(`${URL_BESMCDM}/api/companies/${companyId}/delivery-trips`, 'Failed to fetch delivery trips'),
            fetchData(`${URL_BESMCDM}/api/companies/${companyId}/drivers`, 'Failed to fetch drivers'),
            fetchData(`${URL_BESMCDM}/api/companies/${companyId}/vehicles`, 'Failed to fetch vehicles'),
            fetchData(`${URL_BESMCDM}/api/companies/${companyId}/delivery-orders/unassigned`, 'Failed to fetch unassigned orders'),
            fetchData(`${URL_BESMCPO}/api/companies/${companyId}/purchase-orders`, 'Failed to fetch purchase orders'),
            fetchData(`${URL_BESMCSO}/api/companies/${companyId}/sales-orders`, 'Failed to fetch sales orders')
        ]);
        
        setDeliveryTrips(trips);
        setDrivers(drvs);
        setVehicles(vhcls);
        setUnassignedOrders(unassigned);
        setOpenPurchaseOrders(pos.filter((po: PurchaseOrder) => po.status === 'Approved'));
        setOpenSalesOrders(sos.filter((so: SalesOrder) => so.status === 'Approved'));
        
        setLoading(false);
    }, [companyDetails?.id, fetchData]);

    useEffect(() => {
        refreshAllData();
    }, [refreshAllData]);

    const sortedAndFilteredTrips = useMemo(() => {
        return [...deliveryTrips]
            .filter(trip => {
                if (filterStatus !== 'all' && trip.status !== filterStatus) return false;
                if (!searchTerm) return true;
                const lowerTerm = searchTerm.toLowerCase();
                return (
                    trip.trip_number.toLowerCase().includes(lowerTerm) ||
                    trip.driver.name.toLowerCase().includes(lowerTerm) ||
                    trip.vehicle.license_plate.toLowerCase().includes(lowerTerm)
                );
            })
            .sort((a, b) => {
                const aValue = a[sortColumn as keyof DeliveryTrip];
                const bValue = b[sortColumn as keyof DeliveryTrip];
                if (aValue === undefined || bValue === undefined) return 0;
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [deliveryTrips, searchTerm, filterStatus, sortColumn, sortDirection]);

    const handleApiCall = async (
        url: string,
        method: 'POST' | 'PATCH' | 'DELETE',
        body: object | null,
        successMessage: string,
        errorMessage: string
    ) => {
        if (!companyDetails?.id) return false;
        setLoading(true);
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: body ? JSON.stringify(body) : null,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorMessage);
            }
            showNotification(successMessage, 'success');
            await refreshAllData();
            return true;
        } catch (err) {
            showNotification(err instanceof Error ? err.message : errorMessage, 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    // Action Handlers
    const createDeliveryOrder = (data: DOCreationData) => {
        return handleApiCall(
            `${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-orders`, 'POST',
            { order_id: data.orderId, order_type: data.orderType, shipping_cost: data.shippingCost },
            'Delivery Order created successfully!', 'Failed to create Delivery Order'
        );
    };

    const createDeliveryTrip = (data: DeliveryTripFormData) => {
         return handleApiCall(
            `${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-trips`, 'POST', data,
            'Delivery trip created successfully!', 'Failed to create delivery trip'
        );
    };

    const startTrip = (tripId: number) => {
        return handleApiCall(
            `${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-trips/${tripId}/start`, 'PATCH', null,
            'Trip started successfully!', 'Failed to start trip'
        );
    };

    const completeTrip = (tripId: number) => {
        return handleApiCall(
            `${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-trips/${tripId}/complete`, 'PATCH', null,
            'Trip completed successfully!', 'Failed to complete trip'
        );
    };

    const updateOrderStatus = (orderId: string, status: 'Delivered' | 'Failed') => {
        return handleApiCall(
            `${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-orders/${orderId}/status`, 'PATCH', { status },
            `Order status updated to ${status}!`, 'Failed to update order status'
        );
    };
    
    return {
        loading,
        deliveryTrips,
        drivers,
        vehicles,
        unassignedOrders,
        openPurchaseOrders,
        openSalesOrders,
        sortedAndFilteredTrips,
        refreshAllData,
        createDeliveryOrder,
        createDeliveryTrip,
        startTrip,
        completeTrip,
        updateOrderStatus,
    };
};