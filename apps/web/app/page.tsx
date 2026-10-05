import { BrandStrip } from "@/components/landing/brand-strip";
import { CountryFlags } from "@/components/landing/country-flags";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { GatedCalculator } from "@/components/landing/gated-calculator";

export default function Home() {
  return (
    <div id="inicio" className="relative flex min-h-screen flex-col overflow-x-clip bg-background xl:min-h-[2568px]" data-node-id="260:14144">
      <a href="#calcular-envio" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-4">Ir al simulador de envío</a>
      <LandingHeader />
      <main className="relative z-1 mb-16 flex flex-col items-center px-4 py-12 sm:py-16 xl:mb-0" data-node-id="260:14184">
        <div className="flex w-full max-w-[838px] flex-col items-center gap-8">
          <div className="flex w-full flex-col gap-6">
            <h1 className="w-full text-center text-[34px] font-bold leading-[1.2] sm:text-[44px] sm:leading-[56px] lg:w-[800px] lg:text-[52px] lg:leading-[64px]">Envía dinero.<br />Ahorra tiempo y gasta menos.</h1>
            <p className="w-full pb-3 text-center text-base leading-6 text-content-secondary sm:text-xl lg:w-[800px]">Envía dinero a otro país y haz que tu familiar o amigo lo reciba en minutos.</p>
          </div>
          <GatedCalculator />
          <BrandStrip />
        </div>
      </main>
      <CountryFlags />
      <LandingFooter />
    </div>
  );
}
