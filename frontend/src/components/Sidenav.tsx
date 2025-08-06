import { Link } from "react-router-dom";
import { logo } from "../utils/data";
import { navItems } from "../utils/data";
import { trendsDropdownLinks, productsDropdownLinks, invoiceDropdownLinks, customerDropdownLinks } from "../utils/data";
import DropdownLinks from "./DropdownLinks";
import { useDropdownContext } from "../providers/DropdownProvider";


interface SidenavProps {
  styles?: string;
  onLinkClick?: () => void;
}

const Sidenav = ({styles, onLinkClick}: SidenavProps) => {    
  const {      
      toggleDropdown,
    } = useDropdownContext();    

  return (
    <nav 
      className={`    
        ${styles}
        flex flex-col gap-8 overflow-hidden shadow-xs 
        border-r border-[#e5e7eb] w-64 min-h-screen h-full px-6 bg-[var(--bg-nav)]
      `}
      >
      <h1>{logo}</h1>
      <ul className="flex flex-col gap-6">
        
        <li onClick={() => {toggleDropdown(navItems[0].name)}}>
          <Link to={navItems[0].link}>
            <h3>{navItems[0].name}</h3>
          </Link>
        </li>

        <li>
          <DropdownLinks 
            title={`Trends`} 
            links={trendsDropdownLinks} 
            onLinkClick={onLinkClick}            
          />
        </li>

        <li>
          <DropdownLinks 
            title={`Products`} 
            links={productsDropdownLinks} 
            onLinkClick={onLinkClick}            
          />
        </li>

        <li>
          <DropdownLinks 
            title={`Invoices`} 
            links={invoiceDropdownLinks} 
            onLinkClick={onLinkClick}
          />
        </li>

        <li>
          <DropdownLinks 
            title={`Customers`} 
            links={customerDropdownLinks}
            onLinkClick={onLinkClick}
          />
        </li>

      </ul>
    </nav>
  );
};

export default Sidenav;