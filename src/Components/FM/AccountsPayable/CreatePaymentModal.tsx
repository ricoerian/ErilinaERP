import React, { useState, useMemo, useEffect } from 'react';
import { Bill } from '../../../types/accountsPayable';
import { Account } from '../../../types/generalLedger';
import { Hash, Landmark, CreditCard, Coins } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (paymentData: { payment: { paymentAmount: number; paymentMethod: string; referenceNumber: string; bankCashAccountId: number; apAccountId: number; }; billIds: number[]; }) => Promise<void>;
    billsToPay: Bill[];
    cashOrBankAccounts: Account[];
    defaultApAccount: Account | null;
    primaryColor?: string;
}

const CreatePaymentModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, billsToPay, cashOrBankAccounts, defaultApAccount, primaryColor }) => {
    const totalDue = useMemo(() => billsToPay.reduce((sum, bill) => sum + (bill.totalAmount - bill.amountPaid), 0), [billsToPay]);

    const [paymentAmount, setPaymentAmount] = useState(totalDue);
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [bankCashAccountId, setBankCashAccountId] = useState<number | undefined>(cashOrBankAccounts.length > 0 ? cashOrBankAccounts[0].ID : undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPaymentAmount(totalDue);
            setReferenceNumber('');
            setPaymentMethod('Bank Transfer');
            if (cashOrBankAccounts.length > 0 && !bankCashAccountId) {
                setBankCashAccountId(cashOrBankAccounts[0].ID);
            }
        }
    }, [isOpen, totalDue, cashOrBankAccounts, bankCashAccountId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bankCashAccountId || !defaultApAccount) {
            alert("Cash/Bank Account and AP Account must be available."); return;
        }
        if (paymentAmount <= 0 || paymentAmount > totalDue) {
            alert("Invalid payment amount."); return;
        }
        setLoading(true);
        await onSubmit({
            payment: { paymentAmount, paymentMethod, referenceNumber, bankCashAccountId, apAccountId: defaultApAccount.ID },
            billIds: billsToPay.map(b => b.ID)
        });
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open animate-fade-in-fast">
            <div className="modal-box w-11/12 max-w-lg bg-white shadow-2xl rounded-2xl">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
                <h3 className="font-bold text-2xl text-slate-800">New Payment</h3>
                <p className="mt-2 text-slate-500">
                    You are paying {billsToPay.length} bill(s) with a total due of <span className="font-bold text-indigo-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDue)}</span>
                </p>
                <div className="divider my-4"></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text font-semibold text-slate-600">Payment Amount</span></div>
                        <div className="relative"><Coins size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-20"/><input type="number" value={paymentAmount} onChange={e => setPaymentAmount(parseFloat(e.target.value) || 0)} max={totalDue} className="input input-bordered w-full pl-10 bg-slate-50" required /></div>
                    </label>
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text font-semibold text-slate-600">Funding Source (Cash/Bank Account)</span></div>
                        <div className="relative"><Landmark size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-20"/><select value={bankCashAccountId} onChange={e => setBankCashAccountId(Number(e.target.value))} className="select select-bordered w-full pl-10 bg-slate-50" required>{cashOrBankAccounts.length === 0 ? <option disabled>No Cash/Bank accounts found</option> : cashOrBankAccounts.map(acc => <option key={acc.ID} value={acc.ID}>{acc.AccountNumber} - {acc.AccountName}</option>)}</select></div>
                    </label>
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text font-semibold text-slate-600">Payment Method</span></div>
                        <div className="relative"><CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-20"/><select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="select select-bordered w-full pl-10 bg-slate-50" required><option>Bank Transfer</option><option>Cash</option><option>Credit Card</option></select></div>
                    </label>
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text font-semibold text-slate-600">Reference # (Optional)</span></div>
                        <div className="relative"><Hash size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-20"/><input type="text" value={referenceNumber} onChange={e => setReferenceNumber(e.target.value)} placeholder="e.g., Check No., Transaction ID" className="input input-bordered w-full pl-10 bg-slate-50" /></div>
                    </label>
                    <div className="modal-action pt-6">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button 
                            type="submit" 
                            className="btn text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                            disabled={loading || billsToPay.length === 0}
                        >
                            {loading ? <span className="loading loading-spinner"></span> : `Confirm Payment`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePaymentModal;