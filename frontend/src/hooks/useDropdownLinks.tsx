import { useState } from "react";


export const useDropDownLinks = () => {
  const [isOpen, setIsOpen]  = useState<boolean>(false);
  const toggleDropdown = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    toggleDropdown,
  }
};