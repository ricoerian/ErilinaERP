// src/utils/constants.ts
import {
  Truck, DollarSign, Settings, Cloud, Clipboard, Users, Tag, Wrench, User, Box, BarChart, PieChart, FileText, Cog, ListChecks, ShieldCheck,
  Package, ShoppingCart, UserCheck, Warehouse, Ship, LineChart, // Ikon SCM
  BookOpen, Landmark, CreditCard, Banknote, Building, BarChart2, // Ikon FM
  Factory, Cog as CogMfg, ScanLine, ListOrdered, CheckSquare, Layers, Puzzle, // Ikon Manufacturing
  Router, AreaChart, Rss, // Ikon IoT
  ClipboardList, ListTodo, Users2, Timer, Coins, // Ikon PM
  Contact, Handshake, FileQuestion, Megaphone, MessageSquare, // Ikon CRM
  Target, FileSignature, FileStack, Percent, // Ikon Sales
  Ticket, CalendarClock, FileBadge, Car, Wrench as WrenchSvc, // Ikon Service
  UserCog, UserPlus, Fingerprint, CalendarDays, GraduationCap, HeartHandshake, // Ikon HRM
  Archive, Tv, History, MapPin, // Ikon Asset
  LayoutDashboard, FileBarChart2, AreaChart as AreaChartBI, // Ikon BI
  Database, DatabaseZap, BrainCircuit, // Ikon BDA
  Folder, FileUp, Replace, // Ikon Document
  Shield, GitBranch, KeySquare, // Ikon Compliance
  Workflow, // Ikon Workflow
  LucideIcon,
  FileSliders,
} from 'lucide-react';

interface Submenu {
  name: string;
  href: string;
  Icon?: LucideIcon;
}

interface Module {
  name: string;
  href: string;
  Icon: LucideIcon;
  submenus: Submenu[];
}

// production
// export const URL_ERP = "https://erilinaerp.ricoeri.my.id"
// export const URL_BECC = "https://beerilinaerp.ricoeri.my.id"
// export const URL_BESMCIM = "https://bemsscmimerp.ricoeri.my.id"
// export const URL_BESMCSM = "https://bemsscmsmerp.ricoeri.my.id"
// export const URL_BESMCPO = "https://bemsscmpoerp.ricoeri.my.id"
// export const URL_BESMCSO = "https://bemsscmsoerp.ricoeri.my.id"
// export const URL_BESMCWM = "https://bemsscmwmerp.ricoeri.my.id"
// export const URL_BESMCDM = "https://bemsscmdmerp.ricoeri.my.id"
// export const URL_BESMCDP = "https://bemsscmdperp.ricoeri.my.id"
// export const URL_BEFMGL = "https://bemsfmglerp.ricoeri.my.id"
// export const URL_BEFMAP = "https://bemsfmaperp.ricoeri.my.id"
// export const URL_BEFMAR = "https://bemsfmarerp.ricoeri.my.id"
// export const URL_BEFMCM = "https://bemsfmcmerp.ricoeri.my.id"
// export const URL_BEFMFA = "https://bemsfmfaerp.ricoeri.my.id"
// export const URL_BESA = "https://bemssaerp.ricoeri.my.id"

// export const OSRM_URL = 'https://osrmid.ricoeri.my.id';

// development
export const URL_ERP = "http://localhost:5173"
export const URL_BECC = "http://localhost:3001"
export const URL_BESMCIM = "http://localhost:3002"
export const URL_BESMCSM = "http://localhost:3003"
export const URL_BESMCPO = "http://localhost:3004"
export const URL_BESMCSO = "http://localhost:3005"
export const URL_BESMCWM = "http://localhost:3006"
export const URL_BESMCDM = "http://localhost:3007"
export const URL_BESMCDP = "http://localhost:3008"
export const URL_BEFMGL = "http://localhost:3009"
export const URL_BEFMAP = "http://localhost:3010"
export const URL_BEFMAR = "http://localhost:3011"
export const URL_BEFMCM = "http://localhost:3012"
export const URL_BEFMFA = "http://localhost:3013"
export const URL_BESA = "http://localhost:3090"

export const OSRM_URL = 'http://192.168.1.2:5000';

export const MODULES: Module[] = [
  {
    name: 'Supply Chain Management', href: '/scm', Icon: Truck, submenus: [
      { name: 'Inventory', href: '/scm/inventory', Icon: Package },
      { name: 'Suppliers', href: '/scm/suppliers', Icon: UserCheck },
      { name: 'Purchase Orders', href: '/scm/purchase-orders', Icon: ShoppingCart },
      { name: 'Sales Orders', href: '/scm/sales-orders', Icon: Tag },
      { name: 'Delivery', href: '/scm/delivery', Icon: Ship },
      { name: 'Warehouses', href: '/scm/warehouse', Icon: Warehouse },
      { name: 'Demand Planning', href: '/scm/demand-planning', Icon: LineChart }
    ]
  },
  {
    name: 'Financial Management', href: '/fm', Icon: DollarSign, submenus: [
      { name: 'General Ledger', href: '/fm/general-ledger', Icon: BookOpen },
      { name: 'Payables', href: '/fm/ap', Icon: CreditCard },
      { name: 'Receivables', href: '/fm/ar', Icon: Banknote },
      { name: 'Cash', href: '/fm/cash', Icon: Landmark },
      { name: 'Fixed Assets', href: '/fm/assets', Icon: Building },
      { name: 'Budgeting', href: '/fm/budgeting', Icon: PieChart },
      { name: 'Cost Accounting', href: '/fm/cost-accounting', Icon: FileSliders },
      { name: 'Tax', href: '/fm/tax', Icon: Percent }
    ]
  },
  {
    name: 'Manufacturing', href: '/manufacturing', Icon: Factory, submenus: [
      { name: 'Work Orders', href: '/manufacturing/work-orders', Icon: ListOrdered },
      { name: 'BOM', href: '/manufacturing/bom', Icon: Puzzle },
      { name: 'Planning', href: '/manufacturing/planning', Icon: CalendarClock },
      { name: 'Shop Floor', href: '/manufacturing/shop-floor', Icon: CogMfg },
      { name: 'Quality Control', href: '/manufacturing/quality', Icon: CheckSquare },
      { name: 'Capacity', href: '/manufacturing/capacity', Icon: Layers },
      { name: 'MRP & MPS', href: '/manufacturing/mrp-mps', Icon: ScanLine }
    ]
  },
  {
    name: 'Internet of Things', href: '/iot', Icon: Cloud, submenus: [
      { name: 'Devices', href: '/iot/devices', Icon: Router },
      { name: 'Analytics', href: '/iot/analytics', Icon: AreaChart },
      { name: 'Monitoring', href: '/iot/monitoring', Icon: Rss }
    ]
  },
  {
    name: 'Project Management', href: '/pm', Icon: Clipboard, submenus: [
      { name: 'Projects', href: '/pm/projects', Icon: ClipboardList },
      { name: 'Tasks', href: '/pm/tasks', Icon: ListTodo },
      { name: 'Resources', href: '/pm/resources', Icon: Users2 },
      { name: 'Time Tracking', href: '/pm/time-tracking', Icon: Timer },
      { name: 'Expenses', href: '/pm/expenses', Icon: Coins }
    ]
  },
  {
    name: 'CRM', href: '/crm', Icon: Users, submenus: [
      { name: 'Contacts', href: '/crm/contacts', Icon: Contact },
      { name: 'Opportunities', href: '/crm/opportunities', Icon: Handshake },
      { name: 'Quotes', href: '/crm/quotes', Icon: FileQuestion },
      { name: 'Campaigns', href: '/crm/campaigns', Icon: Megaphone },
      { name: 'Support', href: '/crm/support', Icon: MessageSquare }
    ]
  },
  {
    name: 'Sales Management', href: '/sales', Icon: Tag, submenus: [
      { name: 'Leads', href: '/sales/leads', Icon: Target },
      { name: 'Sales Orders', href: '/sales/orders', Icon: ShoppingCart },
      { name: 'Estimates', href: '/sales/quotes', Icon: FileSignature },
      { name: 'Invoicing', href: '/sales/invoicing', Icon: FileStack },
      { name: 'Reporting', href: '/sales/reports', Icon: BarChart2 },
      { name: 'Commissions', href: '/sales/commissions', Icon: Percent }
    ]
  },
  {
    name: 'Service & Maintenance', href: '/service', Icon: Wrench, submenus: [
      { name: 'Tickets', href: '/service/tickets', Icon: Ticket },
      { name: 'Schedules', href: '/service/schedules', Icon: CalendarClock },
      { name: 'Contracts', href: '/service/contracts', Icon: FileBadge },
      { name: 'Field Service', href: '/service/field-service', Icon: Car },
      { name: 'Parts', href: '/service/parts', Icon: WrenchSvc }
    ]
  },
  {
    name: 'HR Management', href: '/hrm', Icon: User, submenus: [
      { name: 'Directory', href: '/hrm/employees', Icon: Users },
      { name: 'Payroll', href: '/hrm/payroll', Icon: Banknote },
      { name: 'Performance', href: '/hrm/performance', Icon: UserCog },
      { name: 'Recruitment', href: '/hrm/recruitment', Icon: UserPlus },
      { name: 'Attendance', href: '/hrm/time-attendance', Icon: Fingerprint },
      { name: 'Leave', href: '/hrm/leave', Icon: CalendarDays },
      { name: 'Training', href: '/hrm/training', Icon: GraduationCap },
      { name: 'Benefits', href: '/hrm/benefits', Icon: HeartHandshake }
    ]
  },
  {
    name: 'Asset Management', href: '/am', Icon: Box, submenus: [
      { name: 'Register', href: '/am/register', Icon: Archive },
      { name: 'Maintenance', href: '/am/maintenance', Icon: Wrench },
      { name: 'Depreciation', href: '/am/depreciation', Icon: Tv },
      { name: 'Tracking', href: '/am/tracking', Icon: MapPin }
    ]
  },
  {
    name: 'Business Intelligence', href: '/bi', Icon: BarChart, submenus: [
      { name: 'Dashboards', href: '/bi/dashboards', Icon: LayoutDashboard },
      { name: 'Reports', href: '/bi/reports', Icon: FileBarChart2 },
      { name: 'Visualization', href: '/bi/visualization', Icon: AreaChartBI }
    ]
  },
  {
    name: 'Big Data Analytics', href: '/bda', Icon: PieChart, submenus: [
      { name: 'Pipelines', href: '/bda/pipelines', Icon: DatabaseZap },
      { name: 'Jobs', href: '/bda/jobs', Icon: Database },
      { name: 'Predictive', href: '/bda/predictive', Icon: BrainCircuit }
    ]
  },
  {
    name: 'Document Management', href: '/dm', Icon: FileText, submenus: [
      { name: 'Documents', href: '/dm/all', Icon: Folder },
      { name: 'Templates', href: '/dm/templates', Icon: FileUp },
      { name: 'History', href: '/dm/history', Icon: Replace }
    ]
  },
  {
    name: 'System Administration', href: '/admin', Icon: Cog, submenus: [
      { name: 'Users & Roles', href: '/admin/users', Icon: Users },
      { name: 'Company Settings', href: '/admin/company-settings', Icon: Settings },
      { name: 'Audit Log', href: '/admin/audit-log', Icon: History },
      { name: 'Integrations', href: '/admin/integrations', Icon: GitBranch }
    ]
  },
  {
    name: 'Workflow Management', href: '/workflow', Icon: ListChecks, submenus: [
      { name: 'Automation', href: '/workflow/automation', Icon: Workflow },
      { name: 'Designer', href: '/workflow/designer', Icon: Puzzle },
      { name: 'Approvals', href: '/workflow/approvals', Icon: CheckSquare }
    ]
  },
  {
    name: 'Compliance & Risk', href: '/compliance', Icon: ShieldCheck, submenus: [
      { name: 'Compliance', href: '/compliance/regulatory', Icon: Shield },
      { name: 'Risk Assessment', href: '/compliance/risk-assessment', Icon: KeySquare },
      { name: 'Audit', href: '/compliance/audit', Icon: FileBarChart2 }
    ]
  }
];

