import { PackageCheck } from "lucide-react";
import { DeliveryOrder } from "../../../types/delivery";
import StatusBadge from "./StatusBadge";

interface UnassignedOrdersCardProps {
    unassignedOrders: DeliveryOrder[];
}

const UnassignedOrdersCard: React.FC<UnassignedOrdersCardProps> = ({ unassignedOrders }) => (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <PackageCheck size={20} className="mr-2 text-blue-500" />
            Unassigned Delivery Orders
        </h2>
        {unassignedOrders.length === 0 ? (
            <p className="text-gray-500">No unassigned delivery orders.</p>
        ) : (
            <div className="max-h-60 overflow-y-auto">
                <div className="space-y-3">
                    {unassignedOrders.map(order => (
                        <div key={order.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div>
                                <p className="font-medium">DO #{order.do_number}</p>
                                <p className="text-sm text-gray-600">{order.order_type.replace('_', ' ').toUpperCase()}</p>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default UnassignedOrdersCard;