import React, { useState } from 'react';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';
import { useNotification } from '../../NotificationProvider';
import { URL_BEFMFA } from '../../../Utils/Constants';
import { Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const PeriodEndProcessCard: React.FC = () => {
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleRunDepreciation = async () => {
        if (!companyDetails?.id || !isConfirmed) {
            showNotification("Please confirm that you understand this action before proceeding.", "warning");
            return;
        }

        setLoading(true);
        setResult(null);
        try {
            const response = await fetch(`${URL_BEFMFA}/api/companies/${companyDetails.id}/fixed-assets/run-batch-depreciation`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to run batch depreciation.');
            }
            
            setResult(data.message);
            showNotification('Batch depreciation process completed successfully!', 'success');

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setResult(`Error: ${errorMessage}`);
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
            setIsConfirmed(false);
        }
    };

    return (
        <div className="card w-full bg-base-100 shadow-xl mt-8">
            <div className="card-body">
                <h2 className="card-title text-xl font-semibold border-b pb-3 flex items-center gap-3">
                    <Calendar />
                    Period-End Processes
                </h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Kolom Kiri: Deskripsi & Konfirmasi */}
                    <div>
                        <h3 className="font-bold text-lg">Monthly Depreciation</h3>
                        <p className="text-gray-600 mt-2 text-sm">
                            This action will calculate and post the monthly depreciation journal for all active fixed assets. 
                            It creates a single consolidated journal entry in the General Ledger.
                        </p>
                        
                        <div className="alert alert-warning mt-4 shadow-sm text-xs">
                            <AlertTriangle size={32} />
                            <div>
                                <h3 className="font-bold">Important!</h3>
                                <p>This is an irreversible accounting action. Ensure all asset data is correct and you are running this at the appropriate time (e.g., end of the month).</p>
                            </div>
                        </div>

                        <div className="form-control mt-4">
                            <label className="label cursor-pointer justify-start gap-4 p-0">
                                <input 
                                    type="checkbox" 
                                    checked={isConfirmed}
                                    onChange={() => setIsConfirmed(!isConfirmed)}
                                    className="checkbox checkbox-sm"
                                    style={{'--chkbg': primaryColor} as React.CSSProperties}
                                />
                                <span className="label-text font-medium text-sm">
                                    I understand this action is final and will post to the General Ledger.
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Kolom Kanan: Tombol Aksi & Hasil */}
                    <div className="flex flex-col justify-between h-full">
                         <button 
                            className="btn text-white w-full"
                            style={{ backgroundColor: primaryColor }}
                            onClick={handleRunDepreciation}
                            disabled={loading || !isConfirmed}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Clock size={20} className="mr-2"/>
                                    Run Monthly Depreciation
                                </>
                            )}
                        </button>
                        
                        {result && (
                            <div className={`mt-4 p-3 rounded-lg text-sm animate-fade-in ${result.startsWith('Error:') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={18} />
                                    <div>
                                        <h4 className="font-bold">Process Result:</h4>
                                        <p>{result}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeriodEndProcessCard;