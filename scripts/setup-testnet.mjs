import { mkdir, writeFile, chmod, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, join } from "node:path";
import { cli, networkArgs, RPC, TESTNET_PASSPHRASE, readManifest } from "../apps/web/server/stellar-cli.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
// Re-running setup must not silently replace the contract used by earlier receipts.
let configured = false;
try { await access(join(root, ".local/testnet.json")); configured = true; } catch {}
if (configured) {
  try {
    await readManifest(root);
    console.log("La configuración local ya existe. Se conserva el mismo contrato; esto no comprueba que siga activo en la red. Consulta docs/04-pruebas.md para un reinicio de testnet.");
    process.exit(0);
  } catch {
    console.error("La configuración existente es inválida. Revísala antes de preparar otra prueba; no se sobrescribió.");
    process.exit(1);
  }
}
await mkdir(join(root, ".local/stellar"), { recursive: true, mode: 0o700 });
await chmod(join(root, ".local"), 0o700);
async function identity(name) {
  try { return await cli(root, ["keys", "address", name]); }
  catch {
    await cli(root, ["keys", "generate", name]);
    return await cli(root, ["keys", "address", name]);
  }
}
async function fund(address) {
  const balance = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}`, { signal: AbortSignal.timeout(20_000) });
  if (balance.ok) return;
  if (balance.status !== 404) throw new Error("No se pudo comprobar la cuenta testnet.");
  const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error("Friendbot no pudo financiar una cuenta testnet.");
}
try {
  await access(join(root, "target/wasm32v1-none/release/remittance.wasm"));
  const sender = await identity("lab-sender");
  const recipient = await identity("lab-recipient");
  console.log("Financiando dos identidades exclusivas de laboratorio en Stellar testnet…");
  await fund(sender); await fund(recipient);
  const token = (await cli(root, ["contract", "id", "asset", "--asset", "native", ...networkArgs])).replaceAll('"', "");
  console.log("Desplegando el contrato de transferencia testnet…");
  const contractId = (await cli(root, ["contract", "deploy", "--wasm", "target/wasm32v1-none/release/remittance.wasm", "--source-account", "lab-sender", ...networkArgs, "--", "--token", token])).replaceAll('"', "");
  await writeFile(join(root, ".local/testnet.json"), JSON.stringify({ network: "testnet", passphrase: TESTNET_PASSPHRASE, rpc: RPC, asset: "XLM", sender, recipient, contractId }, null, 2), { mode: 0o600 });
  console.log(`Preparado. Contrato público testnet: ${contractId}`);
  console.log("Abre el laboratorio y selecciona Soroban testnet. Nunca financies estas cuentas en mainnet.");
} catch {
  // CLI failures can contain identity/config details: do not forward raw subprocess output.
  console.error("Preparación incompleta. Comprueba internet, Stellar CLI y el WASM (npm run build:contracts). No se ha habilitado el modo Soroban.");
  process.exitCode = 1;
}
