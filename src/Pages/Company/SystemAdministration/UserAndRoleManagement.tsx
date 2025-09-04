/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Users, Shield, PlusCircle, ChevronsRight, Briefcase } from 'lucide-react';
import { useCompanyDetails } from '../../../Contexts/CompanyContext';
import { useNotification } from '../../../Components/NotificationProvider';
import { User, Role, ModulePermissions, initialPermissions } from '../../../types/system-administration';
import { URL_BECC, URL_BESA } from '../../../Utils/Constants';

type ViewMode = 'users' | 'roles' | 'hierarchy';

const UserAndRoleManagementPage: React.FC = () => {
    const { showNotification } = useNotification();
    const companyDetails = useCompanyDetails();
    const companyID = companyDetails?.id;
    const primaryColor = companyDetails?.primary_color || '#3b82f6';
    const textColor = '#ffffff';

    const [viewMode, setViewMode] = useState<ViewMode>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [companyModules, setCompanyModules] = useState<string[]>([]);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    const [newUserFormData, setNewUserFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        email: '',
        role_id: '',
    });

    const [newRoleFormData, setNewRoleFormData] = useState<{ name: string; permissions: ModulePermissions }>({
        name: '',
        permissions: JSON.parse(JSON.stringify(initialPermissions)),
    });

    const fetchData = async () => {
        if (!companyID) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [usersResponse, rolesResponse, companyModulesResponse] = await Promise.all([
                fetch(`${URL_BESA}/api/companies/${companyID}/users`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                }),
                fetch(`${URL_BESA}/api/companies/${companyID}/roles`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                }),
                fetch(`${URL_BECC}/api/user/modules`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                    }
                ),
            ]);

            if (!usersResponse.ok) throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
            if (!rolesResponse.ok) throw new Error(`Failed to fetch roles: ${rolesResponse.statusText}`);
            if (!companyModulesResponse.ok) throw new Error(`Failed to fetch company modules: ${companyModulesResponse.statusText}`);

            const usersData = await usersResponse.json();
            const rolesData = await rolesResponse.json();
            const companyModulesData = await companyModulesResponse.json();
            const companyModuleKeys = companyModulesData.map((module: any) => module.key)
            
            console.log("Modules from API:", companyModuleKeys);
            setUsers(usersData || []);
            setRoles(rolesData || []);
            setCompanyModules(companyModuleKeys);
            
        } catch (error: any) {
            if (error instanceof SyntaxError) {
                showNotification(`Error parsing JSON: ${error.message}`, 'error');
            } else {
                showNotification(`Error fetching data: ${error.message}`, 'error');
            }
            setUsers([]);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companyID) {
            fetchData();
        } else {
            setLoading(true);
        }
    }, [companyID]);

    const handleCreateUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyID) return;

        setLoading(true);
        try {
            const response = await fetch(`${URL_BESA}/api/companies/${companyID}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...newUserFormData,
                    role_id: parseInt(newUserFormData.role_id, 10),
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create user.');
            }

            showNotification('User created successfully!', 'success');
            setIsUserModalOpen(false);
            setNewUserFormData({ username: '', password: '', full_name: '', email: '', role_id: '' });
            fetchData();
        } catch (error: any) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyID) return;

        setLoading(true);
        try {
            const response = await fetch(`${URL_BESA}/api/companies/${companyID}/roles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newRoleFormData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create role.');
            }

            showNotification('Role created successfully!', 'success');
            setIsRoleModalOpen(false);
            setNewRoleFormData({ name: '', permissions: JSON.parse(JSON.stringify(initialPermissions)) });
            fetchData();
        } catch (error: any) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionChange = (module: keyof ModulePermissions, subModule: string, action: 'create' | 'read' | 'update' | 'delete', value: boolean) => {
        setNewRoleFormData(prev => {
            const newPermissions = { ...prev.permissions };
            (newPermissions[module] as any)[subModule][action] = value;
            return { ...prev, permissions: newPermissions };
        });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg text-primary" style={{ color: primaryColor }}></span>
                </div>
            );
        }

        switch (viewMode) {
            case 'users':
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-500 text-sm">
                                    <th>Username</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.ID} className="hover:bg-gray-50 transition-colors duration-200 text-sm">
                                        <td className="font-medium text-gray-800">{user.username}</td>
                                        <td>{user.full_name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className="badge badge-md border-none" style={{ backgroundColor: primaryColor, color: textColor }}>{user.role?.name || 'N/A'}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'roles':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {roles.map(role => (
                            <div key={role.id} className="card bg-gray-100 p-5 rounded-2xl shadow-sm border border-gray-200">
                                <div className="card-body p-0">
                                    <h3 className="card-title text-base font-bold text-gray-800 flex items-center gap-2">
                                        <Briefcase size={20} style={{ color: primaryColor }} /> {role.name}
                                    </h3>
                                    <p className="text-gray-500 mt-1 text-xs">
                                        {users.filter(u => u.role_id === role.id).length} registered users
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'hierarchy':
                return (
                    <div className="space-y-6">
                        {roles.map(role => (
                            <div key={role.id} className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-gray-200" style={{ borderColor: primaryColor }}>
                                <h3 className="font-bold text-base flex items-center gap-2 text-gray-800"><Briefcase size={20} /> {role.name}</h3>
                                <div className="pl-6 mt-3 space-y-2">
                                    {users.filter(u => u.role_id === role.id).length > 0 ? (
                                        users.filter(u => u.role_id === role.id).map(user => (
                                            <div key={user.ID} className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center gap-2">
                                                <Users size={14} className="text-gray-500" />
                                                <span className="text-xs font-medium text-gray-700">{user.full_name} ({user.username})</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-xs italic">No users in this role.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 md:p-4 lg:p-4 bg-gray-50 min-h-screen">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">User & Role Management</h1>
                <p className="text-gray-600 mt-1 text-base">Manage users, define roles, and configure permissions within your company.</p>
            </header>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div role="tablist" className="tabs tabs-lifted transition-all duration-300">
                    <a role="tab" className={`tab text-gray-500 text-sm ${viewMode === 'users' ? 'tab-active font-semibold' : ''}`} style={viewMode === 'users' ? { '--tab-color': primaryColor, '--tab-bg': '#f3f4f6' } as React.CSSProperties : {}} onClick={() => setViewMode('users')}><Users className="mr-2" size={16} /> Users</a>
                    <a role="tab" className={`tab text-gray-500 text-sm ${viewMode === 'roles' ? 'tab-active font-semibold' : ''}`} style={viewMode === 'roles' ? { '--tab-color': primaryColor, '--tab-bg': '#f3f4f6' } as React.CSSProperties : {}} onClick={() => setViewMode('roles')}><Shield className="mr-2" size={16} /> Roles</a>
                    <a role="tab" className={`tab text-gray-500 text-sm ${viewMode === 'hierarchy' ? 'tab-active font-semibold' : ''}`} style={viewMode === 'hierarchy' ? { '--tab-color': primaryColor, '--tab-bg': '#f3f4f6' } as React.CSSProperties : {}} onClick={() => setViewMode('hierarchy')}><ChevronsRight className="mr-2" size={16} /> Hierarchy</a>
                </div>
                <div className="flex gap-2">
                    <button className="btn rounded-xl shadow-md border-none text-sm px-4 py-2" style={{ backgroundColor: primaryColor, color: textColor }} onClick={() => setIsUserModalOpen(true)}>
                        <PlusCircle size={16} /> Add User
                    </button>
                    <button className="btn btn-outline rounded-xl text-sm px-4 py-2" style={{ borderColor: primaryColor, color: primaryColor }} onClick={() => setIsRoleModalOpen(true)}>
                        <PlusCircle size={16} /> Add Role
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                {renderContent()}
            </div>

            {isUserModalOpen && (
                <div className="modal modal-open bg-black bg-opacity-50">
                    <div className="modal-box w-11/12 max-w-lg p-6 rounded-2xl shadow-2xl">
                        <h3 className="font-bold text-xl text-gray-800 mb-5">Create New User</h3>
                        <form onSubmit={handleCreateUserSubmit} className="space-y-3">
                            <input type="text" placeholder="Username" className="input input-bordered w-full rounded-xl text-sm" value={newUserFormData.username} onChange={e => setNewUserFormData({ ...newUserFormData, username: e.target.value })} required />
                            <input type="password" placeholder="Password" className="input input-bordered w-full rounded-xl text-sm" value={newUserFormData.password} onChange={e => setNewUserFormData({ ...newUserFormData, password: e.target.value })} required />
                            <input type="text" placeholder="Full Name" className="input input-bordered w-full rounded-xl text-sm" value={newUserFormData.full_name} onChange={e => setNewUserFormData({ ...newUserFormData, full_name: e.target.value })} required />
                            <input type="email" placeholder="Email" className="input input-bordered w-full rounded-xl text-sm" value={newUserFormData.email} onChange={e => setNewUserFormData({ ...newUserFormData, email: e.target.value })} required />
                            <select className="select select-bordered w-full rounded-xl text-sm" value={newUserFormData.role_id} onChange={e => setNewUserFormData({ ...newUserFormData, role_id: e.target.value })} required>
                                <option disabled value="">Select role</option>
                                {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                            </select>
                            <div className="modal-action mt-4">
                                <button type="button" className="btn btn-ghost rounded-xl text-sm" onClick={() => setIsUserModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary rounded-xl text-sm" style={{ backgroundColor: primaryColor, color: textColor }} disabled={loading}>
                                    {loading ? <span className="loading loading-spinner"></span> : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isRoleModalOpen && (
                <div className="modal modal-open bg-black bg-opacity-50">
                    <div className="modal-box w-11/12 max-w-4xl p-6 rounded-2xl shadow-2xl">
                        <h3 className="font-bold text-xl text-gray-800 mb-5">Create New Role</h3>
                        <form onSubmit={handleCreateRoleSubmit} className="space-y-5">
                            <input type="text" placeholder="Role Name" className="input input-bordered w-full rounded-xl text-sm" value={newRoleFormData.name} onChange={e => setNewRoleFormData({ ...newRoleFormData, name: e.target.value })} required />

                            <h4 className="font-bold mt-6 text-lg text-gray-800">Permissions</h4>
                            <div className="max-h-80 overflow-y-auto space-y-3 p-4 border rounded-2xl bg-gray-50">
                                {Object.keys(initialPermissions)
                                    .filter(moduleKey => companyModules.includes(moduleKey))
                                    .map(moduleKey => {
                                        const modulePermissions = newRoleFormData.permissions[moduleKey as keyof ModulePermissions];
                                        return (
                                            <div key={moduleKey} className="collapse collapse-arrow border border-gray-200 bg-white rounded-xl">
                                                <input type="checkbox" />
                                                <div className="collapse-title text-base font-semibold capitalize text-gray-800">
                                                    {moduleKey.replace(/_/g, ' ')}
                                                </div>
                                                <div className="collapse-content bg-white p-3">
                                                    {Object.keys(modulePermissions).map(subModuleKey => (
                                                        <div key={subModuleKey} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border-b last:border-b-0">
                                                            <span className="capitalize font-medium text-gray-700 text-sm">{subModuleKey.replace(/_/g, ' ')}</span>
                                                            <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
                                                                {Object.keys((modulePermissions as any)[subModuleKey]).map(action => (
                                                                    <label key={action} className="label cursor-pointer gap-2">
                                                                        <span className="label-text text-xs capitalize">{action}</span>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkbox checkbox-sm"
                                                                            style={{ '--chkbg': primaryColor, '--chkfg': 'white' } as React.CSSProperties}
                                                                            checked={(modulePermissions as any)[subModuleKey][action]}
                                                                            onChange={e => handlePermissionChange(moduleKey as keyof ModulePermissions, subModuleKey, action as any, e.target.checked)}
                                                                        />
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className="modal-action mt-4">
                                <button type="button" className="btn btn-ghost rounded-xl text-sm" onClick={() => setIsRoleModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary rounded-xl text-sm" style={{ backgroundColor: primaryColor, color: textColor }} disabled={loading}>
                                    {loading ? <span className="loading loading-spinner"></span> : 'Create Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAndRoleManagementPage;