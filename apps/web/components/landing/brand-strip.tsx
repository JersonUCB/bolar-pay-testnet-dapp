import { Asset } from "./asset";

export function BrandStrip() {
  return <div className="flex w-full flex-wrap items-center justify-center gap-8 px-4 py-5 min-[75rem]:w-[1320px] min-[75rem]:gap-24 min-[75rem]:px-[100px]" aria-label="Tecnologías de Bolar" data-node-id="293:15015">
    <div className="flex items-start gap-[26px] max-[380px]:flex-col max-[380px]:items-center max-[380px]:gap-3"><span className="text-lg leading-6 text-content-secondary">Powered by</span><Asset name="stellar-logo" width={160} height={40} alt="Stellar" /></div>
    <div className="h-[40.18px]"><Asset name="web3-technology" width={244} height={41} alt="Web3 Technology" /></div>
    <div className="flex items-start gap-[26px] max-[380px]:flex-col max-[380px]:items-center max-[380px]:gap-3"><span className="text-lg leading-6 text-content-secondary">Protected by</span><div className="h-10"><Asset name="pollar-logo" width={195} height={42} alt="Pollar" /></div></div>
  </div>;
}
