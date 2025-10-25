import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import SiteFooter from "@/components/layout/SiteFooter"
import SiteHeader from "@/components/layout/SiteHeader"
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
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <SiteHeader />
      <main className="flex flex-col gap-20 pb-24">
        <section className="relative overflow-hidden bg-white">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${area.themeColor} opacity-90`}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <nav className="text-xs font-medium text-neutral-700 sm:text-sm">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="transition hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    ホーム
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/areas"
                    className="transition hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    産地を探す
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-neutral-900">{area.name}</li>
              </ol>
            </nav>
            <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-neutral-700">
                  {area.region}
                </p>
                <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{area.name}</h1>
                <p className="mt-5 text-xl font-medium text-neutral-800 sm:max-w-3xl">{area.hero.tagline}</p>
                <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-700">{area.hero.narrative}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {area.hero.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600 shadow-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-4 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold text-neutral-600">産地のスナップショット</p>
                <dl className="mt-4 grid gap-4">
                  {area.hero.stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-neutral-100/80 px-4 py-3">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                        {stat.label}
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-neutral-900">{stat.value}</dd>
                      {stat.note ? (
                        <p className="mt-1 text-xs leading-5 text-neutral-500">{stat.note}</p>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="area-story-heading"
          className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">ストーリー</p>
              <h2 id="area-story-heading" className="mt-3 text-3xl font-semibold text-neutral-900">
                {area.story.title}
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {area.story.highlights.map((highlight) => (
                  <article
                    key={highlight.title}
                    className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-neutral-900">{highlight.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{highlight.description}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">年表</p>
              <ol className="mt-4 space-y-4 border-l border-neutral-200 pl-6">
                {area.story.timeline.map((item) => (
                  <li key={item.period} className="relative pl-4">
                    <span className="absolute -left-[35px] top-2 h-2.5 w-2.5 rounded-full bg-brand-500" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {item.period}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-neutral-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{item.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="area-workshop-heading"
          className="bg-white py-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">体験・見学</p>
                <h2 id="area-workshop-heading" className="mt-2 text-3xl font-semibold text-neutral-900">
                  職人と出会うワークショップ
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                  見て学ぶだけでなく、手を動かしながら産地の知恵を体感できるプログラムをピックアップ。
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-brand-500/60 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:border-brand-500 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
              >
                団体向けの相談をする
              </Link>
            </div>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {area.workshops.map((workshop) => (
                <article
                  key={workshop.title}
                  className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-neutral-50 p-6 shadow-sm"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">{workshop.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{workshop.description}</p>
                  </div>
                  <dl className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    <div>
                      <dt>所要時間</dt>
                      <dd className="text-sm font-medium text-neutral-800">{workshop.duration}</dd>
                    </div>
                    <div>
                      <dt>定員</dt>
                      <dd className="text-sm font-medium text-neutral-800">{workshop.capacity}</dd>
                    </div>
                    <div>
                      <dt>予約</dt>
                      <dd className="text-sm font-medium text-neutral-800">{workshop.reservation}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="area-projects-heading"
          className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">プロジェクト</p>
              <h2 id="area-projects-heading" className="mt-2 text-3xl font-semibold text-neutral-900">
                今、産地で動いていること
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                地域と職人、来訪者が手を取り合いながら進める取り組み。関わる方法も紹介します。
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {area.projects.map((project) => (
              <article
                key={project.title}
                className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-neutral-900">{project.title}</h3>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {project.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{project.description}</p>
                {project.partner ? (
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    協力: {project.partner}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="area-artisans-heading"
          className="bg-white py-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">職人紹介</p>
            <h2 id="area-artisans-heading" className="mt-2 text-3xl font-semibold text-neutral-900">
              この産地をつくる人たち
            </h2>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {area.artisans.map((artisan) => (
                <article
                  key={artisan.name}
                  className="rounded-3xl border border-neutral-200/80 bg-neutral-50 p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold text-neutral-900">{artisan.name}</h3>
                    <p className="text-sm font-semibold text-brand-600">{artisan.role}</p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-neutral-600">{artisan.bio}</p>
                  <p className="mt-4 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-700">
                    得意分野: {artisan.specialty}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="area-visit-heading"
          className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">訪れる前に</p>
              <h2 id="area-visit-heading" className="mt-2 text-3xl font-semibold text-neutral-900">
                旅のヒント
              </h2>
              <p className="mt-4 text-sm font-semibold text-neutral-700">
                ベストシーズン: {area.visiting.bestSeason}
              </p>
              <ul className="mt-6 space-y-4">
                {area.visiting.travelTips.map((tip) => (
                  <li key={tip} className="flex items-start gap-3 text-sm leading-6 text-neutral-600">
                    <span aria-hidden="true" className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900">アクセス</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{area.visiting.access}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-brand-500/10 via-brand-500/5 to-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">支援・連絡先</p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900">産地とつながる</h2>
                {area.support.note ? (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">{area.support.note}</p>
                ) : (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                    取材や訪問、コラボレーションの相談先を掲載しています。
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-brand-600">
                {area.support.website ? (
                  <Link
                    href={area.support.website}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    公式サイトを見る
                    <span aria-hidden="true">↗</span>
                  </Link>
                ) : null}
                {area.support.instagram ? (
                  <Link
                    href={area.support.instagram}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-2 text-brand-700 transition hover:bg-brand-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    Instagram
                    <span aria-hidden="true">↗</span>
                  </Link>
                ) : null}
                {area.support.contactEmail ? (
                  <a
                    href={`mailto:${area.support.contactEmail}`}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 px-4 py-2 text-brand-700 transition hover:border-brand-500 hover:text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    メールで相談
                    <span aria-hidden="true">✉</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
