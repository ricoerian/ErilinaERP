import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { InventoryTransaction } from '../../../types/inventoryTransaction';

interface TransactionTableProps {
  transactions: InventoryTransaction[];
  sortConfig: { key: keyof InventoryTransaction | null; direction: 'ascending' | 'descending' };
  onSort: (key: keyof InventoryTransaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, sortConfig, onSort }) => {

  const getSortIcon = (key: keyof InventoryTransaction) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
      <table className="table w-full table-zebra min-w-[800px]">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="cursor-pointer" onClick={() => onSort('timestamp')}>
              <div className="flex items-center">Timestamp {getSortIcon('timestamp')}</div>
            </th>
            <th className="cursor-pointer" onClick={() => onSort('itemId')}>
              <div className="flex items-center">Item ID {getSortIcon('itemId')}</div>
            </th>
            <th className="cursor-pointer" onClick={() => onSort('quantityChange')}>
              <div className="flex items-center">Change {getSortIcon('quantityChange')}</div>
            </th>
            <th className="cursor-pointer" onClick={() => onSort('newStockLevel')}>
              <div className="flex items-center">New Stock {getSortIcon('newStockLevel')}</div>
            </th>
            <th className="cursor-pointer" onClick={() => onSort('transactionType')}>
              <div className="flex items-center">Type {getSortIcon('transactionType')}</div>
            </th>
            <th className="cursor-pointer" onClick={() => onSort('reason')}>
              <div className="flex items-center">Reason {getSortIcon('reason')}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">No transactions found.</td>
            </tr>
          ) : (
            transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{transaction.itemId}</td>
                <td className={transaction.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}>
                  {transaction.quantityChange > 0 ? `+${transaction.quantityChange}` : transaction.quantityChange}
                </td>
                <td>{transaction.newStockLevel}</td>
                <td>{transaction.transactionType}</td>
                <td className="whitespace-normal break-words">{transaction.reason}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;