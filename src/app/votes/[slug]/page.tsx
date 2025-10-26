import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import SiteFooter from "@/components/layout/SiteFooter"
import VoteDetailForm from "@/components/votes/VoteDetailForm"
import { listVoteSlugs, getVoteDefinition, VoteError } from "@/lib/votes/service"

type VoteDetailPageProps = {
  params: { slug: string }
}

const updatedAtFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  timeStyle: "short",
})

export function generateStaticParams() {
  return listVoteSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: VoteDetailPageProps): Metadata {
  try {
    const vote = getVoteDefinition(params.slug)

    return {
      title: `${vote.question} | めぐる工芸舎`,
      description: vote.area.overview,
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

export default function VoteDetailPage({ params }: VoteDetailPageProps) {
  let vote
  try {
    vote = getVoteDefinition(params.slug)
  } catch (error) {
    if (error instanceof VoteError && error.status === 404) {
      notFound()
    }
    throw error
  }

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
                <li className="text-neutral-900">{vote.question}</li>
              </ol>
            </nav>
            <div className="space-y-10">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Vote Guide</p>
                <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">{vote.question}</h1>
                <div className="space-y-4 text-sm leading-6 text-neutral-600 sm:text-base">
                  <p className="text-neutral-800">
                    {vote.area.name} が抱える課題を共有し、立場の違う人たちと視点を照らし合わせながら考えるための投票です。
                  </p>
                  <p>{vote.area.overview}</p>
                  <p className="rounded-2xl bg-neutral-100 px-5 py-4 text-sm text-neutral-700">
                    このページでは投票の背景や産地からのストーリーをまとめています。内容を読んだうえで、あなたの考えに近い選択肢へ投票してください。
                  </p>
                </div>
              </div>
              <div id="vote-entry" className="space-y-4">
                <VoteDetailForm
                  question={vote.question}
                  options={vote.options}
                  resultSlug={vote.slug}
                  voteType={vote.voteType}
                  allowComment={vote.allowComment}
                  commentLabel={vote.commentLabel}
                  commentRequired={vote.commentRequired}
                  minChoices={vote.minChoices}
                  maxChoices={vote.maxChoices}
                  status={vote.status}
                  startAt={vote.startAt}
                  endAt={vote.endAt}
                />
                <div className="rounded-2xl border border-neutral-200/80 bg-white px-6 py-5 text-xs leading-6 text-neutral-500">
                  <p>投票内容はプロトタイピング段階の集計に反映されます。正式公開まではテストデータとして扱われます。</p>
                  <p className="mt-2">投票後は自動的に集計ページへ移動し、あなたの選択と議論のハイライトを確認できます。</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-600">
                  更新: {formattedUpdatedAt}
                </span>
                <Link
                  href={`/votes/${vote.slug}/results`}
                  className="inline-flex items-center text-brand-600 transition hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                >
                  現在の集計を見る
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="vote-story-heading" className="bg-white py-12">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Field Notes</p>
              <h2 id="vote-story-heading" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                {vote.area.name} でこの問いが生まれた背景
              </h2>
              <p className="text-sm leading-6 text-neutral-600 sm:text-base">
                賛成・反対・様子見など立場ごとのコメントを匿名で整理しています。開いて読むと、具体的な背景やニュアンスがわかります。
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
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </article>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="rounded-3xl border border-brand-200/70 bg-white p-6 shadow-sm sm:p-7">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">課題とアクション</h3>
                <ul className="mt-4 space-y-4 text-sm text-neutral-600 sm:text-base">
                  {vote.area.challenges.map((challenge) => (
                    <li key={challenge.title} className="rounded-2xl bg-brand-50/60 p-4">
                      <p className="text-sm font-semibold text-brand-700 sm:text-base">{challenge.title}</p>
                      <p className="mt-2 leading-6 text-neutral-600">{challenge.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-7">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">次のアクション</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600 sm:text-base">
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
        </section>
      </main>
      <a
        href="#vote-entry"
        className="fixed bottom-6 right-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 lg:hidden"
        aria-label="投票フォームに戻る"
      >
        投票に戻る
      </a>
      <SiteFooter />
    </div>
  )
}
