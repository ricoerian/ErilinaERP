import React, { useEffect, useState } from 'react';
import { BarChart2, List } from 'lucide-react';
import { useCompanyDetails } from '../../../../Contexts/CompanyContext';
import DemandForecastTable from '../../../../Components/SCM/DemandPlanning/DemandTable';
import DemandForecastChart from '../../../../Components/SCM/DemandPlanning/DemandCharts';
import { URL_BESMCDP, URL_BESMCIM } from '../../../../Utils/Constants';
import { useNotification } from '../../../../Components/NotificationProvider';

interface DemandForecast {
    ID: number;
    companyId: number;
    productId: string;
    forecastDate: string;
    forecastPeriod: string;
    forecastAmount: number;
}

interface Product {
    id: string;
    name: string;
}

type ViewMode = 'table' | 'charts';

const DemandPlanning: React.FC = () => {
    const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProductID, setSelectedProductID] = useState<string>('');
    const [monthsToForecast, setMonthsToForecast] = useState<number>(3);
    const [historicalMonths, setHistoricalMonths] = useState<number>(6);
    const [viewMode, setViewMode] = useState<ViewMode>('charts');
    const { showNotification } = useNotification();

    const companyDetails = useCompanyDetails();
    const companyID = companyDetails?.id;
    const primaryColor = companyDetails?.primary_color || '#3b82f6';
    const textColor = '#ffffff';


    const fetchProducts = async () => {
        if (!companyID) return;
        try {
            const response = await fetch(`${URL_BESMCIM}/api/companies/${companyID}/inventory`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data: Product[] = await response.json();
            setProducts(data);
            if (data.length > 0) {
                setSelectedProductID(data[0].id);
            }
        } catch (error) {
            showNotification(`Failed to fetch products: ${error}`, 'error');
        }
    };

    const fetchDemandForecast = async () => {
        if (!companyID || !selectedProductID) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${URL_BESMCDP}/api/companies/${companyID}/forecast?product_id=${selectedProductID}&forecast_months=${monthsToForecast}&historical_months=${historicalMonths}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw showNotification('Failed to fetch demand forecast');
            }

            const data: DemandForecast[] = await response.json();
            setForecasts(data);
        } catch (err) {
            showNotification(`Error fetching demand forecast: ${err}}`, 'error');
            setForecasts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [companyID]);

    useEffect(() => {
        if (selectedProductID) {
            fetchDemandForecast();
        }
    }, [companyID, selectedProductID, monthsToForecast, historicalMonths]);

    return (
        <div className={`p-4 bg-[#2196F3}] min-h-screen`}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Demand Planning</h1>
            <p className="text-gray-600 mb-8">
                Visualize and manage your product demand forecasts. Use the controls below to view historical data and future projections.
            </p>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-4 bg-white rounded-xl shadow-sm">
                
                {/* Wrapper untuk semua input agar tetap terorganisir */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-wrap w-full md:w-auto">
                    {/* Grup kontrol pertama */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <label className="text-gray-700 font-medium whitespace-nowrap">Select Product:</label>
                        <select
                            className="select select-bordered w-full md:w-auto bg-white"
                            value={selectedProductID}
                            onChange={(e) => setSelectedProductID(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">-- Select a Product --</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    {/* Grup kontrol kedua */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-gray-700 font-medium whitespace-nowrap">Historical Months:</label>
                            <input
                                type="number"
                                value={historicalMonths}
                                onChange={(e) => setHistoricalMonths(Number(e.target.value))}
                                className="input input-bordered w-20 bg-white"
                                min="1"
                                disabled={loading}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-gray-700 font-medium whitespace-nowrap">Forecast Months:</label>
                            <input
                                type="number"
                                value={monthsToForecast}
                                onChange={(e) => setMonthsToForecast(Number(e.target.value))}
                                className="input input-bordered w-20 bg-white"
                                min="1"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Wrapper untuk tombol, diletakkan di akhir */}
                <div className="flex justify-start md:justify-end gap-2 mt-4 md:mt-0 w-full md:w-auto">
                    <button
                        className={`btn rounded-md shadow-sm transition-all duration-200`}
                        onClick={() => setViewMode('charts')}
                        style={viewMode === 'charts' ? {
                            backgroundColor: primaryColor,
                            color: textColor,
                            borderColor: primaryColor
                        } : {}}
                        disabled={loading}
                    >
                        <BarChart2 size={20} />
                        <span className="hidden md:inline">Charts</span>
                    </button>
                    <button
                        className={`btn rounded-md shadow-sm transition-all duration-200`}
                        onClick={() => setViewMode('table')}
                        style={viewMode === 'table' ? {
                            backgroundColor: primaryColor,
                            color: textColor,
                            borderColor: primaryColor
                        } : {}}
                        disabled={loading}
                    >
                        <List size={20} />
                        <span className="hidden md:inline">Table</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-gray-600">Loading forecast data...</p>
                </div>
            ) : (
                <>
                    {forecasts.length > 0 ? (
                        <>
                            {viewMode === 'charts' && <DemandForecastChart forecasts={forecasts} />}
                            {viewMode === 'table' && <DemandForecastTable forecasts={forecasts} />}
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-700">No forecast data available.</h2>
                            <p className="mt-2 text-gray-500 text-center">Please select a product and specify the time range to get started.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DemandPlanning;