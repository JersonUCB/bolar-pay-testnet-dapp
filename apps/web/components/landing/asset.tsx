// Serve original SVG exports unchanged, at their intrinsic dimensions.
export function Asset({ name, width, height, alt = "" }: {
  name: string; width: number; height: number; alt?: string;
}) {
  // Raster optimization is unnecessary for the original vector artwork.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/assets/landing/${name}.svg`} width={width} height={height} alt={alt} className="block max-w-none shrink-0" draggable={false} />;
}
