import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PlusCircle, Search, Table, Printer, Grid, CheckCircle } from 'lucide-react';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import Pagination from '../../../../Components/Pagination';
import ReportGeneratorModal from '../../../../Components/ReportGeneratorModal';
import SalesOrderTable from '../../../../Components/SCM/SalesOrder/SalesOrderTable';
import SalesOrderTimeline from '../../../../Components/SCM/SalesOrder/SalesOrderTimeline';
import { Customer, SalesOrder, SalesOrderItem } from '../../../../types/salesOrder';
import { Warehouse } from '../../../../types/warehouse';
import { URL_BESMCIM, URL_BESMCSO, URL_BESMCWM } from '../../../../Utils/Constants';
import { useNotification } from '../../../../Components/NotificationProvider';
import SalesOrderReportModal from '../../../../Components/SCM/SalesOrder/SalesOrderReportModal';

interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    sellingPrice: number;
}

type CreateSalesOrderPayload = {
    customer_id: string;
    so_number: string;
    ship_date: string;
    notes: string;
    warehouse_id?: number;
    items: Array<{
        inventory_item_id: string;
        sku: string;
        item_name: string;
        quantity: number;
        unit_price: number;
        totalPrice: number;
    }>;
};

type SalesOrderFormData = {
    customerId: string;
    expectedShipDate: string;
    notes: string;
    warehouseId?: string;
    items: SalesOrderItem[];
    newCustomer?: {
        name: string;
        email: string;
        phone: string;
        geo_location: string;
        address: string;
    };
};

export type SortColumn = keyof SalesOrder | 'customer.name';

export type SalesOrderReportColumn = {
    header: string;
    key: string;
    align?: 'left' | 'center' | 'right';
    formatter?: (value: unknown, item: SalesOrder) => string;
};

