import { useRef, useState } from "react";
import { Link } from "react-router-dom";

interface DropdownLink {
  name: string;
  link: string;
  icon?: React.ReactNode;
};

interface DropdownLinksProps {
  title: string;
  links: DropdownLink[];
};

const DropdownLinks = ({title, links}: DropdownLinksProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  return (
    <div
      ref={dropdownRef}      
      className="relative"
    >
      <button 
        onClick={toggleDropdown}
      >
        <h3>{title}</h3>
      </button>

      {isOpen && (
        <div className="p-4 flex flex-col gap-4">
          {links.map((link, index) => (
            <Link to={link.link} key={index}>
              <h3>{link.name}</h3>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

export default DropdownLinks;