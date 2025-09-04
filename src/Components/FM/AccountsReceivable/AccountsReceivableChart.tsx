// File: components/FM/AccountsReceivable/AccountsReceivableChart.tsx

import React, { useEffect, useRef } from 'react';
import { Invoice } from '../../../types/accountsReceivable';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
    invoices: Invoice[];
}

const generateCoolColors = (numColors: number) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const hue = (120 + i * 25) % 360; // Start from green/teal hues
        colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
    }
    return colors;
};

const AccountsReceivableChart: React.FC<Props> = ({ invoices }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current || !invoices) return;

        const dataByCustomer: { [key: string]: number } = {};
        const receivableInvoices = invoices.filter(inv => inv.status === 'Awaiting Payment' || inv.status === 'Partial Paid');

        receivableInvoices.forEach(invoice => {
            const customerName = invoice.customer?.name || `Customer ID: ${invoice.customerId}`;
            const remainingAmount = invoice.totalAmount - invoice.amountPaid;
            if (remainingAmount > 0) {
                dataByCustomer[customerName] = (dataByCustomer[customerName] || 0) + remainingAmount;
            }
        });

        const sortedCustomers = Object.entries(dataByCustomer).sort(([, a], [, b]) => b - a);

        const labels = sortedCustomers.map(([name]) => name);
        const data = sortedCustomers.map(([, amount]) => amount);
        const backgroundColors = generateCoolColors(labels.length);

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Total Receivable',
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
                        title: { display: true, text: 'Total Receivable (USD)', font: { size: 14 } },
                        ticks: {
                            callback: (value) => typeof value === 'number' ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value) : value
                        }
                    },
                    x: {
                        title: { display: true, text: 'Customer', font: { size: 14 } }
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
    }, [invoices]);

    return (
        <div className="w-full h-96 md:h-[500px] p-4 animate-fade-in">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default AccountsReceivableChart;