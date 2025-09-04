import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface DemandForecast {
    ID: number;
    companyId: number;
    productId: string;
    forecastDate: string;
    forecastPeriod: string;
    forecastAmount: number;
}

interface DemandForecastChartProps {
    forecasts: DemandForecast[];
}

const DemandForecastChart: React.FC<DemandForecastChartProps> = ({ forecasts }) => {
    const labels = forecasts.map(item => `${item.forecastPeriod} ${new Date(item.forecastDate).getFullYear()}`);
    const dataPoints = forecasts.map(item => item.forecastAmount);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Forecast Amount (Units)',
                data: dataPoints,
                borderColor: '#4299e1',
                backgroundColor: 'rgba(66, 153, 225, 0.2)',
                tension: 0.4,
                fill: 'origin',
                pointBackgroundColor: '#4299e1',
                pointBorderColor: '#fff',
                pointHoverRadius: 8,
                pointHoverBorderColor: '#4299e1',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 14,
                        family: 'Arial, sans-serif'
                    }
                }
            },
            title: {
                display: true,
                text: 'Demand Forecast Chart',
                font: {
                    size: 18,
                    weight: 700,
                    family: 'Arial, sans-serif'
                },
                color: '#2d3748'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: { size: 16 },
                bodyFont: { size: 14 },
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: function(context: any) {
                        return `  Amount: ${context.parsed.y} units`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Units',
                    font: {
                        size: 14,
                        family: 'Arial, sans-serif'
                    },
                    color: '#4a5568'
                }
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-full overflow-hidden">
            <div className="relative h-[400px]">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default DemandForecastChart;