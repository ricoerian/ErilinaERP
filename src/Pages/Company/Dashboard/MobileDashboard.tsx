import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';
import { MODULES } from '../../../Utils/Constants';

const MobileDashboard: React.FC = () => {
    const { company } = useParams<{ company: string }>();
    const navigate = useNavigate();
    const companyDetails = useCompanyDetails();
    const primaryColor = companyDetails?.primary_color || '#3b82f6';

    const handleModuleClick = (module: (typeof MODULES)[0]) => {
        const targetPath = module.submenus[0]?.href || module.href;
        navigate(`/${company}${targetPath}`);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Modules</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {MODULES.map((module) => {
                    const Icon = module.Icon;
                    return (
                        <button
                            key={module.name}
                            onClick={() => handleModuleClick(module)}
                            className="card bg-white shadow-lg rounded-xl p-4 flex flex-col items-center justify-center text-center aspect-square transition-transform transform hover:scale-105"
                        >
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                                style={{ backgroundColor: `${primaryColor}20` }}
                            >
                                {/* Render ikon jika valid */}
                                {Icon && <Icon size={32} style={{ color: primaryColor }} />}
                            </div>
                            <span className="font-semibold text-gray-700 text-sm">{module.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileDashboard;