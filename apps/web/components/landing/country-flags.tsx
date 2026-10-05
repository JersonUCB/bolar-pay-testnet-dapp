import { Asset } from "./asset";

const flags = [
  { name: "united-states", x: 45, y: 224, size: 96 },
  { name: "france", x: 217, y: 394, size: 72 },
  { name: "italy", x: 60, y: 478, size: 84 },
  { name: "spain", x: 171, y: 616, size: 64 },
  { name: "argentina", x: 1300, y: 229, size: 96 },
  { name: "bolivia", x: 1149, y: 387, size: 72 },
  { name: "brazil", x: 1271, y: 506, size: 84 },
  { name: "chile", x: 1183, y: 635, size: 64 },
];

export function CountryFlags() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden min-[75rem]:block" data-node-id="293:19801">
    {flags.map(({ name, x, y, size }) => <div key={name} className="absolute" style={{ left: `${x / 14.4}%`, top: y }}><Asset name={name} width={size} height={size} /></div>)}
  </div>;
}
