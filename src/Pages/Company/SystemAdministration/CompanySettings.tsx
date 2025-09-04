import React, { useEffect, useState } from 'react';
import { Save, Image as ImageIcon, PaintBucket, Mail, Clock, ChevronDown } from 'lucide-react';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';
import { useNotification } from '../../../Components/NotificationProvider';
import { timezones, URL_BESA } from '../../../Utils/Constants';

interface CompanyFormData {
    name: string;
    logo_url: string;
    primary_color: string;
    secondary_color: string;
    cover_image_url: string;
    timezone: string;
    currency_code: string;
    contact_email: string;
    phone: string;
    address: string;
}

const CompanySettingsPage: React.FC = () => {
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();
    const companyID = companyDetails?.id;
    const textColor = '#ffffff';

    const [formData, setFormData] = useState<CompanyFormData>({
        name: '',
        logo_url: '',
        primary_color: '#3b82f6',
        secondary_color: '#6b7280',
        cover_image_url: '',
        timezone: '',
        currency_code: '',
        contact_email: '',
        phone: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

    // List of timezones for the searchable dropdown
    

    const filteredTimezones = timezones.filter(tz =>
        tz.toLowerCase().includes(formData.timezone.toLowerCase())
    );

    useEffect(() => {
        if (companyDetails) {
            setFormData({
                name: companyDetails.name || '',
                logo_url: companyDetails.logo_url || '',
                primary_color: companyDetails.primary_color || '#3b82f6',
                secondary_color: companyDetails.secondary_color || '#6b7280',
                cover_image_url: companyDetails.cover_image_url || '',
                timezone: companyDetails.timezone || '',
                currency_code: companyDetails.currency_code || '',
                contact_email: companyDetails.contact_email || '',
                phone: companyDetails.phone || '',
                address: companyDetails.address || '',
            });
        }
    }, [companyDetails]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'timezone') {
            setShowTimezoneDropdown(true);
        }
    };

    const handleTimezoneSelect = (tz: string) => {
        setFormData(prev => ({ ...prev, timezone: tz }));
        setShowTimezoneDropdown(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyID) {
            showNotification('Company ID is not available.', 'error');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${URL_BESA}/api/companies/${companyID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update company settings.');
            }

            showNotification('Company settings updated successfully!', 'success');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!companyDetails) {
         return (
            <div className="flex justify-center items-center h-64 bg-white min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary" style={{ color: formData.primary_color }}></span>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-4 lg:p-4 bg-white min-h-screen">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-3xl lg:text-3xl font-bold text-gray-900">Company Settings</h1>
                <p className="text-gray-600 mt-1 text-base">Manage your company's general information, branding, and contact details.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8 w-full mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center mb-5">
                        <ImageIcon size={20} className="mr-3 text-primary" style={{ color: formData.primary_color }}/> General Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="form-control w-full">
                            <span className="label-text font-medium text-gray-600">Company Name</span>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered w-full rounded-xl text-sm" placeholder="Company name" />
                        </label>
                        <label className="form-control w-full relative">
                            <span className="label-text font-medium text-gray-600">Timezone</span>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="timezone"
                                    value={formData.timezone}
                                    onChange={handleChange}
                                    onFocus={() => setShowTimezoneDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowTimezoneDropdown(false), 200)}
                                    className="input input-bordered w-full rounded-xl pl-10 pr-10 text-sm"
                                    placeholder="e.g., Asia/Jakarta"
                                />
                                <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                {showTimezoneDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                                        {filteredTimezones.length > 0 ? (
                                            filteredTimezones.map(tz => (
                                                <div
                                                    key={tz}
                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                                    onMouseDown={() => handleTimezoneSelect(tz)}
                                                >
                                                    {tz}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">No timezone found.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </label>
                        <label className="form-control w-full md:col-span-2">
                            <span className="label-text font-medium text-gray-600">Currency Code</span>
                            <input type="text" name="currency_code" value={formData.currency_code} onChange={handleChange} className="input input-bordered w-full rounded-xl text-sm" maxLength={3} placeholder="e.g., IDR" />
                        </label>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center mb-5">
                        <PaintBucket size={20} className="mr-3 text-primary" style={{ color: formData.primary_color }}/> Branding
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="form-control w-full md:col-span-2">
                            <span className="label-text font-medium text-gray-600">Logo URL</span>
                            <input type="text" name="logo_url" value={formData.logo_url} onChange={handleChange} className="input input-bordered w-full rounded-xl text-sm" placeholder="https://example.com/logo.png" />
                            {formData.logo_url && (
                                <div className="mt-4 p-3 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                                    <img src={formData.logo_url} alt="Logo Preview" className="w-auto object-contain rounded-md" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/200x80')} />
                                </div>
                            )}
                        </label>
                        <label className="form-control w-full md:col-span-2">
                            <span className="label-text font-medium text-gray-600">Cover Image URL</span>
                            <input type="text" name="cover_image_url" value={formData.cover_image_url} onChange={handleChange} className="input input-bordered w-full rounded-xl text-sm" placeholder="https://example.com/cover.jpg" />
                            {formData.cover_image_url && (
                                <div className="mt-4 p-3 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                                    <img src={formData.cover_image_url} alt="Cover Preview" className="w-full object-cover rounded-xl" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/600x200')} />
                                </div>
                            )}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 col-span-2">
                            <label className="form-control w-full">
                                <span className="label-text font-medium text-gray-600">Primary Color</span>
                                <div className="flex items-center gap-2">
                                    <input type="color" name="primary_color" value={formData.primary_color} onChange={handleChange} className="p-1 h-10 w-12 block bg-white border border-gray-200 cursor-pointer rounded-xl"/>
                                    <input type="text" value={formData.primary_color} onChange={handleChange} name="primary_color" className="input input-bordered w-full rounded-xl text-sm"/>
                                </div>
                            </label>
                            <label className="form-control w-full">
                                <span className="label-text font-medium text-gray-600">Secondary Color</span>
                                <div className="flex items-center gap-2">
                                    <input type="color" name="secondary_color" value={formData.secondary_color} onChange={handleChange} className="p-1 h-10 w-12 block bg-white border border-gray-200 cursor-pointer rounded-xl"/>
                                    <input type="text" value={formData.secondary_color} onChange={handleChange} name="secondary_color" className="input input-bordered w-full rounded-xl text-sm"/>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center mb-5">
                        <Mail size={20} className="mr-3 text-primary" style={{ color: formData.primary_color }}/> Contact Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="form-control w-full">
                            <span className="label-text font-medium text-gray-600">Contact Email</span>
                            <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className="input input-bordered w-full rounded-xl text-sm" placeholder="contact@example.com" />
                        </label>
                        <label className="form-control w-full">
                            <span className="label-text font-medium text-gray-600">Phone Number</span>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input input-bordered w-full rounded-xl text-sm" placeholder="+628123456789" />
                        </label>
                        <label className="form-control w-full md:col-span-2">
                            <span className="label-text font-medium text-gray-600">Address</span>
                            <div className="relative mt-1">
                                <textarea name="address" value={formData.address} onChange={handleChange} className="textarea textarea-bordered h-24 w-full rounded-xl text-sm" placeholder="Jl. Contoh No. 1, Jakarta"></textarea>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="btn btn-primary rounded-xl text-base px-6 py-2" style={{ backgroundColor: formData.primary_color, color: textColor, borderColor: formData.primary_color }} disabled={loading}>
                        {loading ? <span className="loading loading-spinner"></span> : <><Save size={18} className="mr-2"/> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanySettingsPage;