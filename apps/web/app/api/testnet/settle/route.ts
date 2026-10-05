import { assertLocalRequest, enqueueSettlement, receiptId, rootDirectory } from "@/server/stellar-cli.mjs";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { assertLocalRequest(request); } catch { return Response.json({ error: "Solo se admiten solicitudes locales del laboratorio." }, { status: 403 }); }
  let id: string;
  try {
    const body = await request.text();
    if (body.length > 256) throw new Error("Too large");
    const parsed = JSON.parse(body);
    if (typeof parsed.id !== "string" || Object.keys(parsed).length !== 1) throw new Error("Invalid body");
    id = parsed.id; receiptId(id);
  } catch { return Response.json({ error: "Identificador de prueba inválido." }, { status: 400 }); }
  try { return Response.json(await enqueueSettlement(rootDirectory(), id), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "No se pudo verificar el contrato testnet. Comprueba la preparación local y la conexión; reintenta esta misma prueba." }, { status: 503 }); }
}
