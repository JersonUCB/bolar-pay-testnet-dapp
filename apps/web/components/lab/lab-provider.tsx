"use client";
import { createContext, useContext, useState } from "react";

const LabContext = createContext<{ entered: boolean; enter: () => void } | null>(null);
export function LabProvider({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  return <LabContext.Provider value={{ entered, enter: () => setEntered(true) }}>
    <div className="lab-banner" role="note"><strong>LABORATORIO TESTNET</strong><span>Sin dinero real · PIX, KYC y entrega bancaria simulados</span></div>
    {children}
  </LabContext.Provider>;
}
export function useLab() {
  const value = useContext(LabContext);
  if (!value) throw new Error("LabProvider missing");
  return value;
}
