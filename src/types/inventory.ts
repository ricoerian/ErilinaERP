import { Warehouse } from "./warehouse";

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  currentStock: number;
  unitOfMeasure: string;
  minStockLevel: number;
  sellingPrice: number;
  costPrice: number;
  imageUrl: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  warehouseId: number;
  Warehouse: Warehouse;
  companyId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string | number | any | Warehouse | string[] ;
}