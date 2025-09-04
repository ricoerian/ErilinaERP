import { Supplier } from "./supplier"; 
import { Warehouse } from "./warehouse";
export interface PurchaseOrder { 
    id: string; 
    companyId: number; 
    supplier_id: string; 
    po_number: string; 
    orderDate: string; 
    required_date: string; 
    status: 'Pending' | 'Approved' | 'Delivered' | 'Completed' | 'Cancelled'; 
    totalAmount: number; 
    notes: string; 
    createdById: number; 
    createdAt: string; 
    updatedAt: string; 
    items: PurchaseOrderItem[]; 
    supplier: Supplier; 
    Warehouse: Warehouse; 
    [key: string]: unknown; 
} 
export interface PurchaseOrderItem { 
    id?: string; 
    purchaseOrderId?: string; 
    inventoryItemId: string; 
    sku: string; 
    itemName: string; 
    quantity: number; 
    unit_price: number; 
    totalPrice: number; 
    [key: string]: unknown; 
} 
export type SortColumn = keyof PurchaseOrder | 'supplier.name';