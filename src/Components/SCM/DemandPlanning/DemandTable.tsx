import React from 'react';

interface DemandForecast {
    ID: number;
    companyId: number;
    productId: string;
    forecastDate: string;
    forecastPeriod: string;
    forecastAmount: number;
}

interface DemandForecastTableProps {
    forecasts: DemandForecast[];
}

const DemandForecastTable: React.FC<DemandForecastTableProps> = ({ forecasts }) => {
    return (
        <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Demand Forecast Table</h2>
            <p className="text-sm text-gray-500 mb-4">
                Below are the detailed demand forecasts displayed in a table format.
            </p>
            <table className="table w-full table-zebra rounded-xl overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="py-3 px-4 text-left font-semibold">Date</th>
                        <th className="py-3 px-4 text-left font-semibold">Period</th>
                        <th className="py-3 px-4 text-left font-semibold">Forecast Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="text-center py-4 text-gray-500">No forecast data available.</td>
                        </tr>
                    ) : (
                        forecasts.map((f, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="py-3 px-4">{new Date(f.forecastDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</td>
                                <td className="py-3 px-4">{f.forecastPeriod}</td>
                                <td className="py-3 px-4 font-medium">{f.forecastAmount.toLocaleString('en-US')} units</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DemandForecastTable;