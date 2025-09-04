// File: src/Components/SCM/DeliveryManagement/DeliveryMap.tsx

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { DeliveryTrip, Vehicle, VehicleStatus } from '../../../types/delivery';
import { OSRM_URL } from '../../../Utils/Constants';
import { useNotification } from '../../NotificationProvider';

interface Props {
    deliveryTrips: DeliveryTrip[];
    vehicleStatuses: Record<number, VehicleStatus>;
}

const createVehicleIcon = (vehicle: Vehicle, tripStatus: string, vehicleStatus?: VehicleStatus) => {
    // Check for SOS in vehicle status message or if vehicle status indicates emergency
    const isSos = vehicleStatus?.message?.toLowerCase().includes('sos') || 
                  vehicleStatus?.message?.toLowerCase().includes('emergency') ||
                  tripStatus === 'SOS';
    const iconColor = isSos ? '#E53E3E' : '#3B82F6';
    
    const html = `
        <div style="
            position: relative; 
            display: flex; 
            flex-direction: column; 
            align-items: center;
        ">
            <div style="
                font-size: 10px; 
                font-weight: bold; 
                background-color: rgba(0, 0, 0, 0.85); 
                color: white; 
                padding: 3px 6px; 
                border-radius: 8px; 
                margin-bottom: 2px;
                white-space: nowrap;
                border: 1px solid rgba(255, 255, 255, 0.5);
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                z-index: 1000;
            ">
                ${vehicle.license_plate}
            </div>
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <i class="fas fa-truck" style="
                    color: ${iconColor}; 
                    font-size: 24px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                    filter: drop-shadow(0 0 2px rgba(255,255,255,0.8));
                "></i>
            </div>
        </div>
    `;
    
    return L.divIcon({
        className: 'custom-vehicle-icon',
        html: html,
        iconSize: [24, 40],
        iconAnchor: [12, 30], // Anchor di tengah bagian bawah icon truck
        popupAnchor: [0, -35], // Popup muncul di atas icon
    });
};

interface AnimatedVehicleMarkerProps {
    trip: DeliveryTrip;
    status: VehicleStatus;
    previousPosition: React.MutableRefObject<LatLngExpression | null>;
}

