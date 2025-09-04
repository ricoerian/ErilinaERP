import React, { useEffect, useRef } from 'react';
import { Bill } from '../../../types/accountsPayable';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
    bills: Bill[];
}

const generateCoolColors = (numColors: number) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const hue = (210 + i * 25) % 360; // Start from blue/indigo hues
        colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
    }
    return colors;
};

const AccountsPayableChart: React.FC<Props> = ({ bills }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current || !bills) return;

        const dataBySupplier: { [key: string]: number } = {};
        const payableBills = bills.filter(b => b.status === 'Awaiting Payment' || b.status === 'Partial Paid');

        payableBills.forEach(bill => {
            const supplierName = bill.Supplier?.name || `Supplier ID: ${bill.supplierId}`;
            const remainingAmount = bill.totalAmount - bill.amountPaid;
            if (remainingAmount > 0) {
                dataBySupplier[supplierName] = (dataBySupplier[supplierName] || 0) + remainingAmount;
            }
        });
        
        const sortedSuppliers = Object.entries(dataBySupplier).sort(([, a], [, b]) => b - a);
        
        const labels = sortedSuppliers.map(([name]) => name);
        const data = sortedSuppliers.map(([, amount]) => amount);
        const backgroundColors = generateCoolColors(labels.length);
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Total Due',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                borderWidth: 1,
                borderRadius: 5,
            }]
        };

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Total Due (USD)', font: { size: 14 } },
                        ticks: {
                            callback: (value) => typeof value === 'number' ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value) : value
                        }
                    },
                    x: {
                        title: { display: true, text: 'Supplier', font: { size: 14 } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Total Due: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y)}`
                        }
                    }
                }
            }
        });

        return () => {
            chartInstanceRef.current?.destroy();
        };
    }, [bills]);

    return (
        <div className="w-full h-96 md:h-[500px] p-4 animate-fade-in">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default AccountsPayableChart;