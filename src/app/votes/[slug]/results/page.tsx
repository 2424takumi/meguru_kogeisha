import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import SiteFooter from "@/components/layout/SiteFooter"
import type { VoteResultDetail } from "@/data/vote-details"
import { getVoteDefinition, getVoteResults, listVoteSlugs, VoteError } from "@/lib/votes/service"

type VoteResultPageProps = {
  params: { slug: string }
  searchParams?: { selected?: string }
}

const updatedAtFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  timeStyle: "short",
})

export function generateStaticParams() {
  return listVoteSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: VoteResultPageProps): Metadata {
  try {
    const vote = getVoteDefinition(params.slug)

    return {
      title: `${vote.title} | めぐる工芸舎`,
      description: vote.description,
    }
  } catch (error) {
    if (error instanceof VoteError && error.status === 404) {
      return {
        title: "投票が見つかりません | めぐる工芸舎",
      }
    }
    throw error
  }
}

export default function VoteResultPage({ params, searchParams }: VoteResultPageProps) {
  let vote: VoteResultDetail
  try {
    vote = getVoteDefinition(params.slug)
  } catch (error) {
    if (error instanceof VoteError && error.status === 404) {
      notFound()
    }
    throw error
  }

  const results = getVoteResults(params.slug)

  const selectedParam = searchParams?.selected ?? ""
  const selectedOptionIds = selectedParam
    ? selectedParam
        .split(",")
        .map((value) => decodeURIComponent(value.trim()))
        .filter(Boolean)
    : []
  const totalVotes = results.total
  const optionsWithPercentage = vote.options.map((option) => {
    const distributionPoint = results.distribution.find(
      (point) => point.optionId === option.id || point.key === (option.valueKey ?? option.id),
    )
    const count = distributionPoint?.count ?? 0
    const percentage = distributionPoint?.percent ?? 0
    return { ...option, count, percentage }
  })
  const selectedOptions = vote.options.filter((option) => selectedOptionIds.includes(option.id))
  const formattedUpdatedAt = updatedAtFormatter.format(new Date(vote.updatedAt))

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <main className="flex flex-col gap-16 pb-24">
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <nav className="text-xs font-medium text-neutral-600 sm:text-sm">
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
                    href="/#weekly-vote"
                    className="transition hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    今週の投票
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/votes/${vote.slug}`}
                    className="transition hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    {vote.question}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-neutral-900">投票結果</li>
              </ol>
            </nav>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
              <div className="space-y-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Result</p>
                <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">{vote.title}</h1>
                <div className="space-y-3 text-sm leading-6 text-neutral-700 sm:text-base">
                  <p className="font-semibold text-neutral-800">{vote.question}</p>
                  <p>{vote.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <a
                    href="#vote-distribution-heading"
                    className="inline-flex items-center rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    集計を見る
                  </a>
                  <Link
                    href={`/votes/${vote.slug}`}
                    className="inline-flex items-center font-semibold text-brand-600 transition hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    投票の背景をもう一度読む
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200/80 bg-neutral-50 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">集計状況</p>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-neutral-500">更新日時</span>
                  <span className="text-lg font-semibold text-neutral-900">{formattedUpdatedAt}</span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-neutral-500">総票数</span>
                  <span className="text-lg font-semibold text-brand-700">{totalVotes.toLocaleString()} 票</span>
                </div>
                {typeof results.avg === "number" ? (
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-neutral-500">平均スコア</span>
                    <span className="text-lg font-semibold text-brand-600">{results.avg.toFixed(2)}</span>
                  </div>
                ) : null}
                <p className="text-xs leading-5 text-neutral-500">
                  本票数はプロトタイピング用のサンプルデータです。正式な調査開始後に更新されます。
                </p>
                {selectedOptions.length > 0 ? (
                  <div className="mt-2 rounded-2xl border border-brand-200/70 bg-white px-4 py-3 text-sm leading-6 text-neutral-600">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">あなたの投票</p>
                    <ul className="mt-2 space-y-2">
                      {selectedOptions.map((option) => (
                        <li key={option.id}>
                          <p className="text-base font-semibold text-neutral-900">{option.label}</p>
                          <p className="mt-1 text-sm text-neutral-600">{option.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="vote-distribution-heading"
          className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Distribution</p>
              <h2 id="vote-distribution-heading" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                投票結果の内訳
              </h2>
              <p className="text-sm leading-6 text-neutral-600 sm:text-base">
                各選択肢の票数と割合、寄せられた主な論点をまとめています。
              </p>
            </div>
            <div className="space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-6">
              <ol className="space-y-6">
                {optionsWithPercentage.map((option) => {
                  const isSelected = selectedOptionIds.includes(option.id)
                  return (
                    <li key={option.id} className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-base font-semibold ${
                              isSelected ? "text-brand-700" : "text-neutral-900"
                            }`}
                          >
                            {option.label}
                          </span>
                          {isSelected ? (
                            <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
                              あなたの投票
                            </span>
                          ) : null}
                        </div>
                        <span className="text-sm font-semibold text-neutral-700 sm:text-base">
                          {option.count.toLocaleString()} 票
                          <span className="ml-2 text-neutral-500">({option.percentage}%)</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-200/80">
                        <div
                          className={`h-2 rounded-full ${isSelected ? "bg-brand-600" : "bg-brand-400/80"}`}
                          style={{ width: `${option.percentage}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="space-y-1 text-sm leading-6 text-neutral-600 sm:text-base">
                        <p>{option.description}</p>
                        <p className="text-neutral-500">{option.narrative}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </section>

        <section aria-labelledby="vote-insights-heading" className="bg-white py-10">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Insights</p>
              <h2 id="vote-insights-heading" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                見えてきた論点
              </h2>
              <p className="text-sm leading-6 text-neutral-600 sm:text-base">
                投票時に寄せられたコメントを整理し、これからの議論に向けた要点をまとめました。
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {vote.insights.map((insight) => (
                <article
                  key={insight.title}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-neutral-200/80 bg-neutral-50 p-6 shadow-sm"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">{insight.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{insight.description}</p>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-600">
                    {insight.points.map((point) => (
                      <li key={point.label} className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{point.label}</p>
                        <p className="mt-1 leading-6 text-neutral-600">{point.detail}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="vote-voices-heading"
          className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8"
        >
          <div className="space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Community Voices</p>
              <h2 id="vote-voices-heading" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                みんなの声のハイライト
              </h2>
              <p className="text-sm leading-6 text-neutral-600 sm:text-base">
                属性ごとに寄せられたコメントを抜粋し、議論の幅を感じられるように整理しています。
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {vote.voices.map((voice) => (
                <article
                  key={voice.segment}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-5"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{voice.segment}</p>
                    <p className="text-sm leading-6 text-neutral-600">{voice.summary}</p>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-600">
                    {voice.quotes.map((quote) => (
                      <li key={quote.comment} className="space-y-2 rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm font-semibold text-neutral-800">{quote.speaker}</p>
                        <p className="text-xs text-neutral-500">{quote.role}</p>
                        <p className="text-sm leading-6 text-neutral-600">“{quote.comment}”</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="vote-area-context-heading" className="bg-white py-10">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Area Context</p>
              <h2 id="vote-area-context-heading" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                {vote.area.name} の背景と課題
              </h2>
              <p className="text-sm leading-6 text-neutral-600 sm:text-base">{vote.area.overview}</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="space-y-4">
                {vote.area.background.map((section) => (
                  <article key={section.heading} className="rounded-3xl border border-neutral-200/80 bg-neutral-50 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-neutral-900">{section.heading}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{section.body}</p>
                  </article>
                ))}
              </div>
              <div className="space-y-6">
                <div className="rounded-3xl border border-brand-200/70 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">課題とアクション</h3>
                  <ul className="mt-4 space-y-4 text-sm text-neutral-600">
                    {vote.area.challenges.map((challenge) => (
                      <li key={challenge.title} className="rounded-2xl bg-brand-50/60 p-4">
                        <p className="text-sm font-semibold text-brand-700">{challenge.title}</p>
                        <p className="mt-2 leading-6 text-neutral-600">{challenge.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">次のアクション</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    産地の活動に参加したい方や、あなたの地域の工房を掲載したい方は以下からご連絡ください。
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/areas/${vote.area.slug}`}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                    >
                      産地ページへ
                    </Link>
                    <Link
                      href={vote.area.registerLink.href}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-brand-500/60 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:border-brand-500 hover:text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                    >
                      {vote.area.registerLink.label}
                    </Link>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-neutral-500">{vote.area.registerLink.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
