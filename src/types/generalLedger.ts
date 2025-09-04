// src/types/generalLedger.ts

export interface Account {
    ID: number;
    CompanyID: number;
    AccountNumber: string;
    AccountName: string;
    AccountType: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface JournalEntry {
    ID: number;
    JournalID: number;
    AccountID: number;
    Debit: number;
    Credit: number;
    Description: string;
    Account?: Account;
    TransactionDate?: string; 
    runningBalance?: number;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface Journal {
    ID: number;
    CompanyID: number;
    TransactionDate: string;
    ReferenceID: string;
    Description: string;
    JournalEntries: JournalEntry[];
    CreatedAt: string;
    UpdatedAt: string;
}

export interface ReportJournalEntry {
  transaction_date: string;
  journal_description: string;
  account_name: string;
  debit: number;
  credit: number;
  runningBalance?: number;
}

export type ViewMode = 'table' | 'chart';
export type SortColumn = keyof Account | 'Balance';

export type JournalCreationPayload = Omit<Journal, 'ID' | 'CompanyID' | 'CreatedAt' | 'UpdatedAt' | 'JournalEntries'> & {
    JournalEntries: Omit<JournalEntry, 'ID' | 'JournalID' | 'CreatedAt' | 'UpdatedAt' | 'Account' | 'runningBalance' | 'TransactionDate'>[];
};