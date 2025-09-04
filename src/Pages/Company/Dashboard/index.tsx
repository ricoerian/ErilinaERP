import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ClipboardList,
  Mail,
  Truck,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  BarChart2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ListTodo,
  Factory,
  CreditCard,
  CalendarCheck,
  Settings,
} from 'lucide-react';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { URL_BECC } from '../../../Utils/Constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CompanyDashboardPage: React.FC = () => {
  const { company } = useParams<{ company: string }>();
  const [companyName, setCompanyName] = useState<string>('Loading...');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const dummyERPData = {
    overviewStats: [
      {
        id: 1,
        title: 'Total Revenue (This Month)',
        value: 'Rp 150.000.000',
        change: '+12%',
        period: 'vs Last Month',
        trend: 'up',
        icon: DollarSign,
        colorClass: 'text-green-600',
        bgColorClass: 'bg-green-50',
      },
      {
        id: 2,
        title: 'Pending Orders',
        value: '45',
        change: '+5',
        period: 'New since yesterday',
        trend: 'up',
        icon: ShoppingCart,
        colorClass: 'text-blue-600',
        bgColorClass: 'bg-blue-50',
      },
      {
        id: 3,
        title: 'New Customers',
        value: '25',
        change: '+8%',
        period: 'vs Last Month',
        trend: 'up',
        icon: Users,
        colorClass: 'text-purple-600',
        bgColorClass: 'bg-purple-50',
      },
      {
        id: 4,
        title: 'Low Stock Items',
        value: '12',
        change: '-3',
        period: 'Items Critical',
        trend: 'down',
        icon: AlertTriangle,
        colorClass: 'text-red-600',
        bgColorClass: 'bg-red-50',
      },
      {
        id: 5,
        title: 'Invoices Due (Next 7 Days)',
        value: 'Rp 25.000.000',
        change: '5',
        period: 'Invoices',
        trend: 'up',
        icon: CreditCard,
        colorClass: 'text-indigo-600',
        bgColorClass: 'bg-indigo-50',
      },
      {
        id: 6,
        title: 'Production Efficiency',
        value: '92%',
        change: '+1%',
        period: 'vs Last Week',
        trend: 'up',
        icon: Factory,
        colorClass: 'text-cyan-600',
        bgColorClass: 'bg-cyan-50',
      },
    ],
    recentActivities: [
      {
        id: 1,
        type: 'Order',
        description: 'New order #ORD-20250724-001 from PT. Maju Jaya. Total: Rp 5.250.000',
        time: '2 minutes ago',
        status: 'completed',
        icon: ShoppingCart,
      },
      {
        id: 2,
        type: 'Inventory',
        description: 'Stock update for Product A-123: +50 units. Location: WH-B',
        time: '1 hour ago',
        status: 'completed',
        icon: Package,
      },
      {
        id: 3,
        type: 'Invoice',
        description: 'Invoice #INV-20250724-005 sent to CV. Sejahtera. Due: 30 July',
        time: '3 hours ago',
        status: 'pending',
        icon: FileText,
      },
      {
        id: 4,
        type: 'Shipment',
        description: 'Shipment #SHP-20250724-003 dispatched to Jakarta. Est. arrival: Tomorrow',
        time: 'Yesterday',
        status: 'completed',
        icon: Truck,
      },
      {
        id: 5,
        type: 'Support',
        description: 'New support ticket #SUP-007 opened by John Doe (Urgent)',
        time: '2 days ago',
        status: 'pending',
        icon: Mail,
      },
      {
        id: 6,
        type: 'Customer',
        description: 'New customer added: PT. Sinar Abadi',
        time: '3 days ago',
        status: 'completed',
        icon: Users,
      },
    ],
    tasks: [
      {
        id: 1,
        title: 'Review Q2 Financial Report',
        dueDate: '2025-07-28',
        priority: 'High',
        status: 'pending',
      },
      {
        id: 2,
        title: 'Approve Purchase Request #PR-010',
        dueDate: '2025-07-25',
        priority: 'Medium',
        status: 'pending',
      },
      {
        id: 3,
        title: 'Follow up with overdue invoice #INV-20250715-002',
        dueDate: '2025-07-20',
        priority: 'High',
        status: 'overdue',
      },
      {
        id: 4,
        title: 'Update product catalog for Q3',
        dueDate: '2025-08-05',
        priority: 'Low',
        status: 'pending',
      },
    ],
    salesChartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Monthly Sales (Rp Juta)',
          data: [120, 150, 130, 180, 200, 190, 210],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    },
    salesChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
                text: 'Monthly Sales Performance',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Sales (Rp Juta)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        }
    },
    upcomingEvents: [
      { id: 1, title: 'Team Meeting', date: 'Jul 26, 2025', time: '10:00 AM', location: 'Meeting Room 1' },
      { id: 2, title: 'Supplier Negotiation (PT. XYZ)', date: 'Aug 01, 2025', time: '02:00 PM', location: 'Online' },
      { id: 3, title: 'Quarterly Inventory Audit', date: 'Aug 05, 2025', time: '09:00 AM', location: 'Warehouse' },
    ],
    quickLinks: [
      { id: 1, name: 'Manage Orders', url: `/${company}/orders`, icon: ShoppingCart },
      { id: 2, name: 'View Inventory', url: `/${company}/inventory`, icon: Package },
      { id: 3, name: 'Customer List', url: `/${company}/customers`, icon: Users },
      { id: 4, name: 'Generate Reports', url: `/${company}/reports`, icon: ClipboardList },
      { id: 5, name: 'Supplier Management', url: `/${company}/suppliers`, icon: Truck },
    ],
  };

  useEffect(() => {
    const fetchCompanyName = async () => {
      if (!company) {
        setCompanyName('Dashboard');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${URL_BECC}/api/check-company`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_name: company }),
        });

        const result = await response.json();
        if (response.ok && result.valid && result.company_name) {
          setCompanyName(result.company_name);
        } else {
          setCompanyName('Unknown Company');
          setError('Could not verify company information.');
        }
      } catch (err : unknown) {
        setError(`Failed to load company info. Network error or server issue. Error : ${err}`);
        setCompanyName('Unknown Company');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyName();
  }, [company]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Loading Dashboard...</h1>
          <p className="text-gray-600">Retrieving latest data...</p>
        </div>
      </div>
    );
  }
  
  const getTaskStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-700 bg-red-200';
      case 'Medium': return 'text-yellow-700 bg-yellow-200';
      case 'Low': return 'text-green-700 bg-green-200';
      default: return 'text-gray-700 bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to the {companyName} Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {dummyERPData.overviewStats.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-700">{stat.title}</h3>
              <div className={`p-2 rounded-full ${stat.bgColorClass}`}>
                <stat.icon size={20} className={stat.colorClass} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</p>
            <div className="flex items-center text-sm">
              {stat.trend === 'up' && <TrendingUp size={16} className="text-green-500 mr-1" />}
              {stat.trend === 'down' && <TrendingDown size={16} className="text-red-500 mr-1" />}
              <span className={`font-semibold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
              <span className="ml-1 text-gray-500">{stat.period}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <BarChart2 size={24} /> Monthly Sales Performance
          </h2>
          <div className="h-72">
            <Line data={dummyERPData.salesChartData} options={dummyERPData.salesChartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ListTodo size={24} /> My Pending Tasks
          </h2>
          <ul className="divide-y divide-gray-200">
            {dummyERPData.tasks.map((task) => (
              <li key={task.id} className="py-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityStyle(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> Due: {task.dueDate}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getTaskStatusStyle(task.status)}`}>
                    {task.status === 'overdue' ? 'Overdue' : task.status === 'pending' ? 'Pending' : 'Completed'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Clock size={24} /> Recent Activities
          </h2>
          <ul className="divide-y divide-gray-200">
            {dummyERPData.recentActivities.map((activity) => (
              <li key={activity.id} className="py-3 flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <activity.icon size={20} className="text-gray-500" />
                </div>
                <div className="flex-grow">
                  <p className="text-gray-800 font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{activity.time}</p>
                </div>
                <div className="flex-shrink-0 mt-1">
                  {activity.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle size={16} />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-yellow-600 text-sm font-medium">
                      <XCircle size={16} />
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ClipboardList size={24} /> Quick Links
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {dummyERPData.quickLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="flex flex-col items-center justify-center p-4 rounded-lg shadow-sm
                           bg-blue-500 text-white hover:bg-blue-600 transition duration-200 transform hover:scale-105"
              >
                <link.icon size={28} className="mb-2" />
                <span className="text-sm font-medium text-center">{link.name}</span>
              </a>
            ))}
             <a
                href={`/${company}/settings`}
                className="flex flex-col items-center justify-center p-4 rounded-lg shadow-sm
                           bg-gray-500 text-white hover:bg-gray-600 transition duration-200 transform hover:scale-105"
              >
                <Settings size={28} className="mb-2" />
                <span className="text-sm font-medium text-center">Settings</span>
              </a>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <CalendarCheck size={24} /> Upcoming Events
          </h2>
        <ul className="divide-y divide-gray-200">
          {dummyERPData.upcomingEvents.map((event) => (
            <li key={event.id} className="py-3 flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <CalendarCheck size={20} className="text-purple-500" />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-gray-800">{event.title}</p>
                <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                <p className="text-xs text-gray-500">{event.location}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default CompanyDashboardPage;