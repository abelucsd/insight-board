import React, { createContext, useContext, useState } from 'react'

type DropdownContextType = {
  openId: string | null;
  toggleDropdown: (id: string) => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const DropdownProvider = ({ children }: {children: React.ReactNode }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenId((prev) => (prev === id ? null: id));
  };

  return (
    <DropdownContext.Provider value={{ openId, toggleDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
};


export const useDropdownContext = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('useDropdownContext must be used within a DropdownProvider');
  return ctx;
}