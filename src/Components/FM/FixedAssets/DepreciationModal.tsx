import React, { useMemo } from 'react';
import { FixedAsset } from '../../../types/fixedAssets';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    asset: FixedAsset | null;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(value);
};

const DepreciationModal: React.FC<Props> = ({ isOpen, onClose, asset }) => {
    const depreciationSchedule = useMemo(() => {
        if (!asset) return [];

        const schedule = [];
        const depreciableValue = asset.acquisitionCost - asset.salvageValue;
        const monthlyDepreciation = depreciableValue / asset.usefulLifeInMonths;
        let accumulatedDepreciation = 0;
        let bookValue = asset.acquisitionCost;

        for (let i = 1; i <= asset.usefulLifeInMonths; i++) {
            accumulatedDepreciation += monthlyDepreciation;
            bookValue -= monthlyDepreciation;
            schedule.push({
                month: i,
                depreciation: monthlyDepreciation,
                accumulated: accumulatedDepreciation,
                bookValue: bookValue < 0 ? 0 : bookValue,
            });
        }
        return schedule;
    }, [asset]);

    if (!isOpen || !asset) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-3xl">
                <div className="mb-4">
                    <h3 className="font-bold text-xl">Depreciation Simulation</h3>
                    <p className="text-gray-600">Asset: <span className="font-semibold">{asset.name}</span> ({asset.assetCode})</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center p-4 bg-base-200 rounded-lg mb-4">
                    <div>
                        <div className="text-sm text-gray-500">Acquisition Cost</div>
                        <div className="font-semibold text-lg">{formatCurrency(asset.acquisitionCost)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Salvage Value</div>
                        <div className="font-semibold text-lg">{formatCurrency(asset.salvageValue)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Useful Life</div>
                        <div className="font-semibold text-lg">{asset.usefulLifeInMonths} Months</div>
                    </div>
                </div>

                <div className="py-2 max-h-80 overflow-y-auto">
                    <table className="table table-compact w-full">
                        <thead>
                            <tr>
                                <th className="text-center">Month</th>
                                <th className="text-right">Monthly Depreciation</th>
                                <th className="text-right">Accumulated Dep.</th>
                                <th className="text-right">Book Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-base-200 font-semibold">
                                <td className="text-center">0</td>
                                <td className="text-right">{formatCurrency(0)}</td>
                                <td className="text-right">{formatCurrency(0)}</td>
                                <td className="text-right">{formatCurrency(asset.acquisitionCost)}</td>
                            </tr>
                            {depreciationSchedule.map(row => (
                                <tr key={row.month} className="hover">
                                    <td className="text-center">{row.month}</td>
                                    <td className="text-right">{formatCurrency(row.depreciation)}</td>
                                    <td className="text-right">{formatCurrency(row.accumulated)}</td>
                                    <td className="text-right">{formatCurrency(row.bookValue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="modal-action mt-4">
                    <button className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default DepreciationModal;