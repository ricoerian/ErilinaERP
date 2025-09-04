export interface CRUD {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
}

export interface SupplyChainManagementPermissions {
    inventory_management: CRUD;
    purchase_orders: CRUD;
    supplier_management: CRUD;
    sales_orders: CRUD;
    warehouse_management: CRUD;
    shipping_and_logistics: CRUD;
    demand_planning: CRUD;
}

export interface FinancialManagementPermissions {
    general_ledger: CRUD;
    accounts_payable: CRUD;
    accounts_receivable: CRUD;
    cash_management: CRUD;
    fixed_assets: CRUD;
    budgeting_and_forecasting: CRUD;
    cost_accounting: CRUD;
    tax_management: CRUD;
}

export interface ManufacturingPermissions {
    work_orders: CRUD;
    bill_of_materials: CRUD;
    production_planning: CRUD;
    shop_floor_control: CRUD;
    quality_control: CRUD;
    capacity_planning: CRUD;
    mrp_and_mps: CRUD;
}

export interface InternetOfThingsPermissions {
    device_management: CRUD;
    iot_data_analytics: CRUD;
    real_time_monitoring: CRUD;
}

export interface ProjectManagementPermissions {
    project_list: CRUD;
    task_management: CRUD;
    resource_allocation: CRUD;
    time_tracking: CRUD;
    project_expenses: CRUD;
}

export interface CustomerRelationshipMgtPermissions {
    contacts: CRUD;
    opportunities: CRUD;
    sales_quotes: CRUD;
    campaign_management: CRUD;
    customer_service_and_support: CRUD;
}

export interface SalesManagementPermissions {
    leads_management: CRUD;
    sales_orders: CRUD;
    quotes_and_estimates: CRUD;
    invoicing: CRUD;
    sales_reporting: CRUD;
    commissions: CRUD;
}

export interface ServiceAndMaintenancePermissions {
    service_tickets: CRUD;
    maintenance_schedules: CRUD;
    service_contracts: CRUD;
    field_service_management: CRUD;
    parts_management: CRUD;
}

export interface HumanResourceManagementPermissions {
    employee_directory: CRUD;
    payroll_management: CRUD;
    performance_management: CRUD;
    recruitment_and_onboarding: CRUD;
    time_and_attendance: CRUD;
    leave_management: CRUD;
    training_and_development: CRUD;
    benefits_administration: CRUD;
}

export interface AssetManagementPermissions {
    asset_register: CRUD;
    asset_maintenance: CRUD;
    asset_depreciation: CRUD;
    asset_tracking: CRUD;
}

export interface BusinessIntelligencePermissions {
    interactive_dashboards: CRUD;
    custom_reports: CRUD;
    data_visualization: CRUD;
    big_data_analytics: CRUD;
    data_pipelines: CRUD;
    analytics_jobs: CRUD;
    predictive_analytics: CRUD;
}

export interface DocumentManagementPermissions {
    all_documents: CRUD;
    document_templates: CRUD;
    version_history: CRUD;
}

export interface SystemAdministrationPermissions {
    user_and_role_management: CRUD;
    company_settings: CRUD;
    audit_log: CRUD;
    integrations: CRUD;
}

export interface WorkflowManagementPermissions {
    process_automation: CRUD;
    workflow_designer: CRUD;
    approval_workflows: CRUD;
}

export interface ComplianceAndRiskMgtPermissions {
    regulatory_compliance: CRUD;
    risk_assessment: CRUD;
    audit_management: CRUD;
}

export interface ExchangeRateManagement {
    rates: CRUD;
}

export interface ModulePermissions {
    supply_chain_management: SupplyChainManagementPermissions;
    financial_management: FinancialManagementPermissions;
    manufacturing: ManufacturingPermissions;
    internet_of_things: InternetOfThingsPermissions;
    project_management: ProjectManagementPermissions;
    customer_relationship_management: CustomerRelationshipMgtPermissions;
    sales_management: SalesManagementPermissions;
    service_and_maintenance: ServiceAndMaintenancePermissions;
    human_resource_management: HumanResourceManagementPermissions;
    asset_management: AssetManagementPermissions;
    business_intelligence: BusinessIntelligencePermissions;
    document_management: DocumentManagementPermissions;
    system_administration: SystemAdministrationPermissions;
    workflow_management: WorkflowManagementPermissions;
    compliance_and_risk_management: ComplianceAndRiskMgtPermissions;
    exchange_rate_management: ExchangeRateManagement;
}

export interface Role {
    id: number;
    name: string;
    company_id: number;
    permissions: ModulePermissions;
}

export interface User {
    ID: number;
    username: string;
    full_name: string;
    email: string;
    company_id: number;
    role_id: number;
    role?: {
        id: number;
        name: string;
    };
}

const crud_false: CRUD = { create: false, read: false, update: false, delete: false };
const crud_true: CRUD = { create: true, read: true, update: true, delete: true };

export const initialPermissions: ModulePermissions = {
    supply_chain_management: {
        inventory_management: { ...crud_false },
        purchase_orders: { ...crud_false },
        supplier_management: { ...crud_false },
        sales_orders: { ...crud_false },
        warehouse_management: { ...crud_false },
        shipping_and_logistics: { ...crud_false },
        demand_planning: { ...crud_false },
    },
    financial_management: {
        general_ledger: { ...crud_false },
        accounts_payable: { ...crud_false },
        accounts_receivable: { ...crud_false },
        cash_management: { ...crud_false },
        fixed_assets: { ...crud_false },
        budgeting_and_forecasting: { ...crud_false },
        cost_accounting: { ...crud_false },
        tax_management: { ...crud_false },
    },
    manufacturing: {
        work_orders: { ...crud_false },
        bill_of_materials: { ...crud_false },
        production_planning: { ...crud_false },
        shop_floor_control: { ...crud_false },
        quality_control: { ...crud_false },
        capacity_planning: { ...crud_false },
        mrp_and_mps: { ...crud_false },
    },
    internet_of_things: {
        device_management: { ...crud_false },
        iot_data_analytics: { ...crud_false },
        real_time_monitoring: { ...crud_false },
    },
    project_management: {
        project_list: { ...crud_false },
        task_management: { ...crud_false },
        resource_allocation: { ...crud_false },
        time_tracking: { ...crud_false },
        project_expenses: { ...crud_false },
    },
    customer_relationship_management: {
        contacts: { ...crud_false },
        opportunities: { ...crud_false },
        sales_quotes: { ...crud_false },
        campaign_management: { ...crud_false },
        customer_service_and_support: { ...crud_false },
    },
    sales_management: {
        leads_management: { ...crud_false },
        sales_orders: { ...crud_false },
        quotes_and_estimates: { ...crud_false },
        invoicing: { ...crud_false },
        sales_reporting: { ...crud_false },
        commissions: { ...crud_false },
    },
    service_and_maintenance: {
        service_tickets: { ...crud_false },
        maintenance_schedules: { ...crud_false },
        service_contracts: { ...crud_false },
        field_service_management: { ...crud_false },
        parts_management: { ...crud_false },
    },
    human_resource_management: {
        employee_directory: { ...crud_false },
        payroll_management: { ...crud_false },
        performance_management: { ...crud_false },
        recruitment_and_onboarding: { ...crud_false },
        time_and_attendance: { ...crud_false },
        leave_management: { ...crud_false },
        training_and_development: { ...crud_false },
        benefits_administration: { ...crud_false },
    },
    asset_management: {
        asset_register: { ...crud_false },
        asset_maintenance: { ...crud_false },
        asset_depreciation: { ...crud_false },
        asset_tracking: { ...crud_false },
    },
    business_intelligence: {
        interactive_dashboards: { ...crud_false },
        custom_reports: { ...crud_false },
        data_visualization: { ...crud_false },
        big_data_analytics: { ...crud_false },
        data_pipelines: { ...crud_false },
        analytics_jobs: { ...crud_false },
        predictive_analytics: { ...crud_false },
    },
    document_management: {
        all_documents: { ...crud_false },
        document_templates: { ...crud_false },
        version_history: { ...crud_false },
    },
    system_administration: {
        user_and_role_management: { ...crud_false },
        company_settings: { ...crud_false },
        audit_log: { ...crud_false },
        integrations: { ...crud_false },
    },
    workflow_management: {
        process_automation: { ...crud_false },
        workflow_designer: { ...crud_false },
        approval_workflows: { ...crud_false },
    },
    compliance_and_risk_management: {
        regulatory_compliance: { ...crud_false },
        risk_assessment: { ...crud_false },
        audit_management: { ...crud_false },
    },
    exchange_rate_management: {
        rates: { ...crud_true },
    },
};