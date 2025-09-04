import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNotification } from '../../../../Components/NotificationProvider';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import { URL_BEFMGL } from '../../../../Utils/Constants';
import { Account, Journal, ViewMode, SortColumn, JournalCreationPayload } from '../../../../types/generalLedger';
import GeneralLedgerHeader from '../../../../Components/FM/GeneralLedger/GeneralLedgerHeader';
import AccountsTable from '../../../../Components/FM/GeneralLedger/AccountTable';
import ChartOfAccounts from '../../../../Components/FM/GeneralLedger/ChartOfAccounts';
import CreateAccountModal from '../../../../Components/FM/GeneralLedger/CreateAccountModal';
import CreateJournalModal from '../../../../Components/FM/GeneralLedger/CreateJournalModal';
import Pagination from '../../../../Components/Pagination';
import GeneralLedgerReportModal from '../../../../Components/FM/GeneralLedger/GeneralLedgerReportModal';
import ConfirmationModal from '../../../../Components/FM/GeneralLedger/ConfirmationModal';
import PeriodEndProcessCard from '../../../../Components/FM/GeneralLedger/PeriodEndProcessCard';
import BalanceSheetModal from '../../../../Components/FM/GeneralLedger/BalanceSheetModal';

const GeneralLedgerPage: React.FC = () => {
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [journals, setJournals] = useState<Journal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [sortColumn, setSortColumn] = useState<SortColumn>('AccountNumber');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportMode, setReportMode] = useState<'all' | 'single-account'>('all');
    const [selectedAccountForReport, setSelectedAccountForReport] = useState<Account | null>(null);
    const [reportStartDate] = useState<string>('');
    const [reportEndDate] = useState<string>('');
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [isBalanceSheetOpen, setIsBalanceSheetOpen] = useState(false);

    // State baru untuk modal konfirmasi penghapusan
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<number | null>(null);

    const fetchData = useCallback(async <T,>(endpoint: string, setter: React.Dispatch<React.SetStateAction<T[]>>, errorMessage: string) => {
        if (!companyDetails?.id) return;
        try {
            const response = await fetch(endpoint, { credentials: 'include' });
            if (!response.ok) throw new Error(errorMessage);
            const data = await response.json();
            setter(data || []);
        } catch (err) {
            showNotification(err instanceof Error ? err.message : errorMessage, 'error');
        }
    }, [companyDetails?.id, showNotification]);

    const fetchAccounts = useCallback(() => fetchData(`${URL_BEFMGL}/api/companies/${companyDetails?.id}/accounts`, setAccounts, 'Failed to fetch accounts'), [companyDetails, fetchData]);
    const fetchJournals = useCallback(() => fetchData(`${URL_BEFMGL}/api/companies/${companyDetails?.id}/journals`, setJournals, 'Failed to fetch journals'), [companyDetails, fetchData]);

    useEffect(() => {
        if (companyDetails?.id) {
            setLoading(true);
            Promise.all([fetchAccounts(), fetchJournals()]).finally(() => setLoading(false));
        }
    }, [companyDetails?.id, fetchAccounts, fetchJournals]);

    const sortedAndFilteredAccounts = useMemo(() => {
        return [...accounts]
            .filter(account => {
                if (!searchTerm) return true;
                const lowerTerm = searchTerm.toLowerCase();
                return (
                    account.AccountNumber.toLowerCase().includes(lowerTerm) ||
                    account.AccountName.toLowerCase().includes(lowerTerm) ||
                    account.AccountType.toLowerCase().includes(lowerTerm)
                );
            })
            .sort((a, b) => {
                const aValue = a[sortColumn as keyof Account];
                const bValue = b[sortColumn as keyof Account];
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [accounts, searchTerm, sortColumn, sortDirection]);

    const paginatedAccounts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAndFilteredAccounts.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedAndFilteredAccounts, currentPage, itemsPerPage]);

    const handleSort = (column: SortColumn) => {
        setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortColumn(column);
    };

    const handleOpenAccountModal = (account: Account | null = null) => {
        setEditingAccount(account);
        setIsAccountModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsAccountModalOpen(false);
        setIsJournalModalOpen(false);
        setEditingAccount(null);
    };

    const handleOpenReportModal = (mode: 'all' | 'single-account', account?: Account) => {
        setReportMode(mode);
        setSelectedAccountForReport(account || null);
        setIsReportModalOpen(true);
    };

    const handleCloseReportModal = () => {
        setIsReportModalOpen(false);
        setReportMode('all');
        setSelectedAccountForReport(null);
    };

    const handleSaveAccount = async (accountData: Omit<Account, 'ID' | 'CompanyID' | 'CreatedAt' | 'UpdatedAt'>) => {
        if (!companyDetails?.id) return;
        const method = editingAccount ? 'PUT' : 'POST';
        const url = editingAccount
            ? `${URL_BEFMGL}/api/companies/${companyDetails.id}/accounts/${editingAccount.ID}`
            : `${URL_BEFMGL}/api/companies/${companyDetails.id}/accounts`;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(accountData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save account');
            }
            showNotification(`Account ${editingAccount ? 'updated' : 'created'} successfully!`, 'success');
            fetchAccounts();
            handleCloseModals();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred', 'error');
        }
    };

    // Fungsi untuk menampilkan modal konfirmasi
    const handleDeleteAccount = (accountId: number) => {
        setAccountToDelete(accountId);
        setIsDeleteModalOpen(true);
    };

    // Fungsi untuk eksekusi penghapusan setelah konfirmasi
    const confirmDelete = async () => {
        if (!companyDetails?.id || accountToDelete === null) return;
        
        try {
            const response = await fetch(`${URL_BEFMGL}/api/companies/${companyDetails.id}/accounts/${accountToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete account');
            }
            showNotification('Account deleted successfully!', 'success');
            fetchAccounts();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred while deleting', 'error');
        } finally {
            // Tutup modal setelah selesai, baik berhasil atau gagal
            setIsDeleteModalOpen(false);
            setAccountToDelete(null);
        }
    };

    const handleSaveJournal = async (journalData: JournalCreationPayload) => {
        if (!companyDetails?.id) return;
        try {
            const response = await fetch(`${URL_BEFMGL}/api/companies/${companyDetails.id}/journals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(journalData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create journal entry');
            }
            showNotification('Journal entry created successfully!', 'success');
            fetchJournals();
            handleCloseModals();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred', 'error');
        }
    };

    const primaryColor = companyDetails?.primary_color || '#4f46e5';

    return (
        <div className="p-4 sm:p-4 lg:p-4 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">General Ledger</h1>
                    <p className="text-slate-500 mt-1">Manage your accounts, view transactions, and create journal entries.</p>
                </header>

                <GeneralLedgerHeader
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onOpenAccountModal={() => handleOpenAccountModal()}
                    onOpenJournalModal={() => setIsJournalModalOpen(true)}
                    onOpenReport={() => handleOpenReportModal('all')}
                    onOpenBalanceSheet={() => setIsBalanceSheetOpen(true)}
                    primaryColor={primaryColor}
                />

                <main className="mt-6">
                    {loading && accounts.length === 0 ? (
                        <div className="text-center text-slate-500 py-12">Loading general ledger data...</div>
                    ) : (
                        <>
                            {viewMode === 'table' ? (
                                <AccountsTable
                                    accounts={paginatedAccounts}
                                    journals={journals}
                                    currencyCode={`${companyDetails?.currency_code}`}
                                    onSort={handleSort}
                                    sortColumn={sortColumn}
                                    sortDirection={sortDirection}
                                    onEditAccount={handleOpenAccountModal}
                                    onDeleteAccount={handleDeleteAccount} // Menggunakan fungsi baru
                                    onGenerateReport={(account) => handleOpenReportModal('single-account', account)}
                                    primaryColor={primaryColor}
                                />
                            ) : (
                                <ChartOfAccounts
                                    accounts={accounts}
                                    journals={journals}
                                    currencyCode={`${companyDetails?.currency_code}`}
                                    onEditAccount={handleOpenAccountModal}
                                    onDeleteAccount={handleDeleteAccount} // Menggunakan fungsi baru
                                    onGenerateReport={(account) => handleOpenReportModal('single-account', account)}
                                    primaryColor={primaryColor}
                                />
                            )}

                            {viewMode === 'table' && sortedAndFilteredAccounts.length > 0 && (
                                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                                    <div className="flex items-center">
                                        <select
                                            id="itemsPerPage"
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="select select-bordered select-sm"
                                        >
                                            <option value={10}>10 per page</option>
                                            <option value={20}>20 per page</option>
                                            <option value={50}>50 per page</option>
                                        </select>
                                    </div>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalItems={sortedAndFilteredAccounts.length}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </main>
                <PeriodEndProcessCard />
            </div>

            <BalanceSheetModal
                isOpen={isBalanceSheetOpen}
                onClose={() => setIsBalanceSheetOpen(false)}
                journals={journals}
                accounts={accounts}
            />

            {isAccountModalOpen && (
                <CreateAccountModal
                    isOpen={isAccountModalOpen}
                    onClose={handleCloseModals}
                    onSubmit={handleSaveAccount}
                    account={editingAccount}
                    primaryColor={primaryColor}
                />
            )}

            {isJournalModalOpen && (
                <CreateJournalModal
                    isOpen={isJournalModalOpen}
                    onClose={handleCloseModals}
                    onSubmit={handleSaveJournal}
                    accounts={accounts}
                    currencyCode={`${companyDetails?.currency_code}`}
                    primaryColor={primaryColor}
                />
            )}

            <GeneralLedgerReportModal
                isOpen={isReportModalOpen}
                onClose={handleCloseReportModal}
                journals={journals}
                accounts={accounts}
                mode={reportMode}
                selectedAccount={selectedAccountForReport}
                startDate={reportStartDate}
                endDate={reportEndDate}
            />

            {/* Modal Konfirmasi Penghapusan */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this account? This action cannot be undone."
                title="Confirm Deletion"
            />
        </div>
    );
};

export default GeneralLedgerPage;