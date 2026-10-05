export type Scenario = "approved" | "pending" | "rejected";
export type Mode = "simulation" | "soroban-testnet";
export type Status = "created" | "kyc_pending" | "kyc_rejected" | "awaiting_deposit" | "deposit_received" | "settled" | "completed" | "refunded";
export type Evidence = { mode: Mode; reference: string; explorerUrl?: string; amount: string; asset: string };
export type Remittance = { id: string; brlCents: number; bobCents: number; mode: Mode; status: Status; evidence?: Evidence; events: string[] };
export type Action = { type: "verify"; scenario: Scenario } | { type: "deposit" } | { type: "settle"; evidence: Evidence } | { type: "payout" } | { type: "refund" };

export function createRemittance(id: string, brlCents: number, mode: Mode): Remittance {
  if (!Number.isSafeInteger(brlCents) || brlCents < 100 || brlCents > 100_000) throw new Error("El laboratorio admite entre 1 y 1.000 BRL ficticios.");
  return { id, brlCents, bobCents: Math.round(brlCents * 23 / 10), mode, status: "created", events: ["Cotización ilustrativa creada"] };
}

export function transition(run: Remittance, action: Action): Remittance {
  let status: Status;
  let event: string;
  let evidence = run.evidence;
  switch (action.type) {
    case "verify":
      if (!["created", "kyc_pending"].includes(run.status)) throw new Error("No se puede verificar en este estado.");
      status = action.scenario === "approved" ? "awaiting_deposit" : action.scenario === "pending" ? "kyc_pending" : "kyc_rejected";
      event = action.scenario === "approved" ? "Identidad ficticia aprobada" : action.scenario === "pending" ? "Revisión ficticia pendiente" : "Identidad ficticia rechazada";
      break;
    case "deposit":
      if (run.status === "deposit_received") return run;
      if (run.status !== "awaiting_deposit") throw new Error("Primero debe aprobarse la identidad ficticia.");
      status = "deposit_received"; event = "Depósito PIX simulado recibido"; break;
    case "settle":
      if (run.status === "settled" || run.status === "completed") return run;
      if (run.status !== "deposit_received") throw new Error("Falta confirmar el depósito simulado.");
      if (action.evidence.mode !== run.mode) throw new Error("La evidencia no corresponde al modo elegido.");
      if (run.mode === "simulation" && action.evidence.explorerUrl) throw new Error("Una simulación no tiene comprobante blockchain.");
      if (run.mode === "soroban-testnet" && !action.evidence.explorerUrl?.startsWith("https://stellar.expert/explorer/testnet/")) throw new Error("Se requiere evidencia de testnet.");
      status = "settled"; evidence = action.evidence;
      event = run.mode === "simulation" ? "Transferencia de demostración simulada" : "Transferencia XLM confirmada por contrato en testnet";
      break;
    case "payout":
      if (run.status === "completed") return run;
      if (run.status !== "settled") throw new Error("Falta completar la transferencia.");
      status = "completed"; event = "Entrega bancaria BOB simulada"; break;
    case "refund":
      if (run.status !== "deposit_received") throw new Error("Solo puede simularse la devolución antes de transferir.");
      status = "refunded"; event = "Devolución PIX simulada"; break;
  }
  return { ...run, status, evidence, events: [...run.events, event] };
}
