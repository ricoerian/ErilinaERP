// src/Components/SosNotification.tsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { SosLog } from '../types/delivery';

interface Props {
    alerts: SosLog[];
    onDismiss: (id: number) => void;
}

const SosNotification: React.FC<Props> = ({ alerts, onDismiss }) => {
    if (alerts.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-20 right-6 w-full max-w-sm z-[9999] space-y-3">
            {alerts.map(alert => (
                <div key={alert.id} className="bg-red-600 text-white rounded-lg shadow-2xl p-4 animate-pulse-fast">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={24} className="flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-lg">!!! S.O.S ALERT !!!</h4>
                                <p className="text-sm mt-1">
                                    Vehicle ID <span className="font-semibold">{alert.vehicle_id}</span> sent an SOS signal.
                                </p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm mt-2 inline-block font-semibold underline hover:text-yellow-300"
                                >
                                    View Last Location
                                </a>
                            </div>
                        </div>
                        <button onClick={() => onDismiss(alert.id)} className="p-1 rounded-full hover:bg-red-700">
                            <X size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SosNotification;