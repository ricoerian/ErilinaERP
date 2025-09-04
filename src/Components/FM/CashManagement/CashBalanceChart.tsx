import React, { useEffect, useRef } from 'react';
import { CashTransaction } from '../../../types/cashManagement';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale, Filler);

interface Props {
    transactions: CashTransaction[];
    currencyCode: string;
}

const CashBalanceChart: React.FC<Props> = ({ transactions, currencyCode }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current || !transactions) return;

        const labels = transactions.map(tx => new Date(tx.CreatedAt));
        const data = transactions.map(tx => tx.balance_after);
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Cash Balance',
                data: data,
                fill: true,
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderColor: 'rgba(79, 70, 229, 1)',
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: 'rgba(79, 70, 229, 1)',
            }]
        };

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => typeof value === 'number' ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value) : value
                        }
                    },
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'MMM dd, yyyy HH:mm',
                            displayFormats: { day: 'MMM dd' }
                        },
                        title: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Balance: ${new Intl.NumberFormat('en-US', { 
                                style: 'currency', 
                                currency: currencyCode 
                            }).format(context.parsed.y)}`
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
            }
        });

        return () => {
            chartInstanceRef.current?.destroy();
        };
    }, [transactions, currencyCode]);

    return (
        <div className="w-full h-96 md:h-[450px] p-4">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default CashBalanceChart;