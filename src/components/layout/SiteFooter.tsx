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
    <footer className="border-t border-brand-800/50 bg-brand-900 text-brand-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-white">めぐる工芸舎</p>
            <p className="mt-3 text-sm leading-6 text-brand-100">
              日本各地の工芸に関わる人や場所を記録し、訪れる人とつなぐためのデジタル・コモンズを目指しています。
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-200">{group.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-brand-100">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-brand-800 pt-6 text-xs text-brand-200 sm:flex-row">
          <p>© {new Date().getFullYear()} めぐる工芸舎 / ONDO Project.</p>
          <p className="flex gap-3">
            <Link href="/privacy" className="transition-colors hover:text-white">
              プライバシーポリシー
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/terms" className="transition-colors hover:text-white">
              利用規約
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
