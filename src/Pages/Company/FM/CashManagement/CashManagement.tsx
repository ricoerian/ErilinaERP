import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNotification } from '../../../../Components/NotificationProvider';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import { URL_BEFMCM, URL_BEFMGL } from '../../../../Utils/Constants';
import CashManagementHeader from '../../../../Components/FM/CashManagement/CashManagementHeader';
import CreateCashAccountModal from '../../../../Components/FM/CashManagement/CreateCashAccountModal';
import CashAccountsList from '../../../../Components/FM/CashManagement/CashAccountsList';
import CashBalanceChart from '../../../../Components/FM/CashManagement/CashBalanceChart';
import CashTransactionsTable from '../../../../Components/FM/CashManagement/CashTransactionsTable';
import { CashAccount, CashTransaction } from '../../../../types/cashManagement';
import { Account as GLAccount, Journal, JournalEntry } from '../../../../types/generalLedger';
import { TrendingUp, TrendingDown, Scale, ArrowUp, ArrowDown } from 'lucide-react';

const processJournalData = (journals: Journal[], cashGLAccountIds: Set<number>): CashTransaction[] => {
    const transactions: CashTransaction[] = [];
    let totalRunningBalance = 0;
    const allEntries: JournalEntry[] = journals.flatMap(j =>
        (j.JournalEntries || []).map(entry => ({ ...entry, TransactionDate: j.TransactionDate, parentJournalDescription: j.Description }))
    ).filter(entry => cashGLAccountIds.has(entry.AccountID));

    allEntries.sort((a, b) => {
        const dateA = new Date(a.CreatedAt).getTime();
        const dateB = new Date(b.CreatedAt).getTime();
        if (dateA !== dateB) {
            return dateA - dateB;
        }
        return a.ID - b.ID;
    });

    allEntries.forEach(entry => {
        const amount = entry.Debit > 0 ? entry.Debit : entry.Credit;
        const type = entry.Debit > 0 ? 'income' : 'expense';
        totalRunningBalance += (entry.Debit - entry.Credit);
        transactions.push({
            ID: entry.ID,
            company_id: 0,
            cash_account_id: entry.AccountID,
            TransactionDate: entry.TransactionDate || entry.CreatedAt,
            Description: entry.Description || entry.Description || 'Journal Entry',
            Amount: amount,
            Type: type,
            balance_after: totalRunningBalance,
            CreatedAt: entry.CreatedAt,
            UpdatedAt: entry.UpdatedAt,
        });
    });

    return transactions;
};