export const timezones = [
  "Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako",
  "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura",
  "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam",
  "Africa/Djibouti", "Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare",
  "Africa/Johannesburg", "Africa/Juba", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa",
  "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka",
  "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia",
  "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo",
  "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek",
  "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires",
  "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja",
  "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan",
  "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion",
  "America/Atikokan", "America/Bahia", "America/Bahia_Banderas", "America/Barbados", "America/Belem", "America/Belize",
  "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande",
  "America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua",
  "America/Ciudad_Juarez", "America/Costa_Rica", "America/Creston", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn",
  "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton",
  "America/Eirunepe", "America/El_Salvador", "America/Fort_Nelson", "America/Fortaleza", "America/Glace_Bay", "America/Goose_Bay",
  "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana",
  "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox",
  "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay",
  "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau",
  "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/Kralendijk", "America/La_Paz", "America/Lima",
  "America/Los_Angeles", "America/Lower_Princes", "America/Maceio", "America/Managua", "America/Manaus", "America/Marigot",
  "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida", "America/Metlakatla",
  "America/Mexico_City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montserrat",
  "America/Nassau", "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Beulah",
  "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Nuuk", "America/Ojinaga", "America/Panama",
  "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", "America/Port_of_Spain",
  "America/Porto_Velho", "America/Puerto_Rico", "America/Punta_Arenas", "America/Rainy_River", "America/Rankin_Inlet",
  "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santarem", "America/Santiago",
  "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/Sitka", "America/St_Barthelemy",
  "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent",
  "America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto",
  "America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife",
  "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Macquarie", "Antarctica/Mawson",
  "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Troll", "Antarctica/Vostok",
  "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Atyrau", "Asia/Baghdad",
  "Asia/Baku", "Asia/Bangkok", "Asia/Barnaul", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Chita", "Asia/Choibalsan",
  "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Famagusta", "Asia/Gaza",
  "Asia/Hebron", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura",
  "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kathmandu", "Asia/Khandyga", "Asia/Kolkata",
  "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar",
  "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral",
  "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qostanay", "Asia/Qyzylorda", "Asia/Riyadh", "Asia/Sakhalin",
  "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Srednekolymsk", "Asia/Taipei", "Asia/Tashkent",
  "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Tomsk", "Asia/Ulaanbaatar", "Asia/Urumqi",
  "Asia/Ust-Nera", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yangon", "Asia/Yekaterinburg", "Asia/Yerevan",
  "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe", "Atlantic/Madeira",
  "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/Stanley", "Atlantic/St_Helena",
  "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart",
  "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney",
  "Europe/Amsterdam", "Europe/Andorra", "Europe/Astrakhan", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin",
  "Europe/Bratislava", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Busingen", "Europe/Chisinau",
  "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Guernsey", "Europe/Helsinki", "Europe/Isle_of_Man",
  "Europe/Istanbul", "Europe/Jersey", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Kirov", "Europe/Lisbon", "Europe/Ljubljana",
  "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow",
  "Europe/Oslo", "Europe/Paris", "Europe/Podgorica", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara",
  "Europe/San_Marino", "Europe/Sarajevo", "Europe/Saratov", "Europe/Simferopol", "Europe/Skopje", "Europe/Sofia",
  "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Ulyanovsk", "Europe/Uzhgorod", "Europe/Vaduz",
  "Europe/Vatican", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zagreb", "Europe/Zaporozhye",
  "Europe/Zurich", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro",
  "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion",
  "Pacific/Apia", "Pacific/Auckland", "Pacific/Bougainville", "Pacific/Chatham", "Pacific/Chuuk", "Pacific/Easter",
  "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos",
  "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Kiritimati", "Pacific/Kosrae",
  "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk",
  "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Pohnpei", "Pacific/Port_Moresby",
  "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Wake",
  "Pacific/Wallis"
];