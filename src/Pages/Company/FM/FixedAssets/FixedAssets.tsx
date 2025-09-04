import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PlusCircle, Trash2, Edit, BarChart, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import { useNotification } from '../../../../Components/NotificationProvider';
import { URL_BEFMFA, URL_BEFMGL } from '../../../../Utils/Constants';
import { FixedAsset } from '../../../../types/fixedAssets';
import { Account } from '../../../../types/generalLedger';
import Pagination from '../../../../Components/Pagination';
import DepreciationModal from '../../../../Components/FM/FixedAssets/DepreciationModal';

type SortColumn = keyof FixedAsset;

const SortIndicator: React.FC<{ direction: 'asc' | 'desc' | null }> = ({ direction }) => {
    if (!direction) return <ChevronUp size={14} className="text-gray-400" />;
    return direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
};

const EmptyState: React.FC<{ onAddNew: () => void, primaryColor: string }> = ({ onAddNew, primaryColor }) => (
    <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
        <BarChart size={48} className="mx-auto text-gray-400" />
        <h3 className="mt-4 text-xl font-semibold text-gray-700">No Assets Found</h3>
        <p className="mt-2 text-gray-500">Get started by registering your first fixed asset.</p>
        <div className="mt-6">
            <button className="btn text-white" style={{ backgroundColor: primaryColor }} onClick={onAddNew}>
                <PlusCircle size={20} /> Register New Asset
            </button>
        </div>
    </div>
);

const FixedAssetsPage: React.FC = () => {
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';
    const companyID = companyDetails?.id;

    const [assets, setAssets] = useState<FixedAsset[]>([]);
    const [glAccounts, setGlAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDepreciationModalOpen, setIsDepreciationModalOpen] = useState(false);
    
    const [currentItem, setCurrentItem] = useState<FixedAsset | null>(null);
    const [assetToDelete, setAssetToDelete] = useState<FixedAsset | null>(null);
    const [assetForSimulation, setAssetForSimulation] = useState<FixedAsset | null>(null);
    const [formData, setFormData] = useState<Partial<FixedAsset>>({});

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [sortColumn, setSortColumn] = useState<SortColumn>('acquisitionDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const fetchData = useCallback(async () => {
        if (!companyID) return;
        setLoading(true);
        try {
            const [assetsRes, accountsRes] = await Promise.all([
                fetch(`${URL_BEFMFA}/api/companies/${companyID}/fixed-assets`, { credentials: 'include' }),
                fetch(`${URL_BEFMGL}/api/companies/${companyID}/accounts`, { credentials: 'include' })
            ]);
            if (!assetsRes.ok) throw new Error('Failed to fetch fixed assets.');
            if (!accountsRes.ok) throw new Error('Failed to fetch GL accounts.');
            
            const assetsData = await assetsRes.json();
            const accountsData = await accountsRes.json();

            setAssets(assetsData || []);
            setGlAccounts(accountsData || []);
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    }, [companyID, showNotification]);

    useEffect(() => {
        if (companyID) fetchData();
    }, [companyID, fetchData]);

    const handleAddClick = () => {
        setCurrentItem(null);
        setFormData({
            name: '', description: '', acquisitionDate: new Date().toISOString().split('T')[0],
            acquisitionCost: 0, depreciationMethod: 'Straight Line', usefulLifeInMonths: 60,
            salvageValue: 0, assetAccountId: 0, accumulatedDepreciationAccountId: 0,
            depreciationExpenseAccountId: 0, imageUrl: ''
        });
        setIsModalOpen(true);
    };

    const handleEditClick = (asset: FixedAsset) => {
        setCurrentItem(asset);
        setFormData(asset);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (asset: FixedAsset) => {
        setAssetToDelete(asset);
        setIsDeleteModalOpen(true);
    };
    
    const handleSimulationClick = (asset: FixedAsset) => {
        setAssetForSimulation(asset);
        setIsDepreciationModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!assetToDelete || !companyID) return;
        try {
            const response = await fetch(`${URL_BEFMFA}/api/companies/${companyID}/fixed-assets/${assetToDelete.ID}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete asset.');
            showNotification('Asset deleted successfully!', 'success');
            fetchData();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred', 'error');
        } finally {
            setIsDeleteModalOpen(false);
            setAssetToDelete(null);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyID || !formData) return;

        const url = currentItem
            ? `${URL_BEFMFA}/api/companies/${companyID}/fixed-assets/${currentItem.ID}`
            : `${URL_BEFMFA}/api/companies/${companyID}/fixed-assets`;
        
        const method = currentItem ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to save asset.');
            showNotification(`Asset ${currentItem ? 'updated' : 'created'} successfully!`, 'success');
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred', 'error');
        }
    };

    const sortedAndFilteredAssets = useMemo(() => {
        return [...assets]
            .filter(asset => asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                 const aVal = a[sortColumn];
                 const bVal = b[sortColumn];
                 if (typeof aVal === 'string' && typeof bVal === 'string') return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                 if (typeof aVal === 'number' && typeof bVal === 'number') return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
                 return 0;
            });
    }, [assets, searchTerm, sortColumn, sortDirection]);

    const paginatedAssets = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAndFilteredAssets.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedAndFilteredAssets, currentPage, itemsPerPage]);

    const handleSort = (column: SortColumn) => {
        setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortColumn(column);
    };

    const renderSortableHeader = (column: SortColumn, title: string, alignment: string = 'text-left') => (
        <th className={`cursor-pointer ${alignment}`} onClick={() => handleSort(column)}>
            <div className={`flex items-center gap-2 ${alignment === 'text-right' ? 'justify-end' : ''}`}>
                <span>{title}</span>
                <SortIndicator direction={sortColumn === column ? sortDirection : null} />
            </div>
        </th>
    );

    return (
        <div className="p-4 md:p-6 bg-base-200 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Fixed Asset Management</h1>
                <p className="text-gray-500 mt-1">Monitor, manage, and depreciate your company's valuable assets.</p>
            </div>

            <div className="card w-full bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name or code..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="input input-bordered w-full md:w-64 pl-10" 
                            />
                        </div>
                        <button className="btn text-white w-full md:w-auto" style={{ backgroundColor: primaryColor }} onClick={handleAddClick}>
                            <PlusCircle size={20} /> Register New Asset
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="text-center p-10"><span className="loading loading-spinner loading-lg"></span></div>
                    ) : paginatedAssets.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            {renderSortableHeader('assetCode', 'Asset Code')}
                                            {renderSortableHeader('name', 'Name')}
                                            {renderSortableHeader('acquisitionDate', 'Acquisition Date')}
                                            {renderSortableHeader('acquisitionCost', 'Acquisition Cost', 'text-right')}
                                            {renderSortableHeader('status', 'Status', 'text-center')}
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedAssets.map(asset => (
                                            <tr key={asset.ID} className="hover">
                                                <td>
                                                    <div className="avatar">
                                                        <div className="w-12 h-12 rounded-lg">
                                                            <img 
                                                                src={asset.imageUrl || `https://ui-avatars.com/api/?name=${asset.name.replace(/\s/g, '+')}&background=random&color=fff`} 
                                                                alt={asset.name}
                                                                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${asset.name.replace(/\s/g, '+')}&background=random&color=fff`; }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="font-mono text-sm">{asset.assetCode}</td>
                                                <td className="font-semibold">{asset.name}</td>
                                                <td>{new Date(asset.acquisitionDate).toLocaleDateString()}</td>
                                                <td className="text-right font-mono">{asset.acquisitionCost.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</td>
                                                <td className="text-center"><span className={`badge ${asset.status === 'Active' ? 'badge-success' : 'badge-ghost'} badge-sm`}>{asset.status}</span></td>
                                                <td className="text-center">
                                                    <div className="tooltip" data-tip="Simulate Depreciation"><button onClick={() => handleSimulationClick(asset)} className="btn btn-xs btn-ghost"><BarChart size={16} /></button></div>
                                                    <div className="tooltip" data-tip="Edit Asset"><button onClick={() => handleEditClick(asset)} className="btn btn-xs btn-ghost"><Edit size={16} /></button></div>
                                                    <div className="tooltip" data-tip="Delete Asset"><button onClick={() => handleDeleteClick(asset)} className="btn btn-xs btn-ghost text-error"><Trash2 size={16} /></button></div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                <select
                                    className="select select-bordered select-sm"
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                >
                                    <option value={10}>10 per page</option>
                                    <option value={20}>20 per page</option>
                                    <option value={50}>50 per page</option>
                                </select>
                                <Pagination
                                    itemsPerPage={itemsPerPage}
                                    totalItems={sortedAndFilteredAssets.length}
                                    currentPage={currentPage}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    ) : (
                        <EmptyState onAddNew={handleAddClick} primaryColor={primaryColor} />
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-4xl">
                        <h3 className="font-bold text-lg">{currentItem ? 'Edit' : 'Register'} Fixed Asset</h3>
                        <form onSubmit={handleSubmit} className="py-4 space-y-6">
                            <div>
                                <h4 className="font-semibold text-md mb-2 border-b pb-1">Asset Details</h4>
                                <div className="flex flex-col md:flex-row gap-6 mt-4">
                                    <div className="w-full md:w-1/3">
                                        <span className="label-text">Image Preview</span>
                                        <div className="mt-1 w-full aspect-square bg-base-200 rounded-lg flex items-center justify-center overflow-hidden">
                                            <img 
                                                key={formData.imageUrl}
                                                src={formData.imageUrl || `https://ui-avatars.com/api/?name=?&background=e0e0e0&color=a0a0a0`}
                                                alt="Asset Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=?&background=e0e0e0&color=a0a0a0`; }}
                                            />
                                        </div>
                                        <label className="form-control w-full mt-2">
                                            <span className="label-text">Image URL</span>
                                            <input 
                                                type="text" 
                                                value={formData.imageUrl || ''} 
                                                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                                                className="input input-bordered" 
                                                placeholder="https://example.com/image.png"
                                            />
                                        </label>
                                    </div>
                                    <div className="w-full md:w-2/3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label className="form-control w-full">
                                                <span className="label-text">Asset Name</span>
                                                <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="input input-bordered" required />
                                            </label>
                                            <label className="form-control w-full">
                                                <span className="label-text">Acquisition Date</span>
                                                <input type="date" value={formData.acquisitionDate?.toString().split('T')[0] || ''} onChange={e => setFormData({...formData, acquisitionDate: e.target.value})} className="input input-bordered" required />
                                            </label>
                                        </div>
                                        <label className="form-control w-full mt-4">
                                            <span className="label-text">Description</span>
                                            <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="textarea textarea-bordered w-full" rows={4} placeholder="Asset Description..."></textarea>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-md mb-2 border-b pb-1">Financial Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <label className="form-control w-full">
                                        <span className="label-text">Acquisition Cost</span>
                                        <input type="number" value={formData.acquisitionCost || 0} onChange={e => setFormData({...formData, acquisitionCost: parseFloat(e.target.value)})} className="input input-bordered" required />
                                    </label>
                                    <label className="form-control w-full">
                                        <span className="label-text">Salvage Value</span>
                                        <input type="number" value={formData.salvageValue || 0} onChange={e => setFormData({...formData, salvageValue: parseFloat(e.target.value)})} className="input input-bordered" />
                                    </label>
                                    <label className="form-control w-full">
                                        <span className="label-text">Useful Life (Months)</span>
                                        <input type="number" value={formData.usefulLifeInMonths || 0} onChange={e => setFormData({...formData, usefulLifeInMonths: parseInt(e.target.value)})} className="input input-bordered" required />
                                    </label>
                                    <label className="form-control w-full">
                                        <span className="label-text">Depreciation Method</span>
                                        <select value={formData.depreciationMethod || 'Straight Line'} className="select select-bordered" disabled>
                                            <option>Straight Line</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-md mb-2 border-b pb-1">GL Account Mapping</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                   <label className="form-control w-full">
                                        <span className="label-text">Asset Account</span>
                                        <select value={formData.assetAccountId || 0} onChange={e => setFormData({...formData, assetAccountId: parseInt(e.target.value)})} className="select select-bordered" required>
                                            <option value={0} disabled>Select Account</option>
                                            {glAccounts.filter(acc => acc.AccountType.includes("Fixed Asset")).map(acc => <option key={acc.ID} value={acc.ID}>{acc.AccountName}</option>)}
                                        </select>
                                    </label>
                                    <label className="form-control w-full">
                                        <span className="label-text">Accumulated Depreciation</span>
                                         <select value={formData.accumulatedDepreciationAccountId || 0} onChange={e => setFormData({...formData, accumulatedDepreciationAccountId: parseInt(e.target.value)})} className="select select-bordered" required>
                                            <option value={0} disabled>Select Account</option>
                                            {glAccounts.filter(acc => acc.AccountType.includes("Accumulated Depreciation")).map(acc => <option key={acc.ID} value={acc.ID}>{acc.AccountName}</option>)}
                                        </select>
                                    </label>
                                    <label className="form-control w-full">
                                        <span className="label-text">Depreciation Expense</span>
                                         <select value={formData.depreciationExpenseAccountId || 0} onChange={e => setFormData({...formData, depreciationExpenseAccountId: parseInt(e.target.value)})} className="select select-bordered" required>
                                            <option value={0} disabled>Select Account</option>
                                            {glAccounts.filter(acc => acc.AccountType.includes("Depreciation Expense")).map(acc => <option key={acc.ID} value={acc.ID}>{acc.AccountName}</option>)}
                                        </select>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="modal-action pt-4">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn text-white" style={{backgroundColor: primaryColor}} disabled={loading}>{loading ? <span className="loading loading-spinner loading-xs"></span> : 'Save Asset'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {isDepreciationModalOpen && (
                <DepreciationModal 
                    isOpen={isDepreciationModalOpen}
                    onClose={() => setIsDepreciationModalOpen(false)}
                    asset={assetForSimulation}
                />
            )}

            {isDeleteModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Deletion</h3>
                        <p className="py-4">Are you sure you want to delete asset "{assetToDelete?.name}"? This action cannot be undone.</p>
                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="btn btn-error" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FixedAssetsPage;