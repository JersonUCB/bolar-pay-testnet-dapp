import Image from "next/image";
import heroImage from "@/public/assets/landing/familias-bolar.png";

export function HeroImage() {
  return (
    <Image
      src={heroImage}
      alt="Familias usando Bolar en el celular para enviar y recibir dinero entre Brasil y Bolivia"
      priority
      sizes="(max-width: 838px) 100vw, 838px"
      className="h-auto w-full max-w-[838px]"
    />
  );
}
