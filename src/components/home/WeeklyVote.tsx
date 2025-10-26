"use client"

import { useMemo, useState } from "react"
import type { WeeklyVoteOption } from "@/data/home"

type WeeklyVoteProps = {
  title: string
  question: string
  description: string
  options: WeeklyVoteOption[]
}

export default function WeeklyVote({ title, question, description, options }: WeeklyVoteProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [comment, setComment] = useState("")

  const selectedOptionDetail = useMemo(
    () => options.find((option) => option.id === selectedOption) ?? null,
    [options, selectedOption],
  )

  const sizeClasses = ["h-12 w-12", "h-11 w-11", "h-10 w-10", "h-11 w-11", "h-12 w-12"] as const

  const handleMobileKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault()
      const nextIndex = Math.min(index + 1, options.length - 1)
      setSelectedOption(options[nextIndex]?.id ?? null)
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault()
      const prevIndex = Math.max(index - 1, 0)
      setSelectedOption(options[prevIndex]?.id ?? null)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedOption) return
    setHasSubmitted(true)
  }

  return (
    <section aria-labelledby="weekly-vote-heading" className="mx-auto w-full max-w-[56rem]">
      <div className="overflow-hidden rounded-[6px] border border-[--neu-200] bg-white/95">
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.1fr,0.9fr] md:p-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-[--brand-600] sm:text-sm">
              {title}
            </p>
            <h2
              id="weekly-vote-heading"
              className="mt-3 font-serif text-[1.875rem] font-semibold text-[--neu-900] sm:mt-4 sm:text-[2.125rem]"
            >
              {question}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[--neu-600] sm:text-base sm:leading-7">
              {description}
            </p>
            <p className="mt-6 text-xs leading-relaxed text-[--neu-500] sm:mt-7">
              ※ 現在はベータ版のため、投票結果は週次レポートで共有します。賛否の分布のみ集計し、個人情報は記録しません。
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <fieldset className="space-y-4">
              <legend className="sr-only">投票先を選択</legend>
              <div className="sm:hidden">
                <div className="flex items-end justify-between text-[11px] font-medium text-[--neu-500]">
                  <span>強く反対</span>
                  <span>強く賛成</span>
                </div>
                <div
                  className="mt-3 flex items-center justify-between gap-2"
                  role="radiogroup"
                  aria-label={`${title} の選択`}
                >
                  {options.map((option, index) => {
                    const isSelected = selectedOption === option.id
                    const size = sizeClasses[index] ?? sizeClasses[sizeClasses.length - 1]
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={option.label}
                        tabIndex={isSelected || (!selectedOption && index === 0) ? 0 : -1}
                        onClick={() => setSelectedOption(option.id)}
                        onKeyDown={(event) => handleMobileKeyDown(event, index)}
                        className={`flex flex-col items-center gap-2 text-[11px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600] ${
                          isSelected ? "text-[--brand-600]" : "text-[--neu-400]"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex items-center justify-center rounded-full border ${size} transition-colors ${
                            isSelected
                              ? "border-[--brand-600] bg-[--brand-600]"
                              : "border-[--neu-300] bg-white"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full transition-transform ${
                              isSelected ? "scale-100 bg-white" : "scale-0 bg-transparent"
                            }`}
                          />
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-4 space-y-4 rounded-[6px] border border-[--neu-200] bg-[--neu-50] p-4 text-sm leading-6 text-[--neu-600]">
                  {selectedOptionDetail ? (
                    <>
                      <p className="font-medium text-[--neu-900]">{selectedOptionDetail.label}</p>
                      <p className="mt-2">{selectedOptionDetail.description}</p>
                      {!hasSubmitted && (
                        <div className="space-y-2 text-left">
                          <label
                            htmlFor="weekly-vote-comment-mobile"
                            className="text-xs font-medium uppercase tracking-wide text-[--neu-500]"
                          >
                            コメント (任意)
                          </label>
                          <textarea
                            id="weekly-vote-comment-mobile"
                            name="weekly-vote-comment"
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                            placeholder="この意見にした理由を伝える。"
                            rows={4}
                            className="w-full rounded-[6px] border border-[--neu-200] bg-white/95 px-4 py-3 text-sm text-[--neu-700] placeholder:text-[--neu-400] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-[--neu-500]">選択すると詳しい説明が表示されます。</p>
                  )}
                </div>
              </div>
              <div className="hidden gap-4 sm:grid sm:grid-cols-5">
                {options.map((option) => {
                  const isSelected = selectedOption === option.id
                  return (
                    <label
                      key={option.id}
                      className={`group flex flex-col gap-3 rounded-[6px] border px-4 py-4 transition-colors hover:border-[--brand-600] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[--info-600] ${
                        isSelected
                          ? "border-[--brand-600] bg-[--brand-600]/10"
                          : "border-[--neu-200] bg-[--neu-50]"
                      }`}
                    >
                      <p className="text-base font-medium text-[--neu-900]">{option.label}</p>
                      <p className="text-sm leading-relaxed text-[--neu-600]">{option.description}</p>
                      <input
                        type="radio"
                        name="weekly-vote"
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
            {!hasSubmitted && selectedOptionDetail && (
              <div className="hidden space-y-4 rounded-[6px] border border-[--neu-200] bg-[--neu-50] p-6 text-left text-sm text-[--neu-600] sm:block">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[--neu-500]">選択中の意見</p>
                  <p className="mt-2 text-base font-medium text-[--neu-900]">{selectedOptionDetail.label}</p>
                  <p className="mt-2 text-sm text-[--neu-600]">{selectedOptionDetail.description}</p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="weekly-vote-comment-desktop"
                    className="text-xs font-medium uppercase tracking-wide text-[--neu-500]"
                  >
                    コメント (任意)
                  </label>
                  <textarea
                    id="weekly-vote-comment-desktop"
                    name="weekly-vote-comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="この意見にした理由を伝える。"
                    rows={5}
                    className="w-full rounded-[6px] border border-[--neu-200] bg-white/95 px-4 py-3 text-sm text-[--neu-700] placeholder:text-[--neu-400] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600]"
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={!selectedOption || hasSubmitted}
              className="inline-flex w-full items-center justify-center rounded-[6px] bg-[--brand-600] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[--brand-700] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--info-600] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {hasSubmitted ? "投票ありがとうございました" : "この意見で投票して、みんなの意見を見る"}
            </button>
            {hasSubmitted && (
              <div className="space-y-3 text-xs text-[--neu-500]">
                <p aria-live="polite">
                  集計結果がアンロックされました。来週のレポートではコメントサマリーを掲載予定です。
                </p>
                <div className="space-y-2 rounded-[6px] border border-[--neu-200] bg-[--neu-50] p-4 text-[--neu-600]">
                  <p className="text-xs font-medium uppercase tracking-wide text-[--neu-500]">現在の分布</p>
                  <ul className="space-y-1 text-sm">
                    {options.map((option) => (
                      <li key={option.id} className="flex items-center justify-between gap-3">
                        <span>{option.label}</span>
                        <span className="font-medium text-[--brand-600]">{option.supporters} 票</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
