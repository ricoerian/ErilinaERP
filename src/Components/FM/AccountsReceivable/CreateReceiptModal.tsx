// File: components/FM/AccountsReceivable/CreateReceiptModal.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Invoice } from '../../../types/accountsReceivable';
import { Account } from '../../../types/generalLedger';
import { Landmark, Coins } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (receiptData: { receipt: { receivedAmount: number; paymentMethod: string; referenceNumber: string; bankCashAccountId: number; arAccountId: number; }; invoiceIds: number[]; }) => Promise<void>;
    invoicesToPay: Invoice[];
    cashOrBankAccounts: Account[];
    defaultArAccount: Account | null;
    primaryColor?: string;
}

const CreateReceiptModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, invoicesToPay, cashOrBankAccounts, defaultArAccount, primaryColor }) => {
    const totalDue = useMemo(() => invoicesToPay.reduce((sum, inv) => sum + (inv.totalAmount - inv.amountPaid), 0), [invoicesToPay]);

    const [receivedAmount, setReceivedAmount] = useState(totalDue);
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [bankCashAccountId, setBankCashAccountId] = useState<number | undefined>(cashOrBankAccounts.length > 0 ? cashOrBankAccounts[0].ID : undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setReceivedAmount(totalDue);
            // Reset state
            setReferenceNumber('');
            setPaymentMethod('Bank Transfer');
            if (cashOrBankAccounts.length > 0 && !bankCashAccountId) {
                setBankCashAccountId(cashOrBankAccounts[0].ID);
            }
        }
    }, [isOpen, totalDue, cashOrBankAccounts, bankCashAccountId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bankCashAccountId || !defaultArAccount) {
            alert("Cash/Bank Account and AR Account must be available."); return;
        }
        if (receivedAmount <= 0) {
            alert("Invalid received amount."); return;
        }
        setLoading(true);
        await onSubmit({
            receipt: { receivedAmount, paymentMethod, referenceNumber, bankCashAccountId, arAccountId: defaultArAccount.ID },
            invoiceIds: invoicesToPay.map(inv => inv.id)
        });
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open animate-fade-in-fast">
            <div className="modal-box w-11/12 max-w-lg bg-white shadow-2xl rounded-2xl">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
                <h3 className="font-bold text-2xl text-slate-800">Record Receipt</h3>
                <p className="mt-2 text-slate-500">
                    Recording payment for {invoicesToPay.length} invoice(s) with a total due of <span className="font-bold text-green-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDue)}</span>
                </p>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* ... form fields similar to CreatePaymentModal but for receipts ... */}
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text font-semibold text-slate-600">Amount Received</span></div>
                        <div className="relative"><Coins size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><input type="number" value={receivedAmount} onChange={e => setReceivedAmount(parseFloat(e.target.value) || 0)} className="input input-bordered w-full pl-10" required /></div>
                    </label>
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text font-semibold text-slate-600">Deposit to (Cash/Bank Account)</span></div>
                        <div className="relative"><Landmark size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><select value={bankCashAccountId} onChange={e => setBankCashAccountId(Number(e.target.value))} className="select select-bordered w-full pl-10" required>{cashOrBankAccounts.map(acc => <option key={acc.ID} value={acc.ID}>{acc.AccountNumber} - {acc.AccountName}</option>)}</select></div>
                    </label>
                    {/* ... other fields ... */}
                     <div className="modal-action pt-6">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn text-white" style={{ backgroundColor: primaryColor }} disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : `Confirm Receipt`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReceiptModal;