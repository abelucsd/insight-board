import { Link } from "react-router-dom";
import { logo } from "../utils/data";
import { navItems } from "../utils/data";

interface SidenavProps {
  styles?: string;
}
const Sidenav = ({styles}: SidenavProps) => {  
  
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
        <li>
          <Link to={navItems[0].link}>
            <h3>{navItems[0].name}</h3>
          </Link>
        </li>

        <li>
          <Link to={navItems[1].link}>
            <h3>{navItems[1].name}</h3>
          </Link>
        </li>

      </ul>
    </nav>
  );
};

export default Sidenav;