// src/Pages/Company/SCM/WarehouseManagement/WarehouseManagement.tsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PlusCircle, Table, Map, Trash2, Edit, Printer, PackageCheck, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import Pagination from '../../../../Components/Pagination';
import ReportGeneratorModal from '../../../../Components/ReportGeneratorModal';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNotification } from '../../../../Components/NotificationProvider';

interface PurchaseOrder {
    id: string;
    po_number: string;
    status: string;
    supplier: {
        name: string;
    };
    items: {
        item_name: string;
        quantity: number;
    }[];
    [key: string]: string | number | object;
}

type WarehouseFormData = {
    name: string;
    location: string;
    isActive: boolean;
};

export type SortColumn = keyof Warehouse;

export type WarehouseReportColumn = {
    header: string;
    key: keyof Warehouse;
    align?: 'left' | 'center' | 'right';
    formatter?: (value: unknown, item: Warehouse) => string;
};

import { URL_BESMCWM, URL_BESMCPO, URL_BESMCSO } from '../../../../Utils/Constants';
import { Warehouse } from '../../../../types/warehouse';
import { SalesOrder } from '../../../../types/salesOrder';

interface WarehouseTableProps {
    data: Warehouse[];
    handleEdit: (warehouse: Warehouse) => void;
    handleDelete: (warehouse: Warehouse) => void;
    handleSort: (column: SortColumn) => void;
    sortColumn: SortColumn;
    sortDirection: 'asc' | 'desc';
}

