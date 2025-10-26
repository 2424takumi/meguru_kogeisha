import Link from "next/link"
import type { CraftArea } from "@/data/home"

type AreaGridProps = {
  areas: CraftArea[]
}

export default function AreaGrid({ areas }: AreaGridProps) {
  return (
    <section
      aria-labelledby="area-list-heading"
      className="mx-auto w-full max-w-[72rem] px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[--brand-600]">
            産地一覧
          </p>
          <h2
            id="area-list-heading"
            className="mt-4 font-serif text-3xl font-semibold text-[--neu-900] sm:text-[2rem]"
          >
            産地の声に触れて、次の旅先を見つける
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-[--neu-600] md:text-right">
          各カードをクリックすると詳細ページへ移動し、工房のストーリーやイベント、職人のプロフィールを読むことができます。
        </p>
      </div>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <Link
            key={area.slug}
            href={`/areas/${area.slug}`}
            aria-label={`${area.name}の詳細ページを開く`}
            className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
          >
            <article className="flex h-full flex-col overflow-hidden rounded-[6px] border border-[--neu-200] bg-white transition-colors group-hover:border-[--brand-400]">
              <div
                className="h-2 w-full bg-[--accent-500]/40"
                aria-hidden="true"
              />
              <div className="flex h-full flex-col gap-5 px-6 pb-6 pt-5">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[--brand-600]">
                    {area.region}
                  </p>
                  <h3 className="font-serif text-xl font-semibold text-[--neu-900]">
                    {area.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-[--neu-600]">
                    {area.description}
                  </p>
                </div>
                <p className="text-sm font-medium text-[--brand-600]">
                  {area.highlight}
                </p>
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-[--neu-700] transition group-hover:text-[--brand-600]">
                  詳細を見る
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
