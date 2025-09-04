export interface InventoryTransaction {
  id: number;
  itemId: string;
  companyId: number;
  quantityChange: number;
  newStockLevel: number;
  reason: string;
  transactionType: string;
  timestamp: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: string | number;
}