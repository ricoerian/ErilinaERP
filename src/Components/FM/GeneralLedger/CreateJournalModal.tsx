// src/Components/FinancialManagement/GeneralLedger/modals/CreateJournalModal.tsx

import React, { useState } from 'react';
import { Account, JournalEntry, JournalCreationPayload } from '../../../types/generalLedger';
import { Plus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../../NotificationProvider';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: JournalCreationPayload) => void;
    accounts: Account[];
    currencyCode: string;
    primaryColor: string;
}

type EntryRow = Omit<JournalEntry, 'ID' | 'JournalID' | 'Account'>;

const CreateJournalModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, accounts, primaryColor }) => {
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
    const [mainDescription, setMainDescription] = useState('');
    const [referenceId, setReferenceId] = useState('');
    const { showNotification } = useNotification();
    const [entries, setEntries] = useState<EntryRow[]>([
        {
            AccountID: 0, Debit: 0, Credit: 0, Description: '',
            CreatedAt: '',
            UpdatedAt: ''
        },
        {
            AccountID: 0, Debit: 0, Credit: 0, Description: '',
            CreatedAt: '',
            UpdatedAt: ''
        },
    ]);

    const handleEntryChange = (index: number, field: keyof EntryRow, value: string | number) => {
        const newEntries = [...entries];
        const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newEntries[index] as any)[field] = field === 'Description' ? value : numValue;

        if (field === 'Debit' && numValue > 0) newEntries[index].Credit = 0;
        if (field === 'Credit' && numValue > 0) newEntries[index].Debit = 0;

        setEntries(newEntries);
    };

    const addEntryRow = () => {
        setEntries([...entries, {
            AccountID: 0, Debit: 0, Credit: 0, Description: '',
            CreatedAt: '',
            UpdatedAt: ''
        }]);
    };

    const removeEntryRow = (index: number) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    const totalDebit = entries.reduce((sum, entry) => sum + (entry.Debit || 0), 0);
    const totalCredit = entries.reduce((sum, entry) => sum + (entry.Credit || 0), 0);
    const isBalanced = totalDebit === totalCredit && totalDebit > 0;

    const handleSubmit = () => {
        if (!isBalanced) {
            showNotification("Debit and Credit totals must be balanced and greater than zero.", 'error');
            return;
        }
        if (entries.some(e => e.AccountID === 0)) {
            showNotification("Please select an account for every entry row.", 'error');
            return;
        }

        const payload: JournalCreationPayload = {
            TransactionDate: transactionDate,
            Description: mainDescription,
            ReferenceID: referenceId,
            JournalEntries: entries
                .filter(e => e.AccountID !== 0 && (e.Debit > 0 || e.Credit > 0))
                .map(e => ({
                    AccountID: e.AccountID,
                    Debit: e.Debit,
                    Credit: e.Credit,
                    Description: e.Description || mainDescription,
                })),
        };
        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl relative">
                <button onClick={onClose} className="btn btn-sm btn-circle absolute right-4 top-4 z-10">✕</button>
                <h3 className="font-bold text-xl text-slate-800">Create New Journal Entry</h3>
                <p className="text-slate-500 mt-1">Record a new transaction with balanced debits and credits.</p>

                <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Transaction Date</span></label>
                        <input type="date" value={transactionDate} onChange={e => setTransactionDate(e.target.value)} className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Reference</span></label>
                        <input type="text" value={referenceId} onChange={e => setReferenceId(e.target.value)} className="input input-bordered" placeholder="e.g., INV-123, Receipt-45" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Main Description</span></label>
                        <input type="text" value={mainDescription} onChange={e => setMainDescription(e.target.value)} className="input input-bordered" placeholder="e.g., Office supplies purchase for Q3" required />
                    </div>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                    <table className="table w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-3 text-slate-600 font-semibold w-[30%]">Account</th>
                                <th className="p-3 text-slate-600 font-semibold w-[35%]">Description</th>
                                <th className="p-3 text-slate-600 font-semibold w-[15%] text-right">Debit</th>
                                <th className="p-3 text-slate-600 font-semibold w-[15%] text-right">Credit</th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, index) => (
                                <tr key={index} className="border-b border-slate-200 last:border-0">
                                    <td className="p-2">
                                        <select
                                            value={entry.AccountID}
                                            onChange={e => handleEntryChange(index, 'AccountID', Number(e.target.value))}
                                            className="select select-bordered select-sm w-full"
                                        >
                                            <option disabled value={0}>Select Account</option>
                                            {accounts.map(acc => <option key={acc.ID} value={acc.ID}>{acc.AccountNumber} - {acc.AccountName}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-2"><input type="text" placeholder="Optional" value={entry.Description} onChange={e => handleEntryChange(index, 'Description', e.target.value)} className="input input-bordered input-sm w-full" /></td>
                                    <td className="p-2"><input type="number" step="0.01" min="0" value={entry.Debit} onChange={e => handleEntryChange(index, 'Debit', e.target.value)} className="input input-bordered input-sm w-full text-right" /></td>
                                    <td className="p-2"><input type="number" step="0.01" min="0" value={entry.Credit} onChange={e => handleEntryChange(index, 'Credit', e.target.value)} className="input input-bordered input-sm w-full text-right" /></td>
                                    <td className="p-2 text-center"><button onClick={() => removeEntryRow(index)} className="btn btn-ghost btn-xs text-red-500" disabled={entries.length <= 2}><Trash2 size={16} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50">
                            <tr>
                                <td colSpan={2} className="p-3 font-bold text-right text-slate-700">Totals</td>
                                <td className="p-3 font-mono font-bold text-right">{totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="p-3 font-mono font-bold text-right">{totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="p-3 text-center">{isBalanced ? <CheckCircle2 size={20} className="text-green-500" /> : <AlertTriangle size={20} className="text-orange-400" />}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <button onClick={addEntryRow} className="btn btn-sm btn-ghost mt-4" style={{ color: primaryColor }}><Plus size={16} className="mr-2" /> Add Row</button>

                <div className="modal-action">
                    <button onClick={onClose} className="btn btn-ghost">Cancel</button>
                    <button 
                        onClick={handleSubmit} 
                        className="btn btn-primary text-white" 
                        disabled={!isBalanced}
                        style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                    >
                        Create Journal
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};

export default CreateJournalModal;