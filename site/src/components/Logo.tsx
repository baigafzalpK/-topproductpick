import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function BrandLogo({ height = 44 }: { height?: number }) {
  return (
    <div className="brand-logo-wrap">
      <Image
        src="/images/brand/logo.png"
        alt={siteConfig.name}
        width={150}
        height={height}
        className="brand-logo-img brand-logo-light"
        priority
      />
      <Image
        src="/images/brand/logo-dark.png"
        alt={siteConfig.name}
        width={150}
        height={height}
        className="brand-logo-img brand-logo-dark"
        priority
      />
    </div>
  );
}

export function BrandIcon({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/images/brand/logo-icon.png"
      alt={`${siteConfig.name} icon`}
      width={size}
      height={size}
      className="brand-icon-img"
    />
  );
}

export function Logo() {
  return (
    <Link href="/" className="logo-link" aria-label={`${siteConfig.name} home`}>
      <BrandLogo />
    </Link>
  );
}

// Backward compatibility export if needed elsewhere
export function BrandImage({ variant, height = 48 }: { variant?: "header" | "full"; height?: number }) {
  return <BrandLogo height={height} />;
}
