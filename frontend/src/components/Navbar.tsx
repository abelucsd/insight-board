import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseSharp } from "react-icons/io5";
import Sidenav from "./Sidenav";
import { adminName } from "../utils/data";
import { userMenuList } from "../utils/data";
import { avatarImg } from "../utils/data";

const Navbar = () => {      
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);

  return (
    <nav className="
      relative flex flex-row justify-between items-center 
      shadow-xs border-b border-[#e5e7eb] h-16 px-6 bg-[var(--bg-nav)]
    ">
            
      <div className={`
          absolute z-50 top-full left-0 
          ${isSideNavOpen ? 'translate-x-0': 'max-[1280px]:-translate-x-full xl:hidden'}
          transition-transform duration-300 ease-in-out
        `}>
          <Sidenav 
            styles={"border-t border-[#e5e7eb] w-62"}
            onLinkClick={() => setIsSideNavOpen(false)}
          />
      </div>
      
      <div>
        {/* Sidenav toggle */}
        <div className="xl:hidden">
          <button onClick={() => setIsSideNavOpen(!isSideNavOpen)}>
            {isSideNavOpen === false ? 
              <RxHamburgerMenu /> :
              <IoCloseSharp />
            }
          </button>
        </div>

        {/* search */}
      </div>

      <div className="relative flex items-center h-full">
        <button className="flex flex-row gap-4" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
          {/* avatar */}
          <div>
            <img className="size-12 rounded-full object-cover" src={avatarImg}/>
          </div>
          {/* name */}
          <h4 className="place-self-center">{adminName}</h4>
        </button>

        {/* dropdown */}
        { isProfileMenuOpen &&
          <div className="
            absolute top-full right-0 shadow-lg 
            rounded-lg w-48 p-4 bg-white text-black
          ">
            {userMenuList.map((item, index) =>
              <h5 key={index}>{item}</h5>
            )}
          </div>
        }
        
      </div>

    </nav>
  );
};

export default Navbar;