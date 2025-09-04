import React, { useEffect, useState, useMemo } from 'react';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import { History, Search, FileText, ArrowLeft } from 'lucide-react';
import TransactionTable from '../../../../Components/SCM/InventoryManagement/TransactionTable';
import Pagination from '../../../../Components/Pagination';
import ReportGeneratorModal, { ReportColumn } from '../../../../Components/ReportGeneratorModal';
import { useNavigate, useParams } from 'react-router-dom';
import { URL_BECC, URL_BESMCIM } from '../../../../Utils/Constants';
import { InventoryTransaction } from '../../../../types/inventoryTransaction';
import { useNotification } from '../../../../Components/NotificationProvider';

type SortKey = keyof InventoryTransaction;

const InventoryTransactionHistoryPage: React.FC = () => {
  const { showNotification } = useNotification();
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: 'ascending' | 'descending' }>({ key: 'timestamp', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const companyDetails = useCompanyDetails();
  const companyID = companyDetails?.id;
  const navigate = useNavigate();
  const { company } = useParams<{ company: string }>();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (companyID === undefined || companyID === null) {
        setLoading(false);
        setTransactions([]);
        showNotification("Company ID not available. Cannot fetch transactions.", 'error');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${URL_BESMCIM}/api/companies/${companyID}/inventory/transactions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }
        const data: InventoryTransaction[] = await response.json();
        setTransactions(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          showNotification(`Failed to connect to the backend server. Make sure your Golang server is running at ${URL_BECC} and accessible. Failed to fetch inventory transactions: ${err.message}`, 'error');
        } else {
          showNotification(`An unknown error occurred while fetching inventory transaction.`, 'error');
        }
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (companyID !== undefined && companyID !== null) {
      fetchTransactions();
    } else {
      setLoading(false);
      showNotification("Company ID not available. Ensure your company details are loaded correctly.", 'error');
    }
  }, [companyID, showNotification]);

  const sortedAndFilteredTransactions = useMemo(() => {
    let sortableItems = [...transactions];

    if (searchTerm) {
      sortableItems = sortableItems.filter(transaction =>
        String(transaction.itemId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(transaction.reason).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(transaction.transactionType).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (typeof aValue === 'string' && typeof bValue === 'string' && (sortConfig.key === 'timestamp' || sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt')) {
            const dateA = new Date(aValue).getTime();
            const dateB = new Date(bValue).getTime();
            return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return sortableItems;
  }, [transactions, searchTerm, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const transactionReportColumns: ReportColumn<InventoryTransaction>[] = useMemo(() => [
    { header: 'Transaction ID', key: 'id', align: 'left' },
    { header: 'Item ID', key: 'itemId', align: 'left' },
    { header: 'Quantity Change', key: 'quantityChange', align: 'right' },
    { header: 'New Stock Level', key: 'newStockLevel', align: 'right' },
    { header: 'Reason', key: 'reason', align: 'left' },
    { header: 'Transaction Type', key: 'transactionType', align: 'left' },
    {
      header: 'Timestamp',
      key: 'timestamp',
      formatter: (value: InventoryTransaction[keyof InventoryTransaction]) => new Date(value as string).toLocaleString(),
      align: 'left'
    },
    { header: 'User ID', key: 'userId', align: 'left' },
  ], []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(`/${company}/scm/inventory`)} className="btn btn-ghost btn-circle mr-2">
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <History size={30} /> Inventory Transaction History
        </h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <label className="input input-bordered flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            className="grow"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Search size={20} className="text-gray-400" />
        </label>
        <button className="btn btn-info rounded-lg shadow-md text-white w-full md:w-auto" onClick={() => setShowReportModal(true)}>
          <FileText size={20} /> Generate Report
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          <TransactionTable
            transactions={currentItems}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={sortedAndFilteredTransactions.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {showReportModal && (
        <ReportGeneratorModal<InventoryTransaction>
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          data={sortedAndFilteredTransactions}
          columns={transactionReportColumns}
          title="Inventory Transaction History Report"
          fileName="Inventory_Transaction_Report"
          headerInfo={{ companyName: companyDetails?.name || 'Your Company' }}
          footerInfo={{ appName: 'EriLinaERP' }}
          dateFilterKey="timestamp"
        />
      )}
    </div>
  );
};

export default InventoryTransactionHistoryPage;