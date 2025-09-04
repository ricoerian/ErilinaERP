import { useState, Fragment } from 'react'
import {
  Dialog,
  Transition,
  Disclosure,
  Popover,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  TruckIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  CloudIcon,
  UsersIcon,
  TagIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  CubeIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const modules = [
  {
    name: 'Supply Chain Management',
    description: 'Streamline logistics and inventory management processes',
    href: '/scm',
    icon: TruckIcon,
  },
  {
    name: 'Financial Management',
    description: 'Manage budgets, cash flow, and financial reporting',
    href: '/fm',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Manufacturing',
    description: 'Optimize production workflows and shop floor operations',
    href: '/manufacturing',
    icon: Cog6ToothIcon,
  },
  {
    name: 'Internet of Things',
    description: 'Connect devices and automate operational processes',
    href: '/iot',
    icon: CloudIcon,
  },
  {
    name: 'Project Management',
    description: 'Plan, track, and deliver projects on time and budget',
    href: '/pm',
    icon: ClipboardIcon,
  },
  {
    name: 'Customer Relationship Management',
    description: 'Enhance customer engagement and relationship management',
    href: '/crm',
    icon: UsersIcon,
  },
  {
    name: 'Sales Management',
    description: 'Track leads, manage pipelines, and grow revenue',
    href: '/sales',
    icon: TagIcon,
  },
  {
    name: 'Service & Maintenance',
    description: 'Schedule, assign, and track service and maintenance tasks',
    href: '/service',
    icon: WrenchScrewdriverIcon,
  },
  {
    name: 'Human Resource Management',
    description: 'Manage recruitment, payroll, performance, and benefits',
    href: '/hrm',
    icon: UserGroupIcon,
  },
  {
    name: 'Asset Management',
    description: 'Monitor and optimize the utilization of assets',
    href: '/am',
    icon: CubeIcon,
  },
  {
    name: 'Business Intelligence',
    description: 'Visualize KPIs and turn data into actionable insights',
    href: '/bi',
    icon: ChartBarIcon,
  },
  {
    name: 'Big Data Analytics',
    description: 'Analyze large datasets to uncover hidden trends',
    href: '/bda',
    icon: ChartBarSquareIcon,
  },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center lg:flex-1">
          <a href="/">
            <span className="sr-only">EriLinaERP</span>
            <img src="/logo.png" alt="EriLinaERP" className="h-14 w-auto" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-10">
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-lg font-medium text-gray-900 hover:text-blue-400 transition">
              Modules
              <ChevronDownIcon className="h-7 w-7" aria-hidden="true" />
            </Popover.Button>
            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-2" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-2">
              <Popover.Panel className="absolute left-1/2 top-full z-10 mt-2 w-screen max-w-4xl -translate-x-1/2 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules.map(item => (
                    <a key={item.name} href={item.href} className="flex items-start gap-x-4 rounded-lg p-3 hover:bg-gray-50 transition">
                      <item.icon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          <a href="/pricing" className="text-lg font-medium text-gray-900 hover:text-blue-400 transition">Pricing</a>
          <a href="/company" className="text-lg font-medium text-gray-900 hover:text-blue-400 transition">Company</a>
          <a href="/contact" className="text-lg font-medium text-gray-900 hover:text-blue-400 transition">Contact</a>
        </PopoverGroup>

        {/* Login & Mobile Toggle */}
        <div className="flex lg:flex-1 lg:justify-end items-center">
          <button className="lg:hidden -m-2.5 p-2.5 text-gray-700 hover:bg-gray-100 rounded-md transition" onClick={() => setMobileMenuOpen(true)}>
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <a href="/login" className="hidden lg:block text-lg font-medium text-gray-900 hover:text-blue-400 transition">
            Log in
          </a>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 flex justify-end">
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-200 transform" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="w-full max-w-sm bg-white p-6 shadow-lg ring-1 ring-black ring-opacity-5 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <a href="/">
                    <span className="sr-only">EriLinaERP</span>
                    <img src="/logo.png" alt="EriLinaERP" className="h-14 w-auto" />
                  </a>
                  <button className="-m-2.5 p-2.5 text-gray-700 hover:bg-gray-100 rounded-md transition" onClick={() => setMobileMenuOpen(false)}>
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-8 w-8" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between rounded-lg text-left text-md font-medium text-gray-900 hover:bg-gray-50 transition">
                          Modules
                          <ChevronDownIcon className={`h-5 w-5 transform transition ${open ? 'rotate-180' : ''}`} />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 space-y-1 pl-4">
                          {modules.map(item => (
                            <a key={item.name} href={item.href} className="block py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition">
                              {item.name}
                            </a>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  <a href="/pricing" className="block text-md font-medium text-gray-900 hover:text-blue-400 transition">Pricing</a>
                  <a href="/company" className="block text-md font-medium text-gray-900 hover:text-blue-400 transition">Company</a>
                  <a href="/contact" className="block text-md font-medium text-gray-900 hover:text-blue-400 transition">Contact</a>

                  <a href="/login" className="mt-4 block w-full text-center text-sm font-semibold text-white bg-blue-400 hover:bg-blue-700 py-2 rounded-lg transition">
                    Log in
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </header>
  )
}
