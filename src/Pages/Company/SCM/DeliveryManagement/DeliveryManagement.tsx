// src/Pages/Company/SCM/DeliveryManagement/DeliveryManagement.tsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNotification } from '../../../../Components/NotificationProvider';
import { URL_BESMCDM, URL_BESMCPO, URL_BESMCSO } from '../../../../Utils/Constants';
import { DeliveryOrder, DeliveryTrip, Driver, Vehicle, VehicleStatus } from '../../../../types/delivery';
import { PurchaseOrder } from '../../../../types/purchaseOrder';
import { SalesOrder } from '../../../../types/salesOrder';
import DeliveryManagementHeader from '../../../../Components/SCM/DeliveryManagement/DeliveryManagementHeader';
import DeliveryTable from '../../../../Components/SCM/DeliveryManagement/DeliveryTable';
import DeliveryCards from '../../../../Components/SCM/DeliveryManagement/DeliveryCards';
import DeliveryMap from '../../../../Components/SCM/DeliveryManagement/DeliveryMap';
import CreateOrderModal from '../../../../Components/SCM/DeliveryManagement/modals/CreateOrderModal';
import ShippingCostModal from '../../../../Components/SCM/DeliveryManagement/modals/ShippingCostModal';
import CreateTripModal from '../../../../Components/SCM/DeliveryManagement/modals/CreateTripModal';
import TripDetailsModal from '../../../../Components/SCM/DeliveryManagement/modals/TripDetailsModal';
import ReportGeneratorModal from '../../../../Components/ReportGeneratorModal';
import Pagination from '../../../../Components/Pagination';
import UnassignedOrdersCard from '../../../../Components/SCM/DeliveryManagement/UnassignedOrdersCard';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import DeliveryReportModal from '../../../../Components/SCM/DeliveryManagement/DeliveryReportModal';

export type ViewMode = 'table' | 'card' | 'map';
export type SortColumn = keyof DeliveryTrip | 'driver' | 'vehicle' | 'createdAt';

