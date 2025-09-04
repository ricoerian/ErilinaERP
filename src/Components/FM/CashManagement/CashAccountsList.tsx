import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Wallet } from 'lucide-react'; 
import { CashAccount } from '../../../types/cashManagement';

interface Props {
    accounts: CashAccount[];
    totalBalance: number;
    currencyCode: string;
}

const CashAccountsList: React.FC<Props> = ({ accounts, totalBalance, currencyCode }) => {

    return (
        <div className="space-y-6 animate-fade-in">
            {accounts.map(account => {
                const percentage = totalBalance > 0 ? (account.balance / totalBalance) * 100 : 0;
                const isBank = (account.account_name || '').toLowerCase().includes('bank');

                return (
                    <div key={account.ID} className="flex flex-col gap-2 p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className={`flex-shrink-0 p-2 rounded-full ${isBank ? 'bg-indigo-100' : 'bg-cyan-100'}`}>
                                    {isBank ?
                                        <Landmark className="text-indigo-600" size={20} /> :
                                        <Wallet className="text-cyan-600" size={20} />
                                    }
                                </div>
                                <p className="font-semibold text-slate-800">{account.account_name}</p>
                            </div>
                            <Link 
                                to={`accounts/${account.ID}/reconciliation`}
                                className="btn btn-sm btn-ghost text-blue-600 hover:bg-indigo-100 font-semibold"
                            >
                                Reconcile
                            </Link>
                        </div>

                        {/* Baris Tengah: Saldo */}
                        <div>
                             <p className="text-lg font-mono font-bold text-slate-900">
                                {new Intl.NumberFormat('en-US', { 
                                    style: 'currency', 
                                    currency: currencyCode,
                                    maximumFractionDigits: 2,
                                }).format(account.balance)}
                            </p>
                        </div>

                        {/* Baris Bawah: Progress Bar */}
                        <div className="mt-1 flex items-center gap-2">
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                                <div 
                                    className={`h-1.5 rounded-full ${isBank ? 'bg-indigo-500' : 'bg-cyan-500'}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <p className="font-mono text-xs font-medium text-slate-500">{percentage.toFixed(0)}%</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CashAccountsList;