const containerStyle = {
    height: '400px',
    width: '100%',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const customMarkerIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
        <div style="position: relative; width: 50px; height: 55px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="55" viewBox="0 0 24 24" style="filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.3));">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="url(#gradient)"/>
                <circle cx="12" cy="9" r="3" fill="#ffffff"/>
            </svg>
        </div>
    `,
    iconSize: [50, 55],
    iconAnchor: [30, 55],
    popupAnchor: [-5, -45]
});

const WarehouseMap = React.memo(({ data }: { data: Warehouse[] }) => {
    const position: [number, number] = useMemo(() => {
        if (data.length > 0) {
            const firstLocation = data[0].location;
            if (firstLocation && firstLocation.includes(',')) {
                const [lat, lng] = firstLocation.split(',').map(Number);
                if (!isNaN(lat) && !isNaN(lng)) {
                    return [lat, lng];
                }
            }
        }
        return [-6.5477094, 107.4398186];
    }, [data]);

    const mapKey = useMemo(() => data.map(wh => wh.id).join('-'), [data]);

    return (
        <MapContainer
            key={mapKey}
            center={position}
            zoom={12}
            scrollWheelZoom={true}
            style={containerStyle}
        >
            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((warehouse) => {
                if (!warehouse.location || !warehouse.location.includes(',')) {
                    console.error(`Invalid location for warehouse ID ${warehouse.id}`);
                    return null;
                }
                const [lat, lng] = warehouse.location.split(',').map(Number);
                if (isNaN(lat) || isNaN(lng)) {
                    console.error(`Invalid coordinates for warehouse ID ${warehouse.id}`);
                    return null;
                }
                return (
                    <Marker key={warehouse.id} position={[lat, lng]} icon={customMarkerIcon}>
                        <Popup>
                            <div className="p-2 font-sans text-gray-800">
                                <h3 className="font-bold text-lg mb-1">{warehouse.name}</h3>
                                <p className="text-sm mb-2">{warehouse.location}</p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                                >
                                    <MapPin size={14} className="mr-1" /> View on Google Maps
                                </a>
                            </div>
                        </Popup>
                        <Tooltip>{warehouse.name}</Tooltip>
                    </Marker>
                );
            })}
        </MapContainer>
    );
});

const WarehouseManagementPage: React.FC = () => {
    const { showNotification } = useNotification();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentWarehouse, setCurrentWarehouse] = useState<Warehouse | null>(null);
    const [formData, setFormData] = useState<WarehouseFormData>({
        name: '', location: '', isActive: true
    });
    const [itemToDelete, setItemToDelete] = useState<{ id: number | null; name: string | null }>({ id: null, name: null });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [sortColumn, setSortColumn] = useState<SortColumn>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [completedPOs, setCompletedPOs] = useState<PurchaseOrder[]>([]);
    const [deliveredSOs, setDeliveredSOs] = useState<SalesOrder[]>([]);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [poToReceive, setPoToReceive] = useState<PurchaseOrder | null>(null);
    const [selectedWarehouseForReceipt, setSelectedWarehouseForReceipt] = useState<string>('');
    const [isReceiving, setIsReceiving] = useState<boolean>(false);
    const [isReceiveSoModalOpen, setIsReceiveSoModalOpen] = useState(false);
    const [soToReceive, setSoToReceive] = useState<SalesOrder | null>(null);
    const [isReceivingSo, setIsReceivingSo] = useState<boolean>(false);
    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';
    const secondaryColor = companyDetails?.secondary_color || '#10b981';
    const textColor = '#ffffff';

    const warehouseReportColumns: WarehouseReportColumn[] = useMemo(() => [
        { header: 'ID', key: 'id', align: 'left' },
        { header: 'Name', key: 'name', align: 'left' },
        { header: 'Location', key: 'location', align: 'left' },
        {
            header: 'Status',
            key: 'isActive',
            formatter: (val: unknown) => (val as boolean) ? 'Active' : 'Inactive',
            align: 'center'
        },
        {
            header: 'Created At',
            key: 'createdAt',
            formatter: (val: unknown) => new Date(val as string).toLocaleDateString(),
            align: 'left'
        },
        {
            header: 'Updated At',
            key: 'updatedAt',
            formatter: (val: unknown) => new Date(val as string).toLocaleDateString(),
            align: 'left'
        },
    ], []);

    const fetchWarehouses = useCallback(async () => {
        if (!companyDetails?.id) return;
        setLoading(true);
        try {
            const response = await fetch(`${URL_BESMCWM}/api/${companyDetails.id}/warehouse?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });;
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch warehouses');
            }
            const data: Warehouse[] = await response.json();
            setWarehouses(data || []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification(String(err), 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [companyDetails?.id, itemsPerPage, currentPage]);

    const fetchDeliveredPOs = useCallback(async () => {
        if (!companyDetails?.id) return;
        try {
            const response = await fetch(`${URL_BESMCPO}/api/companies/${companyDetails.id}/purchase-orders`, { credentials: 'include' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch purchase orders');
            }
            const data: PurchaseOrder[] = await response.json();
            const completed = data.filter(po => po.status === 'Delivered');
            setCompletedPOs(completed);
        } catch (err: unknown) {
            console.error("Failed to fetch completed POs:", err instanceof Error ? err.message : String(err));
        }
    }, [companyDetails?.id]);

    const fetchDeliveredSOs = useCallback(async () => {
        if (!companyDetails?.id) return;
        try {
            const response = await fetch(`${URL_BESMCSO}/api/companies/${companyDetails.id}/sales-orders`, { credentials: 'include' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch sales orders');
            }
            const data: SalesOrder[] = await response.json();
            const delivered = data.filter(so => so.status === 'Delivered');
            setDeliveredSOs(delivered);
        } catch (err: unknown) {
            console.error("Failed to fetch delivered SOs:", err instanceof Error ? err.message : String(err));
        }
    }, [companyDetails?.id]);

    useEffect(() => {
        if (companyDetails?.id) {
            fetchWarehouses();
            fetchDeliveredPOs();
            fetchDeliveredSOs();
        }
    }, [companyDetails?.id, fetchWarehouses, fetchDeliveredPOs, fetchDeliveredSOs]);

    const sortedAndFilteredWarehouses = useMemo(() => {
        let tempWarehouses = [...warehouses];
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            tempWarehouses = tempWarehouses.filter(wh =>
                wh.name.toLowerCase().includes(lowerTerm) ||
                wh.location.toLowerCase().includes(lowerTerm)
            );
        }
        if (filterStatus !== 'all') {
            const isActive = filterStatus === 'active';
            tempWarehouses = tempWarehouses.filter(wh => wh.isActive === isActive);
        }

        tempWarehouses.sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue === undefined || aValue === null || bValue === undefined || bValue === null) {
                if (aValue === undefined || aValue === null) return 1;
                if (bValue === undefined || bValue === null) return -1;
                return 0;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        return tempWarehouses;
    }, [warehouses, searchTerm, filterStatus, sortColumn, sortDirection]);

    const paginatedWarehouses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedAndFilteredWarehouses.slice(startIndex, endIndex);
    }, [sortedAndFilteredWarehouses, currentPage, itemsPerPage]);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSort = (column: SortColumn) => {
        setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortColumn(column);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsReceiveModalOpen(false);
        setCurrentWarehouse(null);
        setFormData({ name: '', location: '', isActive: true });
        setItemToDelete({ id: null, name: null });
        setPoToReceive(null);
        setIsReceiveSoModalOpen(false);
        setSoToReceive(null);
        setSelectedWarehouseForReceipt('');
    };

    const handleOpenReceiveSoModal = (so: SalesOrder) => {
        if (!so.Warehouse || !so.Warehouse.id) {
            showNotification(`Cannot receive items. Warehouse is not specified for SO #${so.so_number}.`, 'error');
            return;
        }
        setSoToReceive(so);
        setSelectedWarehouseForReceipt(String(so.Warehouse.id));
        setIsReceiveSoModalOpen(true);
    };

    const handleConfirmSoReceipt = async () => {
        if (!soToReceive || !selectedWarehouseForReceipt || !companyDetails?.id) {
            showNotification("Missing information to process the receipt.", 'error');
            return;
        }

        setIsReceivingSo(true);

        const payload = {
            salesOrderId: soToReceive.id,
            warehouseId: parseInt(selectedWarehouseForReceipt, 10),
        };

        try {
            const response = await fetch(`${URL_BESMCWM}/api/${companyDetails.id}/warehouse/receive-so`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || `Failed to receive SO: ${response.statusText}`);
            }

            showNotification(responseData.message || `Successfully received items for SO #${soToReceive.so_number}.`, 'success');
            fetchDeliveredSOs();
            closeModal();
        } catch (err: unknown) {
            showNotification(err instanceof Error ? err.message : String(err), 'error');
        } finally {
            setIsReceivingSo(false);
        }
    };

    const handleAddClick = () => {
        setFormData({ name: '', location: '', isActive: true });
        setIsAddModalOpen(true);
    };

    const handleEditClick = (warehouse: Warehouse) => {
        setCurrentWarehouse(warehouse);
        setFormData({
            name: warehouse.name,
            location: warehouse.location,
            isActive: warehouse.isActive
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (warehouse: Warehouse) => {
        setItemToDelete({ id: warehouse.id, name: warehouse.name });
        setIsDeleteModalOpen(true);
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyDetails?.id) {
            showNotification("Company ID missing", 'error');
            return;
        }
        if (!formData.name || !formData.location) {
            showNotification("Name and Location are required.", 'error');
            return;
        }

        const payload = {
            companyId: companyDetails.id,
            name: formData.name,
            location: formData.location,
            isActive: formData.isActive
        };

        try {
            const response = await fetch(`${URL_BESMCWM}/api/${companyDetails.id}/warehouse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create Warehouse: ${response.statusText}`);
            }
            showNotification("Warehouse created successfully!", 'success');
            fetchWarehouses();
            closeModal();
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification(String(err), 'error');
            }
        }
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyDetails?.id || !currentWarehouse?.id) {
            showNotification("Company ID or Warehouse ID missing for update.", 'error');
            return;
        }
        if (!formData.name || !formData.location) {
            showNotification("Name and Location are required.", 'error');
            return;
        }

        const payload = {
            id: currentWarehouse.id,
            companyId: companyDetails.id,
            name: formData.name,
            location: formData.location,
            isActive: formData.isActive
        };

        try {
            const response = await fetch(`${URL_BESMCWM}/api/${companyDetails.id}/warehouse/${currentWarehouse.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to update Warehouse: ${response.statusText}`);
            }
            showNotification("Warehouse updated successfully!", 'success');
            fetchWarehouses();
            closeModal();
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification(String(err), 'error');
            }
        }
    };

    const confirmDeleteItem = async () => {
        if (!itemToDelete.id || !companyDetails?.id) {
            showNotification("Warehouse ID or Company ID missing for deletion.", 'error');
            return;
        }
        try {
            const response = await fetch(`${URL_BESMCWM}/api/${companyDetails.id}/warehouse/${itemToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete warehouse: ${response.statusText}`);
            }
            showNotification(`Warehouse "${itemToDelete.name}" deleted successfully!`, 'success');
            fetchWarehouses();
            closeModal();
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification(String(err), 'error');
            }
        }
    };

    const handleOpenReceiveModal = (po: PurchaseOrder) => {
        if (warehouses.length === 0) {
            showNotification("Cannot receive items. No active warehouses available.", 'error');
            return;
        }
        setPoToReceive(po);
        setSelectedWarehouseForReceipt(String(warehouses[0].id));
        setIsReceiveModalOpen(true);
    };

    const handleConfirmReceipt = async () => {
        if (!poToReceive || !selectedWarehouseForReceipt || !companyDetails?.id) {
            showNotification("Missing information to process the receipt.", 'error');
            return;
        }

        setIsReceiving(true);

        const payload = {
            purchaseOrderId: poToReceive.id,
            warehouseId: parseInt(selectedWarehouseForReceipt, 10),
        };

        try {
            const response = await fetch(`${URL_BESMCWM}/api/${companyDetails.id}/warehouse/receive-po`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || `Failed to receive PO: ${response.statusText}`);
            }

            showNotification(responseData.message || `Successfully received items for PO #${poToReceive.po_number}.`, 'success');
            fetchDeliveredPOs();
            closeModal();
        } catch (err: unknown) {
            showNotification(err instanceof Error ? err.message : String(err), 'error');
        } finally {
            setIsReceiving(false);
        }
    };

    const CompletedPOsCard = () => (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Pending Receipts (Delivered Purchase Orders)</h2>
            {completedPOs.length === 0 ? (
                <p className="text-gray-500 text-sm">No delivered purchase orders are awaiting completion.</p>
            ) : (
                <div className="max-h-60 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        {completedPOs.map(po => (
                            <li key={po.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-900">PO #{po.po_number}</p>
                                    <p className="text-sm text-gray-500">Supplier: {po.supplier.name}</p>
                                    <p className="text-xs text-gray-500">
                                        Total Items: {po.items.reduce((sum, item) => sum + item.quantity, 0)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleOpenReceiveModal(po)}
                                    className="btn btn-sm btn-success text-white mt-2 sm:mt-0"
                                    title={`Receive items for PO #${po.po_number}`}
                                >
                                    <PackageCheck size={16} className="mr-2" />
                                    Receive Items
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    const DeliveredSOsCard = () => (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Pending Receipts (Delivered Sales Orders)</h2>
            {deliveredSOs.length === 0 ? (
                <p className="text-gray-500 text-sm">No delivered sales orders are awaiting completion.</p>
            ) : (
                <div className="max-h-60 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        {deliveredSOs.map(so => (
                            <li key={so.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-900">SO #{so.so_number}</p>
                                    <p className="text-sm text-gray-500">Customer: {so.customer.name}</p>
                                    <p className="text-xs text-gray-500">
                                        Total Items: {so.items.reduce((sum, item) => sum + item.quantity, 0)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleOpenReceiveSoModal(so)}
                                    className="btn btn-sm btn-success text-white mt-2 sm:mt-0"
                                    title={`Close Sales for SO #${so.so_number}`}
                                >
                                    <PackageCheck size={16} className="mr-2" />
                                    Receive Items
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    const WarehouseTable: React.FC<WarehouseTableProps> = ({ data, handleEdit, handleDelete, handleSort, sortColumn, sortDirection }) => {
        const columns: Array<{ key: keyof Warehouse; header: string; formatter?: (val: unknown) => string; }> = [
            { key: 'id', header: 'ID' },
            { key: 'name', header: 'Name' },
            { key: 'location', header: 'Location' },
            {
                key: 'isActive',
                header: 'Active',
                formatter: (val: unknown) => (val as boolean) ? 'Yes' : 'No'
            },
            {
                key: 'createdAt',
                header: 'Created At',
                formatter: (val: unknown) => new Date(val as string).toLocaleDateString()
            },
            {
                key: 'updatedAt',
                header: 'Updated At',
                formatter: (val: unknown) => new Date(val as string).toLocaleDateString()
            },
        ];
        const getSortIcon = (key: keyof Warehouse | null) => {
            if (sortColumn !== key) return null;
            return sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />;
        };

        return (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="table table-zebra w-full min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            {columns.map((col) => (
                                <th
                                    key={col.key as string}
                                    className="py-3 px-4 text-left font-bold text-gray-700 tracking-wider cursor-pointer"
                                    onClick={() => handleSort(col.key)}
                                >
                                    <div className="flex items-center whitespace-nowrap">
                                        {col.header} {getSortIcon(col.key)}
                                    </div>
                                </th>
                            ))}
                            <th className="py-3 text-center font-bold text-gray-700 tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center py-4 text-gray-500">
                                    No warehouses found.
                                </td>
                            </tr>
                        ) : (
                            data.map((item: Warehouse) => (
                                <tr key={item.id} className="hover">
                                    {columns.map((col) => (
                                        <td key={`${item.id}-${col.key as string}`} className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis text-sm text-gray-900">
                                            {col.formatter ? col.formatter(item[col.key]) : String(item[col.key])}
                                        </td>
                                    ))}
                                    <td className="py-3 flex space-x-1 justify-center items-center">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="btn btn-ghost btn-xs p-1 tooltip"
                                            data-tip="Edit Warehouse"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="btn btn-ghost btn-xs p-1 text-error tooltip"
                                            data-tip="Delete Warehouse"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Warehouse Management</h1>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                    <input
                        type="text"
                        placeholder="Search warehouses..."
                        className="input input-bordered w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="select select-bordered w-full sm:w-auto"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <button
                        onClick={handleAddClick}
                        className="btn flex-grow text-white"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <PlusCircle size={20} className="mr-2" /> Add Warehouse
                    </button>
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="btn flex-grow text-white"
                        style={{ backgroundColor: secondaryColor }}
                    >
                        <Printer size={20} className="mr-2" /> Report
                    </button>
                </div>
            </div>

            <div className="flex justify-end mb-6 mt-4">
                <div className="tabs tabs-boxed">
                    <a className={`tab ${viewMode === 'table' ? 'tab-active' : ''}`} onClick={() => setViewMode('table')}>
                        <Table size={16} className="mr-2"/> Table
                    </a> 
                    <a className={`tab ${viewMode === 'map' ? 'tab-active' : ''}`} onClick={() => setViewMode('map')}>
                        <Map size={16} className="mr-2"/> Map
                    </a> 
                </div>
            </div>

            <CompletedPOsCard />
            <DeliveredSOsCard />

            {loading ? (
                <div className="text-center text-gray-600 py-10">Loading warehouses...</div>
            ) : (
                <>
                    {viewMode === 'table' ? (
                        <WarehouseTable
                            data={paginatedWarehouses}
                            handleEdit={handleEditClick}
                            handleDelete={handleDeleteClick}
                            handleSort={handleSort}
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                        />
                    ) : (
                        <WarehouseMap data={sortedAndFilteredWarehouses} />
                    )}

                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="select select-bordered select-sm"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={sortedAndFilteredWarehouses.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}

            {(isAddModalOpen || isEditModalOpen) && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-md">
                        <h3 className="font-bold text-lg">{isAddModalOpen ? 'Add New Warehouse' : 'Edit Warehouse'}</h3>
                        <form onSubmit={isAddModalOpen ? handleCreateSubmit : handleUpdateSubmit} className="py-4 space-y-4">
                            <input type="text" placeholder="Name" className="input input-bordered w-full" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            <input type="text" placeholder="Location (lat,lng)" className="input input-bordered w-full" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                            <label className="cursor-pointer label"><span className="label-text">Is Active</span><input type="checkbox" className="toggle toggle-primary" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /></label>
                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn" style={{backgroundColor: primaryColor, color: textColor}}>{isAddModalOpen ? 'Add' : 'Update'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-sm">
                        <h3 className="font-bold text-lg">Confirm Deletion</h3>
                        <p className="py-4">Are you sure you want to delete warehouse "<strong>{itemToDelete.name}</strong>"?</p>
                        <div className="modal-action">
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="button" onClick={confirmDeleteItem} className="btn btn-error">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {isReceiveModalOpen && poToReceive && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-lg">
                        <h3 className="font-bold text-lg">Confirm Receipt for PO #{poToReceive.po_number}</h3>
                        <p className="py-4">Select the warehouse to receive these items into.</p>
                        <select className="select select-bordered w-full" value={selectedWarehouseForReceipt} onChange={(e) => setSelectedWarehouseForReceipt(e.target.value)}>
                            {warehouses.filter(w => w.isActive).map(w => ( <option key={w.id} value={w.id}>{w.name}</option>))}
                        </select>
                        <div className="modal-action">
                            <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={isReceiving}>Cancel</button>
                            <button type="button" onClick={handleConfirmReceipt} className="btn btn-success" disabled={isReceiving || !selectedWarehouseForReceipt}>{isReceiving ? 'Processing...' : 'Confirm'}</button>
                        </div>
                    </div>
                </div>
            )}

            {isReceiveSoModalOpen && soToReceive && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-lg">
                        <h3 className="font-bold text-lg">Confirm Completion for SO #{soToReceive.so_number}</h3>
                        <p className="py-4">The items will be returned to the warehouse: <strong>{soToReceive.Warehouse?.name}</strong>.</p>
                        <div className="modal-action">
                            <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={isReceivingSo}>Cancel</button>
                            <button type="button" onClick={handleConfirmSoReceipt} className="btn btn-success" disabled={isReceivingSo}>{isReceivingSo ? 'Processing...' : 'Confirm'}</button>
                        </div>
                    </div>
                </div>
            )}
            
            {showReportModal && (
                <ReportGeneratorModal<Warehouse>
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    data={sortedAndFilteredWarehouses}
                    columns={warehouseReportColumns}
                    title="Warehouse Report"
                    fileName="Warehouse_Report"
                    headerInfo={{ companyName: companyDetails?.name || 'Your Company' }}
                    footerInfo={{ appName: 'EriLinaERP' }}
                />
            )}
        </div>
    );
};

export default WarehouseManagementPage;