const KPICard: React.FC<{ title: string; value: string; change?: number; children: React.ReactNode }> = ({ title, value, change, children }) => {
    const isPositive = change !== undefined && change >= 0;
    const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center gap-4">
                {children}
                <p className="font-semibold text-slate-600">{title}</p>
            </div>
            <div className="mt-4 flex justify-between items-end">
                <p className="text-3xl font-bold text-slate-800">{value}</p>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${changeColor}`}>
                        {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        <span>{Math.abs(change).toFixed(2)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};
const CashManagementPage: React.FC = () => {
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();
    const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
    const [tableTransactions, setTableTransactions] = useState<CashTransaction[]>([]);
    const [chartTransactions, setChartTransactions] = useState<CashTransaction[]>([]);
    const [availableGLAccounts, setAvailableGLAccounts] = useState<GLAccount[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const fetchData = useCallback(async () => {
        if (!companyDetails?.id) return;
        setLoading(true);
        try {
            const [cmAccountsRes, glAccountsRes, journalsRes] = await Promise.all([
                fetch(`${URL_BEFMCM}/api/companies/${companyDetails.id}/cash-management/accounts`, { credentials: 'include' }),
                fetch(`${URL_BEFMGL}/api/companies/${companyDetails.id}/accounts`, { credentials: 'include' }),
                fetch(`${URL_BEFMGL}/api/companies/${companyDetails.id}/journals`, { credentials: 'include' })
            ]);
            if (!cmAccountsRes.ok) throw new Error('Failed to fetch cash management accounts');
            if (!glAccountsRes.ok) throw new Error('Failed to fetch general ledger accounts');
            if (!journalsRes.ok) throw new Error('Failed to fetch journals');
            const cmAccountsData: CashAccount[] = await cmAccountsRes.json();
            const glAccountsData: GLAccount[] = await glAccountsRes.json();
            const journalsData: Journal[] = await journalsRes.json();
            const cashGLAccounts = glAccountsData.filter(glAcc => glAcc.AccountType === "Cash" || glAcc.AccountType === "Current Assets");
            const cashGLAccountIds = new Set(cashGLAccounts.map(acc => acc.ID));
            const processedChronologically = processJournalData(journalsData, cashGLAccountIds);
            setChartTransactions(processedChronologically);
            setTableTransactions([...processedChronologically].reverse());
            const balanceMap = new Map<number, number>();
            journalsData.forEach(j => {
                (j.JournalEntries || []).forEach(e => {
                    if (cashGLAccountIds.has(e.AccountID)) {
                        balanceMap.set(e.AccountID, (balanceMap.get(e.AccountID) || 0) + e.Debit - e.Credit);
                    }
                });
            });
            const updatedCmAccounts = cmAccountsData.map(acc => ({
                ...acc,
                balance: balanceMap.get(acc.account_id) || 0,
            }));
            setCashAccounts(Array.isArray(updatedCmAccounts) ? updatedCmAccounts : []);
            const registeredGLAccountIds = new Set(cmAccountsData.map(acc => acc.account_id));
            setAvailableGLAccounts(cashGLAccounts.filter(glAcc => !registeredGLAccountIds.has(glAcc.ID)));
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    }, [companyDetails?.id, showNotification]);
    useEffect(() => {
        if (companyDetails?.id) fetchData();
    }, [companyDetails?.id, fetchData]);
    const handleCreateAccount = async (accountData: { accountId: number; accountName: string }) => {
        if (!companyDetails?.id) return;
        try {
            const response = await fetch(`${URL_BEFMCM}/api/companies/${companyDetails.id}/cash-management/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ account_id: accountData.accountId, account_name: accountData.accountName }),
            });
            if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Failed to create cash account'); }
            showNotification('Cash account added successfully!', 'success');
            setModalOpen(false);
            await fetchData();
        } catch (err) { showNotification(err instanceof Error ? err.message : 'An error occurred', 'error'); }
    };
    const { totalBalance, totalInflow, totalOutflow, netCashFlow } = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentTransactions = tableTransactions.filter(t => new Date(t.TransactionDate) > thirtyDaysAgo);
        const inflow = recentTransactions.filter(t => t.Type === 'income').reduce((sum, t) => sum + t.Amount, 0);
        const outflow = recentTransactions.filter(t => t.Type === 'expense').reduce((sum, t) => sum + t.Amount, 0);
        return {
            totalBalance: cashAccounts.reduce((sum, acc) => sum + acc.balance, 0),
            totalInflow: inflow,
            totalOutflow: outflow,
            netCashFlow: inflow - outflow,
        }
    }, [cashAccounts, tableTransactions]);
    const formatCurrency = (amount: number, currencyCode: string) => {
        const currency = currencyCode || 'USD';
        if (Math.abs(amount) >= 1_000_000) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact', compactDisplay: 'short' }).format(amount);
        }
        return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
    };
    const currencyCode = companyDetails?.currency_code || 'USD';
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen font-sans">
            <CashManagementHeader onRefresh={fetchData} onAddNew={() => setModalOpen(true)} primaryColor={companyDetails?.primary_color} />
            {loading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <span className="loading loading-spinner loading-lg" style={{ color: companyDetails?.primary_color }}></span>
                </div>
            ) : (
                <main className="mt-8 space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                        <KPICard title="Total Cash Balance" value={formatCurrency(totalBalance, currencyCode)}>
                            <div className="bg-indigo-100 p-3 rounded-full"><Scale className="text-indigo-600" /></div>
                        </KPICard>
                        <KPICard title="Net Cash Flow (30d)" value={formatCurrency(netCashFlow, currencyCode)}>
                            <div className={`p-3 rounded-full ${netCashFlow >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                {netCashFlow >= 0 ? <TrendingUp className="text-green-600" /> : <TrendingDown className="text-red-600" />}
                            </div>
                        </KPICard>
                        <KPICard title="Inflow (30d)" value={formatCurrency(totalInflow, currencyCode)}>
                            <div className="bg-green-100 p-3 rounded-full"><TrendingUp className="text-green-600" /></div>
                        </KPICard>
                        <KPICard title="Outflow (30d)" value={formatCurrency(totalOutflow, currencyCode)}>
                            <div className="bg-red-100 p-3 rounded-full"><TrendingDown className="text-red-600" /></div>
                        </KPICard>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8 bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Cash Balance Trend</h3>
                            <CashBalanceChart transactions={chartTransactions} currencyCode={currencyCode} />
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Accounts Overview</h3>
                            <CashAccountsList accounts={cashAccounts} totalBalance={totalBalance} currencyCode={currencyCode} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Transactions</h3>
                        <CashTransactionsTable transactions={tableTransactions.slice(0, 10)} currencyCode={currencyCode} />
                    </div>
                </main>
            )}
            <CreateCashAccountModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateAccount}
                availableGLAccounts={availableGLAccounts}
                primaryColor={companyDetails?.primary_color}
            />
        </div>
    );
};
export default CashManagementPage;