import React from 'react';
import { ViewMode } from '../../../types/generalLedger';
import { List, GitMerge, Plus, BookOpen, Search, Printer, BarChart2, ChevronDown } from 'lucide-react';

interface Props {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    onOpenAccountModal: () => void;
    onOpenJournalModal: () => void;
    onOpenReport: () => void;
    onOpenBalanceSheet: () => void;
    primaryColor: string;
}

const GeneralLedgerHeader: React.FC<Props> = ({
    searchTerm, onSearchTermChange, viewMode, onViewModeChange, onOpenAccountModal, onOpenJournalModal, onOpenReport, onOpenBalanceSheet, primaryColor
}) => {
    
    const activeTabStyle: React.CSSProperties = {
        backgroundColor: 'white',
        color: primaryColor,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200/80">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Bagian Kiri: Search & View Toggles */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            className="input input-bordered w-full sm:w-64 pl-10 bg-slate-50"
                        />
                    </div>
                    <div className="p-1 bg-slate-100 rounded-lg flex gap-1">
                        <button
                            onClick={() => onViewModeChange('table')}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${viewMode === 'table' ? '' : 'text-slate-600 hover:bg-slate-200'}`}
                            style={viewMode === 'table' ? activeTabStyle : {}}
                            title="Table View"
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => onViewModeChange('chart')}
                             className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${viewMode === 'chart' ? '' : 'text-slate-600 hover:bg-slate-200'}`}
                             style={viewMode === 'chart' ? activeTabStyle : {}}
                             title="Chart View"
                        >
                            <GitMerge size={18} />
                        </button>
                    </div>
                </div>

                {/* Bagian Kanan: Tombol Aksi */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost text-slate-600 font-medium">
                            <Printer size={18} className="mr-1" />
                            Reports
                            <ChevronDown size={16} />
                        </button>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-60 z-50">
                            <li>
                                {/* --- PERBAIKAN DI SINI --- */}
                                <a onClick={() => {
                                    onOpenBalanceSheet();
                                    if (document.activeElement instanceof HTMLElement) {
                                        document.activeElement.blur();
                                    }
                                }}>
                                    <BarChart2 size={16} /> Balance Sheet
                                </a>
                            </li>
                            <li>
                                {/* --- PERBAIKAN DI SINI --- */}
                                <a onClick={() => {
                                    onOpenReport();
                                    if (document.activeElement instanceof HTMLElement) {
                                        document.activeElement.blur();
                                    }
                                }}>
                                    <List size={16} /> GL Transaction Report
                                </a>
                            </li>
                        </ul>
                    </div>

                    <button onClick={onOpenJournalModal} className="btn btn-ghost text-slate-600 font-medium">
                        <BookOpen size={18} className="mr-2" />
                        New Journal
                    </button>
                    <button 
                        onClick={onOpenAccountModal} 
                        className="btn text-white"
                        style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                    >
                        <Plus size={18} className="mr-2" />
                        New Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneralLedgerHeader;