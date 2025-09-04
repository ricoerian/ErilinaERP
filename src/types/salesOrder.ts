import { Warehouse } from "./warehouse";

export interface Customer {
    id: string;
    companyId: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface SalesOrderItem {
    id: number;
    salesOrderId: string;
    inventory_item_id: string;
    sku: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    totalPrice: number;
    [key: string]: unknown; 
}

export interface SalesOrder {
    id: string;
    companyId: number;
    customer_id: string;
    customer: Customer;
    so_number: string;
    orderDate: string;
    ship_date: string;
    status: 'Pending' | 'Approved' | 'Delivered' | 'Completed' | 'Cancelled';
    totalAmount: number;
    notes: string;
    warehoudId: string;
    Warehouse: Warehouse;
    createdById: number;
    createdAt: string;
    updatedAt: string;
    items: SalesOrderItem[];
    [key: string]: unknown; 
}

export interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    selling_price: number; // Menggunakan selling_price, bukan averageCost
    averageCost: number;
}

export type SortColumn = keyof SalesOrder | 'customer.name';