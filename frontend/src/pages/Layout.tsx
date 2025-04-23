import { Outlet } from 'react-router-dom';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';

const Layout = () => {
  return (
    <div className='flex flex-row w-screen'>

      <div className='max-[1080px]:hidden'>
        <Sidenav />
      </div>

      <div className='flex-1 flex flex-col'>
        <div className='flex-2'>
          <Navbar />
        </div>
        <main className='flex-grow'>
          <Outlet />
        </main>
      </div>
      
    </div>
  );
};

export default Layout;