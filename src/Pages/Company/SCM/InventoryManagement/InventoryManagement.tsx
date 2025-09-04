import React, { useEffect, useState, useMemo } from 'react';
import {
  PlusCircle,
  Search,
  Printer,
  History,
  Grid,
  List,
  BarChart2,
} from 'lucide-react';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import { useNavigate, useParams } from 'react-router-dom';
import InventoryTable from '../../../../Components/SCM/InventoryManagement/InventoryTable';
import Pagination from '../../../../Components/Pagination';
import { InventoryItem } from '../../../../types/inventory';
import ReportGeneratorModal, { ReportColumn } from '../../../../Components/ReportGeneratorModal';
import { useNotification } from '../../../../Components/NotificationProvider';
import InventoryCard from '../../../../Components/SCM/InventoryManagement/InventoryCard';
import InventoryCharts from '../../../../Components/SCM/InventoryManagement/InventoryCharts';
import { URL_BESMCIM, URL_BESMCWM } from '../../../../Utils/Constants';
import { Warehouse } from '../../../../types/warehouse';


interface StockAdjustment {
  quantity: number;
  reason: string;
}

type SortColumn = keyof InventoryItem;

type ViewMode = 'table' | 'cards' | 'charts';

const InventoryManagementPage: React.FC = () => {
  const { showNotification } = useNotification();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'companyId' | 'Warehouse'>>({
    sku: '', name: '', description: '', category: '', currentStock: 0, unitOfMeasure: 'pcs',
    minStockLevel: 0, sellingPrice: 0, costPrice: 0, imageUrl: '', warehouseId: 0,
  });
  const [adjustmentData, setAdjustmentData] = useState<StockAdjustment>({ quantity: 0, reason: '' });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);

  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const [itemToDeleteName, setItemToDeleteName] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>(window.innerWidth < 768 ? 'cards' : 'table');

  const companyDetails = useCompanyDetails();
  const currencyCode = companyDetails?.currency_code || 'USD';
  const primaryColor = companyDetails?.primary_color || '#3b82f6';
  const textColor = '#ffffff';
  const companyID = companyDetails?.id;

  const navigate = useNavigate();
  const { company } = useParams<{ company: string }>();

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) {
            setViewMode('cards');
        } else {
            setViewMode('table');
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatNumber = (value: string | number): string => {
    const stringValue = typeof value === 'number' ? value.toString() : value || '';
    const sanitizedValue = stringValue.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = sanitizedValue.split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (decimalPart !== undefined) {
      return `${formattedIntegerPart}.${decimalPart}`;
    }

    return formattedIntegerPart;
  };

  const cleanNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, ''));
  };

  const fetchWarehouses = async () => {
    if (companyID === undefined || companyID === null) {
      return;
    }
    try {
      const response = await fetch(`${URL_BESMCWM}/api/${companyID}/warehouse`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        console.warn('Failed to fetch warehouses:', response.statusText);
        return;
      }

      const data: Warehouse[] = await response.json();
      setWarehouses(data.filter(w => w.isActive) || []);
    } catch (err) {
      console.warn('Error fetching warehouses:', err);
    }
  };

  const fetchItems = async () => {
    if (companyID === undefined || companyID === null) {
      setLoading(false);
      setItems([]);
      showNotification("Company ID not available. Cannot fetch inventory items.", 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${URL_BESMCIM}/api/companies/${companyID}/inventory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }
      const data: InventoryItem[] = await response.json();
      setItems(data);
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        showNotification(`Failed to connect to the backend server. Make sure your Golang server is running at ${URL_BESMCIM}/api and accessible. Failed to fetch inventory data: ${err.message}`, 'error');
      } else {
        showNotification(`An unknown error occurred while fetching inventory data.`, 'error');
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyID !== undefined && companyID !== null) {
      fetchItems();
      fetchWarehouses();
    } else {
      setLoading(true);
    }
  }, [companyID]);

  const naturalSort = (a: string, b: string): number => {
    const re = /(\d+)|(\D+)/g;
    const af = a.match(re);
    const bf = b.match(re);

    if (!af || !bf) {
      return a.localeCompare(b);
    }

    for (let i = 0; i < Math.min(af.length, bf.length); i++) {
      const aPart = af[i];
      const bPart = bf[i];

      const aNum = parseInt(aPart, 10);
      const bNum = parseInt(bPart, 10);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        if (aNum !== bNum) {
          return aNum - bNum;
        }
      } else {
        const cmp = aPart.localeCompare(bPart);
        if (cmp !== 0) {
          return cmp;
        }
      }
    }
    return af.length - bf.length;
  };

  const sortedAndFilteredItems = useMemo(() => {
    let tempItems = [...items];

    if (searchTerm) {
      tempItems = tempItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.Warehouse?.name && item.Warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterCategory) {
      tempItems = tempItems.filter(item => item.category === filterCategory);
    }

    if (filterStatus) {
      tempItems = tempItems.filter(item => item.status === filterStatus);
    }

    tempItems.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortColumn === 'name' || sortColumn === 'sku' || sortColumn === 'category' || sortColumn === 'status') {
          return sortDirection === 'asc' ? naturalSort(aValue, bValue) : naturalSort(bValue, aValue);
        } else {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (aValue === undefined || aValue === null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === undefined || bValue === null) return sortDirection === 'asc' ? -1 : 1;
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return tempItems;
  }, [items, searchTerm, filterCategory, filterStatus, sortColumn, sortDirection]);

  useEffect(() => {
    const categories = new Set<string>();
    const statuses = new Set<string>();
    items.forEach(item => {
      categories.add(item.category);
      statuses.add(item.status);
    });
    setUniqueCategories(Array.from(categories).sort());
    setUniqueStatuses(Array.from(statuses).sort());
  }, [items]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = itemsPerPage === sortedAndFilteredItems.length ? 0 : indexOfLastItem - itemsPerPage;
  const currentItems = itemsPerPage === sortedAndFilteredItems.length ? sortedAndFilteredItems : sortedAndFilteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name === 'sellingPrice' || name === 'costPrice') {
      const cleanedValue = cleanNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value === '' && name === 'warehouseId' ? 0 : value
      }));
    }
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value === '' && name === 'warehouseId' ? 0 : value
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanedValue = cleanNumber(value);
    setFormData(prev => ({
      ...prev,
      [name]: cleanedValue,
    }));
  };


  const handleAdjustmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setAdjustmentData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleAddItem = () => {
    setCurrentItem(null);
    setFormData({
      sku: '', name: '', description: '', category: '', currentStock: 0, unitOfMeasure: 'pcs',
      minStockLevel: 0, sellingPrice: 0, costPrice: 0, imageUrl: '', warehouseId: warehouses.length > 0 ? warehouses[0].id : 0
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setCurrentItem(item);
    setFormData({
      sku: item.sku, name: item.name, description: item.description, category: item.category,
      currentStock: item.currentStock, unitOfMeasure: item.unitOfMeasure, minStockLevel: item.minStockLevel,
      sellingPrice: item.sellingPrice, costPrice: item.costPrice, imageUrl: item.imageUrl,
      warehouseId: item.warehouseId
    });
    setIsModalOpen(true);
  };

  const handleAdjustStock = (item: InventoryItem) => {
    setCurrentItem(item);
    setAdjustmentData({ quantity: 0, reason: '' });
    setIsAdjustModalOpen(true);
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (companyID === undefined || companyID === null) {
      showNotification("Company ID is not available. Cannot save item.", 'error');
      return;
    }
    setLoading(true);

    try {
      let response;
      const itemDataToSend = {
        id: currentItem?.id || '',
        sku: formData.sku,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        currentStock: formData.currentStock,
        unitOfMeasure: formData.unitOfMeasure,
        minStockLevel: formData.minStockLevel,
        sellingPrice: formData.sellingPrice,
        costPrice: formData.costPrice,
        imageUrl: formData.imageUrl,
        warehouseId: Number(formData.warehouseId),
        companyId: companyID
      };

      if (currentItem) {
        response = await fetch(`${URL_BESMCIM}/api/companies/${companyID}/inventory/${currentItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(itemDataToSend),
          credentials: 'include'
        });
      } else {
        response = await fetch(`${URL_BESMCIM}/api/companies/${companyID}/inventory`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(itemDataToSend),
          credentials: 'include'
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${currentItem ? 'update' : 'add'} item.`);
      }

      showNotification(`Item successfully ${currentItem ? 'updated' : 'added'}!`, 'success');
      closeModal();
      fetchItems();
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        showNotification(`Failed to connect to the backend server. Make sure your Golang server is running at ${URL_BESMCIM}/api and accessible. Error: ${err.message}`, 'error');
      } else {
        showNotification(`An unknown error occurred.`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem || companyID === undefined || companyID === null) {
      showNotification("Company ID or current item is not available. Cannot adjust stock.", 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${URL_BESMCIM}/api/companies/${companyID}/inventory/${currentItem.id}/adjust`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adjustmentData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to adjust stock.');
      }

      showNotification('Stock successfully adjusted!', 'success');
      closeModal();
      fetchItems();
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        showNotification(`Failed to connect to the backend server. Make sure your Golang server is running at ${URL_BESMCIM}/api and accessible. Error: ${err.message}`, 'error');
      } else {
        showNotification(`An unknown error occurred.`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDeleteId(id);
    setItemToDeleteName(name);
    setShowDeleteConfirmModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAdjustModalOpen(false);
    setShowDeleteConfirmModal(false);
    setShowReportModal(false);
    setCurrentItem(null);
    setItemToDeleteId(null);
    setItemToDeleteName(null);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDeleteId || companyID === undefined || companyID === null) {
      showNotification("Company ID or item ID is not available. Cannot delete item.", 'error');
      closeModal();
      return;
    }

    setLoading(true);
    setShowDeleteConfirmModal(false);

    try {
      const response = await fetch(`${URL_BESMCIM}/api/companies/${companyID}/inventory/${itemToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item.');
      }

      showNotification('Item successfully deleted!', 'success');
      fetchItems();
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        showNotification(`Failed to connect to the backend server. Make sure your Golang server is running at ${URL_BESMCIM}/api and accessible. Error: ${err.message}`, 'error');
      } else {
        showNotification(`${err}`, 'error');
      }
    } finally {
      setLoading(false);
      setItemToDeleteId(null);
      setItemToDeleteName(null);
    }
  };

  const getStockStatusClass = (status: string): string => {
    switch (status) {
      case 'In Stock': return 'badge-success';
      case 'Low Stock': return 'badge-warning';
      case 'Out of Stock': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const inventoryReportColumns: ReportColumn<InventoryItem>[] = useMemo(() => [
    { header: 'SKU', key: 'sku', align: 'left' },
    { header: 'Product Name', key: 'name', align: 'left' },
    { header: 'Category', key: 'category', align: 'left' },
    { header: 'Current Stock', key: 'currentStock', align: 'right' },
    { header: 'Unit', key: 'unitOfMeasure', align: 'left' },
    {
      header: `Selling Price (${currencyCode})`,
      key: 'sellingPrice',
      align: 'right'
    },
    {
      header: `Average Cost (${currencyCode})`,
      key: 'costPrice',
      align: 'right'
    },
    {
      header: 'Warehouse',
      key: 'Warehouse',
      formatter: (value: InventoryItem[keyof InventoryItem]) => {
        const warehouse = value as InventoryItem['Warehouse'];
        return warehouse?.name || 'No Warehouse';
      },
      align: 'left'
    },
    {
      header: 'Status',
      key: 'status',
      formatter: (value: InventoryItem[keyof InventoryItem]) => value as string,
      align: 'center'
    },
    {
      header: 'Created At',
      key: 'createdAt',
      formatter: (value: InventoryItem[keyof InventoryItem]) => new Date(value as string).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      align: 'left'
    },
  ], [currencyCode]);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory Management</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <label className="input input-bordered flex items-center gap-2 rounded-md shadow-sm w-full md:w-auto focus-within:ring-2 focus-within:ring-blue-400">
            <input
              type="text"
              className="grow bg-transparent outline-none placeholder-gray-500 text-gray-800"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="text-gray-400" />
          </label>

          <select
            className="select select-bordered w-full md:w-auto rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            className="select select-bordered w-full md:w-auto rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            className={`btn rounded-md shadow-sm`}
            onClick={() => setViewMode('table')}
            style={viewMode === 'table' ? {
              backgroundColor: primaryColor,
              color: textColor,
              borderColor: primaryColor
            } : {}}
            aria-label="Table View"
          >
            <List size={20} />
          </button>
          <button
            className={`btn rounded-md shadow-sm`}
            onClick={() => setViewMode('cards')}
            style={viewMode === 'cards' ? {
              backgroundColor: primaryColor,
              color: textColor,
              borderColor: primaryColor
            } : {}}
            aria-label="Card View"
          >
            <Grid size={20} />
          </button>
          <button
            className={`btn rounded-md shadow-sm`}
            onClick={() => setViewMode('charts')}
            style={viewMode === 'charts' ? {
              backgroundColor: primaryColor,
              color: textColor,
              borderColor: primaryColor
            } : {}}
            aria-label="Chart View"
          >
            <BarChart2 size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="ml-2 text-gray-600">Loading inventory data...</p>
        </div>
      ) : (
        sortedAndFilteredItems.length === 0 && !searchTerm && !filterCategory && !filterStatus ? (
          <div className="card bg-base-100 shadow-xl rounded-lg p-6 text-center">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-gray-700">No Inventory Items Found</h2>
              <p className="text-gray-500 mt-2">You don't have any items in Inventory Management yet.</p>
              <p className="text-gray-500">Click "Add New Item" to get started!</p>
              <div className="card-actions justify-end mt-4">
                <button className="btn rounded-lg shadow-md" style={{ backgroundColor: primaryColor, color: textColor }} onClick={handleAddItem}>
                  <PlusCircle size={20} /> Add First Item
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'table' && (
              <InventoryTable
                items={currentItems}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                onEditItem={handleEditItem}
                onAdjustStock={handleAdjustStock}
                onDeleteItem={handleDeleteClick}
              />
            )}

            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentItems.map(item => (
                  <InventoryCard
                    key={item.id}
                    item={item}
                    currencyCode={currencyCode}
                    getStockStatusClass={getStockStatusClass}
                    onEditItem={handleEditItem}
                    onAdjustStock={handleAdjustStock}
                    onDeleteItem={handleDeleteClick}
                  />
                ))}
              </div>
            )}

            {viewMode === 'charts' && (
              <InventoryCharts
                items={sortedAndFilteredItems}
              />
            )}
            
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={sortedAndFilteredItems.length}
              currentPage={currentPage}
              onPageChange={paginate}
            />
          </>
        )
      )}

      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end space-y-3 z-50">
        <button
          className="btn btn-circle btn-md md:btn-lg shadow-xl"
          style={{ backgroundColor: primaryColor, color: textColor }}
          onClick={handleAddItem}
          aria-label="Add New Item"
        >
          <PlusCircle size={24} />
        </button>
        <button
          className="btn btn-circle btn-md md:btn-lg shadow-xl"
          style={{ backgroundColor: '#6c757d', color: textColor }}
          onClick={() => setShowReportModal(true)}
          aria-label="Print Report"
        >
          <Printer size={24} />
        </button>
        <button
          className="btn btn-circle btn-md md:btn-lg shadow-xl"
          style={{ backgroundColor: primaryColor, color: textColor }}
          onClick={() => navigate(`/${company}/inventory/transactions`)}
          aria-label="View Transactions"
        >
          <History size={24} />
        </button>
      </div>

      {isModalOpen && (
        <dialog id="item_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl rounded-lg shadow-xl">
            <h3 className="font-bold text-2xl mb-4 text-gray-800">{currentItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h3>
            <form onSubmit={handleSubmitItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="form-control w-full">
                <div className="label"><span className="label-text">Product SKU</span></div>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="Product SKU" className="input input-bordered w-full rounded-md" required />
              </label>
              <label className="form-control w-full">
                <div className="label"><span className="label-text">Product Name</span></div>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="input input-bordered w-full rounded-md" required />
              </label>
              <label className="form-control w-full md:col-span-2">
                <div className="label"><span className="label-text">Description</span></div>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product Description" className="textarea textarea-bordered h-24 rounded-md"></textarea>
              </label>
              <label className="form-control w-full">
                <div className="label"><span className="label-text">Category</span></div>
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="input input-bordered w-full rounded-md" />
              </label>
              <label className="form-control w-full">
                <div className="label"><span className="label-text">Current Stock</span></div>
                <input type="number" name="currentStock" value={formData.currentStock} onChange={handleNumericChange} placeholder="Current Stock" className="input input-bordered w-full rounded-md" required />
              </label>
              <label className="form-control w-full">
                <div className="label"><span className="label-text">Unit of Measure</span></div>
                <input type="text" name="unitOfMeasure" value={formData.unitOfMeasure} onChange={handleChange} placeholder="pcs, kg, liter" className="input input-bordered w-full rounded-md" />
              </label>
              <label className="form-control w-full">
                <div className="label"><span className="label-text">Minimum Stock Level</span></div>
                <input type="number" name="minStockLevel" value={formData.minStockLevel} onChange={handleNumericChange} placeholder="Min. Stock Level" className="input input-bordered w-full rounded-md" />
              </label>

              <label className="form-control w-full">
                <div className="label"><span className="label-text">Selling Price ({currencyCode})</span></div>
                <input
                  type="text"
                  name="sellingPrice"
                  value={formatNumber(formData.sellingPrice)}
                  onChange={handlePriceChange}
                  placeholder="Selling Price"
                  className="input input-bordered w-full rounded-md"
                />
              </label>

              <label className="form-control w-full">
                <div className="label"><span className="label-text">Average Cost ({currencyCode})</span></div>
                <input
                  type="text"
                  name="costPrice"
                  value={formatNumber(formData.costPrice)}
                  onChange={handlePriceChange}
                  placeholder="Average Cost"
                  className="input input-bordered w-full rounded-md"
                />
              </label>

              <label className="form-control w-full md:col-span-2">
                <div className="label"><span className="label-text">Image URL</span></div>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Product Image URL" className="input input-bordered w-full rounded-md" />
              </label>
              <label className="form-control w-full md:col-span-2">
                <div className="label"><span className="label-text">Warehouse</span></div>
                <select
                  name="warehouseId"
                  value={formData.warehouseId}
                  onChange={handleChange}
                  className="select select-bordered w-full rounded-md"
                >
                  <option value="">Select Warehouse (Optional)</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} - {warehouse.location}
                    </option>
                  ))}
                </select>
              </label>
              <div className="modal-action col-span-1 md:col-span-2 flex justify-end gap-2 mt-6">
                <button type="button" className="btn btn-ghost rounded-lg" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn rounded-lg" style={{ backgroundColor: primaryColor, color: textColor }}>
                  {loading ? <span className="loading loading-spinner"></span> : (currentItem ? 'Save Changes' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
      
      {isAdjustModalOpen && currentItem && (
        <dialog id="adjust_stock_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-lg rounded-lg shadow-xl">
            <h3 className="font-bold text-2xl mb-4 text-gray-800">Adjust Stock for {currentItem.name}</h3>
            <p className="mb-4 text-gray-600">Current Stock: <span className="font-semibold">{currentItem.currentStock} {currentItem.unitOfMeasure}</span></p>
            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <label className="form-control w-full">
                <div className="label"><span className="label-text">Adjustment Quantity</span></div>
                <input type="number" name="quantity" value={adjustmentData.quantity} onChange={handleAdjustmentChange} placeholder="Positive to add, negative to remove" className="input input-bordered w-full rounded-md" required />
              </label>
              <label className="form-control w-full">
                <div className="label"><span className="label-text">Reason for Adjustment</span></div>
                <textarea name="reason" value={adjustmentData.reason} onChange={handleAdjustmentChange} placeholder="e.g., Stock take, damage, etc." className="textarea textarea-bordered h-24 rounded-md" required></textarea>
              </label>
              <div className="modal-action flex justify-end gap-2 mt-6">
                <button type="button" className="btn btn-ghost rounded-lg" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn rounded-lg" style={{ backgroundColor: primaryColor, color: textColor }}>
                  {loading ? <span className="loading loading-spinner"></span> : 'Adjust Stock'}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {showReportModal && (
        <ReportGeneratorModal<InventoryItem>
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          data={sortedAndFilteredItems}
          columns={inventoryReportColumns}
          title="Inventory Report"
          fileName="Inventory_Report"
          headerInfo={{ companyName: companyDetails?.name || 'Your Company' }}
          footerInfo={{ appName: 'EriLinaERP' }}
          dateFilterKey="createdAt"
          currencyCode={currencyCode}
          inventoryManagement
          getStockStatusClass={getStockStatusClass}
        />
      )}

      {showDeleteConfirmModal && (
        <dialog id="delete_confirm_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-sm rounded-lg shadow-xl">
            <h3 className="font-bold text-2xl mb-4 text-gray-800">Confirm Deletion</h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete inventory item "
              <span className="font-semibold">{itemToDeleteName}</span>"?
              This action cannot be undone.
            </p>
            <div className="modal-action flex justify-end gap-2 mt-6">
              <button type="button" className="btn btn-ghost rounded-lg" onClick={closeModal}>Cancel</button>
              <button type="button" className="btn btn-error text-white rounded-lg" onClick={confirmDeleteItem}>
                {loading ? <span className="loading loading-spinner"></span> : 'Delete'}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default InventoryManagementPage;