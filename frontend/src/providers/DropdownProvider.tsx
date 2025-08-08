import React, { createContext, useContext, useState } from 'react'

type DropdownContextType = {
  openId: string | null;
  activeDropdownId: string | null;
  activeLink: string | null;
  toggleDropdown: (id: string) => void;
  handleActiveLink: (id: string, linkName: string) => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const DropdownProvider = ({ children }: {children: React.ReactNode }) => {  
  const [activeDropdownId, setDropdownActiveId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenId((prev) => (prev === id ? null: id));
  };

  const handleActiveLink = (id: string, linkName: string) => {
    setDropdownActiveId(id);
    setActiveLink(linkName);
  };

  return (
    <DropdownContext.Provider value={{ openId, activeDropdownId, activeLink, toggleDropdown, handleActiveLink }}>
      {children}
    </DropdownContext.Provider>
  );
};


export const useDropdownContext = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('useDropdownContext must be used within a DropdownProvider');
  return ctx;
}