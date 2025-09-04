// File: src/Components/FM/CashManagement/CashManagementHeader.tsx

import React, { memo } from 'react';
import { RefreshCw, Plus } from 'lucide-react';

interface Props {
    primaryColor?: string;
    onRefresh: () => void;
    onAddNew: () => void;
}

const CashManagementHeader: React.FC<Props> = memo(({ onRefresh, onAddNew, primaryColor }) => {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Cash Management Dashboard</h1>
                <p className="text-slate-500 mt-1">An overview of your company's cash flow and bank balances.</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onRefresh}
                    className="btn btn-ghost btn-circle text-slate-600 hover:bg-slate-200 transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw size={20} />
                </button>
                <button
                    onClick={onAddNew}
                    className="btn text-white"
                    style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                >
                    <Plus size={20} /> Add Account
                </button>
            </div>
        </header>
    );
});

export default CashManagementHeader;