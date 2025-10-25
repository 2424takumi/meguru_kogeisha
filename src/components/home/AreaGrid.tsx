import Link from "next/link"
import type { CraftArea } from "@/data/home"

type AreaGridProps = {
  areas: CraftArea[]
}

export default function AreaGrid({ areas }: AreaGridProps) {
  return (
    <section
      aria-labelledby="area-list-heading"
      className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">産地一覧</p>
          <h2 id="area-list-heading" className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
            産地の声に触れて、次の旅先を見つける
          </h2>
        </div>
        <p className="hidden max-w-md text-sm text-neutral-500 lg:block">
          各カードをクリックすると詳細ページへ移動し、工房のストーリーやイベント、職人のプロフィールを読むことができます。
        </p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <article
            key={area.slug}
            className="group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`h-24 w-full bg-gradient-to-br ${area.themeColor}`} aria-hidden="true" />
            <div className="flex h-full flex-col gap-4 px-6 pb-6 pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{area.region}</p>
                <h3 className="mt-2 text-xl font-semibold text-neutral-900">{area.name}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{area.description}</p>
              </div>
              <p className="text-sm font-medium text-brand-600">{area.highlight}</p>
              <Link
                href={`/areas/${area.slug}`}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 transition group-hover:text-brand-600"
              >
                詳細を見る
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
