import React from 'react';
import { Edit, Trash2, Phone, Mail, User, MapPin } from 'lucide-react';
import { Supplier } from '../../../types/supplier';

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string, name: string) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onEdit, onDelete }) => {
  const getStatusClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-warning';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl rounded-lg overflow-hidden flex flex-col h-full">
      <div className="card-body p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="card-title text-xl font-bold text-gray-800 break-words pr-2">
              {supplier.name}
            </h2>
            <div className={`badge ${getStatusClass(supplier.status)} text-white px-3 py-2 text-sm`}>
              {supplier.status}
            </div>
          </div>
          
          {supplier.contactPersons && supplier.contactPersons.length > 0 && (
            <div className="mb-4">
              <span className="font-semibold text-gray-700">Contact Persons:</span>
              <div className="mt-1 space-y-2">
                {supplier.contactPersons.map((contact, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                    <div className="flex items-center mb-1">
                      <User size={14} className="mr-2 text-gray-500" />
                      <span className="font-medium">{contact.name}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center mb-1 ml-5">
                        <Mail size={14} className="mr-2 text-gray-500" />
                        <span className="text-gray-600">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center ml-5">
                        <Phone size={14} className="mr-2 text-gray-500" />
                        <span className="text-gray-600">{contact.phone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {supplier.address && (
            <p className="text-gray-600 flex items-start mt-2">
              <MapPin size={16} className="mr-2 mt-1 text-gray-500 flex-shrink-0" />
              <span className="break-words">{supplier.address}</span>
            </p>
          )}
        </div>

        <div className="card-actions justify-end mt-4">
          <button 
            className="btn btn-sm btn-ghost text-blue-500 hover:bg-blue-50" 
            onClick={() => onEdit(supplier)}
          >
            <Edit size={16} /> Edit
          </button>
          <button 
            className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50" 
            onClick={() => onDelete(supplier.id, supplier.name)}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;