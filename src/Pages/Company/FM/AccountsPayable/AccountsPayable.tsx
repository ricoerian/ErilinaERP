// File: AccountsPayable.tsx

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNotification } from '../../../../Components/NotificationProvider';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import { URL_BEFMAP, URL_BEFMGL } from '../../../../Utils/Constants';
import AccountsPayableTable from '../../../../Components/FM/AccountsPayable/AccountsPayableTable';
import PurchaseOrdersForBillingTable from '../../../../Components/FM/AccountsPayable/PurchaseOrdersForBillingTable';
import AccountsPayableChart from '../../../../Components/FM/AccountsPayable/AccountsPayableChart';
import Pagination from '../../../../Components/Pagination';
import AccountsPayableHeader from '../../../../Components/FM/AccountsPayable/AccountsPayableHeader';
import CreatePaymentModal from '../../../../Components/FM/AccountsPayable/CreatePaymentModal';
import { Bill } from '../../../../types/accountsPayable';
import { PurchaseOrder } from '../../../../types/purchaseOrder';
import { Account } from '../../../../types/generalLedger';
import { BarChart3, List, FileText } from 'lucide-react';

export type SortColumn = 'billNumber' | 'supplierId' | 'billDate' | 'dueDate' | 'totalAmount' | 'status';
export type ViewMode = 'pos' | 'bills' | 'chart';

