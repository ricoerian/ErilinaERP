// src/Components/FM/GeneralLedger/CreateAccountModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { FilePlus2, Hash, Type, Layers } from 'lucide-react';
import { Account } from '../../../types/generalLedger';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Account, 'ID' | 'CompanyID' | 'CreatedAt' | 'UpdatedAt'>) => void;
  account: Account | null;
  primaryColor: string;
}

const accountTypes = [
  "Asset", "Current Assets", "Cash", "Accounts Receivable", "Inventory", "Prepaid Expenses",
  "Non-Current Assets", "Fixed Assets", "Machinery", "Buildings", "Vehicles", "Accumulated Depreciation",
  "Liability", "Current Liabilities", "Accounts Payable", "Wages Payable", "Unearned Revenue",
  "Non-Current Liabilities", "Notes Payable", "Bonds Payable",
  "Equity", "Owner's Capital", "Retained Earnings", "Drawings",
  "Revenue", "Sales Revenue", "Service Revenue", "Interest Income",
  "Expense", "Cost of Goods Sold", "Rent Expense", "Wages Expense", "Utilities Expense", "Depreciation Expense", "General and Administrative Expenses"
];

const AccountTypeInput: React.FC<{ value: string; onChange: (value: string) => void; placeholder: string; options: string[] }> = ({ value, onChange, placeholder, options }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (value) {
      setFilteredOptions(options.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      ));
    } else {
      setFilteredOptions(options);
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (option: string) => {
    onChange(option);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        className="input input-bordered w-full pl-10 rounded-md"
        required
      />
      {showSuggestions && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li key={index} onClick={() => handleSelect(option)} className="p-2 cursor-pointer hover:bg-gray-100 text-gray-800">{option}</li>
            ))
          ) : (
            <li className="p-2 text-gray-500 italic">No suggestions found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

const CreateAccountModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, account, primaryColor }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState(accountTypes[0]);

  useEffect(() => {
    if (isOpen) {
      if (account) {
        setAccountNumber(account.AccountNumber);
        setAccountName(account.AccountName);
        setAccountType(account.AccountType);
      } else {
        setAccountNumber('');
        setAccountName('');
        setAccountType(accountTypes[0]);
      }
    }
  }, [account, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !accountName || !accountType) {
      console.error("Account Number, Name, and Type are required.");
      return;
    }
    onSubmit({ AccountNumber: accountNumber, AccountName: accountName, AccountType: accountType });
  };

  if (!isOpen) return null;
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  };
  
  const primaryColorRgb = hexToRgb(primaryColor);

  return (
    <div className="modal modal-open flex justify-center items-center fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50">
      <div className="modal-box relative w-11/12 max-w-lg bg-white shadow-xl rounded-lg p-0">
        <header className="flex items-start justify-between p-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `rgba(${primaryColorRgb}, 0.1)` }}>
              <FilePlus2 style={{ color: primaryColor }} size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800">{account ? 'Edit Account' : 'Create New Account'}</h3>
              <p className="text-sm text-slate-500 mt-1">Fill in the details to add a new account to the ledger.</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost btn-circle">✕</button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="form-control">
            <label className="label pb-1"><span className="label-text font-semibold text-slate-700">Account Number</span></label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-20" />
              <input type="text" placeholder="e.g., 1101" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="input input-bordered w-full pl-10 rounded-md" required />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">Unique identifier for the account (e.g., 1101 for Cash, 4100 for Sales).</p>
          </div>
          <div className="form-control">
            <label className="label pb-1"><span className="label-text font-semibold text-slate-700">Account Name</span></label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-20" />
              <input type="text" placeholder="e.g., Kas, Pendapatan Jasa" value={accountName} onChange={e => setAccountName(e.target.value)} className="input input-bordered w-full pl-10 rounded-md" required />
            </div>
          </div>
          <div className="form-control">
            <label className="label pb-1"><span className="label-text font-semibold text-slate-700">Account Type</span></label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-20" />
              <AccountTypeInput value={accountType} onChange={setAccountType} placeholder="Choose or type a new account type" options={accountTypes} />
            </div>
          </div>
        </form>

        <footer className="modal-action p-6 pt-4 border-t border-slate-200 flex justify-end">
          <button type="button" onClick={onClose} className="btn btn-ghost mr-2 rounded-md">Cancel</button>
          <button 
            type="submit" 
            onClick={handleSubmit} 
            className="btn btn-primary text-white rounded-md"
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
          >
            {account ? 'Update Account' : 'Create Account'}
          </button>
        </footer>
      </div>
      <div className="modal-backdrop absolute w-full h-full -z-10" onClick={onClose} style={{ cursor: 'pointer' }}></div>
    </div>
  );
};

export default CreateAccountModal;