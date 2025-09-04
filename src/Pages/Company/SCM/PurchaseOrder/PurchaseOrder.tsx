import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PlusCircle, Search, Table, CheckCircle, Printer, Trash2, Grid } from 'lucide-react';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import { PurchaseOrder, PurchaseOrderItem } from '../../../../types/purchaseOrder';
import Pagination from '../../../../Components/Pagination';
import ReportGeneratorModal from '../../../../Components/ReportGeneratorModal';
import PurchaseOrderTable from '../../../../Components/SCM/PurchaseOrder/PurchaseOrderTable';
import PurchaseOrderTimeline from '../../../../Components/SCM/PurchaseOrder/PurchaseOrderTimeline';
import { URL_BESMCIM, URL_BESMCPO, URL_BESMCSM, URL_BESMCWM } from '../../../../Utils/Constants';
import { useNotification } from '../../../../Components/NotificationProvider';
import PurchaseOrderReportModal from '../../../../Components/SCM/PurchaseOrder/PurchaseOrderReportModal';
import { Supplier } from '../../../../types/supplier';
import { Warehouse } from '../../../../types/warehouse';

interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    averageCost: number;
}

type CreatePurchaseOrderPayload = {
    supplier_id: string;
    po_number: string;
    required_date: string;
    notes: string;
    warehouse_id?: number;
    items: Array<{
        inventory_item_id: string;
        sku: string;
        item_name: string;
        quantity: number;
        unit_price: number;
    }>;
};

type PurchaseOrderFormData = {
    supplierId: string;
    expectedDeliveryDate: string;
    notes: string;
    warehouseId?: string;
    items: PurchaseOrderItem[];
};

export type SortColumn = keyof PurchaseOrder | 'supplier.name';

export type PurchaseOrderReportColumn = {
    header: string;
    key: string;
    align?: 'left' | 'center' | 'right';
    formatter?: (value: unknown, item: PurchaseOrder) => string;
};


