import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import MarkdownText from "@/components/MarkdownText"
import SiteFooter from "@/components/layout/SiteFooter"
import type { VoteResultDetail } from "@/data/vote-details"
import { getVoteDefinition, getVoteResults, listVoteSlugs, VoteError } from "@/lib/votes/service"

type VoteResultPageParams = Promise<{ slug: string }>
type VoteResultSearchParams = Promise<{ selected?: string | string[] }>

const updatedAtFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  timeStyle: "short",
})

export function generateStaticParams() {
  return listVoteSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: VoteResultPageParams }): Promise<Metadata> {
  try {
    const { slug } = await params
    const vote = getVoteDefinition(slug)

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

export default async function VoteResultPage({
  params,
  searchParams,
}: {
  params: VoteResultPageParams
  searchParams?: VoteResultSearchParams
}) {
  const { slug } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  let vote: VoteResultDetail
  try {
    vote = getVoteDefinition(slug)
  } catch (error) {
    if (error instanceof VoteError && error.status === 404) {
      notFound()
    }
    throw error
  }

  const results = getVoteResults(slug)

  const rawSelected = resolvedSearchParams?.selected
  const selectedValues = Array.isArray(rawSelected) ? rawSelected : rawSelected ? [rawSelected] : []
  const decodedSelections = selectedValues
    .flatMap((value) => value.split(","))
    .map((value) => decodeURIComponent(value.trim()))
    .filter(Boolean)
  const selectedOptionIds = decodedSelections
  const totalVotes = results.total
  const optionsWithPercentage = vote.options.map((option) => {
    const distributionPoint = results.distribution.find(
      (point) => point.optionId === option.id || point.key === (option.valueKey ?? option.id),
    )
    const count = distributionPoint?.count ?? 0
    const percentage = distributionPoint?.percent ?? 0
    return { ...option, count, percentage }
  })
  const optionsWithoutVotes = optionsWithPercentage.filter((option) => option.count === 0)
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
                <div>
                  <p className="text-sm font-medium leading-6 text-neutral-700">{vote.question}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {optionsWithoutVotes.length > 0 ? (
                  <div className="flex flex-col gap-3 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">投票結果のない立場</p>
                    <p className="text-xs leading-5 text-neutral-500">
                      まだ票が集まっていない選択肢です。調査の更新時に変化が反映されます。
                    </p>
                    <ul className="space-y-2">
                      {optionsWithoutVotes.map((option) => (
                        <li key={option.id} className="rounded-2xl border border-neutral-100 px-4 py-3">
                          <p className="text-sm font-semibold text-neutral-900">{option.label}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
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
                            <MarkdownText content={option.description} className="mt-1" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
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
                      <div className="space-y-2">
                        <MarkdownText content={option.description} />
                        <MarkdownText content={option.narrative} variant="muted" />
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="vote-voices-heading"
          className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8"
        >
          <div className="space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Community Voices</p>
              <h2 id="vote-voices-heading" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                みんなの声のハイライト
              </h2>
              <p className="text-sm leading-6 text-neutral-600 sm:text-base">
                立場ごとに寄せられたコメントを匿名で整理しています。開いて読むと、意見のニュアンスを確認できます。
              </p>
            </div>
            <div className="space-y-4">
              {vote.voices.map((voice) => (
                <details
                  key={voice.position}
                  className="group rounded-2xl border border-neutral-100 bg-neutral-50 p-5 text-neutral-700"
                >
                  <summary className="flex cursor-pointer items-start justify-between gap-3 text-left text-neutral-900 outline-none transition hover:text-brand-700 focus-visible:text-brand-700 [&::-webkit-details-marker]:hidden">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{voice.position}</p>
                      <p className="text-sm leading-6 text-neutral-600">{voice.summary}</p>
                    </div>
                    <span className="whitespace-nowrap text-sm text-neutral-400 group-open:hidden">開く</span>
                    <span className="hidden whitespace-nowrap text-sm text-neutral-400 group-open:inline">閉じる</span>
                  </summary>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-600">
                    {voice.highlights.map((highlight, index) => (
                      <li key={`${voice.position}-${index}`} className="rounded-xl bg-white p-4 shadow-sm">
                        <MarkdownText content={highlight} />
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-neutral-200/80 bg-white px-6 py-5 text-sm shadow-sm">
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
      </main>
      <SiteFooter />
    </div>
  )
}
