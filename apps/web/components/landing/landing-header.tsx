import { Asset } from "./asset";
import { InfoButton } from "./info-button";
import { HeaderWallet } from "./header-wallet";

function Navigation() {
  return <>
    <a className="nav-link" href="#calcular-envio">Calcular envío</a>
    <InfoButton className="nav-link" title="Acerca de Bolar" message="Estamos construyendo Bolar: una aplicación de remesas internacionales sobre Stellar. Esta primera versión permite explorar el diseño y simular un envío de Brasil a Bolivia.">Nosotros</InfoButton>
    <a className="nav-link" href="/laboratorio">Desarrolladores</a>
    <a className="nav-link" href="#contacto">Contacto</a>
  </>;
}

export function LandingHeader() {
  return (
    <header className="relative z-10 flex min-h-[88px] flex-wrap items-center justify-between gap-3 border-b border-field bg-white px-4 py-[15.5px] sm:px-6" data-node-id="260:14145">
      <a href="#inicio" aria-label="Bolar, inicio" className="flex shrink-0 items-center gap-1">
        <Asset name="bolar-logo" width={203} height={56} alt="Bolar" />
        <span className="relative hidden h-6 w-0 min-[84.375rem]:block" aria-hidden="true"><span className="absolute left-0 top-0 origin-top-left rotate-90"><Asset name="brand-divider" width={24} height={1.996} /></span></span>
        <span className="hidden pl-2 text-center text-base leading-5 tracking-[2px] min-[84.375rem]:block">REMESAS INTERNACIONALES</span>
      </a>
      <nav aria-label="Navegación principal" className="hidden items-center gap-2 lg:flex"><Navigation /></nav>
      <HeaderWallet />
      <details className="w-full lg:hidden">
        <summary className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium">Menú</summary>
        <nav aria-label="Navegación móvil" className="mt-2 flex flex-wrap gap-1"><Navigation /></nav>
      </details>
    </header>
  );
}
