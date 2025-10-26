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
    <header className="sticky top-0 z-50 border-b border-brand-100/80 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" aria-label="めぐる工芸舎" className="flex items-center">
          <Image
            src="/meguru_logo.png"
            alt="めぐる工芸舎のロゴ"
            width={120}
            height={40}
            priority
            className="h-[28px] w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-800 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border border-brand-200 bg-transparent px-3 py-2 text-xs font-semibold text-brand-700 transition hover:border-brand-400 hover:text-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 sm:px-4 sm:text-sm"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-full border border-brand-500/40 bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 sm:px-4 sm:text-sm"
          >
            新規登録
          </Link>
        </div>
      </div>
    </header>
  );
}
