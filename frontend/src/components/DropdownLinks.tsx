import { useRef } from "react";
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
    toggleDropdown,
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
        <div className="flex flex-row justify-between">
          <h3>{title}</h3>
          {isOpen === false ?
            <DownArrow />
          :
            <UpArrow />
          }
        </div>
      </button>

      {isOpen && (
        <div className="p-4 flex flex-col gap-4">
          {links.map((link, index) => (            
              <Link 
                to={link.link} key={index} 
                onClick={() => {                
                  onLinkClick?.();
                }
              }
              >
                <h3>{link.name}</h3>
              </Link>            
          ))}
        </div>
      )}

    </div>
  );
};

export default DropdownLinks;