const PurchaseOrderPage: React.FC = () => {
    const { showNotification } = useNotification();
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPO, setCurrentPO] = useState<PurchaseOrder | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: string | null; name: string | null }>({ id: null, name: null });
    const [formData, setFormData] = useState<PurchaseOrderFormData>({
        supplierId: '', expectedDeliveryDate: '', notes: '', items: []
    });
    const [newStatus, setNewStatus] = useState<PurchaseOrder['status']>('Pending');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [sortColumn, setSortColumn] = useState<SortColumn>('orderDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'table' | 'timeline'>(window.innerWidth < 768 ? 'timeline' : 'table');
    const [poNumberPrefix, setPoNumberPrefix] = useState('PO-');
    const [poNumberSuffix, setPoNumberSuffix] = useState('');
    const [poNumberStartingNumber, setPoNumberStartingNumber] = useState('');
    const [dynamicPoNumberPreview, setDynamicPoNumberPreview] = useState('');
    const [isSinglePoReportModalOpen, setIsSinglePoReportModalOpen] = useState<boolean>(false);
    const [reportTargetPO, setReportTargetPO] = useState<PurchaseOrder | null>(null);
    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';
    const secondaryColor = companyDetails?.secondary_color || '#10b981';
    const textColor = '#ffffff';

    const purchaseReportColumns: PurchaseOrderReportColumn[] = useMemo(() => [
        { header: 'PO Number', key: 'po_number', align: 'left' },
        { header: 'Supplier', key: 'supplier.name', align: 'left' },
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
            formatter: (_val: unknown, po: PurchaseOrder) => {
                if (!po.items || po.items.length === 0) {
                    return 'No items';
                }
                return `<ul>${po.items.map(item =>
                    `<li>${item.itemName} (SKU: ${item.sku}) - Qty: ${item.quantity}, Unit Price: $${item.unit_price.toFixed(2)}</li>`
                ).join('')}</ul>`;
            },
        },
    ], []);

    const fetchPurchaseOrders = useCallback(async () => {
        if (!companyDetails?.id) return;
        setLoading(true);
        try {
            const response = await fetch(`${URL_BESMCPO}/api/companies/${companyDetails.id}/purchase-orders`, { credentials: 'include' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch purchase orders');
            }
            const data: PurchaseOrder[] = await response.json();
            const mappedData = data.map(po => ({
                ...po,
                expectedDeliveryDate: po.required_date ? po.required_date.split('T')[0] : '',
                supplierId: po.supplier_id
            }));
            setPurchaseOrders(mappedData || []);
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
            const supRes = await fetch(`${URL_BESMCSM}/api/${companyDetails.id}`, { credentials: 'include' });
            if (!supRes.ok) {
                const errorData = await supRes.json();
                throw new Error(errorData.error || 'Failed to fetch suppliers');
            }
            const suppliersData = await supRes.json();
            setSuppliers(suppliersData || []);

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
                showNotification("Failed to fetch data for new PO form.", 'error');
            }
        }
    }, [companyDetails?.id, showNotification]);

    useEffect(() => {
        if (companyDetails?.id) {
            fetchPurchaseOrders();
            fetchDropdownData();
        }
    }, [companyDetails?.id, fetchPurchaseOrders, fetchDropdownData]);

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
        const formattedNumber = String(poNumberStartingNumber).padStart(3, '0');
        setDynamicPoNumberPreview(`${poNumberPrefix}${formattedNumber}${poNumberSuffix}`);
    }, [poNumberPrefix, poNumberSuffix, poNumberStartingNumber]);


    const sortedAndFilteredPOs = useMemo(() => {
        let tempPOs = [...purchaseOrders];
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            tempPOs = tempPOs.filter(po =>
                po.po_number.toLowerCase().includes(lowerTerm) ||
                po.supplier.name.toLowerCase().includes(lowerTerm)
            );
        }
        if (filterStatus) {
            tempPOs = tempPOs.filter(po => po.status === filterStatus);
        }
        tempPOs.sort((a, b) => {
            const getVal = (obj: PurchaseOrder, col: SortColumn): string | number | undefined => {
                if (col === 'supplier.name') return obj.supplier.name;
                const value = obj[col as keyof PurchaseOrder];
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
        return tempPOs;
    }, [purchaseOrders, searchTerm, filterStatus, sortColumn, sortDirection]);

    const currentPOs = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return sortedAndFilteredPOs.slice(indexOfFirstItem, indexOfLastItem);
    }, [currentPage, itemsPerPage, sortedAndFilteredPOs]);

    const handleSort = (column: SortColumn) => {
        setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortColumn(column);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setIsStatusModalOpen(false);
        setIsDeleteModalOpen(false);
        setCurrentPO(null);
        setItemToDelete({ id: null, name: null });
    };

    const handleAddClick = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedToday = `${yyyy}-${mm}-${dd}`;

        setFormData({
            supplierId: '',
            expectedDeliveryDate: formattedToday,
            notes: '',
            warehouseId: warehouses.length > 0 ? String(warehouses[0].id) : '',
            items: []
        });
        setIsAddModalOpen(true);
    };

    const handleRemoveItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleStatusClick = (po: PurchaseOrder) => {
        setCurrentPO(po);
        setNewStatus(po.status);
        setIsStatusModalOpen(true);
    };

    const handleDeleteClick = (po: PurchaseOrder) => {
        setItemToDelete({ id: po.id, name: po.po_number });
        setIsDeleteModalOpen(true);
    };

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { inventoryItemId: '', quantity: 1, unit_price: 0, sku: '', itemName: '', totalPrice: 0 }]
        }));
    };

    const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
        const newItems = [...formData.items];
        const currentItem = { ...newItems[index] };

        if (field === 'quantity' || field === 'unit_price') {
            currentItem[field] = Number(value);
        } else if (field === 'inventoryItemId') {
            currentItem[field] = value as string;
            const selected = inventoryItems.find(i => i.id === value);
            if (selected) {
                currentItem.sku = selected.sku;
                currentItem.itemName = selected.name;
                currentItem.unit_price = selected.averageCost;
            } else {
                currentItem.sku = '';
                currentItem.itemName = '';
                currentItem.unit_price = 0;
            }
        } else {
            (currentItem as Record<keyof PurchaseOrderItem, string | number | undefined>)[field] = value;
        }

        newItems[index] = currentItem;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const totalAmount = useMemo(() => {
        return formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    }, [formData.items]);


    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyDetails?.id) { showNotification("Company ID missing", 'error'); return; }

        if (!formData.expectedDeliveryDate) {
            showNotification("Expected Delivery Date is required.", 'error');
            return;
        }

        const deliveryDate = new Date(formData.expectedDeliveryDate);
        if (isNaN(deliveryDate.getTime())) {
            showNotification("Invalid Expected Delivery Date. Please enter a valid date.", 'error');
            return;
        }

        if (!formData.supplierId) {
            showNotification("Supplier is required. Please select a supplier from the list.", 'error');
            return;
        }

        if (formData.items.length === 0) {
            showNotification("At least one item is required for the Purchase Order.", 'error');
            return;
        }
        for (const item of formData.items) {
            if (!item.inventoryItemId || item.quantity <= 0 || item.unit_price < 0) {
                showNotification("All line items must have a selected inventory item, a quantity greater than 0, and a unit price.", 'error');
                return;
            }
        }

        const payload: CreatePurchaseOrderPayload = {
            supplier_id: formData.supplierId,
            po_number: dynamicPoNumberPreview,
            required_date: deliveryDate.toISOString(),
            notes: formData.notes,
            warehouse_id: Number(formData.warehouseId),
            items: formData.items.map(item => ({
                inventory_item_id: item.inventoryItemId,
                sku: item.sku,
                item_name: item.itemName,
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price),
            }))
        };

        try {
            const response = await fetch(`${URL_BESMCPO}/api/companies/${companyDetails.id}/purchase-orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create Purchase Order: ${response.statusText}`);
            }
            showNotification("Purchase Order created successfully!", 'success');
            fetchPurchaseOrders();
            closeModal();
            setPoNumberStartingNumber(prev => String(Number(prev) + 1));
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
            const response = await fetch(`${URL_BESMCPO}/api/companies/${companyDetails.id}/purchase-orders/${itemToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete order: ${response.statusText}`);
            }

            showNotification(`Order "${itemToDelete.name}" deleted successfully.`, 'success');
            fetchPurchaseOrders();
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
        if (!currentPO || !companyDetails?.id) return;
        try {
            const response = await fetch(`${URL_BESMCPO}/api/companies/${companyDetails.id}/purchase-orders/${currentPO.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, warehouse_id: formData.warehouseId }),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to update status: ${response.statusText}`);
            }
            showNotification(`PO #${currentPO.po_number} status updated to ${newStatus}.`, 'success');
            fetchPurchaseOrders();
            closeModal();
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification(String(err), 'error');
            }
        }
    };

    const handleOpenSinglePoReport = (po: PurchaseOrder) => {
        setReportTargetPO(po);
        setIsSinglePoReportModalOpen(true);
    };

    const handleCloseSinglePoReport = () => {
        setIsSinglePoReportModalOpen(false);
        setReportTargetPO(null);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Purchase Order Management</h1>

            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <input type="text" className="grow" placeholder="Search PO# or Supplier" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <Search size={20} className="text-gray-400" />
                    </label>
                    <select
                        className="select select-bordered w-full sm:w-auto"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="btn text-white rounded-lg flex-1" style={{ backgroundColor: primaryColor }} onClick={handleAddClick}>
                        <PlusCircle size={20} /> New PO
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
                <div className="text-center p-10"><span className="loading loading-spinner loading-lg"></span></div>
            ) : sortedAndFilteredPOs.length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">No Purchase Orders Found</h2>
                    <p>Try adjusting your search or create a new purchase order.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'table' ? (
                        <PurchaseOrderTable
                            purchaseOrders={currentPOs}
                            onSort={handleSort}
                            sortColumn={sortColumn}
                            currencyCode={`${companyDetails?.currency_code}`}
                            sortDirection={sortDirection}
                            onUpdateStatus={handleStatusClick}
                            onDelete={handleDeleteClick}
                            onGenerateSingleReport={handleOpenSinglePoReport}
                        />
                    ) : (
                        <PurchaseOrderTimeline
                            purchaseOrders={currentPOs}
                            currencyCode={`${companyDetails?.currency_code}`}
                            onUpdateStatus={handleStatusClick}
                            onDelete={handleDeleteClick}
                            onGenerateSingleReport={handleOpenSinglePoReport}
                        />
                    )}
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={sortedAndFilteredPOs.length}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {isAddModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-2xl mb-4 text-gray-800">Create New Purchase Order</h3>
                        <form onSubmit={handleCreateSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <h4 className="font-semibold text-lg mb-3 text-gray-700">PO Number Pattern</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="form-control">
                                        <div className="label"><span className="label-text">Prefix</span></div>
                                        <input type="text" value={poNumberPrefix} onChange={(e) => setPoNumberPrefix(e.target.value)} className="input input-bordered w-full" />
                                    </label>
                                    <label className="form-control">
                                        <div className="label"><span className="label-text">Starting Number</span></div>
                                        <input type="text" value={poNumberStartingNumber} onChange={(e) => setPoNumberStartingNumber(e.target.value)} className="input input-bordered w-full" />
                                    </label>
                                    <label className="form-control">
                                        <div className="label"><span className="label-text">Suffix</span></div>
                                        <input type="text" value={poNumberSuffix} onChange={(e) => setPoNumberSuffix(e.target.value)} className="input input-bordered w-full" />
                                    </label>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
                                    <p className="font-medium">Preview: <span className="text-xl font-bold">{dynamicPoNumberPreview}</span></p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <h4 className="font-semibold text-lg mb-3 text-gray-700">Order Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="form-control">
                                        <div className="label"><span className="label-text">Supplier</span></div>
                                        <select name="supplierId" value={formData.supplierId} onChange={e => setFormData({ ...formData, supplierId: e.target.value })} className="select select-bordered w-full" required>
                                            <option disabled value="">Select Supplier</option>
                                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </label>
                                    <label className="form-control">
                                        <div className="label"><span className="label-text">Expected Delivery Date</span></div>
                                        <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={e => setFormData({ ...formData, expectedDeliveryDate: e.target.value })} className="input input-bordered w-full" required />
                                    </label>
                                </div>
                                <div className="form-control w-full my-4">
                                    <label className="label"><span className="label-text">Warehouse</span></label>
                                    <select className="select select-bordered w-full" value={formData.warehouseId} onChange={(e) => setFormData(prev => ({ ...prev, warehouseId: e.target.value }))} required>
                                        <option value="" disabled>Select a warehouse</option>
                                        {warehouses.map(warehouse => (<option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>))}
                                    </select>
                                </div>
                                <label className="form-control mt-4">
                                    <div className="label"><span className="label-text">Notes</span></div>
                                    <textarea name="notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="textarea textarea-bordered w-full h-24"></textarea>
                                </label>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <h4 className="font-semibold text-lg mb-3 text-gray-700">Line Items</h4>
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead>
                                        <tbody>
                                            {formData.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <select value={item.inventoryItemId} onChange={e => handleItemChange(index, 'inventoryItemId', e.target.value)} className="select select-bordered select-sm w-full" required>
                                                            <option value="">Select</option>
                                                            {inventoryItems.map(inv => <option key={inv.id} value={inv.id}>{inv.name}</option>)}
                                                        </select>
                                                    </td>
                                                    <td><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} className="input input-bordered input-sm w-20 text-center" min="1" required /></td>
                                                    <td><input type="text" value={item.unit_price.toLocaleString()} className="input input-bordered input-sm w-24 text-right bg-gray-200" readOnly /></td>
                                                    <td className="text-right font-medium">{(item.quantity * item.unit_price).toLocaleString()}</td>
                                                    <td><button type="button" onClick={() => handleRemoveItem(index)} className="btn btn-xs btn-error btn-square"><Trash2 size={12} /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <button type="button" onClick={handleAddItem} className="btn btn-sm btn-outline">Add Item</button>
                                    <div className="text-lg font-bold">Total: <span className="text-success">{totalAmount.toLocaleString()}</span></div>
                                </div>
                            </div>
                        </form>
                        <div className="modal-action mt-4 pt-4 border-t">
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" form="create-po-form" className="btn text-white" style={{ backgroundColor: primaryColor }}>Create PO</button>
                        </div>
                    </div>
                </dialog>
            )}

            {isStatusModalOpen && currentPO && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-sm">
                        <h3 className="font-bold text-lg">Update Status for PO #{currentPO.po_number}</h3>
                        <p className="py-4">Select the new status.</p>
                        <select className="select select-bordered w-full" value={newStatus} onChange={e => setNewStatus(e.target.value as PurchaseOrder['status'])}>
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
            )}

            {isDeleteModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-sm">
                        <h3 className="font-bold text-lg">Confirm Deletion</h3>
                        <p className="py-4">Are you sure you want to delete PO "{itemToDelete.name}"?</p>
                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button className="btn btn-error" onClick={confirmDeleteItem} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
                        </div>
                    </div>
                </dialog>
            )}

            {showReportModal && (
                <ReportGeneratorModal<PurchaseOrder>
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    data={sortedAndFilteredPOs}
                    columns={purchaseReportColumns}
                    title="Purchase Order Report"
                    fileName="Purchase_Order_Report"
                    headerInfo={{ companyName: companyDetails?.name || 'Your Company' }}
                    footerInfo={{ appName: 'EriLinaERP' }}
                    dateFilterKey="orderDate"
                />
            )}

            {isSinglePoReportModalOpen && reportTargetPO && (
                <PurchaseOrderReportModal
                    isOpen={isSinglePoReportModalOpen}
                    onClose={handleCloseSinglePoReport}
                    purchaseOrder={reportTargetPO}
                />
            )}
        </div>
    );
};

export default PurchaseOrderPage;