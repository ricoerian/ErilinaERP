import React from 'react';
import { Edit, Trash2, ArrowUpCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { InventoryItem } from '../../../types/inventory';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';

type SortColumn = keyof InventoryItem;

interface InventoryTableProps {
  items: InventoryItem[];
  sortColumn: SortColumn;
  sortDirection: 'asc' | 'desc';
  onSort: (column: SortColumn) => void;
  onEditItem: (item: InventoryItem) => void;
  onAdjustStock: (item: InventoryItem) => void;
  onDeleteItem: (id: string, name: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  sortColumn,
  sortDirection,
  onSort,
  onEditItem,
  onAdjustStock,
  onDeleteItem,
}) => {
  const companyDetails = useCompanyDetails();
  const currencyCode = companyDetails?.currency_code || 'USD';

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />;
    }
    return null;
  };

  const getStockStatusClass = (status: string) => {
    switch (status) {
      case 'In Stock': return 'badge badge-success';
      case 'Low Stock': return 'badge badge-warning text-black';
      case 'Out of Stock': return 'badge badge-error';
      default: return 'badge badge-neutral';
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
      <table className="table w-full table-zebra min-w-[1200px]">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="w-[80px]">Image</th>
              <th className="cursor-pointer w-[120px]" onClick={() => onSort('sku')}>
                <div className="flex items-center whitespace-nowrap">SKU {getSortIcon('sku')}</div>
              </th>
              <th className="cursor-pointer w-[200px]" onClick={() => onSort('name')}>
                <div className="flex items-center whitespace-nowrap">Product Name {getSortIcon('name')}</div>
              </th>
              <th className="cursor-pointer w-[150px]" onClick={() => onSort('category')}>
                <div className="flex items-center whitespace-nowrap">Category {getSortIcon('category')}</div>
              </th>
              <th className="text-right cursor-pointer w-[140px]" onClick={() => onSort('currentStock')}>
                <div className="flex items-center justify-end whitespace-nowrap">Current Stock {getSortIcon('currentStock')}</div>
              </th>
              <th className="text-right cursor-pointer w-[140px]" onClick={() => onSort('minStockLevel')}>
                <div className="flex items-center justify-end whitespace-nowrap">Min. Stock {getSortIcon('minStockLevel')}</div>
              </th>
              <th className="text-right cursor-pointer w-[180px]" onClick={() => onSort('sellingPrice')}>
                <div className="flex items-center justify-end whitespace-nowrap">Selling Price ({currencyCode}) {getSortIcon('sellingPrice')}</div>
              </th>
              <th className="text-center cursor-pointer w-[140px]" onClick={() => onSort('status')}>
                <div className="flex items-center justify-center whitespace-nowrap">Status {getSortIcon('status')}</div>
              </th>
              <th className="text-center w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">No inventory items found.</td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={item.imageUrl || `https://ui-avatars.com/api/?name=${item.name.replace(/\s/g, '+')}`} alt={item.name} />
                      </div>
                    </div>
                  </td>
                  <td>{item.sku}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td className="text-right">{item.currentStock} {item.unitOfMeasure}</td>
                  <td className="text-right">{item.minStockLevel}</td>
                  <td className="text-right">{item.sellingPrice.toLocaleString()} {currencyCode}</td>
                  <td className="text-center"><span className={getStockStatusClass(item.status)}>{item.status}</span></td>
                  <td className="text-center">
                    <button className="btn btn-ghost btn-xs" onClick={() => onEditItem(item)}><Edit size={16} /></button>
                    <button className="btn btn-ghost btn-xs" onClick={() => onAdjustStock(item)}><ArrowUpCircle size={16} /></button>
                    <button className="btn btn-ghost btn-xs text-error" onClick={() => onDeleteItem(item.id, item.name)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  );
};

export default InventoryTable;