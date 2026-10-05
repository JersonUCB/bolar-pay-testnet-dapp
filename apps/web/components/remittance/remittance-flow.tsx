"use client";
import { useEffect, useRef, useState } from "react";
import { createRemittance, transition, type Mode, type Remittance, type Scenario } from "@/domain/remittance";
import { settleRemittance } from "@/application/settlement";
import { simulatedSettlement, sorobanSettlement } from "@/infrastructure/settlement";
import { parseAmount } from "@/lib/remittance-quote";

const labels = {
  created: "Verificación de ejemplo", kyc_pending: "Revisión pendiente", kyc_rejected: "Verificación rechazada",
  awaiting_deposit: "Esperando depósito simulado", deposit_received: "Depósito simulado recibido",
  settled: "Transferencia completada", completed: "Recorrido completado", refunded: "Devolución simulada",
};
export default function RemittanceFlow({ send, onClose }: { send: string; receive: string; onClose: () => void }) {
  const [mode, setMode] = useState<Mode>("simulation");
  const [scenario, setScenario] = useState<Scenario>("approved");
  const [ready, setReady] = useState(false);
  const [run, setRun] = useState<Remittance | null>(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/testnet/status", { signal: abort.signal }).then(r => r.json()).then(data => setReady(data.ready === true)).catch(() => {});
    return () => abort.abort();
  }, []);
  function begin() {
    try { setRun(createRemittance(crypto.randomUUID(), parseAmount(send) ?? 0, mode)); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "No se pudo iniciar."); }
  }
  async function settle() {
    if (!run || lock.current) return;
    lock.current = true; setBusy(true); setError("");
    try {
      const evidence = await settleRemittance(run, run.mode === "simulation" ? simulatedSettlement : sorobanSettlement);
      setRun(current => current ? transition(current, { type: "settle", evidence }) : current);
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo confirmar. Reintenta la misma operación."); }
    finally { lock.current = false; setBusy(false); }
  }
  const step = !run ? 0 : ["created", "kyc_pending", "kyc_rejected"].includes(run.status) ? 1 : 2;
  return <div className="flex flex-col gap-5">
    <ol className="remittance-stepper" aria-label="Progreso">
      {["Monto", "Datos de ejemplo", "Cargar y finalizar"].map((text, index) => <li key={text} className={index < step ? "is-complete" : ""} aria-current={index === step ? "step" : undefined}>
        <span className="remittance-step-label"><span className={`remittance-step-dot ${index <= step ? "is-active" : ""}`}>{index < step ? "✓" : index + 1}</span>{text}</span>
      </li>)}
    </ol>
    <h2 id="remittance-title" className="text-xl font-semibold">{run ? labels[run.status] : "Tu remesa de prueba"}</h2>
    <div className="lab-note">{(run?.mode ?? mode) === "simulation" ? "Todo este recorrido es simulado. No utiliza Bridge ni envía dinero." : "Solo la transferencia de 1 XLM usa Stellar testnet. PIX, KYC y BOB siguen siendo simulados. No es USDC."}</div>
    {!run && <>
      <p>{send} BRL de ejemplo → {(Math.round((parseAmount(send) ?? 0) * 23 / 10) / 100).toFixed(2)} BOB ilustrativos.</p>
      <label className="flex flex-col gap-2">Modo de prueba<select className="remittance-field" value={mode} onChange={e => setMode(e.target.value as Mode)}>
        <option value="simulation">Simulación completa · sin conexión bancaria</option>
        <option value="soroban-testnet" disabled={!ready}>Soroban testnet · transferir 1 XLM de prueba{!ready ? " (requiere preparación local)" : ""}</option>
      </select></label>
      {!ready && <p className="text-sm text-content-secondary">La simulación ya está disponible. La guía de preparación del contrato está en <a className="underline" href="/laboratorio">el laboratorio</a>.</p>}
      <button className="primary-button" onClick={begin}>Continuar con datos ficticios</button>
    </>}
    {run && ["created", "kyc_pending"].includes(run.status) && <>
      <p><strong>Remitente:</strong> Alex Demo · Brasil<br /><strong>Destinataria:</strong> Camila Demo · Bolivia</p>
      <p className="text-sm text-content-secondary">No introduzcas CPF, documentos ni datos personales. Este selector reproduce respuestas de un proveedor ficticio.</p>
      <label className="flex flex-col gap-2">Resultado de verificación<select className="remittance-field" value={scenario} onChange={e => setScenario(e.target.value as Scenario)}>
        <option value="approved">Aprobada</option><option value="pending">En revisión</option><option value="rejected">Rechazada</option>
      </select></label>
      {run.status === "kyc_pending" && <p role="status">La revisión simulada está pendiente. Selecciona otro resultado para continuar.</p>}
      <button className="primary-button" onClick={() => setRun(transition(run, { type: "verify", scenario }))}>Simular verificación</button>
    </>}
    {run?.status === "kyc_rejected" && <p role="status">La verificación simulada fue rechazada. No se habilitó ningún depósito. Cierra y comienza otra prueba.</p>}
    {run?.status === "awaiting_deposit" && <>
      <div className="demo-deposit"><span aria-hidden="true">▦</span><strong>PIX SIMULADO</strong><p>NO ESCANEAR · NO PAGAR</p><code>DEMO-{run.id.slice(0, 8)}</code></div>
      <p className="text-sm text-content-secondary">Esta referencia no es un QR bancario. El botón reproduce la notificación de un depósito.</p>
      <button className="primary-button" onClick={() => setRun(transition(run, { type: "deposit" }))}>Simular depósito PIX recibido</button>
    </>}
    {run?.status === "deposit_received" && <>
      <p>{run.mode === "simulation" ? "Ahora simularemos la transferencia entre wallets." : "El contrato enviará exactamente 1 XLM entre las dos cuentas de laboratorio. Es una prueba técnica independiente del monto BRL."}</p>
      <button className="primary-button" disabled={busy} onClick={settle}>{busy ? "Comprobando transferencia…" : run.mode === "simulation" ? "Simular transferencia" : "Transferir 1 XLM en testnet"}</button>
      <button className="lab-secondary" disabled={busy} onClick={() => setRun(transition(run, { type: "refund" }))}>Probar devolución antes de transferir</button>
    </>}
    {run?.evidence && <div className="lab-note break-all"><strong>{run.evidence.amount} {run.evidence.asset}</strong><p className="text-xs">Referencia: {run.evidence.reference}</p>{run.evidence.explorerUrl && <a className="underline" href={run.evidence.explorerUrl} target="_blank" rel="noreferrer">Ver contrato en Stellar testnet</a>}</div>}
    {run?.status === "settled" && <button className="primary-button" onClick={() => setRun(transition(run, { type: "payout" }))}>Simular entrega bancaria en Bolivia</button>}
    {run?.status === "completed" && <p role="status">Camila recibió {(run.bobCents / 100).toFixed(2)} BOB <strong>simulados</strong>. Ninguna cuenta bancaria fue abonada.</p>}
    {run?.status === "refunded" && <p role="status">La devolución fue simulada. No se realizó la transferencia blockchain.</p>}
    {run && <details><summary className="text-sm font-semibold">Ver lo que ocurrió</summary><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{run.events.map((e, i) => <li key={`${i}-${e}`}>{e}</li>)}</ol></details>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <p className="text-xs text-content-secondary">Al cerrar comienza una prueba nueva. En testnet, una transferencia confirmada permanece en la red hasta su reinicio.</p>
    <button className="lab-secondary" onClick={onClose}>Cerrar prueba</button>
  </div>;
}
