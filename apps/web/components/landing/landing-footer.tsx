import { Asset } from "./asset";
import { InfoButton } from "./info-button";

const pendingMessage = "Esta sección todavía contiene los datos de ejemplo del diseño de Figma. El equipo de Bolar está preparando el contenido y los canales oficiales.";
const linkClass = "trim-cap text-left text-sm leading-[1.4] tracking-[0.4px] opacity-80 hover:underline";

export function LandingFooter() {
  return (
    // The source design still uses Routeflow placeholder branding and contact data.
    <footer id="contacto" className="mx-auto mb-[42px] mt-auto w-[calc(100%-32px)] max-w-[1220px] scroll-mt-8 rounded-3xl bg-footer-green px-6 pb-6 pt-10 font-footer text-footer-ink md:px-[55px] md:pb-[25px] md:pt-[61px]" data-node-id="260:14281">
      <div className="grid gap-10 md:grid-cols-2 xl:min-h-[189px] xl:grid-cols-[482px_253px_222px_1fr] xl:gap-0">
        <div className="flex flex-col items-start gap-6">
          <Asset name="bolar-logo" width={196} height={54} alt="BOLAR" />
          <p className="trim-cap text-sm leading-[1.4] tracking-[0.4px]">Remesas internacionales<br />Laboratorio de aprendizaje · Stellar testnet</p>
          <div className="flex gap-8">
            {(["youtube", "facebook", "whatsapp"] as const).map((name) => <InfoButton key={name} label={`${name}: canal pendiente`} title="Canales de Bolar" message={pendingMessage} className="rounded-md hover:opacity-70"><Asset name={name} width={32} height={32} /></InfoButton>)}
          </div>
        </div>
        <div className="flex flex-col items-start gap-4">
          <h2 className="trim-cap text-lg font-bold leading-[1.6] tracking-[0.5px]">Información</h2>
          {["Acerca de nosotros", "Servicios", "Blog"].map((label) => <InfoButton key={label} className={linkClass} title={label} message={pendingMessage}>{label}</InfoButton>)}
        </div>
        <div className="flex flex-col items-start gap-4">
          <h2 className="trim-cap text-lg font-bold leading-[1.6] tracking-[0.5px]">Empresas</h2>
          {[1, 2, 3].map((item) => <InfoButton key={item} className={linkClass} title="Empresas" message={pendingMessage}>Formulario</InfoButton>)}
        </div>
        <div className="flex flex-col items-start gap-4">
          <h2 className="trim-cap text-lg font-bold leading-[1.6] tracking-[0.5px]">Contacto</h2>
          {["Equipo BOLAR", "Canales por confirmar", "Sin pagos reales"].map((label) => <InfoButton key={label} className={`${linkClass} whitespace-nowrap`} title="Contacto de Bolar" message={pendingMessage}>{label}</InfoButton>)}
        </div>
      </div>
      <div className="mt-10 overflow-hidden xl:mt-0" aria-hidden="true"><Asset name="footer-divider" width={1110} height={1.0001} /></div>
      <p className="trim-cap mt-10 text-center text-sm leading-[1.4] tracking-[0.4px] opacity-80">BOLAR · Laboratorio testnet · Sin valor monetario</p>
    </footer>
  );
}