const AnimatedVehicleMarker: React.FC<AnimatedVehicleMarkerProps> = ({ trip, status, previousPosition }) => {
    const map = useMap();
    const markerRef = useRef<L.Marker | null>(null);
    const [currentPosition, setCurrentPosition] = useState<LatLngExpression>([status.latitude, status.longitude]);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const startPositionRef = useRef<[number, number] | null>(null);
    const endPositionRef = useRef<[number, number] | null>(null);

    useEffect(() => {
        const newPosition: LatLngExpression = [status.latitude, status.longitude];
        
        // Validasi koordinat yang lebih fleksibel - hanya validasi range dan NaN
        if (typeof status.latitude !== 'number' || typeof status.longitude !== 'number' ||
            isNaN(status.latitude) || isNaN(status.longitude) ||
            Math.abs(status.latitude) > 90 || Math.abs(status.longitude) > 180) {
            console.warn(`Invalid coordinates for vehicle ${trip.vehicle.license_plate}:`, status.latitude, status.longitude);
            return;
        }

        const newPos = newPosition as [number, number];

        if (previousPosition.current && markerRef.current) {
            const prevPos = previousPosition.current as [number, number];
            
            // Hitung jarak dalam meter
            const distance = map.distance(prevPos, newPos);
            
            // Animate hanya jika pergerakan signifikan (lebih dari 0.5 meter)
            if (distance > 0.5) {
                // Cancel any existing animation
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }

                // Set up smooth animation using requestAnimationFrame
                startPositionRef.current = prevPos;
                endPositionRef.current = newPos;
                startTimeRef.current = performance.now();
                
                // Dynamic duration based on distance (minimum 1000ms, maximum 3000ms)
                const animationDuration = Math.min(3000, Math.max(1000, distance * 2));

                const animate = (currentTime: number) => {
                    const elapsed = currentTime - startTimeRef.current;
                    const progress = Math.min(elapsed / animationDuration, 1);
                    
                    // Easing function untuk pergerakan yang lebih natural (ease-out)
                    const easedProgress = 1 - Math.pow(1 - progress, 3);
                    
                    if (startPositionRef.current && endPositionRef.current) {
                        const interpolatedLat = startPositionRef.current[0] + 
                            (endPositionRef.current[0] - startPositionRef.current[0]) * easedProgress;
                        const interpolatedLng = startPositionRef.current[1] + 
                            (endPositionRef.current[1] - startPositionRef.current[1]) * easedProgress;
                        
                        const interpolatedPos: LatLngExpression = [interpolatedLat, interpolatedLng];
                        setCurrentPosition(interpolatedPos);
                    }
                    
                    if (progress < 1) {
                        animationRef.current = requestAnimationFrame(animate);
                    } else {
                        // Animation complete
                        setCurrentPosition(newPosition);
                        previousPosition.current = newPosition;
                        animationRef.current = null;
                    }
                };

                animationRef.current = requestAnimationFrame(animate);
            } else {
                // Jika pergerakan kecil, langsung update posisi tanpa animasi
                setCurrentPosition(newPosition);
                previousPosition.current = newPosition;
            }
        } else {
            // First time positioning
            setCurrentPosition(newPosition);
            previousPosition.current = newPosition;
        }

        // Cleanup function
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [status.latitude, status.longitude, map, trip.vehicle.license_plate, previousPosition]);

    return (
        <Marker
            ref={markerRef}
            position={currentPosition}
            icon={createVehicleIcon(trip.vehicle, trip.status, status)}
            zIndexOffset={1000}
        >
            <Popup>
                <div className="p-2">
                    <h3 className="font-bold text-base">{trip.vehicle.license_plate}</h3>
                    <p className="text-sm">Driver: {trip.driver.name}</p>
                    <p className="text-sm">Status: <span className={`font-semibold ${
                        status.message?.toLowerCase().includes('sos') || 
                        status.message?.toLowerCase().includes('emergency') ? 'text-red-600' : 'text-green-600'
                    }`}>{trip.status}</span></p>
                    {status.message && <p className="text-xs text-gray-600 mt-1">{status.message}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                        Lat: {status.latitude.toFixed(8)}, Lng: {status.longitude.toFixed(8)}
                    </p>
                    <p className="text-xs text-gray-400">
                        Last Update: {new Date(status.updated_at).toLocaleTimeString()}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
};

const VehicleMarkersLayer: React.FC<{ deliveryTrips: DeliveryTrip[]; vehicleStatuses: Record<number, VehicleStatus> }> = ({ deliveryTrips, vehicleStatuses }) => {
    const previousPositions = useRef<Record<number, LatLngExpression | null>>({});

    return (
        <>
            {deliveryTrips.map((trip) => {
                const status = vehicleStatuses[trip.vehicle_id];
                
                // Validasi yang lebih fleksibel
                if (!status || 
                    typeof status.latitude !== 'number' || 
                    typeof status.longitude !== 'number' ||
                    isNaN(status.latitude) || 
                    isNaN(status.longitude) ||
                    Math.abs(status.latitude) > 90 || 
                    Math.abs(status.longitude) > 180) {
                    console.warn(`Skipping invalid vehicle position for trip ${trip.id}:`, status);
                    return null;
                }

                // Initialize previous position if not exists
                if (!(trip.vehicle_id in previousPositions.current)) {
                    previousPositions.current[trip.vehicle_id] = null;
                }

                return (
                    <AnimatedVehicleMarker
                        key={`vehicle-${trip.id}-${trip.vehicle_id}`}
                        trip={trip}
                        status={status}
                        previousPosition={{
                            current: previousPositions.current[trip.vehicle_id]
                        } as React.MutableRefObject<LatLngExpression | null>}
                    />
                );
            })}
        </>
    );
};

const DeliveryMap: React.FC<Props> = ({ deliveryTrips, vehicleStatuses }) => {
    const { showNotification } = useNotification();
    const [routes, setRoutes] = useState<{ id: string, route: [number, number][] }[]>([]);

    const warehouseIcon = L.divIcon({ 
        className: 'custom-div-icon', 
        html: `<div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">🏢 Warehouse</div>`, 
        iconSize: [110, 30], 
        iconAnchor: [55, 15],
        popupAnchor: [0, -15]
    });
    
    const customerIcon = L.divIcon({ 
        className: 'custom-div-icon', 
        html: `<div style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">👤 Customer</div>`, 
        iconSize: [100, 30], 
        iconAnchor: [50, 15],
        popupAnchor: [0, -15]
    });
    
    const supplierIcon = L.divIcon({ 
        className: 'custom-div-icon', 
        html: `<div style="background: #8b5cf6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">👷 Supplier</div>`, 
        iconSize: [100, 30], 
        iconAnchor: [50, 15],
        popupAnchor: [0, -15]
    });
    
    const getCoordinatesFromAddress = (address: string): [number, number] | null => {
        if (!address || typeof address !== 'string') return null;
        
        if (address.includes(',')) {
            const parts = address.split(',').map(part => parseFloat(part.trim()));
            if (parts.length === 2 && 
                !isNaN(parts[0]) && !isNaN(parts[1]) &&
                Math.abs(parts[0]) <= 90 && Math.abs(parts[1]) <= 180) {
                return [parts[0], parts[1]];
            }
        }
        return null;
    };

    const getRoute = async (start: [number, number], end: [number, number]): Promise<[number, number][]> => {
        const url = `${OSRM_URL}/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson&overview=full`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`OSRM request failed with status ${response.status}`);
            const data = await response.json();
            if (data.code === 'Ok' && data.routes.length > 0) {
                return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
            } else {
                showNotification(`OSRM Error: ${data.message || 'Route not found'}`);
                return [];
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Unknown error";
            showNotification(`Error fetching route: ${msg}`, 'error');
            return [];
        }
    };

    useEffect(() => {
        const fetchAllRoutes = async () => {
            const allRoutesPromises = deliveryTrips.flatMap(trip =>
                trip.delivery_orders.map(async (order) => {
                    const sourceCoords = getCoordinatesFromAddress(order.source_geo_location);
                    const destCoords = getCoordinatesFromAddress(order.destination_geo_location);
                    if (sourceCoords && destCoords) {
                        const routePoints = await getRoute(sourceCoords, destCoords);
                        return { id: `${trip.id}-${order.id}`, route: routePoints };
                    }
                    return null;
                })
            );
            const resolvedRoutes = (await Promise.all(allRoutesPromises)).filter(r => r !== null && r.route.length > 0);
            setRoutes(resolvedRoutes as { id: string, route: [number, number][] }[]);
        };

        if (deliveryTrips.length > 0) fetchAllRoutes();
    }, [deliveryTrips, showNotification]);

    const center: [number, number] = useMemo(() => {
        // Coba ambil koordinat dari vehicle status terlebih dahulu
        const validVehiclePositions = Object.values(vehicleStatuses).filter(status => 
            status && 
            typeof status.latitude === 'number' && 
            typeof status.longitude === 'number' &&
            !isNaN(status.latitude) && 
            !isNaN(status.longitude) &&
            Math.abs(status.latitude) <= 90 && 
            Math.abs(status.longitude) <= 180
        );

        if (validVehiclePositions.length > 0) {
            const avgLat = validVehiclePositions.reduce((sum, pos) => sum + pos.latitude, 0) / validVehiclePositions.length;
            const avgLng = validVehiclePositions.reduce((sum, pos) => sum + pos.longitude, 0) / validVehiclePositions.length;
            return [avgLat, avgLng];
        }

        // Fallback ke delivery orders
        if (deliveryTrips.length > 0 && deliveryTrips[0].delivery_orders.length > 0) {
            const firstOrder = deliveryTrips[0].delivery_orders[0];
            const coords = getCoordinatesFromAddress(firstOrder.source_geo_location);
            if (coords) return coords;
        }
        
        // Default ke Jakarta jika tidak ada koordinat valid
        return [-6.2349, 106.9896];
    }, [deliveryTrips, vehicleStatuses]);

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <MapContainer 
                center={center} 
                zoom={13} 
                style={{ height: '600px', width: '100%', borderRadius: '8px' }} 
                scrollWheelZoom={true} 
                attributionControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Render routes */}
                {routes.map(({ id, route }) => (
                    <Polyline 
                        key={id} 
                        positions={route} 
                        color={'#6b7280'} 
                        weight={4} 
                        opacity={0.7}
                        dashArray="5, 10"
                    />
                ))}

                {/* Render delivery order markers */}
                {deliveryTrips.flatMap(trip =>
                    trip.delivery_orders.map(order => {
                        const sourceCoords = getCoordinatesFromAddress(order.source_geo_location);
                        const destCoords = getCoordinatesFromAddress(order.destination_geo_location);
                        return (
                            <React.Fragment key={`markers-${trip.id}-${order.id}`}>
                                {sourceCoords && (
                                    <Marker 
                                        position={sourceCoords} 
                                        icon={order.order_type === 'purchase_order' ? supplierIcon : warehouseIcon}
                                        zIndexOffset={100}
                                    >
                                        <Popup>
                                            <div className="p-2">
                                                <h3 className="font-bold">{order.order_type === 'purchase_order' ? 'Supplier' : 'Warehouse'}</h3>
                                                <p className="text-sm">DO: {order.do_number}</p>
                                                <p className="text-xs text-gray-500">
                                                    {sourceCoords[0].toFixed(6)}, {sourceCoords[1].toFixed(6)}
                                                </p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                                {destCoords && (
                                    <Marker 
                                        position={destCoords} 
                                        icon={order.order_type === 'purchase_order' ? warehouseIcon : customerIcon}
                                        zIndexOffset={100}
                                    >
                                        <Popup>
                                            <div className="p-2">
                                                <h3 className="font-bold">{order.order_type === 'purchase_order' ? 'Warehouse' : 'Customer'}</h3>
                                                <p className="text-sm">DO: {order.do_number}</p>
                                                <p className="text-xs text-gray-500">
                                                    {destCoords[0].toFixed(6)}, {destCoords[1].toFixed(6)}
                                                </p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                            </React.Fragment>
                        );
                    })
                )}

                {/* Render vehicle markers dengan zIndex tertinggi */}
                <VehicleMarkersLayer deliveryTrips={deliveryTrips} vehicleStatuses={vehicleStatuses} />
            </MapContainer>
        </div>
    );
};

export default DeliveryMap;