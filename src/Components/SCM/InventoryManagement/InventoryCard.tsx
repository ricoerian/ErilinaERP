import React from 'react';
import { Edit, PackageMinus, Trash2 } from 'lucide-react';
import { InventoryItem } from '../../../types/inventory';

interface InventoryCardProps {
    item: InventoryItem;
    currencyCode: string;
    getStockStatusClass: (status: string) => string;
    onEditItem: (item: InventoryItem) => void;
    onAdjustStock: (item: InventoryItem) => void;
    onDeleteItem: (id: string, name: string) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
    item,
    currencyCode,
    getStockStatusClass,
    onEditItem,
    onAdjustStock,
    onDeleteItem,
}) => {
    return (
        <div className="card bg-base-100 shadow-xl rounded-lg overflow-hidden">
            <figure className="relative h-48 w-full bg-gray-100">
                <img
                    src={item.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                />
                <div className="absolute top-2 left-2 badge badge-lg text-white bg-blue-400 border-none">
                    {item.sku}
                </div>
                <div className={`absolute bottom-2 right-2 badge badge-lg ${getStockStatusClass(item.status)} text-white`}>
                    {item.status}
                </div>
            </figure>
            <div className="card-body p-4">
                <h2 className="card-title text-gray-800 text-lg mb-1 line-clamp-1">{item.name}</h2>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Stock:</strong> {item.currentStock} {item.unitOfMeasure}</p>
                    <p><strong>Min Stock:</strong> {item.minStockLevel} {item.unitOfMeasure}</p>
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Warehouse:</strong> {item.Warehouse.name}</p>
                    <p><strong>Selling Price:</strong> {`${item.sellingPrice.toLocaleString()} ${currencyCode}`}</p>
                    <p><strong>Avg. Cost:</strong> {`${item.averageCost.toLocaleString(`${currencyCode}`, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencyCode}`}</p>
                </div>
                <div className="card-actions justify-end mt-4 flex flex-wrap gap-2">
                    <button
                        className="btn btn-sm btn-ghost btn-square tooltip tooltip-top"
                        data-tip="Edit Item"
                        onClick={() => onEditItem(item)}
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        className="btn btn-sm btn-ghost btn-square tooltip tooltip-top"
                        data-tip="Adjust Stock"
                        onClick={() => onAdjustStock(item)}
                    >
                        <PackageMinus size={18} />
                    </button>
                    <button
                        className="btn btn-sm btn-ghost btn-square text-error tooltip tooltip-top"
                        data-tip="Delete Item"
                        onClick={() => onDeleteItem(item.id, item.name)}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryCard;