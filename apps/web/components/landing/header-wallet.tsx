"use client";
import { useLab } from "@/components/lab/lab-provider";
export function HeaderWallet() {
  const { entered, enter } = useLab();
  return <button className="primary-button" onClick={() => { enter(); document.getElementById("calcular-envio")?.scrollIntoView(); }}>
    {entered ? "Mi laboratorio" : "Entrar al laboratorio"}
  </button>;
}
