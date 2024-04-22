import { NextPage } from 'next'
import MobileSidebar from './mobile-sidebar'
import NavbarRoutes from '@/components/navbar-routes'

interface Props {}

const Navbar: NextPage<Props> = ({}) => {
  return <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
    <MobileSidebar />
    <NavbarRoutes />
  </div>
}

export default Navbar