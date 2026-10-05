"use client";
import { useLab } from "@/components/lab/lab-provider";
import { HeroImage } from "./hero-image";
import { RemittanceCalculator } from "./remittance-calculator";
export function GatedCalculator() {
  const { entered, enter } = useLab();
  return entered ? <RemittanceCalculator /> : <div id="calcular-envio" className="flex flex-col items-center gap-6">
    <HeroImage />
    <button className="primary-button" onClick={enter}>Probar una remesa de ejemplo</button>
    <p className="text-sm text-content-secondary">Sin registro. Usaremos personajes y pagos ficticios.</p>
  </div>;
}
