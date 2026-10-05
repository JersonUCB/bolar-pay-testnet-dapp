import type { SettlementPort } from "../application/settlement";

export const simulatedSettlement: SettlementPort = {
  async settle(run) {
    return { mode: "simulation", reference: `DEMO-${run.id}`, amount: "1", asset: "unidad ficticia" };
  },
};

export const sorobanSettlement: SettlementPort = {
  async settle(run) {
    const response = await fetch("/api/testnet/settle", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: run.id }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "No se pudo comprobar la transferencia testnet.");
    return result;
  },
};
