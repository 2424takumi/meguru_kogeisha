import Link from "next/link"
import type { CraftArea } from "@/data/home"

type AreaGridProps = {
  areas: CraftArea[]
}

export default function AreaGrid({ areas }: AreaGridProps) {
  return (
    <section
      aria-label="産地一覧"
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">産地一覧</p>
        </div>
        <p className="hidden max-w-md text-sm text-neutral-500 lg:block">
          各カードをクリックすると詳細ページへ移動し、工房のストーリーやイベント、職人のプロフィールを読むことができます。
        </p>
      </div>
      <div className="mt-6 overflow-x-auto pb-4">
        <div className="flex gap-6">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              aria-label={`${area.name}の詳細ページを開く`}
              className="group block w-48 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <article className="relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className={`h-28 w-full bg-gradient-to-br ${area.themeColor}`} aria-hidden="true" />
                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{area.region}</p>
                  <h3 className="mt-2 text-xl font-semibold text-neutral-900">{area.name}</h3>
                  <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 transition group-hover:text-brand-600">
                    詳細を見る
                    <span aria-hidden="true" className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
