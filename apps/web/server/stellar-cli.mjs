import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";

export const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";
export const RPC = "https://soroban-testnet.stellar.org";
export const networkArgs = ["--rpc-url", RPC, "--network-passphrase", TESTNET_PASSPHRASE];
const execute = promisify(execFile);
export const rootDirectory = () => resolve(process.cwd(), "../..");

export async function cli(root, args) {
  // Never inherit a developer's mainnet account, RPC, signing or network options.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("STELLAR_") && key !== "RUST_LOG"));
  const { stdout } = await execute("stellar", ["--config-dir", join(root, ".local/stellar"), "--no-cache", ...args], { cwd: root, env, timeout: 90_000, maxBuffer: 1024 * 1024 });
  return stdout.trim();
}

export function validateManifest(value) {
  if (value?.network !== "testnet" || value?.passphrase !== TESTNET_PASSPHRASE || value?.rpc !== RPC || value?.asset !== "XLM") throw new Error("Configuración testnet inválida.");
  for (const field of ["sender", "recipient"]) if (!/^G[A-Z2-7]{55}$/.test(value[field] || "")) throw new Error("Cuenta testnet inválida.");
  if (value.sender === value.recipient || !/^C[A-Z2-7]{55}$/.test(value.contractId || "")) throw new Error("Contrato o destinatario inválido.");
  return value;
}

export async function readManifest(root) {
  return validateManifest(JSON.parse(await readFile(join(root, ".local/testnet.json"), "utf8")));
}

export function receiptId(id) {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id)) throw new Error("Identificador de prueba inválido.");
  return createHash("sha256").update(`bolar-testnet:${id}`).digest("hex");
}

export function assertLocalRequest(request) {
  const url = new URL(request.url);
  if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) throw new Error("El ejecutor testnet solo está disponible localmente.");
  if (request.headers.get("origin") !== url.origin) throw new Error("Origen no permitido.");
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error("Se requiere JSON.");
}

export async function settleOnTestnet(root, id, invoke = cli) {
  const manifest = await readManifest(root);
  const hex = receiptId(id);
  // Identity names are fixed, never accepted from the browser or environment.
  const sender = (await invoke(root, ["keys", "address", "lab-sender"])).trim();
  if (sender !== manifest.sender) throw new Error("La identidad de laboratorio no coincide.");
  const common = ["contract", "invoke", "--id", manifest.contractId, "--source-account", "lab-sender", ...networkArgs];
  const read = async () => {
    const output = await invoke(root, [...common, "--send", "no", "--", "receipt", "--sender", manifest.sender, "--id", hex]);
    return JSON.parse(output);
  };
  let receipt = await read();
  if (!receipt) {
    try {
      await invoke(root, [...common, "--send", "yes", "--", "settle", "--id", hex, "--sender", manifest.sender, "--recipient", manifest.recipient, "--amount", "10000000"]);
    } catch {
      // Submission may have succeeded even if the response timed out. Query the SAME receipt.
      receipt = await read();
      if (!receipt) throw new Error("No se confirmó la transferencia. Reintenta la misma operación; no se generará otro identificador.");
    }
    receipt = await read();
  }
  if (!receipt || receipt.sender !== manifest.sender || receipt.recipient !== manifest.recipient || String(receipt.amount) !== "10000000") throw new Error("El recibo no coincide con la transferencia esperada.");
  const evidence = { mode: "soroban-testnet", reference: hex, explorerUrl: `https://stellar.expert/explorer/testnet/contract/${manifest.contractId}`, amount: "1", asset: "XLM testnet" };
  await mkdir(join(root, ".local/receipts"), { recursive: true });
  await writeFile(join(root, ".local/receipts", `${hex}.json`), JSON.stringify({ evidence, receipt }, null, 2), { mode: 0o600 });
  return evidence;
}

// Single local process: serialize CLI calls to avoid account sequence races.
let queue = Promise.resolve();
export function enqueueSettlement(root, id) {
  const task = queue.then(() => settleOnTestnet(root, id));
  queue = task.catch(() => {});
  return task;
}
