import { useRef} from "react";
import { Link } from "react-router-dom";
import { DownArrow } from "../icons/DownArrow";
import { UpArrow } from "../icons/UpArrow";
import { useDropdownContext } from "../providers/DropdownProvider";

interface DropdownLink {
  name: string;
  link: string;
  icon?: React.ReactNode;
};

interface DropdownLinksProps {
  title: string;
  links: DropdownLink[];
  onLinkClick?: () => void;    
};

const DropdownLinks = ({title, links, onLinkClick}: DropdownLinksProps) => {  
  const dropdownRef = useRef<HTMLDivElement | null>(null);  

  const {
    openId,
    activeDropdownId,
    activeLink,
    toggleDropdown,
    handleActiveLink,
  } = useDropdownContext();
  const isOpen = openId === title;

  return (
    <div
      ref={dropdownRef}      
      className="relative w-full"
    >
      <button 
        onClick={() => toggleDropdown(title)}
        className="w-full"
      >
        {isOpen === true || activeDropdownId === title ?
          <div className="flex flex-row justify-between navlink active"><h3>{title}</h3><UpArrow /></div>
          :
          <div className="flex flex-row justify-between navlink"><h3>{title}</h3><DownArrow /></div>
        }        
      </button>

      {isOpen || activeDropdownId === title ?
        <div className="flex flex-col gap-4 m-4">
          {links.map((link, index) => (
              <Link                                 
                to={link.link} 
                key={index}
                className={`navlink ${activeLink === link.name ? 'active' : ''}`}
                onClick={() => {                  
                  handleActiveLink(title, link.name);
                  onLinkClick?.();
                }
              }
              >                                  
                <h3>{link.name}</h3>                
              </Link>
          ))}
        </div>
        : <div></div>
      }

    </div>
  );
};

export default DropdownLinks;