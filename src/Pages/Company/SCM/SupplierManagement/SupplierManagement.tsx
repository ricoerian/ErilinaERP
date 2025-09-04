import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PlusCircle, Search, Printer, Table, Grid, Trash2, Plus } from 'lucide-react';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import SupplierTable from '../../../../Components/SCM/SupplierManagement/SupplierTable';
import SupplierCard from '../../../../Components/SCM/SupplierManagement/SupplierCard';
import Pagination from '../../../../Components/Pagination';
import ReportGeneratorModal, { ReportColumn } from '../../../../Components/ReportGeneratorModal';
import { URL_BESMCSM } from '../../../../Utils/Constants';
import { useNotification } from '../../../../Components/NotificationProvider';
import { ContactPerson, Supplier } from '../../../../types/supplier';

type SupplierFormData = {
    name: string;
    contactPersons: ContactPerson[];
    address: string;
    geo_location: string;
    status: 'Active' | 'Inactive';
};

type SortColumn = keyof Supplier;

interface ApiError {
    error: string;
}

const SupplierManagementPage: React.FC = () => {
    const { showNotification } = useNotification();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
    const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
    const [formData, setFormData] = useState<SupplierFormData>({
        name: '',
        contactPersons: [{ name: '', email: '', phone: '' }],
        address: '',
        geo_location: '',
        status: 'Active'
    });
    const [itemToDelete, setItemToDelete] = useState<{ id: string | null; name: string | null }>({
        id: null,
        name: null
    });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [sortColumn, setSortColumn] = useState<SortColumn>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';
    const secondaryColor = companyDetails?.secondary_color || '#10b981';
    const textColor = '#ffffff';

    // Fix the report columns type
    const supplierReportColumns: ReportColumn<Supplier>[] = useMemo(() => [
        { header: 'Name', key: 'name', align: 'left' },
        {
            header: 'Contact Persons',
            key: 'contactPersons',
            formatter: (value: Supplier[keyof Supplier]) => {
                const contacts = value as ContactPerson[];
                return contacts && contacts.length > 0
                    ? contacts.map(c => `${c.name} (${c.email})`).join(', ')
                    : 'No contacts';
            },
            align: 'left'
        },
        { header: 'Address', key: 'address', align: 'left' },
        { header: 'Geo Location', key: 'geo_location', align: 'left' },
        {
            header: 'Status',
            key: 'status',
            formatter: (value: Supplier[keyof Supplier]) => value as string,
            align: 'center'
        },
        {
            header: 'Created At',
            key: 'createdAt',
            formatter: (value: Supplier[keyof Supplier]) =>
                new Date(value as string).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }),
            align: 'left'
        },
    ], []);

    const sortedAndFilteredSuppliers = useMemo(() => {
        let tempSuppliers = [...suppliers];

        // Search filter
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            tempSuppliers = tempSuppliers.filter(s =>
                s.name?.toLowerCase().includes(lowercasedTerm) ||
                s.address?.toLowerCase().includes(lowercasedTerm) ||
                (s.contactPersons && Array.isArray(s.contactPersons) && s.contactPersons.some((cp: ContactPerson) =>
                    cp.name?.toLowerCase().includes(lowercasedTerm) ||
                    cp.email?.toLowerCase().includes(lowercasedTerm) ||
                    cp.phone?.toLowerCase().includes(lowercasedTerm)
                ))
            );
        }

        // Status filter
        if (filterStatus) {
            tempSuppliers = tempSuppliers.filter(s => s.status === filterStatus);
        }

        // Sorting - fix undefined values
        tempSuppliers.sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            // Handle undefined values
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
            if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return tempSuppliers;
    }, [suppliers, searchTerm, filterStatus, sortColumn, sortDirection]);

    const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'All') {
            setItemsPerPage(sortedAndFilteredSuppliers.length || 10);
        } else {
            setItemsPerPage(Number(value));
        }
        setCurrentPage(1);
    }, [sortedAndFilteredSuppliers.length]);

    const fetchSuppliers = useCallback(async () => {
        if (!companyDetails?.id) {
            showNotification("Company ID not available. Cannot fetch suppliers.", 'error');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${URL_BESMCSM}/api/${companyDetails.id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorBody: ApiError = await response.json();
                throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
            }

            const data: Supplier[] | null = await response.json();
            setSuppliers(data || []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(`Failed to fetch suppliers: ${err.message}`, 'error');
            } else {
                showNotification("An unknown error occurred while fetching suppliers.", 'error');
            }
            setSuppliers([]);
        } finally {
            setLoading(false);
        }
    }, [companyDetails?.id, showNotification]);

    useEffect(() => {
        if (companyDetails?.id) {
            fetchSuppliers();
        } else {
            setLoading(true);
        }
    }, [companyDetails?.id, fetchSuppliers]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSuppliers = sortedAndFilteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    // Sort handler
    const handleSort = (column: keyof Supplier) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setShowDeleteConfirmModal(false);
        setCurrentSupplier(null);
        setShowReportModal(false);
        setItemToDelete({ id: null, name: null });
    };

    const handleContactChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newContacts = [...formData.contactPersons];
        newContacts[index] = { ...newContacts[index], [name]: value };
        setFormData(prev => ({ ...prev, contactPersons: newContacts }));
    };

    const handleAddContact = () => {
        setFormData(prev => ({
            ...prev,
            contactPersons: [...prev.contactPersons, { name: '', email: '', phone: '' }]
        }));
    };

    const handleRemoveContact = (index: number) => {
        if (formData.contactPersons.length > 1) {
            const newContacts = [...formData.contactPersons];
            newContacts.splice(index, 1);
            setFormData(prev => ({ ...prev, contactPersons: newContacts }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddClick = () => {
        setCurrentSupplier(null);
        setFormData({
            name: '',
            contactPersons: [{ name: '', email: '', phone: '' }],
            address: '',
            geo_location: '',
            status: 'Active'
        });
        setIsModalOpen(true);
    };

    const handleEditClick = (supplier: Supplier) => {
        setCurrentSupplier(supplier);
        setFormData({
            name: supplier.name || '',
            contactPersons: (Array.isArray(supplier.contactPersons) && supplier.contactPersons.length > 0)
                ? supplier.contactPersons
                : [{ name: '', email: '', phone: '' }],
            address: supplier.address || '',
            geo_location: supplier.geo_location || '',
            status: supplier.status || 'Active'
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string, name: string) => {
        setItemToDelete({ id, name });
        setShowDeleteConfirmModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyDetails?.id) {
            showNotification("Company ID is missing.", 'error');
            return;
        }

        // Validate form data
        if (!formData.name?.trim()) {
            showNotification("Supplier name is required.", 'error');
            return;
        }

        // Filter out empty contacts
        const validContacts = formData.contactPersons?.filter((contact: ContactPerson) =>
            contact.name?.trim() || contact.email?.trim() || contact.phone?.trim()
        ) || [];

        const submitData = {
            ...formData,
            contactPersons: validContacts.length > 0 ? validContacts : []
        };

        setLoading(true);
        const url = currentSupplier
            ? `${URL_BESMCSM}/api/${companyDetails.id}/${currentSupplier.id}`
            : `${URL_BESMCSM}/api/${companyDetails.id}`;
        const method = currentSupplier ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
                credentials: 'include'
            });

            if (!response.ok) {
                const data: ApiError = await response.json();
                throw new Error(data.error || `Failed to ${currentSupplier ? 'update' : 'create'} supplier.`);
            }

            showNotification(`Supplier successfully ${currentSupplier ? 'updated' : 'created'}!`, 'success');
            await fetchSuppliers();
            closeModal();
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification("An unknown error occurred during the submission.", 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteItem = async () => {
        if (!itemToDelete.id || !companyDetails?.id) return;

        setLoading(true);
        try {
            const response = await fetch(`${URL_BESMCSM}/api/${companyDetails.id}/${itemToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const data: ApiError = await response.json();
                throw new Error(data.error || 'Failed to delete supplier.');
            }

            showNotification('Supplier successfully deleted!', 'success');
            await fetchSuppliers();
            closeModal();
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification(err.message, 'error');
            } else {
                showNotification("An unknown error occurred while deleting.", 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Supplier Management</h1>

            {/* Top Controls */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto flex-grow">
                    {/* Search Input */}
                    <label className="input input-bordered flex items-center gap-2 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-400 w-full md:w-auto flex-grow">
                        <input
                            type="text"
                            className="grow bg-transparent outline-none placeholder-gray-500 text-gray-800"
                            placeholder="Search by name, contact, or email"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <Search size={20} className="text-gray-400" />
                    </label>

                    {/* Status Filter */}
                    <select
                        className="select select-bordered w-full md:w-auto rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    {/* Items Per Page */}
                    <select
                        className="select select-bordered w-full md:w-auto rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        value={itemsPerPage === sortedAndFilteredSuppliers.length ? 'All' : itemsPerPage}
                        onChange={handleItemsPerPageChange}
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                        <option value="All">All</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 justify-end">
                    <button
                        className="btn rounded-lg shadow-sm text-white hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                        onClick={handleAddClick}
                    >
                        <PlusCircle size={20} /> Add Supplier
                    </button>
                    <button
                        className="btn rounded-lg shadow-sm text-white hover:opacity-90"
                        style={{ backgroundColor: secondaryColor }}
                        onClick={() => setShowReportModal(true)}
                    >
                        <Printer size={20} /> Generate Report
                    </button>
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex justify-end mb-6 mt-4">
                <div className="flex gap-2">
                    <button
                        className={`btn btn-sm ${viewMode === 'table' ? 'text-white' : 'btn-outline border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setViewMode('table')}
                        style={viewMode === 'table' ? {
                            backgroundColor: primaryColor,
                            color: textColor,
                            borderColor: primaryColor
                        } : {}}
                    >
                        <Table size={16} /> Table View
                    </button>
                    <button
                        className={`btn btn-sm ${viewMode === 'cards' ? 'text-white' : 'btn-outline border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setViewMode('cards')}
                        style={viewMode === 'cards' ? {
                            backgroundColor: primaryColor,
                            color: textColor,
                            borderColor: primaryColor
                        } : {}}
                    >
                        <Grid size={16} /> Card View
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {loading && suppliers.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-md">
                    <span className="loading loading-spinner loading-lg" style={{ color: primaryColor }}></span>
                    <p className="ml-2 text-gray-600 mt-2">Loading supplier data...</p>
                </div>
            ) : (
                <>
                    {sortedAndFilteredSuppliers.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-md">
                            <p className="text-gray-600 text-lg">No suppliers found.</p>
                            {searchTerm || filterStatus ? (
                                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
                            ) : null}
                        </div>
                    ) : (
                        viewMode === 'table' ? (
                            <SupplierTable
                                suppliers={currentSuppliers}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                                onSort={handleSort}
                                onEditSupplier={handleEditClick}
                                onDeleteSupplier={handleDeleteClick}
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {currentSuppliers.map(supplier => (
                                    <SupplierCard
                                        key={supplier.id}
                                        supplier={supplier}
                                        onEdit={handleEditClick}
                                        onDelete={handleDeleteClick}
                                    />
                                ))}
                            </div>
                        )
                    )}
                </>
            )}

            {/* Pagination Controls */}
            {sortedAndFilteredSuppliers.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={sortedAndFilteredSuppliers.length}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            )}

            {/* Modal for Add/Edit Supplier */}
            {isModalOpen && (
                <div className="modal modal-open fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
                    <div className="modal-box w-11/12 max-w-2xl bg-white p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-2xl text-gray-800 mb-4">
                            {currentSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            {/* Supplier Name */}
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text text-gray-700 font-semibold">Supplier Name *</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-blue-400"
                                    placeholder="Enter supplier name"
                                    required
                                />
                            </div>

                            {/* Dynamic Contact Person Fields */}
                            <div className="mb-4">
                                <label className="label">
                                    <span className="label-text text-gray-700 font-semibold">Contact Persons</span>
                                </label>
                                <div className="space-y-3">
                                    {formData.contactPersons.map((contact: ContactPerson, index: number) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-medium text-gray-600">
                                                    Contact {index + 1}
                                                </span>
                                                {formData.contactPersons.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveContact(index)}
                                                        className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-50"
                                                        title="Remove contact"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="label-text text-gray-600 text-sm">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={contact.name}
                                                        onChange={(e) => handleContactChange(index, e)}
                                                        className="input input-bordered input-sm w-full mt-1"
                                                        placeholder="Contact name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="label-text text-gray-600 text-sm">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={contact.email}
                                                        onChange={(e) => handleContactChange(index, e)}
                                                        className="input input-bordered input-sm w-full mt-1"
                                                        placeholder="email@example.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="label-text text-gray-600 text-sm">Phone</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={contact.phone}
                                                        onChange={(e) => handleContactChange(index, e)}
                                                        className="input input-bordered input-sm w-full mt-1"
                                                        placeholder="+1234567890"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddContact}
                                    className="btn btn-sm btn-outline mt-3 hover:bg-blue-50"
                                    style={{ borderColor: primaryColor, color: primaryColor }}
                                >
                                    <Plus size={16} /> Add Another Contact
                                </button>
                            </div>

                            {/* Address */}
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text text-gray-700 font-semibold">Address</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered h-24 rounded-md focus:ring-2 focus:ring-blue-400"
                                    placeholder="Enter supplier address"
                                ></textarea>
                            </div>

                            {/* Geo Location */}
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text text-gray-700 font-semibold">Geo Location</span>
                                </label>
                                <input
                                    type="text"
                                    name="geo_location"
                                    value={formData.geo_location}
                                    onChange={handleChange}
                                    className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-blue-400"
                                    placeholder="e.g., Jakarta, Indonesia or coordinates"
                                />
                            </div>

                            {/* Status */}
                            <div className="form-control w-full mb-6">
                                <label className="label">
                                    <span className="label-text text-gray-700 font-semibold">Status *</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="select select-bordered w-full rounded-md focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn btn-ghost rounded-md hover:bg-gray-100"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn text-white rounded-md hover:opacity-90"
                                    style={{ backgroundColor: primaryColor }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            {currentSupplier ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        currentSupplier ? 'Update Supplier' : 'Create Supplier'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
                    <div className="modal-box w-11/12 max-w-md bg-white p-6 rounded-lg shadow-lg relative">
                        <h3 className="font-bold text-xl text-gray-800 mb-4">Confirm Delete</h3>
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                            <Trash2 size={32} className="text-red-600" />
                        </div>
                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to delete supplier{' '}
                            <span className="font-semibold text-gray-800">"{itemToDelete.name}"</span>?
                            <br />
                            <span className="text-sm text-red-600 mt-2 block">
                                This action cannot be undone.
                            </span>
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="btn btn-ghost rounded-md hover:bg-gray-100"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteItem}
                                className="btn bg-red-500 text-white rounded-md hover:bg-red-600"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Supplier'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Generator Modal */}
            {showReportModal && (
                <ReportGeneratorModal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    data={sortedAndFilteredSuppliers}
                    columns={supplierReportColumns}
                    title="Supplier Report"
                    fileName="supplier_report"
                    headerInfo={{
                        companyName: companyDetails?.name || 'Your Company'
                    }}
                    footerInfo={{
                        appName: 'Supply Chain Management System'
                    }}
                />
            )}
        </div>
    );
};

export default SupplierManagementPage;