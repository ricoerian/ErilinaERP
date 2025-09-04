export interface CashAccount {
    ID: number;
    company_id: number;
    account_id: number;
    account_name: string;
    balance: number;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface CashTransaction {
    ID: number;
    company_id: number;
    cash_account_id: number;
    TransactionDate: string;
    Description: string;
    Amount: number;
    Type: 'income' | 'expense';
    balance_after: number;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface BankStatementTransaction {
    ID: number;
    TransactionDate: string;
    Description: string;
    Amount: number;
    Status: string;
}