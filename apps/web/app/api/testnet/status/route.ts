import { readManifest, rootDirectory } from "@/server/stellar-cli.mjs";
export const runtime = "nodejs";
export async function GET() {
  try {
    const config = await readManifest(rootDirectory());
    return Response.json({ ready: true, network: "testnet", contractId: config.contractId }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ready: false, network: "testnet" }, { headers: { "Cache-Control": "no-store" } });
  }
}
