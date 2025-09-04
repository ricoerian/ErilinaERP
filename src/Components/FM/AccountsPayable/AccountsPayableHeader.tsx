import React, { memo } from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface Props {
    onSearchChange: (searchTerm: string) => void;
    onRefresh: () => void;
}

const AccountsPayableHeader: React.FC<Props> = memo(({ onSearchChange, onRefresh }) => {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Accounts Payable</h1>
                <p className="text-slate-500 mt-1">Manage your company's payables from purchase order to final payment.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="input input-bordered flex items-center gap-2 w-full sm:w-80 shadow-sm bg-white">
                    <Search className="text-slate-400" size={20} />
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search Bills or Suppliers..."
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </label>
                <button
                    onClick={onRefresh}
                    className="btn btn-ghost btn-circle text-slate-600 hover:bg-slate-200 transition-colors"
                    data-tip="Refresh Data"
                >
                    <RefreshCw size={20} />
                </button>
            </div>
        </header>
    );
});

export default AccountsPayableHeader;