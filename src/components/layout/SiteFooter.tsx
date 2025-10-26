import Link from 'next/link'

const footerLinks = [
  {
    title: 'プロジェクト',
    links: [
      { href: '/about', label: 'めぐる工芸舎とは' },
      { href: '/areas', label: '産地一覧' },
      { href: '/stories', label: 'ストーリーアーカイブ' },
    ],
  },
  {
    title: '参加する',
    links: [
      { href: '/newsletter', label: 'ニュースレター登録' },
      { href: '/contact', label: '取材・協業のご相談' },
      { href: '/support', label: '寄付・支援について' },
    ],
  },
  {
    title: 'ソーシャル',
    links: [
      { href: 'https://instagram.com', label: 'Instagram' },
      { href: 'https://youtube.com', label: 'YouTube' },
      { href: 'https://x.com', label: 'X (旧Twitter)' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/80 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-neutral-900">めぐる工芸舎</p>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              日本各地の工芸に関わる人や場所を記録し、訪れる人とつなぐためのデジタル・コモンズを目指しています。
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{group.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-neutral-200/60 pt-6 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} めぐる工芸舎 / ONDO Project.</p>
          <p className="flex gap-3">
            <Link href="/privacy" className="hover:text-brand-600">
              プライバシーポリシー
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/terms" className="hover:text-brand-600">
              利用規約
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
