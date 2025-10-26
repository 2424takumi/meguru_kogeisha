"use client"

import type { FormEvent } from "react"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { VoteOptionDetail } from "@/data/vote-details"

type VoteDetailFormProps = {
  question: string
  options: VoteOptionDetail[]
  resultSlug: string
  initialSelectedOptionId?: string | null
}

export default function VoteDetailForm({
  question,
  options,
  resultSlug,
  initialSelectedOptionId = null,
}: VoteDetailFormProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(initialSelectedOptionId)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(Boolean(initialSelectedOptionId))
  const [comment, setComment] = useState("")
  const router = useRouter()

  useEffect(() => {
    setSelectedOption(initialSelectedOptionId)
    setHasSubmitted(Boolean(initialSelectedOptionId))
  }, [initialSelectedOptionId])

  const selectedOptionDetail = useMemo(
    () => options.find((option) => option.id === selectedOption) ?? null,
    [options, selectedOption],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedOption) return
    setHasSubmitted(true)
    router.replace(`/votes/${resultSlug}/results?selected=${selectedOption}#vote-distribution`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-brand-200/70 bg-white/90 p-6 shadow-sm shadow-brand-500/10 backdrop-blur sm:space-y-7 sm:p-7 lg:p-8"
      aria-labelledby="vote-detail-form-heading"
    >
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Vote</p>
        <h3 id="vote-detail-form-heading" className="text-lg font-semibold text-neutral-900 sm:text-xl">
          {question}
        </h3>
        <p className="text-sm leading-6 text-neutral-600 sm:text-base">
          背景を読んだうえで、今の考えに近い選択肢を選んでください。コメントは産地チームが参考にします。
        </p>
      </div>
      <fieldset className="space-y-3">
        <legend className="sr-only">投票先を選択</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = selectedOption === option.id
            return (
              <label
                key={option.id}
                className={`flex h-full flex-col justify-between rounded-2xl border p-4 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand-500 hover:border-brand-500/50 hover:bg-brand-500/5 ${
                  isSelected ? "border-brand-500 bg-brand-500/10 ring-4 ring-brand-500/10" : "border-neutral-200/80 bg-neutral-50"
                }`}
              >
                <div className="space-y-2">
                  <span className="text-base font-semibold text-neutral-900">{option.label}</span>
                  <span className="text-sm text-neutral-600">{option.description}</span>
                </div>
                <input
                  type="radio"
                  name="vote-detail-option"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => setSelectedOption(option.id)}
                  className="sr-only"
                  aria-label={option.label}
                />
              </label>
            )
          })}
        </div>
      </fieldset>
      {selectedOptionDetail && !hasSubmitted ? (
        <div className="space-y-2 rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">選択中の意見</p>
          <p className="text-base font-semibold text-neutral-900">{selectedOptionDetail.label}</p>
          <p className="text-sm text-neutral-600">{selectedOptionDetail.description}</p>
        </div>
      ) : null}
      {!hasSubmitted && (
        <div className="space-y-2">
          <label
            htmlFor="vote-detail-comment"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
          >
            コメント (任意)
          </label>
          <textarea
            id="vote-detail-comment"
            name="vote-detail-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="素材選びに関する考えや現場で感じていることを教えてください。"
            rows={4}
            className="w-full rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 text-sm text-neutral-700 placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!selectedOption || hasSubmitted}
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400"
        >
          {hasSubmitted ? "投票ありがとうございました" : "この意見で投票する"}
        </button>
        <a
          href={`/votes/${resultSlug}/results#vote-distribution-heading`}
          className="inline-flex items-center text-sm font-semibold text-brand-600 transition hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
        >
          集計を見る
        </a>
      </div>
      <p className="text-xs leading-5 text-neutral-500">
        {hasSubmitted
          ? "集計ページであなたの投票が反映されています。"
          : "投票すると、集計ページで現在の結果と論点を確認できます。"}
      </p>
    </form>
  )
}
