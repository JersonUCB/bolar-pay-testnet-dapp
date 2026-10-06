"use client";

import dynamic from "next/dynamic";
import { RemittanceDialog } from "@/components/remittance/remittance-dialog";
import { useRef, useState, type FormEvent } from "react";
import { convertAmount, DEMO_RATE_LABEL, parseAmount } from "@/lib/remittance-quote";
import { Asset } from "./asset";
import { InfoButton } from "./info-button";

const RemittanceFlow = dynamic(() => import("@/components/remittance/remittance-flow"), {
  ssr: false,
  loading: () => <h2 id="remittance-title" role="status" className="py-16 text-center text-content-secondary">Preparando tu envío…</h2>,
});

function CurrencyField({ side, value, onChange }: { side: "send" | "receive"; value: string; onChange: (value: string) => void }) {
  const receiving = side === "receive";
  const code = receiving ? "BOB" : "BRL";
  const label = receiving ? "Recibe" : "Envías";
  return <div className="flex flex-col gap-2 px-4">
    <label htmlFor={`amount-${side}`} className="text-base font-medium leading-5">{label}</label>
    <div className={`flex h-12 items-center rounded-lg bg-field focus-within:ring-2 focus-within:ring-bolar-green ${receiving ? "ring-2 ring-inset ring-bolar-green" : ""}`}>
      <div className="relative flex h-12 shrink-0 items-center px-2 max-[380px]:px-1">
        <span className="pointer-events-none flex items-center gap-4 px-2 max-[380px]:gap-2 max-[380px]:px-1" aria-hidden="true">
          <span className="flex size-5 items-center justify-center"><Asset name={receiving ? "currency-bob" : "currency-brl"} width={receiving ? 18.3334 : 18.3333} height={receiving ? 13.3334 : 13.3333} /></span>
          <span className="text-base font-medium leading-5 max-[440px]:text-sm">{receiving ? "Bolivianos (BOB)" : "Reales (BRL)"}</span>
          <Asset name="chevron" width={20} height={20} />
        </span>
        <select aria-label={receiving ? "Moneda de destino" : "Moneda de origen"} defaultValue={code} className="absolute inset-0 cursor-pointer opacity-0"><option value={code}>{receiving ? "Bolivianos (BOB)" : "Reales (BRL)"}</option></select>
      </div>
      <input id={`amount-${side}`} name={side} aria-label={`${label} en ${code}`} aria-describedby="quote-rate" type="text" inputMode="decimal" autoComplete="off" required pattern="[0-9]{1,9}([.,][0-9]{1,2})?" title="Ingresa un importe positivo con hasta dos decimales." value={value} onChange={(event) => onChange(event.target.value)} className="h-12 min-w-0 flex-1 rounded-lg bg-transparent pr-5 text-right text-2xl font-semibold leading-7 outline-none max-[440px]:pr-3 max-[440px]:text-xl" />
    </div>
    {receiving && <div id="quote-rate" className="flex h-5 justify-end"><InfoButton className="text-right text-sm leading-5 text-content-tertiary hover:underline" title="Tipo de cambio de demostración" message="Usamos el valor ilustrativo del diseño: 1 real = 2,3 bolivianos. Esta simulación no es una cotización vigente ni incluye comisiones. No se enviará dinero.">Tipo de cambio {DEMO_RATE_LABEL}</InfoButton></div>}
  </div>;
}

function MethodField({ label, value, id }: { label: string; value: string; id: string }) {
  return <div className="flex h-7 items-start justify-between gap-[10px] px-4">
    <label htmlFor={id} className="text-sm leading-5">{label}</label>
    <div className="relative h-7 w-24 shrink-0 rounded-full bg-field">
      <select id={id} defaultValue={value} className="h-full w-full cursor-pointer appearance-none rounded-full bg-transparent px-2 pr-7 text-xs font-medium leading-4"><option value={value}>{value}</option></select>
      <span aria-hidden="true" className="pointer-events-none absolute right-2 top-2 size-3"><span className="block origin-top-left scale-50"><Asset name="chevron-small" width={24} height={24} /></span></span>
    </div>
  </div>;
}

export function RemittanceCalculator() {
  const [send, setSend] = useState("500");
  const [receive, setReceive] = useState("1150");
  const [error, setError] = useState("");
  const [flowOpen, setFlowOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  function update(value: string, side: "send" | "receive") {
    setError("");
    if (side === "send") { setSend(value); setReceive(convertAmount(value, side)); }
    else { setReceive(value); setSend(convertAmount(value, side)); }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if ((parseAmount(send) ?? 0) <= 0 || (parseAmount(receive) ?? 0) <= 0) {
      setError("Ingresa un importe mayor que cero para calcular tu envío.");
      return;
    }
    setFlowOpen(true);
  }
  return <>
    <form id="calcular-envio" aria-label="Simulador de envío de dinero" aria-describedby={error ? "quote-error" : undefined} onSubmit={submit} className="relative flex w-[423px] max-w-full scroll-mt-8 flex-col gap-4 rounded-[14px] border border-card-border bg-white p-[23px] shadow-quote max-[440px]:p-[15px]" data-node-id="260:14189">
      <CurrencyField side="send" value={send} onChange={(value) => update(value, "send")} />
      <CurrencyField side="receive" value={receive} onChange={(value) => update(value, "receive")} />
      <MethodField label="Método de pago" value="Pix demo" id="payment-method" />
      <MethodField label="Método de Entrega" value="BOB demo" id="delivery-method" />
      <button ref={trigger} type="submit" className="primary-button mx-4 h-14">Probar envío 💸</button>
      {error && <p id="quote-error" role="alert" className="px-4 text-sm text-red-700">{error}</p>}
    </form>
    {flowOpen && <RemittanceDialog onClose={() => setFlowOpen(false)} returnFocusRef={trigger}>
      <RemittanceFlow send={send} receive={receive} onClose={() => setFlowOpen(false)} />
    </RemittanceDialog>}
  </>;
}