const AccountsPayablePage: React.FC = () => {
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();

    const [bills, setBills] = useState<Bill[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [defaultApAccount, setDefaultApAccount] = useState<Account | null>(null);
    const [cashOrBankAccounts, setCashOrBankAccounts] = useState<Account[]>([]);
    
    // State untuk akun yang bisa didebit (Beban atau Aset)
    const [expenseAssetAccounts, setExpenseAssetAccounts] = useState<Account[]>([]);
    
    const [loading, setLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<ViewMode>('pos');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [sortColumn, setSortColumn] = useState<SortColumn>('dueDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedBills, setSelectedBills] = useState<Set<number>>(new Set());
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

    useEffect(() => {
        const fetchPrerequisites = async () => {
            if (!companyDetails?.id) return;
            try {
                const response = await fetch(`${URL_BEFMGL}/api/companies/${companyDetails.id}/accounts`, { credentials: 'include' });
                if (!response.ok) throw new Error('Failed to fetch accounts from GL');
                const allAccounts: Account[] = await response.json();
                 
                const payableAccount = allAccounts.find(acc => acc.AccountType === "Accounts Payable");
                if (payableAccount) {
                    setDefaultApAccount(payableAccount);
                } else {
                    showNotification('Peringatan: Akun "Accounts Payable" tidak ditemukan di General Ledger.', 'warning');
                }

                const cashAccounts = allAccounts.filter(acc => acc.AccountType === "Cash" || acc.AccountType === "Current Assets");
                setCashOrBankAccounts(cashAccounts);

                const validExpenseAccounts = allAccounts.filter(acc => {
                    const type = acc.AccountType;
                    const isExpenseOrAsset = type === "Expense" || type === "COGS" || type === "Fixed Asset" || type === "Other Current Asset";
                    const isNotPayableOrReceivable = type !== "Accounts Payable" && type !== "Accounts Receivable";

                    return isExpenseOrAsset && isNotPayableOrReceivable;
                });

                setExpenseAssetAccounts(validExpenseAccounts);
                if (validExpenseAccounts.length === 0) {
                    showNotification('Peringatan: Tidak ada akun Beban atau Aset yang valid untuk membuat tagihan.', 'warning');
                }
                // --- AKHIR DARI PERBAIKAN LOGIKA ---

            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Error fetching GL accounts.';
                showNotification(msg, 'error');
            }
        };
        if (companyDetails?.id) fetchPrerequisites();
    }, [companyDetails?.id, showNotification]);

    const fetchData = useCallback(async () => {
        if (!companyDetails?.id) return;
        setLoading(true);
        try {
            const [poResponse, billsResponse] = await Promise.all([
                fetch(`${URL_BEFMAP}/api/companies/${companyDetails.id}/purchase-orders-for-billing`, { credentials: 'include' }),
                fetch(`${URL_BEFMAP}/api/companies/${companyDetails.id}/bills`, { credentials: 'include' })
            ]);
            if (!poResponse.ok) throw new Error('Failed to fetch Purchase Orders for billing');
            if (!billsResponse.ok) throw new Error('Failed to fetch existing Bills');
            const poData = await poResponse.json();
            const billsData = await billsResponse.json();
            setPurchaseOrders(Array.isArray(poData) ? poData : []);
            setBills(Array.isArray(billsData) ? billsData : []);
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    }, [companyDetails?.id, showNotification]);

    useEffect(() => {
        if (companyDetails?.id) fetchData();
    }, [fetchData, companyDetails?.id]);
    
    const handleCreateBillFromPO = async (poId: string) => {
        if (!companyDetails?.id || !defaultApAccount || expenseAssetAccounts.length === 0) {
            showNotification('Kesalahan Konfigurasi: Akun default AP atau akun Beban/Aset belum diatur.', 'error');
            return;
        }
        // Tetap gunakan akun pertama dari daftar yang sudah difilter dengan benar
        const defaultExpenseAccount = expenseAssetAccounts[0];
        
        setLoading(true);
        try {
            const response = await fetch(`${URL_BEFMAP}/api/companies/${companyDetails.id}/purchase-orders/${poId}/bills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    apAccountId: defaultApAccount.ID,
                    expenseAccountId: defaultExpenseAccount.ID 
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to create bill from PO');
            }
            showNotification('Bill created successfully!', 'success');
            await fetchData();
            setViewMode('bills');
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const handleCreatePayment = async (paymentData: { payment: { paymentAmount: number; paymentMethod: string; referenceNumber: string; bankCashAccountId: number; apAccountId: number; }; billIds: number[]; }) => {
        if (!companyDetails?.id) return;
        setLoading(true);
        try {
            const response = await fetch(`${URL_BEFMAP}/api/companies/${companyDetails.id}/bills/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(paymentData),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to process payment');
            }
            showNotification('Payment recorded successfully!', 'success');
            setPaymentModalOpen(false);
            setSelectedBills(new Set());
            await fetchData();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSort = useCallback((column: SortColumn) => {
        setSortColumn(prev => {
            if (prev === column) {
                setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
            } else {
                setSortDirection('asc');
            }
            return column;
        });
        setCurrentPage(1);
    }, []);

    const sortedAndFilteredBills = useMemo(() => {
        return [...bills].filter(bill => {
            const lowerTerm = searchTerm.toLowerCase();
            return (bill.billNumber && bill.billNumber.toLowerCase().includes(lowerTerm)) || (bill.Supplier?.name && bill.Supplier.name.toLowerCase().includes(lowerTerm));
        }).sort((a, b) => {
            let aValue = a[sortColumn];
            let bValue = b[sortColumn];
            if (sortColumn === 'supplierId') {
                aValue = a.Supplier?.name || '';
                bValue = b.Supplier?.name || '';
            }
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    }, [bills, searchTerm, sortColumn, sortDirection]);
    
    const paginatedBills = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAndFilteredBills.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedAndFilteredBills, currentPage, itemsPerPage]);

    const billsToPay = useMemo(() => bills.filter(b => selectedBills.has(b.ID)), [bills, selectedBills]);
    
    const handleSelect = (billId: number) => {
        setSelectedBills(prev => {
            const newSet = new Set(prev);
            if (newSet.has(billId)) {
                newSet.delete(billId);
            } else {
                newSet.add(billId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        const currentPagePayableIds = paginatedBills
            .filter(b => b.status === 'Awaiting Payment' || b.status === 'Partial Paid')
            .map(b => b.ID);

        const allOnPageSelected = currentPagePayableIds.length > 0 && currentPagePayableIds.every(id => selectedBills.has(id));

        setSelectedBills(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (allOnPageSelected) {
                currentPagePayableIds.forEach(id => newSelected.delete(id));
            } else {
                currentPagePayableIds.forEach(id => newSelected.add(id));
            }
            return newSelected;
        });
    };

    const activeTabStyle: React.CSSProperties = {
        backgroundColor: companyDetails?.primary_color,
        color: 'white',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-96">
                    <span className="loading loading-spinner loading-lg" style={{color: companyDetails?.primary_color}}></span>
                </div>
            );
        }
        switch(viewMode) {
            case 'pos': return <PurchaseOrdersForBillingTable purchaseOrders={purchaseOrders} onCreateBill={handleCreateBillFromPO} primaryColor={companyDetails?.primary_color} />;
            case 'bills': return (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-end">
                        <button 
                            className="btn text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            style={{ 
                                backgroundColor: companyDetails?.primary_color, 
                                borderColor: companyDetails?.primary_color 
                            }}
                            disabled={selectedBills.size === 0} 
                            onClick={() => setPaymentModalOpen(true)}
                        >
                            Pay Selected Bills ({selectedBills.size})
                        </button>
                    </div>
                    <AccountsPayableTable 
                        bills={paginatedBills} 
                        companyPrimaryColor={companyDetails?.primary_color} 
                        selectedBills={selectedBills} 
                        onSort={handleSort} 
                        sortColumn={sortColumn} 
                        sortDirection={sortDirection}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                    />
                    {sortedAndFilteredBills.length > itemsPerPage && <Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalItems={sortedAndFilteredBills.length} itemsPerPage={itemsPerPage} />}
                </div>
            );
            case 'chart': return <AccountsPayableChart bills={bills} />;
            default: return null;
        }
    };

    return (
        <div className="p-4 sm:p-4 lg:p-4 bg-slate-50 min-h-screen">
            <AccountsPayableHeader onSearchChange={setSearchTerm} onRefresh={fetchData} />
            <main className="mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-500">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-slate-200 pb-4">
                        <h2 className="text-xl font-bold text-slate-800">
                            {viewMode === 'pos' && 'Purchase Orders to Bill'}
                            {viewMode === 'bills' && 'Active Bills'}
                            {viewMode === 'chart' && 'Payables by Supplier'}
                        </h2>
                        <div className="tabs tabs-boxed bg-slate-100 mt-4 sm:mt-0 p-1">
                            <a 
                                className={`tab gap-2 transition-all duration-300 ${viewMode === 'pos' ? 'tab-active' : ''}`} 
                                style={viewMode === 'pos' ? activeTabStyle : {}}
                                onClick={() => setViewMode('pos')}>
                                <FileText size={16}/> PO Inbox
                            </a>
                            <a 
                                className={`tab gap-2 transition-all duration-300 ${viewMode === 'bills' ? 'tab-active' : ''}`} 
                                style={viewMode === 'bills' ? activeTabStyle : {}}
                                onClick={() => setViewMode('bills')}>
                                <List size={16}/> Bill List
                            </a>
                            <a 
                                className={`tab gap-2 transition-all duration-300 ${viewMode === 'chart' ? 'tab-active' : ''}`} 
                                style={viewMode === 'chart' ? activeTabStyle : {}}
                                onClick={() => setViewMode('chart')}>
                                <BarChart3 size={16}/> Chart View
                            </a>
                        </div>
                    </div>
                    {renderContent()}
                </div>
            </main>
            <CreatePaymentModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSubmit={handleCreatePayment} billsToPay={billsToPay} cashOrBankAccounts={cashOrBankAccounts} defaultApAccount={defaultApAccount} primaryColor={companyDetails?.primary_color} />
        </div>
    );
};

export default AccountsPayablePage;