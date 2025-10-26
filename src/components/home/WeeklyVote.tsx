"use client"

import { useId, useMemo, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { VoteType, WeeklyVoteOption } from "@/data/home"

type WeeklyVoteProps = {
  title: string
  question: string
  description: string[]
  options: WeeklyVoteOption[]
  resultSlug: string
  voteType: VoteType
  allowComment: boolean
  commentLabel?: string
  minChoices?: number
  maxChoices?: number
}

export default function WeeklyVote({
  title,
  question,
  description,
  options,
  resultSlug,
  voteType,
  allowComment,
  commentLabel,
  minChoices,
  maxChoices,
}: WeeklyVoteProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [comment, setComment] = useState("")
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const router = useRouter()
  const commentIdBase = useId()
  const fieldsetLegendId = useId()

  const commentCounterMobileId = `${commentIdBase}-mobile`
  const commentCounterDesktopId = `${commentIdBase}-desktop`
  const isMultiple = voteType === "multiple"
  const isLikert = voteType === "likert5" && options.length === 5
  const minSelection = minChoices ?? (isMultiple ? 1 : 1)
  const maxSelection = maxChoices ?? (isMultiple ? options.length : 1)
  const commentMaxLength = 2000
  const formattedCommentLabel = commentLabel ?? "コメント (任意)"

  const selectedOptionDetails = useMemo(
    () =>
      selectedOptionIds
        .map((optionId) => options.find((option) => option.id === optionId))
        .filter((option): option is WeeklyVoteOption => Boolean(option)),
    [options, selectedOptionIds],
  )

  const hasSelection = selectedOptionIds.length > 0

  const sizeClasses = ["h-12 w-12", "h-11 w-11", "h-10 w-10", "h-11 w-11", "h-12 w-12"] as const

  const handleMobileKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!isLikert) return
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault()
      const nextIndex = Math.min(index + 1, options.length - 1)
      const nextId = options[nextIndex]?.id
      if (nextId) {
        setSelectedOptionIds([nextId])
      }
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault()
      const prevIndex = Math.max(index - 1, 0)
      const prevId = options[prevIndex]?.id
      if (prevId) {
        setSelectedOptionIds([prevId])
      }
    }
  }

  const handleOptionSelect = (optionId: string) => {
    setValidationMessage(null)
    if (isMultiple) {
      setSelectedOptionIds((previous) => {
        if (previous.includes(optionId)) {
          return previous.filter((id) => id !== optionId)
        }
        if (previous.length >= maxSelection) {
          setValidationMessage(`選択できるのは最大で${maxSelection}件までです。`)
          return previous
        }
        return [...previous, optionId]
      })
      return
    }
    setSelectedOptionIds([optionId])
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selectedOptionIds.length < minSelection) {
      setValidationMessage(`少なくとも${minSelection}件選択してください。`)
      return
    }
    const selectedQuery = selectedOptionIds.join(",")
    setHasSubmitted(true)
    router.push(`/votes/${resultSlug}/results?selected=${encodeURIComponent(selectedQuery)}`)
  }

  const renderCommentField = (id: string, counterId: string) => {
    if (!allowComment || !hasSelection || hasSubmitted) {
      return null
    }
    return (
      <div className="space-y-2">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {formattedCommentLabel}
        </label>
        <textarea
          id={id}
          name="weekly-vote-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="この意見にした理由を伝える。"
          rows={4}
          maxLength={commentMaxLength}
          aria-describedby={counterId}
          className="w-full rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 text-sm text-neutral-700 placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
        />
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span id={counterId}>任意入力・{comment.length}/{commentMaxLength}</span>
          <span>2000文字まで</span>
        </div>
      </div>
    )
  }

  return (
    <section
      id="weekly-vote"
      aria-labelledby="weekly-vote-heading"
      className="mx-auto w-full max-w-4xl px-4 sm:px-6"
    >
      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-md shadow-brand-500/10">
        <div className="grid gap-6 p-6 md:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600 sm:text-sm">{title}</p>
            <h2 id="weekly-vote-heading" className="mt-3 text-2xl font-semibold text-neutral-900 sm:mt-4 sm:text-3xl">
              {question}
            </h2>
            <div className="mt-4 space-y-1.5 text-sm leading-6 text-neutral-600 sm:space-y-2 sm:text-base">
              {description.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <Link
              href={`/votes/${resultSlug}`}
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 underline-offset-4 transition hover:text-brand-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 sm:text-xs"
            >
              さらに詳しい説明をみる
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <fieldset className="space-y-4" aria-labelledby={fieldsetLegendId}>
              <legend id={fieldsetLegendId} className="sr-only">
                投票先を選択
              </legend>
              <div className="sm:hidden">
                {isLikert ? (
                  <>
                    <div className="flex items-end justify-between text-[11px] font-medium text-neutral-500">
                      <span>強く反対</span>
                      <span>強く賛成</span>
                    </div>
                    <div
                      className="mt-3 flex items-center justify-between gap-2"
                      role="radiogroup"
                      aria-label={`${title} の選択`}
                    >
                      {options.map((option, index) => {
                        const isSelected = selectedOptionIds.includes(option.id)
                        const size = sizeClasses[index] ?? sizeClasses[sizeClasses.length - 1]
                        const optionLabelId = `weekly-mobile-${option.id}-label`
                        return (
                          <button
                            key={option.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-labelledby={optionLabelId}
                            tabIndex={isSelected || (!hasSelection && index === 0) ? 0 : -1}
                            onClick={() => handleOptionSelect(option.id)}
                            onKeyDown={(event) => handleMobileKeyDown(event, index)}
                            className={`flex flex-col items-center gap-2 text-[11px] font-semibold transition ${
                              isSelected ? "text-brand-600" : "text-neutral-400"
                            }`}
                          >
                            <span id={optionLabelId} className="sr-only">
                              {option.label}
                            </span>
                            <span
                              aria-hidden="true"
                              className={`flex items-center justify-center rounded-full border transition ${
                                size
                              } ${
                                isSelected
                                  ? "border-brand-500 bg-brand-500 shadow-[0_0_0_4px_rgba(159,53,58,0.18)]"
                                  : "border-neutral-300 bg-neutral-50"
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
                  </>
                ) : (
                  <div className="space-y-3">
                    {options.map((option) => {
                      const isSelected = selectedOptionIds.includes(option.id)
                      const optionLabelId = `weekly-generic-mobile-${option.id}-label`
                      return (
                        <label
                          key={option.id}
                          className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 transition hover:border-brand-500/50 hover:bg-brand-500/5 ${
                            isSelected
                              ? "border-brand-500 bg-brand-500/10 ring-4 ring-brand-500/10"
                              : "border-neutral-200/80 bg-neutral-50"
                          }`}
                        >
                          <div>
                            <p id={optionLabelId} className="text-sm font-semibold text-neutral-900">
                              {option.label}
                            </p>
                            <p className="mt-1 text-xs text-neutral-600">{option.description}</p>
                          </div>
                          <input
                            type={isMultiple ? "checkbox" : "radio"}
                            name="weekly-vote"
                            value={option.id}
                            checked={isSelected}
                            onChange={() => handleOptionSelect(option.id)}
                            className="mt-1"
                            aria-labelledby={optionLabelId}
                          />
                        </label>
                      )
                    })}
                  </div>
                )}
                {selectedOptionDetails.length > 0 && !hasSubmitted ? (
                  <div className="mt-4 space-y-4 text-sm leading-6 text-neutral-600">
                    <p className="font-semibold text-neutral-900">
                      選択中の意見{isMultiple ? `（${selectedOptionDetails.length}件）` : ""}
                    </p>
                    <ul className="space-y-3">
                      {selectedOptionDetails.map((option) => (
                        <li key={option?.id ?? ""}>
                          <p className="text-sm font-semibold text-neutral-900">{option?.label}</p>
                          <p className="mt-1 text-sm text-neutral-600">{option?.description}</p>
                        </li>
                      ))}
                    </ul>
                    {renderCommentField("weekly-vote-comment-mobile", commentCounterMobileId)}
                  </div>
                ) : null}
              </div>
              <div className="hidden gap-4 sm:grid sm:grid-cols-5">
                {isLikert
                  ? options.map((option) => {
                      const isSelected = selectedOptionIds.includes(option.id)
                      const optionLabelId = `weekly-desktop-${option.id}-label`
                      return (
                        <label
                          key={option.id}
                          className={`group flex flex-col rounded-2xl border px-4 py-4 transition hover:border-brand-500/50 hover:bg-brand-500/5 ${
                            isSelected
                              ? "border-brand-500 bg-brand-500/10 ring-4 ring-brand-500/10"
                              : "border-neutral-200/80 bg-neutral-50"
                          }`}
                        >
                          <p id={optionLabelId} className="text-base font-semibold text-neutral-900">
                            {option.label}
                          </p>
                          <p className="mt-2 text-sm text-neutral-600">{option.description}</p>
                          <input
                            type="radio"
                            name="weekly-vote"
                            value={option.id}
                            checked={isSelected}
                            onChange={() => handleOptionSelect(option.id)}
                            className="sr-only"
                            aria-labelledby={optionLabelId}
                          />
                        </label>
                      )
                    })
                  : options.map((option) => {
                      const isSelected = selectedOptionIds.includes(option.id)
                      const optionLabelId = `weekly-desktop-generic-${option.id}-label`
                      return (
                        <label
                          key={option.id}
                          className={`col-span-5 flex items-start justify-between gap-4 rounded-2xl border px-5 py-4 transition hover:border-brand-500/50 hover:bg-brand-500/5 ${
                            isSelected
                              ? "border-brand-500 bg-brand-500/10 ring-4 ring-brand-500/10"
                              : "border-neutral-200/80 bg-neutral-50"
                          }`}
                        >
                          <div>
                            <p id={optionLabelId} className="text-base font-semibold text-neutral-900">
                              {option.label}
                            </p>
                            <p className="mt-1 text-sm text-neutral-600">{option.description}</p>
                          </div>
                          <input
                            type={isMultiple ? "checkbox" : "radio"}
                            name="weekly-vote"
                            value={option.id}
                            checked={isSelected}
                            onChange={() => handleOptionSelect(option.id)}
                            className="mt-1 h-5 w-5"
                            aria-labelledby={optionLabelId}
                          />
                        </label>
                      )
                    })}
              </div>
            </fieldset>
            {!hasSubmitted && selectedOptionDetails.length > 0 ? (
              <div className="hidden space-y-4 rounded-2xl border border-neutral-200/80 bg-neutral-50 p-6 text-left text-sm text-neutral-600 sm:block">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                    選択中の意見{isMultiple ? `（${selectedOptionDetails.length}件）` : ""}
                  </p>
                  <ul className="mt-3 space-y-3">
                    {selectedOptionDetails.map((option) => (
                      <li key={option?.id ?? ""}>
                        <p className="text-base font-semibold text-neutral-900">{option?.label}</p>
                        <p className="mt-1 text-sm text-neutral-600">{option?.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                {renderCommentField("weekly-vote-comment-desktop", commentCounterDesktopId)}
              </div>
            ) : null}
            {validationMessage ? (
              <p role="alert" className="text-sm font-medium text-red-600">
                {validationMessage}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={!hasSelection || hasSubmitted}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400 sm:w-auto"
            >
              {hasSubmitted ? "投票ありがとうございました" : "この意見で投票して、みんなの意見を見る"}
            </button>
            {hasSubmitted && (
              <div className="space-y-3 text-xs text-neutral-500">
                <p aria-live="polite">
                  集計結果がアンロックされました。来週のレポートではコメントサマリーを掲載予定です。
                </p>
                <div className="space-y-2 rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4 text-neutral-600">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">現在の分布</p>
                  <ul className="space-y-1 text-sm">
                    {options.map((option) => (
                      <li key={option.id} className="flex items-center justify-between gap-3">
                        <span>{option.label}</span>
                        <span className="font-semibold text-brand-600">{option.supporters} 票</span>
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
