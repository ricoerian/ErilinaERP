// File: types/accountsPayable.ts

// --- INTERFACE UTAMA YANG DIPERBAIKI ---
export interface Bill {
    // Properti disesuaikan dengan respons JSON dari backend
    ID: number;                         // Sebelumnya 'id'
    companyId: number;
    supplierId: string;
    Supplier?: Supplier;                // Sebelumnya 'supplier'
    billNumber: string;
    billDate: string;                   // ISO date string
    dueDate: string;                    // ISO date string
    totalAmount: number;
    amountPaid: number;
    status: BillStatus;
    purchaseOrderId?: string;
    PurchaseOrder?: PurchaseOrder;      // Sebelumnya 'purchaseOrder'
    CreatedAt: string;                  // Sebelumnya 'createdAt'
    UpdatedAt: string;                  // Sebelumnya 'updatedAt'
    items?: BillItem[];
}

export interface BillItem {
    ID: number;                         // Sebelumnya 'id'
    accountId: number;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    CreatedAt: string;                  // Properti ditambahkan
    UpdatedAt: string;                  // Properti ditambahkan
}

// --- Interface Pendukung (Disesuaikan Juga) ---
export interface Supplier {
    id: string; // Di dalam objek Supplier, 'id' sudah benar (lowercase)
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    status?: string;
}

export interface PurchaseOrder {
    id: string; // Di dalam objek PO, 'id' sudah benar (lowercase)
    po_number: string;                  // Sebelumnya 'poNumber' agar cocok dengan JSON
    totalAmount: number;
    supplier_id: string;                // Sebelumnya 'supplierId' agar cocok dengan JSON
    status: string;
    orderDate: string;
    required_date: string;              // Sebelumnya 'expectedDeliveryDate'
}

export interface Payment {
    id?: number;
    companyId: number;
    paymentDate: string;
    paymentMethod: string;
    referenceNumber: string;
    paymentAmount: number;
    apAccountId: number;
    bankCashAccountId: number;
    bills?: Bill[];
}

// --- Tipe dan Interface Lainnya (Tidak Perlu Diubah) ---
export type BillStatus =
    | 'Draft'
    | 'Awaiting Approval'
    | 'Approved'
    | 'Awaiting Payment'
    | 'Partial Paid'
    | 'Paid'
    | 'Cancelled';

export interface CreateBillRequest {
    supplierId: string;
    billNumber: string;
    billDate: string;
    dueDate: string;
    purchaseOrderId?: string;
    // Pastikan 'Omit' tidak membuang 'ID' jika backend membutuhkannya
    items: Omit<BillItem, 'ID' | 'totalPrice' | 'CreatedAt' | 'UpdatedAt'>[];
}

export interface CreatePaymentRequest {
    payment: Omit<Payment, 'id' | 'companyId'>;
    billIds: number[];
}

export interface ApproveBillRequest {
    apAccountId: number;
}

export interface BillListResponse {
    data: Bill[];
    total: number;
    page: number;
    limit: number;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}