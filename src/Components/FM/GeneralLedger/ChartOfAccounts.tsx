import React, { useMemo, useState } from 'react';
import { Account, Journal } from '../../../types/generalLedger';
import { Folder, FileText as FileIcon, ChevronRight, Edit, Trash2, FileText as ReportIcon } from 'lucide-react';

interface TreeNode {
    account: Account;
    children: TreeNode[];
}

interface Props {
    accounts: Account[];
    journals: Journal[];
    currencyCode: string;
    onEditAccount: (account: Account) => void;
    onDeleteAccount: (id: number) => void;
    onGenerateReport: (account: Account) => void;
    primaryColor: string;
}

const buildTree = (accounts: Account[]): TreeNode[] => {
    const tree: TreeNode[] = [];
    const map: { [key: string]: TreeNode } = {};

    const sortedAccounts = [...accounts].sort((a, b) => a.AccountNumber.localeCompare(b.AccountNumber));

    sortedAccounts.forEach(account => {
        map[account.AccountNumber] = { account, children: [] };
    });
    
    sortedAccounts.forEach(account => {
        let parentNumber = account.AccountNumber.slice(0, -1);
        let parentNode = map[parentNumber];

        while (!parentNode && parentNumber.length > 1) {
            parentNumber = parentNumber.slice(0, -1);
            parentNode = map[parentNumber];
        }

        if (parentNode) {
            parentNode.children.push(map[account.AccountNumber]);
        } else {
            tree.push(map[account.AccountNumber]);
        }
    });

    return tree;
};

const Node: React.FC<{ 
    node: TreeNode; 
    journals: Journal[]; 
    currencyCode: string; 
    onEditAccount: (account: Account) => void;
    onDeleteAccount: (id: number) => void;
    onGenerateReport: (account: Account) => void;
    expandedNodeId: number | null;
    toggleNode: (id: number) => void;
    primaryColor: string;
}> = ({ node, journals, currencyCode, onEditAccount, onDeleteAccount, onGenerateReport, expandedNodeId, toggleNode, primaryColor }) => {
    const isParent = node.children.length > 0;
    const isExpanded = expandedNodeId === node.account.ID;
    
    const { entries, balance } = useMemo(() => {
        const relevantEntries = journals
            .flatMap(j => j.JournalEntries)
            .filter(entry => entry.AccountID === node.account.ID);
        
        const totalDebit = relevantEntries.reduce((sum, entry) => sum + entry.Debit, 0);
        const totalCredit = relevantEntries.reduce((sum, entry) => sum + entry.Credit, 0);

        const debitNormalBalanceTypes = new Set([
            "Asset", "Current Assets", "Cash", "Accounts Receivable", "Inventory", "Prepaid Expenses",
            "Non-Current Assets", "Fixed Assets", "Machinery", "Buildings", "Vehicles", 
            "Drawings",
            "Expense", "Cost of Goods Sold", "Rent Expense", "Wages Expense", "Utilities Expense", 
            "Depreciation Expense", "General and Administrative Expenses"
        ]);

        let calculatedBalance = 0;
        if (debitNormalBalanceTypes.has(node.account.AccountType)) { 
            calculatedBalance = totalDebit - totalCredit;
        } else {
            calculatedBalance = totalCredit - totalDebit;
        }

        return { entries: relevantEntries, balance: calculatedBalance };
    }, [node.account, journals]);


    const formatBalance = (amount: number, currencyCode: string) => {
        const formatted = amount.toLocaleString(`${currencyCode}`, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (amount > 0) return `+${formatted}`;
        if (amount < 0) return formatted;
        return formatted;
    };

    return (
        <li className="relative">
            <span className="absolute left-4 top-5 h-full border-l-2 border-slate-200"></span>
            <div className="flex items-center py-2 relative">
                <span className="absolute left-4 top-1/2 w-4 border-t-2 border-slate-200"></span>
                <div className="z-10 flex items-center p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 border border-slate-200 w-full ml-8 transition-colors">
                    <button onClick={() => toggleNode(node.account.ID)} className="btn btn-ghost btn-xs p-1">
                        <ChevronRight size={18} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'text-slate-400'}`} style={{ color: isExpanded ? primaryColor : '' }} />
                    </button>
                    {isParent ? <Folder size={18} className="mr-3 text-indigo-500 flex-shrink-0" style={{ color: primaryColor }} /> : <FileIcon size={18} className="mr-3 text-slate-400 flex-shrink-0" />}
                    <span className="font-mono text-sm text-slate-500 mr-4">{node.account.AccountNumber}</span>
                    <span className="font-medium text-slate-800 truncate">{node.account.AccountName}</span>
                    <span className="ml-auto bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 mr-2">{node.account.AccountType}</span>
                    
                    <button onClick={() => onGenerateReport(node.account)} className="btn btn-ghost btn-xs text-slate-500 hover:text-blue-600" title="Generate Report">
                        <ReportIcon size={16} />
                    </button>
                    <button onClick={() => onEditAccount(node.account)} className="btn btn-ghost btn-xs text-slate-500" title="Edit Account" style={{'--hover-color': primaryColor} as React.CSSProperties} onMouseOver={e => e.currentTarget.style.color = primaryColor} onMouseOut={e => e.currentTarget.style.color = ''}>
                        <Edit size={16} />
                    </button>
                    <button onClick={() => onDeleteAccount(node.account.ID)} className="btn btn-ghost btn-xs text-slate-500 hover:text-red-600" title="Delete Account">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {isExpanded && entries.length > 0 && (
                <ul className="pl-12 space-y-1">
                    <div className="flex justify-between items-center py-2 text-sm text-slate-600 font-semibold border-b border-slate-200">
                        <span>Transaction Details</span>
                        <span className={`font-bold text-base ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatBalance(balance, currencyCode)} {currencyCode}
                        </span>
                    </div>
                    {entries.map(entry => {
                        const parentJournal = journals.find(j => j.ID === entry.JournalID);
                        return (
                            <li key={entry.ID} className="flex items-center py-1 relative">
                                <span className="absolute left-0 top-1/2 w-4 border-t-2 border-slate-200"></span>
                                <div className="z-10 flex items-center p-2 bg-white rounded-lg border border-slate-200 w-full transition-colors hover:bg-slate-50">
                                    <FileIcon size={16} className="mr-3 text-slate-400" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-slate-800">{entry.Description || parentJournal?.Description}</div>
                                        <div className="text-xs text-slate-500">{parentJournal?.ReferenceID} - {parentJournal ? new Date(parentJournal.TransactionDate).toLocaleDateString() : 'N/A'}</div>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <div className="font-mono text-xs text-green-600">{entry.Debit > 0 ? new Intl.NumberFormat('id-ID').format(entry.Debit) : ''}</div>
                                        <div className="font-mono text-xs text-red-600">{entry.Credit > 0 ? new Intl.NumberFormat('id-ID').format(entry.Credit) : ''}</div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
            
            {isExpanded && entries.length === 0 && (
                 <p className="text-center text-slate-500 py-4 text-sm">No transactions found for this account.</p>
            )}

            {isParent && isExpanded && (
                <ul className="pl-8">
                    {node.children.map(child => <Node key={child.account.ID} node={child} {...{ journals, currencyCode, onEditAccount, onDeleteAccount, onGenerateReport, expandedNodeId, toggleNode, primaryColor }} />)}
                </ul>
            )}
        </li>
    );
};

const ChartOfAccounts: React.FC<Props> = ({ accounts, journals, currencyCode, onEditAccount, onDeleteAccount, onGenerateReport, primaryColor }) => {
    const accountTree = useMemo(() => buildTree(accounts), [accounts]);
    const [expandedNodeId, setExpandedNodeId] = useState<number | null>(null);

    const toggleNode = (id: number) => {
        setExpandedNodeId(expandedNodeId === id ? null : id);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Chart of Accounts</h2>
            {accountTree.length > 0 ? (
                <ul className="space-y-1">
                    {accountTree.map(rootNode => (
                        <Node 
                            key={rootNode.account.ID} 
                            node={rootNode} 
                            journals={journals} 
                            currencyCode={currencyCode} 
                            onEditAccount={onEditAccount}
                            onDeleteAccount={onDeleteAccount}
                            onGenerateReport={onGenerateReport}
                            expandedNodeId={expandedNodeId}
                            toggleNode={toggleNode}
                            primaryColor={primaryColor}
                        />
                    ))}
                </ul>
            ) : (
                 <p className="text-center text-slate-500 py-10">No accounts found to build the chart.</p>
            )}
        </div>
    );
};

export default ChartOfAccounts;