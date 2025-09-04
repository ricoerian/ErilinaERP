// File: types/accountsReceivable.ts

import { SalesOrder } from './salesOrder'; // Asumsi Anda punya tipe untuk SalesOrder

// --- INTERFACE UTAMA UNTUK ACCOUNTS RECEIVABLE ---
export interface Invoice {
    id: number;
    companyId: number;
    customerId: string;
    customer?: Customer;
    invoiceNumber: string;
    invoiceDate: string; // ISO date string
    dueDate: string;     // ISO date string
    totalAmount: number;
    amountPaid: number;
    status: InvoiceStatus;
    salesOrderId?: string;
    salesOrder?: SalesOrder;
    createdAt: string;
    updatedAt: string;
    items?: InvoiceItem[];
}

export interface InvoiceItem {
    id: number;
    accountId: number;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Receipt {
    id?: number;
    companyId: number;
    receiptDate: string;
    paymentMethod: string;
    referenceNumber: string;
    receivedAmount: number;
    arAccountId: number;
    bankCashAccountId: number;
}

// --- Interface Pendukung ---
export interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
}

// --- Tipe dan Interface Lainnya ---
export type InvoiceStatus =
    | 'Draft'
    | 'Awaiting Payment'
    | 'Partial Paid'
    | 'Paid'
    | 'Cancelled';

export interface CreateInvoiceFromSORequest {
    arAccountId: number;
    revenueAccountId: number;
}

export interface CreateReceiptRequest {
    receipt: Omit<Receipt, 'id' | 'companyId'>;
    invoiceIds: number[];
}