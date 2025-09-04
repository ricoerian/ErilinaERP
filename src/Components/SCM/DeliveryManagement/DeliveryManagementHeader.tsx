// src/Components/SCM/DeliveryManagement/DeliveryManagementHeader.tsx
import React from 'react';
import { PlusCircle, Search, Table, Map, Printer, Grid3x3, ShoppingCart } from 'lucide-react';
import { ViewMode } from '../../../Pages/Company/SCM/DeliveryManagement/DeliveryManagement';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';

interface Props {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    filterStatus: string;
    onFilterStatusChange: (status: string) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    onOpenCreateOrderModal: () => void;
    onOpenCreateTripModal: () => void;
    onOpenReportModal: () => void;
}

const DeliveryManagementHeader: React.FC<Props> = ({
    searchTerm, onSearchTermChange, filterStatus, onFilterStatusChange,
    viewMode, onViewModeChange, onOpenCreateOrderModal, onOpenCreateTripModal, onOpenReportModal
}) => {
    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';
    const secondaryColor = companyDetails?.secondary_color || '#10b981';
    const textColor = '#ffffff';

    // Kelas terpisah untuk tombol view di desktop dan mobile
    const desktopViewButtonClass = (mode: ViewMode) =>
        `btn p-2 ${viewMode === mode ? 'text-white' : 'btn-ghost'}`;
        
    const mobileViewButtonClass = (mode: ViewMode) =>
        `btn btn-sm flex-1 ${viewMode === mode ? 'text-white' : 'btn-ghost'}`;

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* Bagian Kiri: Filter dan Pencarian */}
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search trips, drivers..."
                        className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 w-full"
                        value={searchTerm}
                        onChange={(e) => onSearchTermChange(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <select
                    className="select select-bordered w-full sm:w-auto"
                    value={filterStatus}
                    onChange={(e) => onFilterStatusChange(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            {/* Bagian Kanan: Tombol Aksi */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
                {/* Tombol View (HANYA DESKTOP) */}
                <div className="hidden md:flex gap-2">
                    <button
                        onClick={() => onViewModeChange('table')}
                        className={desktopViewButtonClass('table')}
                        style={viewMode === 'table' ? { backgroundColor: primaryColor, color: textColor } : {}}
                        title="Table View"
                    >
                        <Table size={20} />
                    </button>
                    <button
                        onClick={() => onViewModeChange('card')}
                        className={desktopViewButtonClass('card')}
                        style={viewMode === 'card' ? { backgroundColor: primaryColor, color: textColor } : {}}
                        title="Card View"
                    >
                        <Grid3x3 size={20} />
                    </button>
                    <button
                        onClick={() => onViewModeChange('map')}
                        className={desktopViewButtonClass('map')}
                        style={viewMode === 'map' ? { backgroundColor: primaryColor, color: textColor } : {}}
                        title="Map View"
                    >
                        <Map size={20} />
                    </button>
                </div>

                {/* Tombol Aksi Utama (Ukuran normal di desktop, sm di mobile) */}
                <div className="flex gap-2 flex-grow sm:flex-grow-0 w-full md:w-auto">
                    <button onClick={onOpenCreateOrderModal} className="btn btn-sm md:btn-md flex-grow rounded-lg shadow-md text-white" style={{ backgroundColor: secondaryColor }}>
                        <ShoppingCart size={16} /> <span className="hidden sm:inline">Create DO</span>
                    </button>
                    <button onClick={onOpenCreateTripModal} className="btn btn-sm md:btn-md flex-grow rounded-lg shadow-md text-white" style={{ backgroundColor: primaryColor }}>
                        <PlusCircle size={16} /> <span className="hidden sm:inline">Create Trip</span>
                    </button>
                    <button onClick={onOpenReportModal} className="btn btn-sm md:btn-md flex-grow rounded-lg shadow-md text-white" style={{ backgroundColor: secondaryColor, color: textColor }}>
                        <Printer size={16} /> <span className="hidden sm:inline">Report</span>
                    </button>
                </div>
            </div>
            
            {/* Tombol View (HANYA MOBILE) */}
             <div className="flex md:hidden gap-2 w-full mt-2">
                <button onClick={() => onViewModeChange('table')} className={mobileViewButtonClass('table')} style={viewMode === 'table' ? { backgroundColor: primaryColor, color: textColor } : {}}>
                    <Table size={16} /> Table
                </button>
                <button onClick={() => onViewModeChange('card')} className={mobileViewButtonClass('card')} style={viewMode === 'card' ? { backgroundColor: primaryColor, color: textColor } : {}}>
                    <Grid3x3 size={16} /> Cards
                </button>
                <button onClick={() => onViewModeChange('map')} className={mobileViewButtonClass('map')} style={viewMode === 'map' ? { backgroundColor: primaryColor, color: textColor } : {}}>
                    <Map size={16} /> Map
                </button>
            </div>
        </div>
    );
};

export default DeliveryManagementHeader;