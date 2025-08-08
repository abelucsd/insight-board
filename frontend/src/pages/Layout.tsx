import { Outlet } from 'react-router-dom';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';


const Layout = () => {
  return (
    <div className='flex flex-row max-w-screen bg-gray-50'>
      
      <div className='max-[1280px]:hidden fixed h-full z-101'>
        <Sidenav />
      </div>
      <div className='max-[1280px]:hidden w-64'/>
     

      <div className='flex-1 flex flex-col'>
        <div className='fixed top-0 left-0 w-full z-100'>
          <Navbar />
        </div>
        <div className='h-24'/>        
        <main className='flex-grow max-w-screen'>
          <Outlet />
        </main>
      </div>
      
    </div>
  );
};

export default Layout;