const SalesOrderPage: React.FC = () => {
    const { showNotification } = useNotification();
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentSO, setCurrentSO] = useState<SalesOrder | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: string | null; name: string | null }>({ id: null, name: null });
    const [formData, setFormData] = useState<SalesOrderFormData>({
        customerId: '', expectedShipDate: '', notes: '', items: []
    });
    const [newStatus, setNewStatus] = useState<SalesOrder['status']>('Approved');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [sortColumn, setSortColumn] = useState<SortColumn>('orderDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'table' | 'timeline'>(window.innerWidth < 768 ? 'timeline' : 'table');
    const [isSingleSoReportModalOpen, setIsSingleSoReportModalOpen] = useState<boolean>(false);
    const [reportTargetSO, setReportTargetSO] = useState<SalesOrder | null>(null);
    const [soNumberPrefix, setSoNumberPrefix] = useState('SO-');
    const [soNumberSuffix, setSoNumberSuffix] = useState('');
    const [soNumberStartingNumber, setSoNumberStartingNumber] = useState('');
    const [dynamicSoNumberPreview, setDynamicSoNumberPreview] = useState('');
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';
    const secondaryColor = companyDetails?.secondary_color || '#10b981';
    const textColor = '#ffffff';

    const salesReportColumns: SalesOrderReportColumn[] = useMemo(() => [
        { header: 'SO Number', key: 'so_number', align: 'left' },
        { header: 'Customer', key: 'customer.name', align: 'left' },
        {
            header: 'Order Date',
            key: 'orderDate',
            formatter: (val: unknown) => {
                const dateString = typeof val === 'string' ? val : String(val);
                return new Date(dateString).toLocaleDateString();
            },
            align: 'left'
        },
        { header: 'Total Amount', key: 'totalAmount', formatter: (val) => `$${(val as number).toFixed(2)}`, align: 'right' },
        { header: 'Status', key: 'status', align: 'center' },
        {
            header: 'Items',
            key: 'items',
            align: 'left',
            formatter: (_val: unknown, so: SalesOrder) => {
                if (!so.items || so.items.length === 0) {
                    return 'No items';
                }
                return `<ul>${so.items.map(item =>
                    `<li>${item.item_name} (SKU: ${item.sku}) - Qty: ${item.quantity}, Unit Price: $${item.unit_price.toFixed(2)}</li>`
                ).join('')}</ul>`;
            },
        },
    ], []);

    const fetchSalesOrders = useCallback(async () => {
        if (!companyDetails?.id) return;
        setLoading(true);
        try {
            const response = await fetch(`${URL_BESMCSO}/api/companies/${companyDetails.id}/sales-orders/`, { credentials: 'include' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch sales orders');
            }
            const data: SalesOrder[] = await response.json();
            const mappedData = data.map(so => ({
                ...so,
                expectedShipDate: so.ship_date ? so.ship_date.split('T')[0] : '',
                customer_id: so.customer_id
            }));
            setSalesOrders(mappedData || []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification(String(err), 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [companyDetails?.id, showNotification]);

    const fetchDropdownData = useCallback(async () => {
        if (!companyDetails?.id) return;
        try {
            const custRes = await fetch(`${URL_BESMCSO}/api/companies/${companyDetails.id}/customers/`, { credentials: 'include' });
            if (!custRes.ok) {
                const errorData = await custRes.json();
                throw new Error(errorData.error || 'Failed to fetch customers');
            }
            const customersData = await custRes.json();
            setCustomers(customersData || []);
            const invRes = await fetch(`${URL_BESMCIM}/api/companies/${companyDetails.id}/inventory`, { credentials: 'include' });
            if (!invRes.ok) {
                const errorData = await invRes.json();
                throw new Error(errorData.error || 'Failed to fetch inventory items');
            }
            const inventoryData = await invRes.json();
            setInventoryItems(inventoryData || []);

            const whRes = await fetch(`${URL_BESMCWM}/api/${companyDetails.id}/warehouse`, { credentials: 'include' });
            if (!whRes.ok) {
                const errorData = await whRes.json();
                throw new Error(errorData.error || 'Failed to fetch warehouses');
            }
            const warehousesData = await whRes.json();
            setWarehouses(warehousesData || []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(`Failed to fetch dropdown data: ${err.message}`, 'error');
            } else {
                showNotification("Failed to fetch data for new SO form.", 'error');
            }
        }
    }, [companyDetails?.id, showNotification]);

    useEffect(() => {
        if (companyDetails?.id) {
            fetchSalesOrders();
            fetchDropdownData();
        }
    }, [companyDetails?.id, fetchSalesOrders, fetchDropdownData]);
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setViewMode('timeline');
            } else {
                setViewMode('table');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const formattedNumber = String(soNumberStartingNumber).padStart(3, '0');
        setDynamicSoNumberPreview(`${soNumberPrefix}${formattedNumber}${soNumberSuffix}`);
    }, [soNumberPrefix, soNumberSuffix, soNumberStartingNumber]);

    const sortedAndFilteredSOs = useMemo(() => {
        let tempSOs = [...salesOrders];
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            tempSOs = tempSOs.filter(so =>
                so.so_number.toLowerCase().includes(lowerTerm) ||
                so.customer.name.toLowerCase().includes(lowerTerm)
            );
        }
        if (filterStatus) {
            tempSOs = tempSOs.filter(so => so.status === filterStatus);
        }
        tempSOs.sort((a, b) => {
            const getVal = (obj: SalesOrder, col: SortColumn): string | number | undefined => {
                if (col === 'customer.name') return obj.customer?.name;
                const value = obj[col as keyof SalesOrder];
                if (typeof value === 'string' || typeof value === 'number') {
                    return value;
                }
                return undefined;
            };
            const aValue = getVal(a, sortColumn);
            const bValue = getVal(b, sortColumn);

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (aValue === undefined || bValue === undefined) return 0;
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        return tempSOs;
    }, [salesOrders, searchTerm, filterStatus, sortColumn, sortDirection]);

    const currentSOs = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return sortedAndFilteredSOs.slice(indexOfFirstItem, indexOfLastItem);
    }, [currentPage, itemsPerPage, sortedAndFilteredSOs]);

    const handleSort = (column: SortColumn) => {
        setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortColumn(column);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setIsStatusModalOpen(false);
        setIsDeleteModalOpen(false);
        setCurrentSO(null);
        setItemToDelete({ id: null, name: null });
        setIsNewCustomer(false);
    };

    const handleAddClick = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedToday = `${yyyy}-${mm}-${dd}`;

        setFormData({
            customerId: '',
            expectedShipDate: formattedToday,
            notes: '',
            warehouseId: warehouses.length > 0 ? String(warehouses[0].id) : '',
            items: [],
            newCustomer: { name: '', email: '', phone: '', geo_location: '', address: '' }
        });
        setIsAddModalOpen(true);
    };

    const handleRemoveItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleStatusClick = (so: SalesOrder) => {
        setCurrentSO(so);
        setNewStatus(so.status);
        setIsStatusModalOpen(true);
    };

    const handleDeleteClick = (so: SalesOrder) => {
        setItemToDelete({ id: so.id, name: so.so_number });
        setIsDeleteModalOpen(true);
    };

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { salesOrderId: '', inventory_item_id: '', quantity: 1, unit_price: 0, sku: '', item_name: '', totalPrice: 0, id: 0 }]
        }));
    };

    const handleItemChange = (index: number, field: keyof SalesOrderItem, value: string | number) => {
        const newItems = [...formData.items];
        const currentItem = { ...newItems[index] };

        if (field === 'quantity' || field === 'unit_price') {
            currentItem[field] = Number(value);
        } else if (field === 'inventory_item_id') {
            currentItem[field] = value as string;
            const selected = inventoryItems.find(i => i.id === value);
            if (selected) {
                currentItem.sku = selected.sku;
                currentItem.item_name = selected.name;
                currentItem.unit_price = selected?.sellingPrice || 0;
            } else {
                currentItem.sku = '';
                currentItem.item_name = '';
                currentItem.unit_price = 0;
            }
        } else {
            (currentItem as Record<keyof SalesOrderItem, string | number | undefined>)[field] = value;
        }

        newItems[index] = { ...currentItem, totalPrice: currentItem.quantity * currentItem.unit_price };
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const totalAmount = useMemo(() => {
        return formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    }, [formData.items]);


    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyDetails?.id) { showNotification("Company ID missing", 'error'); return; }

        if (!formData.expectedShipDate) {
            showNotification("Expected Delivery Date is required.", 'error');
            return;
        }

        const shipDate = new Date(formData.expectedShipDate);
        if (isNaN(shipDate.getTime())) {
            showNotification("Invalid Expected Delivery Date. Please enter a valid date.", 'error');
            return;
        }

        let customerId = formData.customerId;

        if (isNewCustomer && formData.newCustomer) {
            const newCustomerPayload = {
                name: formData.newCustomer.name,
                email: formData.newCustomer.email,
                phone: formData.newCustomer.phone,
                geo_location: formData.newCustomer.geo_location,
                address: formData.newCustomer.address,
            };

            try {
                const res = await fetch(`${URL_BESMCSO}/api/companies/${companyDetails.id}/customers/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCustomerPayload),
                    credentials: 'include'
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Failed to create new customer');
                }
                const newCustomer = await res.json();
                customerId = newCustomer.id;
                fetchDropdownData();
            } catch (err: unknown) {
                if (err instanceof Error) {
                    showNotification(`Error creating customer: ${err.message}`, 'error');
                }
                return;
            }
        }

        if (!customerId) {
            showNotification("Customer is required. Please select an existing customer or create a new one.", 'error');
            return;
        }

        if (formData.items.length === 0) {
            showNotification("At least one item is required for the Sales Order.", 'error');
            return;
        }

        for (const item of formData.items) {
            if (!item.inventory_item_id || item.quantity <= 0 || item.unit_price < 0) {
                showNotification("All line items must have a selected inventory item, a quantity greater than 0, and a unit price.", 'error');
                return;
            }
        }

        const payload: CreateSalesOrderPayload = {
            customer_id: customerId,
            so_number: dynamicSoNumberPreview,
            ship_date: shipDate.toISOString(),
            notes: formData.notes,
            warehouse_id: formData.warehouseId ? Number(formData.warehouseId) : undefined,
            items: formData.items.map(item => ({
                inventory_item_id: item.inventory_item_id,
                sku: item.sku,
                item_name: item.item_name,
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price),
                totalPrice: Number(item.unit_price) * Number(item.quantity)
            }))
        };

        try {
            const response = await fetch(`${URL_BESMCSO}/api/companies/${companyDetails.id}/sales-orders/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create Sales Order: ${response.statusText}`);
            }
            showNotification("Sales Order created successfully!", 'success');
            fetchSalesOrders();
            closeModal();
            setSoNumberStartingNumber(prev => String(Number(prev) + 1));
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification(String(err), 'error');
            }
        }
    };

    const confirmDeleteItem = async () => {
        if (!itemToDelete.id || !companyDetails?.id) return;
        setLoading(true);
        try {
            const response = await fetch(`${URL_BESMCSO}/api/companies/${companyDetails.id}/sales-orders/${itemToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete order: ${response.statusText}`);
            }
            showNotification(`Order "${itemToDelete.name}" deleted successfully.`, 'success');
            fetchSalesOrders();
            closeModal();
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification(String(err), 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!currentSO || !companyDetails?.id) return;
        try {
            const response = await fetch(`${URL_BESMCSO}/api/companies/${companyDetails.id}/sales-orders/${currentSO.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, warehouse_id: formData.warehouseId }),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to update status: ${response.statusText}`);
            }
            showNotification(`SO #${currentSO.so_number} status updated to ${newStatus}.`, 'success');
            fetchSalesOrders();
            closeModal();
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification(String(err), 'error');
            }
        }
    };

    const handleOpenSingleSoReport = (so: SalesOrder) => {
        setReportTargetSO(so);
        setIsSingleSoReportModalOpen(true);
    };

    const handleCloseSingleSoReport = () => {
        setIsSingleSoReportModalOpen(false);
        setReportTargetSO(null);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Sales Order Management</h1>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <input type="text" className="grow" placeholder="Search SO# or Customer" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <Search size={20} className="text-gray-400" />
                    </label>
                    <select className="select select-bordered w-full sm:w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All Statuses</option>
                        {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="btn text-white rounded-lg flex-1" style={{ backgroundColor: primaryColor }} onClick={handleAddClick}>
                        <PlusCircle size={20} /> New SO
                    </button>
                    <button className="btn text-white rounded-lg flex-1" style={{ backgroundColor: secondaryColor }} onClick={() => setShowReportModal(true)}>
                        <Printer size={20} /> Report
                    </button>
                </div>
            </div>

            <div className="hidden md:flex justify-end mb-6 mt-4">
                <div className="flex gap-2">
                    <button
                        className={`btn btn-sm ${viewMode === 'table' ? 'text-white' : 'btn-outline border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setViewMode('table')}
                        style={viewMode === 'table' ? { backgroundColor: primaryColor, color: textColor, borderColor: primaryColor } : {}}
                    >
                        <Table size={16} /> Table View
                    </button>
                    <button
                        className={`btn btn-sm ${viewMode === 'timeline' ? 'text-white' : 'btn-outline border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setViewMode('timeline')}
                        style={viewMode === 'timeline' ? { backgroundColor: primaryColor, color: textColor, borderColor: primaryColor } : {}}
                    >
                        <Grid size={16} /> Card View
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : salesOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <p>No Sales Orders found.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'table' ? (
                        <SalesOrderTable
                            salesOrders={currentSOs}
                            onSort={handleSort}
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            currencyCode={`${companyDetails?.currency_code}`}
                            onUpdateStatus={handleStatusClick}
                            onDelete={handleDeleteClick}
                            onGenerateSingleReport={handleOpenSingleSoReport}
                        />
                    ) : (
                        <SalesOrderTimeline
                            salesOrders={currentSOs}
                            currencyCode={`${companyDetails?.currency_code}`}
                            onUpdateStatus={handleStatusClick}
                            onDelete={handleDeleteClick}
                            onGenerateSingleReport={handleOpenSingleSoReport}
                        />
                    )}
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={sortedAndFilteredSOs.length}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            <dialog open={isAddModalOpen} className="modal modal-middle">
                <div className="modal-box w-11/12 max-w-4xl p-6 bg-white rounded-xl shadow-2xl">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800">Create New Sales Order</h3>
                        <button type="button" className="btn btn-sm btn-ghost p-1" onClick={closeModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <form onSubmit={handleCreateSubmit} className="py-6 space-y-8 max-h-[70vh] overflow-y-auto pr-4">
                        <div className="space-y-4">
                            <h4 className="text-xl font-semibold text-gray-700">Order Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="label text-sm font-medium text-gray-600">Customer</label>
                                    <div className="flex gap-2">
                                        <div className="flex-grow">
                                            {isNewCustomer ? (
                                                <div className="space-y-2">
                                                    <input type="text" placeholder="Name" className="input input-bordered w-full" value={formData.newCustomer?.name} onChange={(e) => setFormData(prev => ({...prev, newCustomer: {...prev.newCustomer!, name: e.target.value}}))} />
                                                    <input type="email" placeholder="Email" className="input input-bordered w-full" value={formData.newCustomer?.email} onChange={(e) => setFormData(prev => ({...prev, newCustomer: {...prev.newCustomer!, email: e.target.value}}))} />
                                                </div>
                                            ) : (
                                                <select className="select select-bordered w-full" value={formData.customerId} onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))} required>
                                                    <option value="" disabled>Select a customer</option>
                                                    {customers.map(cust => (<option key={cust.id} value={cust.id}>{cust.name}</option>))}
                                                </select>
                                            )}
                                        </div>
                                        <button type="button" className="btn btn-outline btn-ghost text-sm" onClick={() => setIsNewCustomer(!isNewCustomer)}>
                                            {isNewCustomer ? 'Existing' : 'New'}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="label text-sm font-medium text-gray-600">SO Number</label>
                                        <div className="flex space-x-2">
                                            <input type="text" placeholder="Prefix" className="input input-bordered w-1/4" value={soNumberPrefix} onChange={e => setSoNumberPrefix(e.target.value)} />
                                            <input type="text" placeholder="Start #" className="input input-bordered flex-grow" value={soNumberStartingNumber} onChange={e => setSoNumberStartingNumber(e.target.value)} />
                                            <input type="text" placeholder="Suffix" className="input input-bordered w-1/4" value={soNumberSuffix} onChange={e => setSoNumberSuffix(e.target.value)} />
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">Preview: <span className="font-semibold">{dynamicSoNumberPreview}</span></div>
                                    </div>
                                    <div>
                                        <label className="label text-sm font-medium text-gray-600">Expected Ship Date</label>
                                        <input type="date" name='expectedShipDate' className="input input-bordered w-full" value={formData.expectedShipDate} onChange={(e) => setFormData(prev => ({ ...prev, expectedShipDate: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="label text-sm font-medium text-gray-600">Warehouse</label>
                                        <select className="select select-bordered w-full" value={formData.warehouseId} onChange={(e) => setFormData(prev => ({ ...prev, warehouseId: e.target.value }))}>
                                            <option value="">No Warehouse</option>
                                            {warehouses.map(wh => (<option key={wh.id} value={wh.id}>{wh.name}</option>))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xl font-semibold text-gray-700">Order Items</h4>
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="table w-full">
                                    <thead><tr><th>Item</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {formData.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <select className="select select-bordered select-sm w-full" value={item.inventory_item_id} onChange={(e) => handleItemChange(index, 'inventory_item_id', e.target.value)}>
                                                        <option value="">Select</option>
                                                        {inventoryItems.map(invItem => (<option key={invItem.id} value={invItem.id}>{invItem.name}</option>))}
                                                    </select>
                                                </td>
                                                <td>{item.sku}</td>
                                                <td><input type="number" className="input input-bordered input-sm w-20" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} /></td>
                                                <td><input type="number" className="input input-bordered input-sm w-24" value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} /></td>
                                                <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
                                                <td><button type="button" onClick={() => handleRemoveItem(index)} className="btn btn-sm btn-error">Remove</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot><tr><td colSpan={4} className="text-right font-bold">Total:</td><td className="font-bold">${totalAmount.toFixed(2)}</td><td></td></tr></tfoot>
                                </table>
                            </div>
                            <button type="button" onClick={handleAddItem} className="btn btn-sm btn-outline btn-primary">Add Item</button>
                        </div>

                        <div className="space-y-2">
                            <label className="label text-sm font-medium text-gray-600">Notes</label>
                            <textarea className="textarea textarea-bordered w-full" placeholder="Add notes..." value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}></textarea>
                        </div>

                        <div className="modal-action mt-8 flex justify-end gap-3">
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary text-white" style={{ backgroundColor: primaryColor, borderColor: primaryColor }}>
                                Create Sales Order
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            <dialog open={isStatusModalOpen} className="modal">
                <div className="modal-box w-11/12 max-w-sm">
                    <h3 className="font-bold text-lg">Update Status for SO #{currentSO?.so_number}</h3>
                    <p className="py-4">Select the new status.</p>
                    <select className="select select-bordered w-full" value={newStatus} onChange={e => setNewStatus(e.target.value as SalesOrder['status'])}>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <div className="modal-action">
                        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-success text-white" onClick={handleStatusUpdate}><CheckCircle size={16} /> Save Status</button>
                    </div>
                </div>
            </dialog>

            <dialog open={isDeleteModalOpen} className="modal">
                <div className="modal-box w-11/12 max-w-sm">
                    <h3 className="font-bold text-lg">Confirm Deletion</h3>
                    <p className="py-4">Are you sure you want to delete Sales Order "{itemToDelete.name}"?</p>
                    <div className="modal-action">
                        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-error" onClick={confirmDeleteItem}>Delete</button>
                    </div>
                </div>
            </dialog>

            {showReportModal && (
                <ReportGeneratorModal<SalesOrder>
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    data={sortedAndFilteredSOs}
                    columns={salesReportColumns}
                    title="Sales Order Report"
                    fileName="Sales_Order_Report"
                    headerInfo={{ companyName: companyDetails?.name || 'Your Company' }}
                    footerInfo={{ appName: 'EriLinaERP' }}
                    dateFilterKey="orderDate"
                />
            )}

            {isSingleSoReportModalOpen && reportTargetSO && (
                <SalesOrderReportModal
                    isOpen={isSingleSoReportModalOpen}
                    onClose={handleCloseSingleSoReport}
                    salesOrder={reportTargetSO}
                />
            )}
        </div>
    );
};

export default SalesOrderPage;