const DeliveryManagementPage: React.FC = () => {
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();
    const [deliveryTrips, setDeliveryTrips] = useState<DeliveryTrip[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [unassignedOrders, setUnassignedOrders] = useState<DeliveryOrder[]>([]);
    const [vehicleStatuses, setVehicleStatuses] = useState<Record<number, VehicleStatus>>({});
    const [openPurchaseOrders, setOpenPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [openSalesOrders, setOpenSalesOrders] = useState<SalesOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [sortColumn, setSortColumn] = useState<SortColumn>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
    const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
    const [isShippingCostModalOpen, setIsShippingCostModalOpen] = useState(false);
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [selectedTrip, setSelectedTrip] = useState<DeliveryTrip | null>(null);
    const [tripToReport, setTripToReport] = useState<DeliveryTrip | null>(null);
    const [doCreationData, setDoCreationData] = useState<{
        orderId: string;
        orderType: 'purchase_order' | 'sales_order';
        orderNumber: string;
        shippingCost: number;
    } | null>(null);

    const fetchData = useCallback(async <T,>(endpoint: string, setter: React.Dispatch<React.SetStateAction<T>>, errorMessage: string) => {
        if (!companyDetails?.id) return;
        try {
            const response = await fetch(endpoint, { credentials: 'include' });
            if (!response.ok) throw new Error(errorMessage);
            const data = await response.json();
            setter(data || []);
            return data;
        } catch (err) {
            showNotification(err instanceof Error ? err.message : errorMessage, 'error');
        }
    }, [companyDetails?.id, showNotification]);
 
    const fetchDeliveryTrips = useCallback(() => fetchData(`${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-trips`, setDeliveryTrips as React.Dispatch<React.SetStateAction<DeliveryTrip[]>>, 'Failed to fetch delivery trips'), [companyDetails, fetchData]);
    const fetchDrivers = useCallback(() => fetchData(`${URL_BESMCDM}/api/companies/${companyDetails?.id}/drivers`, setDrivers, 'Failed to fetch drivers'), [companyDetails, fetchData]);
    const fetchVehicles = useCallback(() => fetchData(`${URL_BESMCDM}/api/companies/${companyDetails?.id}/vehicles`, setVehicles, 'Failed to fetch vehicles'), [companyDetails, fetchData]);
    const fetchUnassignedOrders = useCallback(() => fetchData(`${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-orders/unassigned`, setUnassignedOrders, 'Failed to fetch unassigned orders'), [companyDetails, fetchData]);
    

    const fetchOpenOrders = useCallback(async () => {
        if (!companyDetails?.id) return;
        try {
            const [poResponse, soResponse] = await Promise.all([
                fetch(`${URL_BESMCPO}/api/companies/${companyDetails.id}/purchase-orders`, { credentials: 'include' }),
                fetch(`${URL_BESMCSO}/api/companies/${companyDetails.id}/sales-orders`, { credentials: 'include' })
            ]);
            if (!poResponse.ok) throw new Error('Failed to fetch open purchase orders');
            if (!soResponse.ok) throw new Error('Failed to fetch open sales orders');
            const poData = (await poResponse.json()).filter((po: PurchaseOrder) => po.status === 'Approved');
            const soData = (await soResponse.json()).filter((so: SalesOrder) => so.status === 'Approved');
            setOpenPurchaseOrders(poData || []);
            setOpenSalesOrders(soData || []);
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'Failed to fetch open orders', 'error');
        }
    }, [companyDetails?.id, showNotification]);

    useEffect(() => {
        if (companyDetails?.id) {
            setLoading(true);
            Promise.all([
                fetchDeliveryTrips(),
                fetchDrivers(),
                fetchVehicles(),
                fetchUnassignedOrders(),
                fetchOpenOrders()
            ]).finally(() => setLoading(false));
        }
    }, [companyDetails?.id, fetchDeliveryTrips, fetchDrivers, fetchVehicles, fetchUnassignedOrders, fetchOpenOrders]);

    useEffect(() => {
        const wsUrl = URL_BESMCDM.replace(/^http/, 'ws') + '/ws/track';
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => console.log("WebSocket connected on Delivery Management page!");
        ws.onclose = () => console.log("WebSocket disconnected.");

        ws.onmessage = (event) => {
            try {
                const data: VehicleStatus = JSON.parse(event.data);
                setVehicleStatuses(prev => ({
                    ...prev,
                    [data.vehicle_id]: data
                }));
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

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

    const paginatedTrips = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAndFilteredTrips.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedAndFilteredTrips, currentPage, itemsPerPage]);

    const handleSort = (column: SortColumn) => {
        setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortColumn(column);
    };

    const handleAction = useCallback(async (url: string, method: string, successMessage: string, body?: unknown) => {
        if (!companyDetails?.id) return;
        setLoading(true);
        try {
            const response = await fetch(url, {
                method,
                headers: body ? { 'Content-Type': 'application/json' } : {},
                credentials: 'include',
                body: body ? JSON.stringify(body) : undefined
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${successMessage.toLowerCase()}`);
            }
            showNotification(successMessage, 'success');
            await fetchDeliveryTrips();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    }, [companyDetails?.id, fetchDeliveryTrips, showNotification]);

    const handleCreateDeliveryOrder = async (costData: { shippingCost: number }) => {
        if (!companyDetails?.id || !doCreationData) return;
        await handleAction(
            `${URL_BESMCDM}/api/companies/${companyDetails.id}/delivery-orders`,
            'POST',
            'Delivery Order created successfully!',
            {
                order_id: doCreationData.orderId,
                order_type: doCreationData.orderType,
                shipping_cost: costData.shippingCost
            }
        );
        await Promise.all([fetchUnassignedOrders(), fetchOpenOrders()]);
        closeAllModals();
    };

    const handleCreateTrip = async (tripData: DeliveryTrip) => {
        await handleAction(
            `${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-trips`,
            'POST',
            'Delivery trip created successfully!',
            tripData
        );
        await Promise.all([fetchUnassignedOrders(), fetchDrivers(), fetchVehicles()]);
        closeAllModals();
    };

    const handleStartTrip = (tripId: number) => handleAction(`${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-trips/${tripId}/start`, 'PATCH', 'Trip started successfully!');
    const handleCompleteTrip = (tripId: number) => handleAction(`${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-trips/${tripId}/complete`, 'PATCH', 'Trip completed successfully!');
    const handleUpdateOrderStatus = (orderId: string, status: 'Delivered' | 'Failed') => handleAction(`${URL_BESMCDM}/api/companies/${companyDetails?.id}/delivery-orders/${orderId}/status`, 'PATCH', `Order status updated to ${status}!`, { status });

    const handleGenerateReport = (trip: DeliveryTrip) => {
        setTripToReport(trip);
    };

    const handleCloseReportModal = () => {
        setTripToReport(null);
    };

    const handleOpenShippingCostModal = (orderId: string, orderType: 'purchase_order' | 'sales_order', orderNumber: string) => {
        setDoCreationData({ orderId, orderType, orderNumber, shippingCost: 0 });
        setIsShippingCostModalOpen(true);
        setIsCreateOrderModalOpen(false);
    };

    const closeAllModals = () => {
        setIsCreateTripModalOpen(false);
        setIsCreateOrderModalOpen(false);
        setIsShippingCostModalOpen(false);
        setSelectedTrip(null);
        setDoCreationData(null);
        handleCloseReportModal();
    };

    const deliveryReportColumns = useMemo(() => [
        { header: 'Trip Number', key: 'trip_number' as keyof DeliveryTrip, align: 'left' as const },
        { header: 'Driver', key: 'driver' as keyof DeliveryTrip, formatter: (val: unknown) => (val as Driver).name, align: 'left' as const },
        { header: 'Vehicle', key: 'vehicle' as keyof DeliveryTrip, formatter: (val: unknown) => `${(val as Vehicle).license_plate} - ${(val as Vehicle).type}`, align: 'left' as const },
        { header: 'Orders', key: 'delivery_orders' as keyof DeliveryTrip, formatter: (val: unknown) => (val as DeliveryOrder[]).length.toString(), align: 'center' as const },
        { header: 'Status', key: 'status' as keyof DeliveryTrip, align: 'center' as const },
        { header: 'Created At', key: 'createdAt' as keyof DeliveryTrip, formatter: (val: unknown) => new Date(val as string).toLocaleDateString(), align: 'left' as const },
    ], []);

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Delivery Management</h1>
            <DeliveryManagementHeader
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onOpenCreateOrderModal={() => setIsCreateOrderModalOpen(true)}
                onOpenCreateTripModal={() => setIsCreateTripModalOpen(true)}
                onOpenReportModal={() => setShowReportModal(true)}
            />
            <UnassignedOrdersCard unassignedOrders={unassignedOrders} />
            {loading && paginatedTrips.length === 0 ? (
                <div className="text-center text-gray-600 py-8">Loading delivery data...</div>
            ) : (
                <>
                    {viewMode === 'table' && <DeliveryTable trips={paginatedTrips} onSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} onStartTrip={handleStartTrip} onCompleteTrip={handleCompleteTrip} onSelectTrip={setSelectedTrip} onGenerateReport={handleGenerateReport} />}
                    {viewMode === 'card' && <DeliveryCards trips={paginatedTrips} onStartTrip={handleStartTrip} onCompleteTrip={handleCompleteTrip} onSelectTrip={setSelectedTrip} onGenerateReport={handleGenerateReport} />}
                    {viewMode === 'map' && <DeliveryMap deliveryTrips={deliveryTrips} vehicleStatuses={vehicleStatuses} />}
                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="itemsPerPage" className="text-gray-700 text-sm">Items per page:</label>
                            <select
                                id="itemsPerPage"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="p-2 border rounded-md"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={sortedAndFilteredTrips.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}
            {isCreateOrderModalOpen && <CreateOrderModal isOpen={isCreateOrderModalOpen} onClose={closeAllModals} openPurchaseOrders={openPurchaseOrders} openSalesOrders={openSalesOrders} onSelectOrder={handleOpenShippingCostModal} />}
            {isShippingCostModalOpen && doCreationData && <ShippingCostModal isOpen={isShippingCostModalOpen} onClose={closeAllModals} onSubmit={handleCreateDeliveryOrder} creationData={doCreationData} loading={loading} />}
            {companyDetails?.id && (
                <CreateTripModal
                    isOpen={isCreateTripModalOpen}
                    onClose={closeAllModals}
                    onSubmit={handleCreateTrip}
                    unassignedOrders={unassignedOrders}
                    drivers={drivers}
                    vehicles={vehicles}
                    companyId={companyDetails.id}
                />
            )}
            {selectedTrip && <TripDetailsModal trip={selectedTrip} isOpen={!!selectedTrip} onClose={closeAllModals} onStartTrip={handleStartTrip} onCompleteTrip={handleCompleteTrip} onUpdateOrderStatus={handleUpdateOrderStatus} companyDetails={companyDetails} />}
            {showReportModal && <ReportGeneratorModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} data={sortedAndFilteredTrips as unknown as Record<string, unknown>[]} columns={deliveryReportColumns} title="Delivery Management Report" fileName="Delivery_Management_Report" headerInfo={{ companyName: companyDetails?.name || 'Your Company' }} footerInfo={{ appName: 'EriLinaERP' }} />}
            {tripToReport && <DeliveryReportModal isOpen={!!tripToReport} onClose={handleCloseReportModal} deliveryTrip={tripToReport} />}
        </div>
    );
};

export default DeliveryManagementPage;