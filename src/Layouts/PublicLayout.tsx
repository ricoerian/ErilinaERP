import Navbar from '../Components/Layouts/Navbar'
import { Footer } from '../Components/Layouts/Footer'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default PublicLayout
