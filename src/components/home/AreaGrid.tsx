import Link from "next/link"
import type { CraftArea } from "@/data/home"

const PREFECTURE_PATTERN = /^(.*?[都道府県])/

const extractPrefecture = (region: string) => {
  const match = region.match(PREFECTURE_PATTERN)
  return match ? match[1] : region
}

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
                <div className="relative w-full overflow-hidden">
                  <div
                    className={`aspect-[3/4] w-full bg-gradient-to-br ${area.themeColor}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <h3 className="text-xl font-semibold text-neutral-900">{area.name}</h3>
                  <span className="mt-2 inline-flex w-fit items-center rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                    {extractPrefecture(area.region)}
                  </span>
                  <p className="mt-3 overflow-hidden text-sm leading-relaxed text-neutral-600 [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                    {area.description}
                  </p>
                  <div className="mt-auto flex items-center justify-end text-sm font-semibold text-neutral-900 transition group-hover:text-brand-600">
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
