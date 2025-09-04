import React from 'react'

const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-blue-50 text-center text-sm text-gray-600 py-4 mt-auto border-t">
      &copy; {new Date().getFullYear()} EriLina ERP - Dashboard. All rights reserved.
    </footer>
  )
}

export default DashboardFooter
