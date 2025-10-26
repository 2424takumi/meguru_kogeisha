import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import SiteFooter from "@/components/layout/SiteFooter"
import { getCraftAreaDetail, listCraftAreaSlugs } from "@/data/area-details"

type CraftAreaPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return listCraftAreaSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: CraftAreaPageProps): Metadata {
  const area = getCraftAreaDetail(params.slug)

  if (!area) {
    return {
      title: "産地が見つかりません | めぐる工芸舎",
    }
  }

  return {
    title: `${area.name} | めぐる工芸舎`,
    description: area.hero.narrative,
  }
}

export default function CraftAreaPage({ params }: CraftAreaPageProps) {
  const area = getCraftAreaDetail(params.slug)

  if (!area) {
    notFound()
  }

  return (
    <div className="flex flex-col bg-[--neu-50]">
      <section className="border-b border-[--neu-200] bg-white/90">
        <div className="mx-auto w-full max-w-[72rem] px-4 py-12 sm:px-6 lg:px-8">
          <nav className="text-xs font-medium text-[--neu-600] sm:text-sm">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="rounded-[4px] px-1 py-0.5 transition-colors hover:text-[--brand-600] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
                >
                  ホーム
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/areas"
                  className="rounded-[4px] px-1 py-0.5 transition-colors hover:text-[--brand-600] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
                >
                  産地を探す
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[--neu-800]">{area.name}</li>
            </ol>
          </nav>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[--brand-600]">
                {area.region}
              </p>
              <div className="space-y-5">
                <h1 className="font-serif text-[2.5rem] font-semibold leading-tight text-[--neu-900] sm:text-[2.75rem]">
                  {area.name}
                </h1>
                <p className="text-lg font-medium leading-8 text-[--neu-700] sm:max-w-xl">
                  {area.hero.tagline}
                </p>
                <div className="h-px w-12 bg-[--neu-200]" aria-hidden="true" />
                <p className="max-w-3xl text-base leading-7 text-[--neu-700]">
                  {area.hero.narrative}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {area.hero.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center rounded-full border border-[--neu-200] bg-white px-3 py-1 text-xs font-medium text-[--neu-600]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] border border-[--neu-200] bg-white/95">
                {area.hero.visual ? (
                  <Image
                    src={area.hero.visual.src}
                    alt={area.hero.visual.alt}
                    fill
                    sizes="(min-width: 1024px) 360px, 70vw"
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-[--neu-500]">
                    ビジュアルを準備中です
                  </div>
                )}
              </div>
              {area.hero.visual?.credit ? (
                <p className="text-xs text-[--neu-500]">{area.hero.visual.credit}</p>
              ) : null}
              {area.hero.stats.length > 0 ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  {area.hero.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[6px] border border-[--neu-200] bg-[--neu-50] p-4"
                    >
                      <dt className="text-xs font-medium uppercase tracking-[0.2em] text-[--neu-500]">
                        {stat.label}
                      </dt>
                      <dd className="mt-2 font-serif text-2xl font-semibold text-[--brand-600]">
                        {stat.value}
                      </dd>
                      {stat.note ? (
                        <p className="mt-2 text-xs leading-relaxed text-[--neu-600]">{stat.note}</p>
                      ) : null}
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-24 py-24">
        <section
          aria-labelledby="area-story-heading"
          className="mx-auto w-full max-w-[72rem] px-4 sm:px-6 lg:px-8"
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[--brand-600]">ストーリー</p>
              <h2
                id="area-story-heading"
                className="font-serif text-3xl font-semibold text-[--neu-900] sm:text-[2rem]"
              >
                {area.story.title}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {area.story.highlights.map((highlight) => (
                  <article
                    key={highlight.title}
                    className="rounded-[6px] border border-[--neu-200] bg-white p-6"
                  >
                    <h3 className="font-serif text-lg font-semibold text-[--neu-900]">{highlight.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[--neu-600]">{highlight.description}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[--neu-500]">年表</p>
              <ol className="mt-4 space-y-4 border-l border-[--neu-200] pl-6">
                {area.story.timeline.map((item) => (
                  <li key={item.period} className="relative pl-4">
                    <span className="absolute -left-3 top-2 block h-2 w-2 rounded-full bg-[--brand-600]" />
                    <p className="text-xs font-medium uppercase tracking-wide text-[--neu-500]">
                      {item.period}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[--neu-900]">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[--neu-600]">{item.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="area-workshop-heading"
          className="border-y border-[--neu-200] bg-white/90 py-16"
        >
          <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-[--brand-600]">体験・見学</p>
                <h2
                  id="area-workshop-heading"
                  className="font-serif text-3xl font-semibold text-[--neu-900]"
                >
                  職人と出会うワークショップ
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-[--neu-600]">
                  見て学ぶだけでなく、手を動かしながら産地の知恵を体感できるプログラムをピックアップ。
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-[6px] border border-[--neu-300] px-4 text-sm font-medium text-[--neu-700] transition-colors hover:border-[--neu-400] hover:text-[--brand-600] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
              >
                団体向けの相談をする
              </Link>
            </div>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {area.workshops.map((workshop) => (
                <article
                  key={workshop.title}
                  className="flex h-full flex-col justify-between gap-5 rounded-[6px] border border-[--neu-200] bg-white p-6"
                >
                  <div className="space-y-3">
                    <h3 className="font-serif text-xl font-semibold text-[--neu-900]">{workshop.title}</h3>
                    <p className="text-sm leading-relaxed text-[--neu-600]">{workshop.description}</p>
                  </div>
                  <dl className="grid gap-2 text-xs font-medium uppercase tracking-wide text-[--neu-500]">
                    <div>
                      <dt>所要時間</dt>
                      <dd className="text-sm font-medium text-[--neu-700]">{workshop.duration}</dd>
                    </div>
                    <div>
                      <dt>定員</dt>
                      <dd className="text-sm font-medium text-[--neu-700]">{workshop.capacity}</dd>
                    </div>
                    <div>
                      <dt>予約</dt>
                      <dd className="text-sm font-medium text-[--neu-700]">{workshop.reservation}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="area-projects-heading"
          className="mx-auto w-full max-w-[72rem] px-4 sm:px-6 lg:px-8"
        >
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[--brand-600]">プロジェクト</p>
            <h2
              id="area-projects-heading"
              className="font-serif text-3xl font-semibold text-[--neu-900]"
            >
              今、産地で動いていること
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-[--neu-600]">
              地域と職人、来訪者が手を取り合いながら進める取り組み。関わる方法も紹介します。
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {area.projects.map((project) => (
              <article
                key={project.title}
                className="rounded-[6px] border border-[--neu-200] bg-white p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-serif text-lg font-semibold text-[--neu-900]">{project.title}</h3>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-[--brand-600]/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[--brand-600]">
                    {project.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[--neu-600]">{project.description}</p>
                {project.partner ? (
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[--neu-500]">
                    協力: {project.partner}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="area-artisans-heading"
          className="border-y border-[--neu-200] bg-white/90 py-16"
        >
          <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[--brand-600]">職人紹介</p>
            <h2
              id="area-artisans-heading"
              className="mt-3 font-serif text-3xl font-semibold text-[--neu-900]"
            >
              この産地をつくる人たち
            </h2>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {area.artisans.map((artisan) => (
                <article
                  key={artisan.name}
                  className="flex h-full flex-col gap-4 rounded-[6px] border border-[--neu-200] bg-white p-6"
                >
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-semibold text-[--neu-900]">{artisan.name}</h3>
                    <p className="text-sm font-medium text-[--brand-600]">{artisan.role}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-[--neu-600]">{artisan.bio}</p>
                  <p className="inline-flex w-fit items-center rounded-[6px] border border-[--neu-200] bg-[--neu-50] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[--neu-600]">
                    得意分野: {artisan.specialty}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="area-visit-heading"
          className="mx-auto w-full max-w-[72rem] px-4 sm:px-6 lg:px-8"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[--brand-600]">訪れる前に</p>
              <h2
                id="area-visit-heading"
                className="font-serif text-3xl font-semibold text-[--neu-900]"
              >
                旅のヒント
              </h2>
              <p className="text-sm font-medium text-[--neu-700]">
                ベストシーズン: {area.visiting.bestSeason}
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[--neu-600]">
                {area.visiting.travelTips.map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-1 inline-block h-2 w-2 rounded-full bg-[--brand-600]" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[6px] border border-[--neu-200] bg-white p-6">
              <h3 className="font-serif text-lg font-semibold text-[--neu-900]">アクセス</h3>
              <p className="mt-3 text-sm leading-relaxed text-[--neu-600]">{area.visiting.access}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[6px] border border-[--neu-200] bg-white p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-[--brand-600]">支援・連絡先</p>
                <h2 className="font-serif text-2xl font-semibold text-[--neu-900]">産地とつながる</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-[--neu-600]">
                  {area.support.note ?? "取材や訪問、コラボレーションの相談先を掲載しています。"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                {area.support.website ? (
                  <Link
                    href={area.support.website}
                    className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-[--neu-300] bg-white px-4 text-[--neu-700] transition-colors hover:border-[--neu-400] hover:text-[--brand-600] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
                  >
                    公式サイトを見る
                    <span aria-hidden="true">↗</span>
                  </Link>
                ) : null}
                {area.support.instagram ? (
                  <Link
                    href={area.support.instagram}
                    className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-[--brand-600]/10 px-4 text-[--brand-700] transition-colors hover:bg-[--brand-600]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
                  >
                    Instagram
                    <span aria-hidden="true">↗</span>
                  </Link>
                ) : null}
                {area.support.contactEmail ? (
                  <a
                    href={`mailto:${area.support.contactEmail}`}
                    className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-[--brand-600] px-4 text-white transition-colors hover:bg-[--brand-700] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
                  >
                    メールで相談
                    <span aria-hidden="true">✉</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  )
}
