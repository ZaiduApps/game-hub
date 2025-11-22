import Image from "next/image";
import { SiteConfig } from "@/config/site";

interface PubgLogoProps {
  siteConfig: SiteConfig;
}

export function PubgLogo({ siteConfig }: PubgLogoProps) {
  return (
    <div className="flex items-center gap-3">
      {siteConfig.header.logo.url && (
        <Image 
          src={siteConfig.header.logo.url} 
          alt={siteConfig.header.logo.alt}
          width={40}
          height={40}
          className="rounded-md"
        />
      )}
      <span className="font-bold text-lg text-white whitespace-nowrap">
        {siteConfig.name}
      </span>
    </div>
  );
}
