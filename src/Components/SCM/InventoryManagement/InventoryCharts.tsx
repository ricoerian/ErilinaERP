import React, { useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { InventoryItem } from '../../../types/inventory';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface InventoryChartsProps {
    items: InventoryItem[];
}

const COLORS = [
    '#4CAF50',
    '#FFC107',
    '#F44336',
    '#2196F3',
    '#9C27B0',
    '#FF9800',
    '#607D8B',
    '#795548',
];

const InventoryCharts: React.FC<InventoryChartsProps> = ({ items }) => {
    const stockByCategoryData = useMemo(() => {
        const categoriesMap = new Map<string, number>();
        items.forEach(item => {
            categoriesMap.set(item.category, (categoriesMap.get(item.category) || 0) + item.currentStock);
        });
        const labels = Array.from(categoriesMap.keys());
        const data = Array.from(categoriesMap.values());

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Total Stock',
                    data: data,
                    backgroundColor: COLORS.slice(3, COLORS.length),
                    borderColor: COLORS.slice(3, COLORS.length).map(color => color.replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        };
    }, [items]);

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Category',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Stock Quantity',
                },
                beginAtZero: true,
            },
        },
    };

    const stockStatusData = useMemo(() => {
        const statusMap = new Map<string, number>();
        items.forEach(item => {
            statusMap.set(item.status, (statusMap.get(item.status) || 0) + 1);
        });

        const labels = Array.from(statusMap.keys());
        const data = Array.from(statusMap.values());

        const backgroundColors = labels.map(status => {
            if (status === 'In Stock') return COLORS[0];
            if (status === 'Low Stock') return COLORS[1];
            if (status === 'Out of Stock') return COLORS[2];
            return COLORS[3];
        });

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Number of Items',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        };
    }, [items]);

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: false,
            },
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            <div className="card bg-base-100 shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Stock by Category</h2>
                <div className="h-[300px]">
                    <Bar data={stockByCategoryData} options={barChartOptions} />
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Stock Status</h2>
                <div className="h-[300px]">
                    <Pie data={stockStatusData} options={pieChartOptions} />
                </div>
            </div>
        </div>
    );
};

export default InventoryCharts;