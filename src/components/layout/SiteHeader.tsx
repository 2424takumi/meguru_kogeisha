import Link from 'next/link'

const navItems = [
  { href: '/', label: 'ホーム' },
  { href: '/areas', label: '産地を探す' },
  { href: '/stories', label: '物語を読む' },
  { href: '/about', label: 'めぐる工芸舎について' },
]

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">
            <span className="text-lg font-semibold">巡</span>
          </div>
          <div>
            <p className="text-base font-semibold text-neutral-900">めぐる工芸舎</p>
            <p className="text-xs text-neutral-500">Meguru Kogeisha</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 md:flex">
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
        <Link
          href="/contact"
          className="inline-flex items-center rounded-full border border-brand-500/40 bg-brand-500/90 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 sm:px-4 sm:text-sm md:px-5"
        >
          産地づくりに参加する
        </Link>
      </div>
    </header>
  )
}
