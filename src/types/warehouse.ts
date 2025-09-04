export interface Warehouse {
    id: number;
    companyId: number;
    name: string;
    location: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
}