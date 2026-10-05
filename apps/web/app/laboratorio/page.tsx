import Link from "next/link";
export default function Laboratory() {
  return <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
    <Link className="text-bolar-green underline" href="/">← Volver a BOLAR</Link>
    <h1 className="text-3xl font-bold">Un laboratorio, dos formas de aprender</h1>
    <p>La landing conserva el diseño de BOLAR. Aquí ensayamos la remesa sin cuentas bancarias ni datos personales.</p>
    <section className="lab-note"><h2 className="text-xl font-semibold">1. Simulación completa</h2><p>Disponible inmediatamente. Reproduce verificación aprobada, pendiente o rechazada; depósito; transferencia; entrega y devolución. No llama a Pollar ni a Bridge.</p></section>
    <section className="lab-note"><h2 className="text-xl font-semibold">2. Contrato en Stellar testnet</h2><p>Un contrato Soroban transfiere 1 XLM de prueba y registra un recibo único. Solo ese tramo usa blockchain; los bancos siguen simulados.</p><p className="mt-3">Desde la raíz del nuevo proyecto:</p><pre className="mt-2 overflow-x-auto rounded bg-white p-3 text-sm">npm run build:contracts{"\n"}npm run testnet:setup{"\n"}npm run dev</pre><p className="mt-3">Requiere Stellar CLI, Rust y acceso a internet. El laboratorio genera cuentas exclusivas de testnet. No usa tu wallet de BOLAR ni acepta claves de producción.</p></section>
    <section><h2 className="text-xl font-semibold">Pollar y Bridge</h2><p>La conexión de sandbox con estos proveedores queda como etapa independiente: requiere confirmar credenciales y capacidades con Oscar. La simulación no certifica KYC ni elegibilidad PIX.</p></section>
    <p>El directorio docs del repositorio contiene arquitectura, etapas, prompts y criterios para habilitar un piloto real.</p>
  </main>;
}
