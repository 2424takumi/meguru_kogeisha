import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/areas", label: "産地を探す" },
  { href: "/stories", label: "物語を読む" },
  { href: "/about", label: "めぐる工芸舎について" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[--neu-200] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[72rem] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="めぐる工芸舎"
          className="flex items-center gap-3 text-sm font-medium text-[--neu-800] transition-colors hover:text-[--brand-600]"
        >
          <Image
            src="/meguru_logo.png"
            alt="めぐる工芸舎のロゴ"
            width={120}
            height={40}
            priority
            className="h-[28px] w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-[--neu-600] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[6px] px-1 py-1 transition-colors hover:text-[--brand-600] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="inline-flex h-10 items-center justify-center rounded-[6px] bg-[--brand-600] px-4 text-sm font-medium text-white transition-colors hover:bg-[--brand-700] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
        >
          産地づくりに参加する
        </Link>
      </div>
    </header>
  );
}
