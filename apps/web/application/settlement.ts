import type { Evidence, Remittance } from "../domain/remittance";
export interface SettlementPort { settle(run: Remittance): Promise<Evidence> }

export async function settleRemittance(run: Remittance, adapter: SettlementPort): Promise<Evidence> {
  if (run.status !== "deposit_received") throw new Error("Falta el depósito simulado.");
  return adapter.settle(run);
}
