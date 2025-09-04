// File: src/Components/FM/CashManagement/CashTransactionsTable.tsx

import React from 'react';
import { CashTransaction } from '../../../types/cashManagement';
import { ArrowDownLeft, ArrowUpRight, Inbox } from 'lucide-react';

interface Props {
    transactions: CashTransaction[];
    currencyCode: string; // Prop baru ditambahkan
}

const CashTransactionsTable: React.FC<Props> = ({ transactions, currencyCode }) => {
    // Fungsi format sekarang menggunakan prop currencyCode
    const formatCurrency = (amount: number): string => new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currencyCode 
    }).format(amount);

    const formatDate = (dateString: string): string => new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (transactions.length === 0) {
        return (
            <div className="text-center py-16">
                <Inbox size={48} className="mx-auto text-slate-300" />
                <h3 className="text-xl font-semibold text-slate-700 mt-4">No Transactions Found</h3>
                <p className="text-slate-500 mt-2">There are no cash or bank transactions recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="text-sm text-slate-500 uppercase tracking-wider border-b-2 border-slate-200">
                        <th className="p-3 font-medium bg-transparent">Date</th>
                        <th className="p-3 font-medium bg-transparent">Description</th>
                        <th className="text-right p-3 font-medium bg-transparent">Amount</th>
                        <th className="text-right p-3 font-medium bg-transparent">Balance After</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => {
                        const isIncome = tx.Type === 'income';
                        return (
                            <tr key={tx.ID} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100">
                                <td className="py-4 px-3 text-slate-500">{formatDate(tx.TransactionDate)}</td>
                                <td className="py-4 px-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex-shrink-0 p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {isIncome ? <ArrowDownLeft size={16} className="text-green-600"/> : <ArrowUpRight size={16} className="text-red-600"/>}
                                        </div>
                                        <span className="font-medium text-slate-800">{tx.Description}</span>
                                    </div>
                                </td>
                                <td className={`text-right py-4 px-3 font-mono font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                                    {isIncome ? '+' : '-'} {formatCurrency(tx.Amount)}
                                </td>
                                <td className="text-right py-4 px-3 font-mono font-medium text-slate-600">
                                    {formatCurrency(tx.balance_after)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CashTransactionsTable;