// File: src/Pages/Company/FM/CashManagement/BankReconciliationPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNotification } from '../../../../Components/NotificationProvider';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import { URL_BEFMCM } from '../../../../Utils/Constants';
import { BankStatementTransaction } from '../../../../types/cashManagement';
import { JournalEntry } from '../../../../types/generalLedger';
import { Upload, GitMerge, Inbox, ArrowLeft } from 'lucide-react';

interface ReconciliationData {
    bankTransactions: BankStatementTransaction[];
    systemTransactions: JournalEntry[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TxRow = ({ tx, isBankTx, isSelected, onSelect, currencyCode }: any) => {
    const amount = isBankTx ? tx.Amount : tx.Debit - tx.Credit;
    const isPositive = amount >= 0;

    return (
        <tr 
            className={`hover:bg-sky-50 cursor-pointer ${isSelected ? 'bg-sky-100 ring-2 ring-sky-300' : ''}`}
            onClick={() => onSelect(tx)}
        >
            <td className="p-3">
                <p className="font-medium text-slate-800">{new Date(tx.TransactionDate).toLocaleDateString('en-GB')}</p>
            </td>
            <td className="p-3 text-slate-600">{isBankTx ? tx.Description : tx.Description || 'Journal Entry'}</td>
            <td className={`p-3 text-right font-mono font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount)}
            </td>
        </tr>
    );
};


const BankReconciliationPage: React.FC = () => {
    const { account_id } = useParams<{ account_id: string }>();
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();

    const [data, setData] = useState<ReconciliationData>({ bankTransactions: [], systemTransactions: [] });
    const [loading, setLoading] = useState(true);
    const [selectedBankTx, setSelectedBankTx] = useState<BankStatementTransaction | null>(null);
    const [selectedSystemTx, setSelectedSystemTx] = useState<JournalEntry | null>(null);
    
    const currencyCode = companyDetails?.currency_code || 'USD';

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${URL_BEFMCM}/api/companies/${companyDetails?.id}/cash-management/accounts/${account_id}/reconciliation`, { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch reconciliation data');
            const result: ReconciliationData = await response.json();
            setData(result);
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    }, [account_id, companyDetails?.id, showNotification]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('statement', file);

        setLoading(true); // Tampilkan loading saat upload
        try {
            const response = await fetch(`${URL_BEFMCM}/api/companies/${companyDetails?.id}/cash-management/accounts/${account_id}/reconciliation/upload`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Upload failed');
            showNotification('File uploaded successfully! Data is being processed.', 'success');
            await fetchData(); // Refresh data setelah upload berhasil
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'Upload failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleMatch = async () => {
        if (!selectedBankTx || !selectedSystemTx) return;
        setLoading(true); // Tampilkan loading saat proses match
        try {
            const response = await fetch(`${URL_BEFMCM}/api/companies/${companyDetails?.id}/cash-management/accounts/${account_id}/reconciliation/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    bankTransactionId: selectedBankTx.ID,
                    journalEntryId: selectedSystemTx.ID,
                }),
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Match failed');
            showNotification('Transactions matched successfully!', 'success');
            setSelectedBankTx(null);
            setSelectedSystemTx(null);
            await fetchData(); // Refresh data
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'Match failed', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const amountBank = selectedBankTx ? selectedBankTx.Amount : 0;
    const amountSystem = selectedSystemTx ? (selectedSystemTx.Debit - selectedSystemTx.Credit) : 0;
    const isMatchable = selectedBankTx && selectedSystemTx && (amountBank === amountSystem);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderTable = (transactions: any[], isBankTx: boolean) => (
        <div className="overflow-y-auto h-[60vh]">
            <table className="table w-full">
                <thead>
                    <tr className="text-sm text-slate-500 uppercase bg-slate-50">
                        <th className="p-3">Date</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <TxRow 
                            key={tx.ID}
                            tx={tx}
                            isBankTx={isBankTx}
                            isSelected={isBankTx ? selectedBankTx?.ID === tx.ID : selectedSystemTx?.ID === tx.ID}
                            onSelect={isBankTx ? setSelectedBankTx : setSelectedSystemTx}
                            currencyCode={currencyCode}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderEmptyState = (title: string) => (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <Inbox size={48} className="text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-700 mt-4">{title}</h3>
            <p className="text-slate-500 mt-2">Upload a bank statement to get started.</p>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link to={`/${companyDetails?.slug}/fm/cash`} className="btn btn-ghost btn-circle">
                         <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Bank Reconciliation</h1>
                        <p className="text-slate-500 mt-1">Match bank statements with your system transactions.</p>
                    </div>
                </div>
                <label className="btn text-white" style={{ backgroundColor: companyDetails?.primary_color }}>
                    <Upload size={20} className="mr-2" />
                    Upload Statement
                    <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                </label>
            </header>

            {loading ? (
                 <div className="flex justify-center items-center h-[60vh]">
                    <span className="loading loading-spinner loading-lg" style={{ color: companyDetails?.primary_color }}></span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">Bank Statement Transactions ({data.bankTransactions.length})</h2>
                        {data.bankTransactions.length > 0 ? renderTable(data.bankTransactions, true) : renderEmptyState("No Bank Transactions")}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">System Transactions (GL) ({data.systemTransactions.length})</h2>
                        {data.systemTransactions.length > 0 ? renderTable(data.systemTransactions, false) : renderEmptyState("No Unreconciled System Transactions")}
                    </div>
                </div>
            )}
            
            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t shadow-lg flex justify-center items-center gap-6 h-24">
                <button 
                    className="btn btn-lg btn-success text-white disabled:bg-slate-300 transition-all duration-300 w-64" 
                    disabled={!isMatchable || loading} 
                    onClick={handleMatch}
                >
                    <GitMerge size={24} className="mr-2" />
                    {loading ? <span className="loading loading-spinner"></span> : 'Match Selected'}
                </button>
            </footer>
        </div>
    );
};

export default BankReconciliationPage;