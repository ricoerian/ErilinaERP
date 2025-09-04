import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNotification } from '../../../../Components/NotificationProvider';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import { URL_BEFMAR, URL_BEFMGL } from '../../../../Utils/Constants';
import AccountsReceivableTable from '../../../../Components/FM/AccountsReceivable/AccountsReceivableTable';
import SalesOrdersForInvoicingTable from '../../../../Components/FM/AccountsReceivable/SalesOrdersForInvoicingTable';
import AccountsReceivableChart from '../../../../Components/FM/AccountsReceivable/AccountsReceivableChart';
import Pagination from '../../../../Components/Pagination';
import AccountsReceivableHeader from '../../../../Components/FM/AccountsReceivable/AccountsReceivableHeader';
import CreateReceiptModal from '../../../../Components/FM/AccountsReceivable/CreateReceiptModal';
import { Invoice } from '../../../../types/accountsReceivable';
import { SalesOrder } from '../../../../types/salesOrder';
import { Account } from '../../../../types/generalLedger';
import { BarChart3, List, FileText } from 'lucide-react';

export type SortColumn = 'invoiceNumber' | 'customerId' | 'dueDate' | 'totalAmount' | 'status';
export type ViewMode = 'sos' | 'invoices' | 'chart';

const AccountsReceivablePage: React.FC = () => {
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();

    // States
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
    const [defaultArAccount, setDefaultArAccount] = useState<Account | null>(null);
    const [defaultRevenueAccount, setDefaultRevenueAccount] = useState<Account | null>(null);
    const [cashOrBankAccounts, setCashOrBankAccounts] = useState<Account[]>([]);
    
    const [loading, setLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<ViewMode>('sos');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [sortColumn, setSortColumn] = useState<SortColumn>('dueDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedInvoices, setSelectedInvoices] = useState<Set<number>>(new Set());
    const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);

    // Fetch GL Accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            if (!companyDetails?.id) return;
            try {
                const response = await fetch(`${URL_BEFMGL}/api/companies/${companyDetails.id}/accounts`, { credentials: 'include' });
                if (!response.ok) throw new Error('Failed to fetch accounts from GL');
                const allAccounts: Account[] = await response.json();
                
                const arAccount = allAccounts.find(acc => acc.AccountType === "Accounts Receivable");
                if (arAccount) {
                    setDefaultArAccount(arAccount);
                } else {
                    showNotification('Peringatan: Akun "Accounts Receivable" tidak ditemukan. Mohon buat terlebih dahulu di General Ledger.', 'warning');
                }
                const revAccount = allAccounts.find(acc => acc.AccountType === "Revenue" || acc.AccountType === "Sales");
                
                if (revAccount) {
                    setDefaultRevenueAccount(revAccount);
                } else {
                    showNotification('Kritis: Akun "Revenue" atau "Sales" tidak ditemukan. Pembuatan invoice tidak dapat dilanjutkan.', 'error');
                }
                setCashOrBankAccounts(allAccounts.filter(acc => acc.AccountType === "Cash" || acc.AccountType === "Current Assets"));

            } catch (err) { 
                const msg = err instanceof Error ? err.message : 'Error fetching GL accounts.';
                showNotification(msg, 'error'); 
            }
        };
        if (companyDetails?.id) fetchAccounts();
    }, [companyDetails?.id, showNotification]);

    // Fetch AR Data (SOs and Invoices)
    const fetchData = useCallback(async () => {
        if (!companyDetails?.id) return;
        setLoading(true);
        try {
            const [soResponse, invoicesResponse] = await Promise.all([
                fetch(`${URL_BEFMAR}/api/companies/${companyDetails.id}/sales-orders-for-invoicing`, { credentials: 'include' }),
                fetch(`${URL_BEFMAR}/api/companies/${companyDetails.id}/invoices`, { credentials: 'include' })
            ]);
            if (!soResponse.ok) throw new Error('Failed to fetch Sales Orders for invoicing');
            if (!invoicesResponse.ok) throw new Error('Failed to fetch existing Invoices');
            
            const soData = await soResponse.json();
            const invoicesData = await invoicesResponse.json();
            
            setSalesOrders(Array.isArray(soData) ? soData : []);
            setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
        } catch (err) { 
            showNotification(err instanceof Error ? err.message : 'Failed to fetch AR data', 'error'); 
        } 
        finally { setLoading(false); }
    }, [companyDetails?.id, showNotification]);

    useEffect(() => {
        if (companyDetails?.id) fetchData();
    }, [fetchData, companyDetails?.id]);

    // Handlers
    const handleCreateInvoice = async (soId: string) => {
        if (!companyDetails?.id || !defaultArAccount || !defaultRevenueAccount) {
            showNotification('Akun default Piutang (AR) atau Pendapatan (Revenue) belum diatur. Silakan periksa pengaturan General Ledger.', 'error');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${URL_BEFMAR}/api/companies/${companyDetails.id}/sales-orders/${soId}/invoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ arAccountId: defaultArAccount.ID, revenueAccountId: defaultRevenueAccount.ID }),
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to create invoice');
            showNotification('Invoice created successfully!', 'success');
            await fetchData();
            setViewMode('invoices');
        } catch (err) { 
            showNotification(err instanceof Error ? err.message : 'An unexpected error occurred', 'error'); 
        } 
        finally { setLoading(false); }
    };
    
    const handleCreateReceipt = async (receiptData: { receipt: { receivedAmount: number; paymentMethod: string; referenceNumber: string; bankCashAccountId: number; arAccountId: number; }; invoiceIds: number[]; }) => {
        if (!companyDetails?.id) return;
        setLoading(true);
        try {
            const response = await fetch(`${URL_BEFMAR}/api/companies/${companyDetails.id}/receipts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(receiptData),
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to record receipt');
            showNotification('Receipt recorded successfully!', 'success');
            setReceiptModalOpen(false);
            setSelectedInvoices(new Set());
            await fetchData();
        } catch (err) { 
            showNotification(err instanceof Error ? err.message : 'An unexpected error occurred', 'error'); 
        }
        finally { setLoading(false); }
    };
    
    const handleSort = useCallback((column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    }, [sortColumn]);

    // Memoized Sorting, Filtering, and Pagination
    const sortedAndFilteredInvoices = useMemo(() => {
        return [...invoices].filter(invoice => {
            const lowerTerm = searchTerm.toLowerCase();
            return (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(lowerTerm)) || 
                   (invoice.customer?.name && invoice.customer.name.toLowerCase().includes(lowerTerm));
        }).sort((a, b) => {
            let aValue: string | number = a[sortColumn];
            let bValue: string | number = b[sortColumn];

            if (sortColumn === 'customerId') {
                aValue = a.customer?.name || '';
                bValue = b.customer?.name || '';
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    }, [invoices, searchTerm, sortColumn, sortDirection]);

    const paginatedInvoices = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAndFilteredInvoices.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedAndFilteredInvoices, currentPage, itemsPerPage]);
    
    const invoicesToPay = useMemo(() => invoices.filter(inv => selectedInvoices.has(inv.id)), [invoices, selectedInvoices]);
    
    const handleSelect = (invoiceId: number) => {
        setSelectedInvoices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(invoiceId)) newSet.delete(invoiceId);
            else newSet.add(invoiceId);
            return newSet;
        });
    };

    const handleSelectAll = () => {
        const currentPageReceivableIds = paginatedInvoices
            .filter(inv => inv.status === 'Awaiting Payment' || inv.status === 'Partial Paid')
            .map(inv => inv.id);

        const allOnPageSelected = currentPageReceivableIds.length > 0 && currentPageReceivableIds.every(id => selectedInvoices.has(id));

        setSelectedInvoices(prev => {
            const newSelected = new Set(prev);
            if (allOnPageSelected) {
                currentPageReceivableIds.forEach(id => newSelected.delete(id));
            } else {
                currentPageReceivableIds.forEach(id => newSelected.add(id));
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
            case 'sos': return <SalesOrdersForInvoicingTable salesOrders={salesOrders} onCreateInvoice={handleCreateInvoice} primaryColor={companyDetails?.primary_color} />;
            case 'invoices': return (
                <div className="space-y-4 animate-fade-in">
                     <div className="flex justify-end">
                        <button 
                            className="btn text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            style={{ backgroundColor: companyDetails?.primary_color, borderColor: companyDetails?.primary_color }}
                            disabled={selectedInvoices.size === 0} 
                            onClick={() => setReceiptModalOpen(true)}
                        >
                            Record Receipt ({selectedInvoices.size})
                        </button>
                    </div>
                    <AccountsReceivableTable 
                        invoices={paginatedInvoices}
                        companyPrimaryColor={companyDetails?.primary_color}
                        selectedInvoices={selectedInvoices}
                        onSort={handleSort}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                    />
                    {sortedAndFilteredInvoices.length > itemsPerPage && <Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalItems={sortedAndFilteredInvoices.length} itemsPerPage={itemsPerPage}/>}
                </div>
            );
            case 'chart': return <AccountsReceivableChart invoices={invoices} />;
            default: return null;
        }
    };
    
    return (
        <div className="p-4 sm:p-4 lg:p-4 bg-slate-50 min-h-screen">
            <AccountsReceivableHeader onSearchChange={setSearchTerm} onRefresh={fetchData} />
            <main className="mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-500">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-slate-200 pb-4">
                        <h2 className="text-xl font-bold text-slate-800">
                            {viewMode === 'sos' && 'Sales Orders to Invoice'}
                            {viewMode === 'invoices' && 'Active Invoices'}
                            {viewMode === 'chart' && 'Receivables by Customer'}
                        </h2>
                        <div className="tabs tabs-boxed bg-slate-100 mt-4 sm:mt-0 p-1">
                            <a className={`tab gap-2 transition-all duration-300 ${viewMode === 'sos' ? 'tab-active' : ''}`} style={viewMode === 'sos' ? activeTabStyle : {}} onClick={() => setViewMode('sos')}>
                                <FileText size={16}/> SO Inbox
                            </a>
                            <a className={`tab gap-2 transition-all duration-300 ${viewMode === 'invoices' ? 'tab-active' : ''}`} style={viewMode === 'invoices' ? activeTabStyle : {}} onClick={() => setViewMode('invoices')}>
                                <List size={16}/> Invoice List
                            </a>
                            <a className={`tab gap-2 transition-all duration-300 ${viewMode === 'chart' ? 'tab-active' : ''}`} style={viewMode === 'chart' ? activeTabStyle : {}} onClick={() => setViewMode('chart')}>
                                <BarChart3 size={16}/> Chart View
                            </a>
                        </div>
                    </div>
                    {renderContent()}
                </div>
            </main>
            <CreateReceiptModal 
                isOpen={isReceiptModalOpen} 
                onClose={() => setReceiptModalOpen(false)} 
                onSubmit={handleCreateReceipt} 
                invoicesToPay={invoicesToPay} 
                cashOrBankAccounts={cashOrBankAccounts} 
                defaultArAccount={defaultArAccount} 
                primaryColor={companyDetails?.primary_color} 
            />
        </div>
    );
};

export default AccountsReceivablePage;