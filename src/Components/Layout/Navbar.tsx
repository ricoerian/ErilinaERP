import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
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
import { ChevronDownIcon} from '@heroicons/react/20/solid'

const modules = [
  {
    name: 'Supply Chain Management',
    description: 'Optimalkan alur logistik dan manajemen persediaan Anda',
    href: '#',
    icon: TruckIcon,
  },
  {
    name: 'Financial Management',
    description: 'Kelola anggaran, faktur, dan arus kas',
    href: '#',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Manufacturing',
    description: 'Permudah proses produksi dan operasional',
    href: '#',
    icon: Cog6ToothIcon,
  },
  {
    name: 'Internet of Things',
    description: 'Menghubungkan perangkat dan mengotomatisasi proses',
    href: '#',
    icon: CloudIcon,
  },
  {
    name: 'Project Management',
    description: 'Rencanakan, lacak, dan selesaikan proyek tepat waktu',
    href: '#',
    icon: ClipboardIcon,
  },
  {
    name: 'Customer Relationship',
    description: 'Bangun dan pelihara hubungan pelanggan',
    href: '#',
    icon: UsersIcon,
  },
  {
    name: 'Sales Management',
    description: 'Lacak prospek, peluang, dan pendapatan',
    href: '#',
    icon: TagIcon,
  },
  {
    name: 'Service & Maintenance',
    description: 'Jadwalkan dan catat tugas pemeliharaan',
    href: '#',
    icon: WrenchScrewdriverIcon,
  },
  {
    name: 'Human Resource',
    description: 'Kelola rekrutmen, penggajian, dan tunjangan',
    href: '#',
    icon: UserGroupIcon,
  },
  {
    name: 'Asset Management',
    description: 'Pantau dan optimalkan pemanfaatan aset',
    href: '#',
    icon: CubeIcon,
  },
  {
    name: 'Business Intelligence',
    description: 'Visualisasikan KPI dan buat laporan',
    href: '#',
    icon: ChartBarIcon,
  },
  {
    name: 'Big Data Analytics',
    description: 'Analisis kumpulan data besar untuk wawasan',
    href: '#',
    icon: ChartBarSquareIcon,
  },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white sticky top-0 z-50">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {/* Logo & Mobile Toggle */}
        <div className="flex lg:flex-1">
          <a href="#">
            <span className="sr-only">EriLinaERP</span>
            <img alt="" src="/logo.png" className="h-12 w-auto" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 rounded-md"
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop Nav */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
              Modules
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </PopoverButton>
            <PopoverPanel className="
                absolute top-full left-1/2 z-10 mt-3 -translate-x-1/2
                w-screen max-w-4xl
                overflow-hidden rounded-3xl bg-white shadow-lg
              ">
              {/* Grid 3 kolom, max height + scroll vertical */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto">
                {modules.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex flex-col rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-indigo-50">
                      <item.icon className="h-6 w-6 text-blue-500" aria-hidden="true" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <a href="#" className="text-sm font-semibold text-gray-900">Features</a>
          <a href="#" className="text-sm font-semibold text-gray-900">Pricing</a>
          <a href="#" className="text-sm font-semibold text-gray-900">Company</a>
        </PopoverGroup>

        {/* Desktop Log in */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold text-gray-900">
            Log in <span aria-hidden="true">→</span>
          </a>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 bg-black/30" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full max-w-sm overflow-y-auto bg-white px-6 py-6 ring-1 ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">EriLinaERP</span>
              <img alt="" src="/logo.png" className="h-8 w-auto" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 p-2.5 text-gray-700 rounded-md"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6">
            <Disclosure>
              <DisclosureButton className="flex w-full items-center justify-between rounded-lg p-2 pt-4 text-left font-semibold text-gray-900 hover:bg-gray-50">
                Modules
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </DisclosureButton>
              <DisclosurePanel className="mt-2 space-y-1">
                {modules.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </DisclosurePanel>
            </Disclosure>

            <div className="mt-4 space-y-2">
              <a href="#" className="block rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">Features</a>
              <a href="#" className="block rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">Pricing</a>
              <a href="#" className="block rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">Company</a>
            </div>

            <div className="mt-6">
              <a href="#" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50">Log in</a>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
