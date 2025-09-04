import React from 'react';
import { Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Supplier } from '../../../types/supplier';

type SortColumn = keyof Omit<Supplier, 'contactPersons'>;

interface SupplierTableProps {
  suppliers: Supplier[];
  sortColumn: SortColumn;
  sortDirection: 'asc' | 'desc';
  onSort: (column: SortColumn) => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string, name: string) => void;
}

const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  sortColumn,
  sortDirection,
  onSort,
  onEditSupplier,
  onDeleteSupplier,
}) => {
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? 
        <ChevronUp size={16} className="ml-1" /> : 
        <ChevronDown size={16} className="ml-1" />;
    }
    return null;
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'badge badge-success';
      case 'inactive': return 'badge badge-error';
      default: return 'badge badge-neutral';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="overflow-x-auto w-full">
        <table className="table w-full table-zebra">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="cursor-pointer w-[15%]" onClick={() => onSort('name')}>
                <div className="flex items-center">
                  Name {getSortIcon('name')}
                </div>
              </th>
              <th className="w-[30%]">
                <div className="flex items-center">Contact Persons</div>
              </th>
              <th className="cursor-pointer w-[25%]" onClick={() => onSort('address')}>
                <div className="flex items-center">
                  Address {getSortIcon('address')}
                </div>
              </th>
              <th className="cursor-pointer w-[10%]" onClick={() => onSort('status')}>
                <div className="flex items-center">
                  Status {getSortIcon('status')}
                </div>
              </th>
              <th className="w-[20%] text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td className="break-words max-w-0">
                    <div className="truncate" title={supplier.name}>
                      {supplier.name}
                    </div>
                  </td>
                  <td>
                    {supplier.contactPersons && supplier.contactPersons.length > 0 ? (
                      <div className="space-y-2">
                        {supplier.contactPersons.map((contact, index) => (
                          <div key={index} className="text-sm">
                            <p className="font-semibold text-gray-800">{contact.name}</p>
                            {contact.email && (
                              <p className="text-xs text-gray-500 truncate" title={contact.email}>
                                {contact.email}
                              </p>
                            )}
                            {contact.phone && (
                              <p className="text-xs text-gray-500">{contact.phone}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No contacts</span>
                    )}
                  </td>
                  <td className="break-words max-w-0">
                    <div className="truncate" title={supplier.address}>
                      {supplier.address || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div className={getStatusClass(supplier.status)}>
                      {supplier.status}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <button 
                        onClick={() => onEditSupplier(supplier)} 
                        className="btn btn-sm btn-ghost text-blue-500 hover:bg-blue-50"
                        title="Edit supplier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteSupplier(supplier.id, supplier.name)} 
                        className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"
                        title="Delete supplier"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierTable;