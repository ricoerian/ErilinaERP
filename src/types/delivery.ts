// src/types/delivery.ts
import L from 'leaflet';
import { PurchaseOrder } from './purchaseOrder';
import { SalesOrder } from './salesOrder';

export interface Driver {
    id: number;
    name: string;
    phone: string;
    status: string;
    is_active: boolean;
    createdAt: string;
}

export interface Vehicle {
    id: number;
    license_plate: string;
    type: string;
    model: string;
    status: string;
    is_active: boolean;
    createdAt: string;
}

export interface DeliveryOrder {
    id: string;
    order_type: 'purchase_order' | 'sales_order';
    order_id: string;
    do_number: string;
    status: 'Pending Assignment' | 'On The Way' | 'Delivered' | 'Failed';
    shipping_cost: number;
    source_address: string;
    source_geo_location: string;
    destination_address: string;
    destination_geo_location: string;
    notes: string;
    delivery_trip_id?: number;
    order_details?: PurchaseOrder | SalesOrder;
    createdAt: string;
}

export interface DeliveryTrip {
    id: number;
    driver_id: number;
    vehicle_id: number;
    trip_number: string;
    status: 'Planned' | 'In Progress' | 'Completed';
    start_date?: string;
    end_date?: string;
    createdAt: string;
    driver: Driver;
    vehicle: Vehicle;
    delivery_orders: DeliveryOrder[];
}

export type DeliveryTripFormData = {
    driver_id: number;
    vehicle_id: number;
    trip_number: string;
    order_ids: string[];
    notes: string;
};

export type DOCreationData = {
    orderId: string;
    orderType: 'purchase_order' | 'sales_order';
    orderNumber: string;
    shippingCost: number;
};


export type DeliveryFormData = {
    driver_id: number;
    vehicle_id: number;
    trip_number: string;
    order_ids: string[];
    shipping_cost: number;
    notes: string;
};

export interface VehicleStatus {
    id: number;
    vehicle_id: number;
    latitude: number;
    longitude: number;
    message: string;
    updated_at: string;
}

export interface SosLog {
    id: number;
    vehicle_id: number;
    latitude: number;
    longitude: number;
    message: string;
    timestamp: string;
}

// UI-related types
export type ViewMode = 'table' | 'card' | 'map';
export type SortColumn = keyof DeliveryTrip;
export type SortDirection = 'asc' | 'desc';

// Leaflet Icon definitions
export const warehouseIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">&#x1F3E2; Warehouse</div>`,
    iconSize: [100, 30],
    iconAnchor: [50, 15]
});

export const customerIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">&#x1F464; Customer</div>`,
    iconSize: [100, 30],
    iconAnchor: [50, 15]
});

export const supplierIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background: #8b5cf6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">&#x1F477; Supplier</div>`,
    iconSize: [100, 30],
    iconAnchor: [50, 15]
});

export interface VehicleStatus {
    vehicle_id: number;
    latitude: number;
    longitude: number;
    message: string;
}