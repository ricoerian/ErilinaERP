// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './Layouts/PublicLayout';
import DashboardLayout from './Layouts/DashboardLayout';
import MobileDashboardLayout from './Layouts/MobileDashboardLayout';

import Home from './Pages/Public/Home';
import PricingPage from './Pages/Public/Pricing';
import CompanyPage from './Pages/Public/Company';
import ContactPage from './Pages/Public/Contact';
import SCMPage from './Pages/Modules/SCMPage';
import FinancialManagementPage from './Pages/Modules/FMPage';
import ManufacturingPage from './Pages/Modules/ManufacturingPage';
import IoTPage from './Pages/Modules/IoTPage';
import ProjectManagementPage from './Pages/Modules/PMPage';
import CustomerRelationshipManagementPage from './Pages/Modules/CRMPage';
import SalesManagementPage from './Pages/Modules/SMPage';
import ServiceMaintenancePage from './Pages/Modules/SeviceMaintenancePage';
import HumanResourcePage from './Pages/Modules/HRMPage';
import AssetManagementPage from './Pages/Modules/AMPage';
import BusinessIntelligencePage from './Pages/Modules/BIPage';
import BigDataAnalyticsPage from './Pages/Modules/BDAPage';
import PrivacyPolicyPage from './Pages/Public/PrivacyPolicyPage';
import CompanyLoginPage from './Pages/CompanyLoginPage';
import CompanyAuthLoginPage from './Pages/Company/Login';
import CompanyDashboardPage from './Pages/Company/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import InventoryManagementPage from './Pages/Company/SCM/InventoryManagement/InventoryManagement';
import InventoryTransactionHistoryPage from './Pages/Company/SCM/InventoryManagement/InventoryTransactionHistoryPage';
import ForbiddenPage from './Pages/ForbiddenPage';
import NotFoundPage from './Pages/NotFoundPage';
import SupplierManagementPage from './Pages/Company/SCM/SupplierManagement/SupplierManagement';
import PurchaseOrderPage from './Pages/Company/SCM/PurchaseOrder/PurchaseOrder';
import WarehouseManagementPage from './Pages/Company/SCM/WarehouseManagement/WarehouseManagement';
import SalesOrderPage from './Pages/Company/SCM/SalesOrder/SalesOrder';
import DeliveryManagementPage from './Pages/Company/SCM/DeliveryManagement/DeliveryManagement';
import DemandPlanning from './Pages/Company/SCM/DemandPlanning/DemandPlanning';
import UserAndRoleManagementPage from './Pages/Company/SystemAdministration/UserAndRoleManagement';
import CompanySettingsPage from './Pages/Company/SystemAdministration/CompanySettings';
import GeneralLedgerPage from './Pages/Company/FM/GeneralLedger/GeneralLedger';
import AccountsPayablePage from './Pages/Company/FM/AccountsPayable/AccountsPayable';
import AccountsReceivablePage from './Pages/Company/FM/AccountsReceivable/AccountsReceivable';
import CashManagementPage from './Pages/Company/FM/CashManagement/CashManagement';
import BankReconciliationPage from './Pages/Company/FM/CashManagement/BankReconciliation';
import FixedAssetsPage from './Pages/Company/FM/FixedAssets/FixedAssets';

import MobileDashboard from './Pages/Company/Dashboard/MobileDashboard';
const App: React.FC = () => {
  const isMobile = window.innerWidth < 768;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="company" element={<CompanyPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="scm" element={<SCMPage />} />
          <Route path="fm" element={<FinancialManagementPage />} />
          <Route path="manufacturing" element={<ManufacturingPage />} />
          <Route path="iot" element={<IoTPage />} />
          <Route path="pm" element={<ProjectManagementPage />} />
          <Route path="crm" element={<CustomerRelationshipManagementPage />} />
          <Route path="sales" element={<SalesManagementPage />} />
          <Route path="service" element={<ServiceMaintenancePage />} />
          <Route path="hrm" element={<HumanResourcePage />} />
          <Route path="am" element={<AssetManagementPage />} />
          <Route path="bi" element={<BusinessIntelligencePage />} />
          <Route path="bda" element={<BigDataAnalyticsPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="login" element={<CompanyLoginPage />} />
          <Route path=":company/login" element={<CompanyAuthLoginPage />} />
        </Route>
        
        <Route
          path="/:company"
          element={
            <ProtectedRoute>
              {isMobile ? <MobileDashboardLayout /> : <DashboardLayout />}
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={isMobile ? <MobileDashboard /> : <CompanyDashboardPage />} />
          <Route path="scm/inventory" element={<InventoryManagementPage />} />
          <Route path="inventory/transactions" element={<InventoryTransactionHistoryPage />} />
          <Route path="scm/suppliers" element={<SupplierManagementPage />} />
          <Route path="scm/purchase-orders" element={<PurchaseOrderPage />} />
          <Route path="scm/sales-orders" element={<SalesOrderPage />} />
          <Route path="scm/warehouse" element={<WarehouseManagementPage />} />
          <Route path="scm/delivery" element={<DeliveryManagementPage />} />
          <Route path="scm/demand-planning" element={<DemandPlanning />} />
          <Route path="fm/general-ledger" element={<GeneralLedgerPage />} />
          <Route path="fm/ap" element={<AccountsPayablePage />} />
          <Route path="fm/ar" element={<AccountsReceivablePage />} />
          <Route path="fm/cash" element={<CashManagementPage />} />
          <Route path="fm/assets" element={<FixedAssetsPage />} />
          <Route
            path="fm/cash/accounts/:account_id/reconciliation"
            element={<BankReconciliationPage />}
          />
          <Route path="admin/users" element={<UserAndRoleManagementPage />} />
          <Route path="admin/company-settings" element={<CompanySettingsPage />} />
        </Route>

        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
};

export default App;