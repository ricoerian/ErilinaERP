// File: src/Components/FM/CashManagement/CreateCashAccountModal.tsx

import React, { useState, useEffect } from 'react';
import { Account } from '../../../types/generalLedger';
import { Landmark } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (accountData: { accountId: number; accountName: string }) => Promise<void>;
    availableGLAccounts: Account[];
    primaryColor?: string;
}

const CreateCashAccountModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, availableGLAccounts, primaryColor }) => {
    const [selectedAccountId, setSelectedAccountId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && availableGLAccounts.length > 0) {
            setSelectedAccountId(availableGLAccounts[0].ID);
        } else if (isOpen) {
            setSelectedAccountId(undefined);
        }
    }, [isOpen, availableGLAccounts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAccountId) {
            alert("Please select an account to add.");
            return;
        }
        const selectedAccount = availableGLAccounts.find(acc => acc.ID === selectedAccountId);
        if (!selectedAccount) {
            alert("Selected account not found.");
            return;
        }

        setLoading(true);
        await onSubmit({
            accountId: selectedAccount.ID,
            accountName: selectedAccount.AccountName,
        });
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open animate-fade-in-fast">
            <div className="modal-box w-11/12 max-w-lg bg-white shadow-2xl rounded-2xl">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
                <h3 className="font-bold text-2xl text-slate-800">Add Cash Account</h3>
                <p className="mt-2 text-slate-500">
                    Register an existing account from the General Ledger to be managed here.
                </p>
                <div className="divider my-4"></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text font-semibold text-slate-600">Select Account from GL</span></div>
                        <div className="relative">
                            <Landmark size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-20" />
                            <select
                                value={selectedAccountId}
                                onChange={e => setSelectedAccountId(Number(e.target.value))}
                                className="select select-bordered w-full pl-10 bg-slate-50"
                                required
                                disabled={availableGLAccounts.length === 0}
                            >
                                {availableGLAccounts.length === 0 ? (
                                    <option disabled>No available Cash/Bank accounts in GL</option>
                                ) : (
                                    availableGLAccounts.map(acc => (
                                        <option key={acc.ID} value={acc.ID}>
                                            {acc.AccountNumber} - {acc.AccountName}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </label>
                    <div className="modal-action pt-6">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button
                            type="submit"
                            className="btn text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                            disabled={loading || availableGLAccounts.length === 0}
                        >
                            {loading ? <span className="loading loading-spinner"></span> : `Add Account`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCashAccountModal;