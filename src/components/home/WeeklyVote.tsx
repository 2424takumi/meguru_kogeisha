"use client"

import { useEffect, useId, useMemo, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { VoteType, WeeklyVoteOption } from "@/data/home"
import type { VoteStatus } from "@/data/votes/types"

type WeeklyVoteProps = {
  title: string
  question: string
  description: string[]
  options: WeeklyVoteOption[]
  resultSlug: string
  voteType: VoteType
  allowComment: boolean
  commentLabel?: string
  commentRequired?: boolean
  minChoices?: number
  maxChoices?: number
  status: VoteStatus
  startAt: string
  endAt: string
}

type StoredBallot = {
  choices?: string[]
  comment?: string | null
  submittedAt?: string
}

const COMMENT_MAX_LENGTH = 2000
const periodFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeStyle: "short",
})

function computeVoteWindow(status: VoteStatus, startAt: string, endAt: string) {
  const start = new Date(startAt).getTime()
  const end = new Date(endAt).getTime()
  const now = Date.now()
  const beforeStart = Number.isFinite(start) && now < start
  const afterEnd = Number.isFinite(end) && now > end
  const isActive = status === "open" && !beforeStart && !afterEnd
  let reason: string | null = null
  if (beforeStart) {
    reason = "投票はまだ開始していません。"
  } else if (afterEnd) {
    reason = "投票期間が終了しました。"
  } else if (status !== "open") {
    reason = "この投票は現在準備中です。"
  }
  return { isActive, reason }
}

function formatPeriodLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return periodFormatter.format(date)
}

function haveSameMembers(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false
  }
  const rightSet = new Set(right)
  return left.every((value) => rightSet.has(value))
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
  commentRequired = false,
  minChoices,
  maxChoices,
  status,
  startAt,
  endAt,
}: WeeklyVoteProps) {
  const router = useRouter()
  const commentIdBase = useId()
  const fieldsetLegendId = useId()
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [comment, setComment] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ballotStorageKey = useMemo(() => `ballot:${resultSlug}`, [resultSlug])
  const commentFieldMobileId = `${commentIdBase}-mobile`
  const commentCounterMobileId = `${commentIdBase}-mobile-counter`
  const commentFieldDesktopId = `${commentIdBase}-desktop`
  const commentCounterDesktopId = `${commentIdBase}-desktop-counter`
  const isMultiple = voteType === "multiple"
  const isLikert = voteType === "likert5" && options.length === 5
  const minSelection = minChoices ?? (isMultiple ? 1 : 1)
  const maxSelection = maxChoices ?? (isMultiple ? options.length : 1)
  const commentLabelText =
    commentLabel ?? (commentRequired ? "コメント (必須)" : "コメント (任意)")
  const trimmedComment = comment.trim()
  const voteWindow = useMemo(
    () => computeVoteWindow(status, startAt, endAt),
    [status, startAt, endAt],
  )
  const startLabel = useMemo(() => formatPeriodLabel(startAt), [startAt])
  const endLabel = useMemo(() => formatPeriodLabel(endAt), [endAt])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(ballotStorageKey)
      if (!raw) return
      const stored = JSON.parse(raw) as StoredBallot
      if (Array.isArray(stored.choices) && stored.choices.length > 0) {
        const persistedChoices = stored.choices.filter(
          (value): value is string => typeof value === "string",
        )
        if (persistedChoices.length === 0) {
          return
        }
        setSelectedOptionIds((previous) =>
          haveSameMembers(previous, persistedChoices) ? previous : persistedChoices,
        )
        setHasSubmitted((previous) => previous || persistedChoices.length > 0)
      }
    } catch {
      // 壊れたデータは無視する
    }
  }, [ballotStorageKey])

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
    if (!isLikert || hasSubmitted) return
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
    if (hasSubmitted) {
      return
    }
    setFormError(null)
    if (isMultiple) {
      setSelectedOptionIds((previous) => {
        if (previous.includes(optionId)) {
          return previous.filter((id) => id !== optionId)
        }
        if (previous.length >= maxSelection) {
          setFormError(`選択できるのは最大で${maxSelection}件までです。`)
          return previous
        }
        return [...previous, optionId]
      })
      return
    }
    setSelectedOptionIds([optionId])
  }

  const renderCommentField = (id: string, counterId: string) => {
    if (!allowComment || !hasSelection || hasSubmitted) {
      return null
    }
    return (
      <div className="space-y-2">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {commentLabelText}
        </label>
        <textarea
          id={id}
          name="weekly-vote-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="この意見にした理由を伝える。"
          rows={4}
          maxLength={COMMENT_MAX_LENGTH}
          aria-describedby={counterId}
          required={commentRequired}
          className="w-full rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 text-sm text-neutral-700 placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
        />
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span id={counterId}>
            {commentRequired ? "必須入力" : "任意入力"}・{comment.length}/{COMMENT_MAX_LENGTH}
          </span>
          <span>2000文字まで</span>
        </div>
      </div>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (!voteWindow.isActive) {
      setFormError(voteWindow.reason ?? "現在この投票には参加できません。")
      return
    }

    if (selectedOptionIds.length < minSelection) {
      setFormError(`少なくとも${minSelection}件選択してください。`)
      return
    }
    if (isMultiple && selectedOptionIds.length > maxSelection) {
      setFormError(`選択できるのは最大で${maxSelection}件までです。`)
      return
    }

    const sanitizedComment = comment.trim()
    if (commentRequired && sanitizedComment.length === 0) {
      setFormError("コメントを入力してください。")
      return
    }
    if (sanitizedComment.length > COMMENT_MAX_LENGTH) {
      setFormError("コメントは2000文字以内で入力してください。")
      return
    }

    const payload = {
      choices: selectedOptionIds.map((optionId) => {
        const option = options.find((candidate) => candidate.id === optionId)
        return {
          option_id: optionId,
          ...(typeof option?.numericValue === "number" ? { numeric_value: option.numericValue } : {}),
        }
      }),
      comment: sanitizedComment.length > 0 ? sanitizedComment : undefined,
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/votes/${resultSlug}/ballots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          (data && typeof data.error === "string" && data.error) ||
          "投票の送信に失敗しました。時間をおいて再度お試しください。"
        setFormError(message)
        return
      }

      if (typeof window !== "undefined") {
        const storedBallot: StoredBallot = {
          choices: selectedOptionIds,
          comment: sanitizedComment.length > 0 ? sanitizedComment : null,
          submittedAt: new Date().toISOString(),
        }
        window.localStorage.setItem(ballotStorageKey, JSON.stringify(storedBallot))
      }

      setHasSubmitted(true)
      const selectedQuery = selectedOptionIds.join(",")
      router.push(`/votes/${resultSlug}/results?selected=${encodeURIComponent(selectedQuery)}`)
    } catch {
      setFormError("ネットワークエラーが発生しました。接続状況をご確認ください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitDisabled =
    hasSubmitted ||
    isSubmitting ||
    !voteWindow.isActive ||
    selectedOptionIds.length < minSelection ||
    (isMultiple && selectedOptionIds.length > maxSelection) ||
    (commentRequired && trimmedComment.length === 0)

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
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 sm:text-xs">
              {startLabel ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 font-medium">
                  開始: {startLabel}
                </span>
              ) : null}
              {endLabel ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 font-medium">
                  締切: {endLabel}
                </span>
              ) : null}
              {!voteWindow.isActive && voteWindow.reason ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
                  {voteWindow.reason}
                </span>
              ) : null}
              {hasSubmitted ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 font-medium text-brand-700">
                  投票済み
                </span>
              ) : null}
            </div>
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
                            aria-disabled={hasSubmitted}
                            tabIndex={hasSubmitted ? -1 : isSelected || (!hasSelection && index === 0) ? 0 : -1}
                            onClick={() => handleOptionSelect(option.id)}
                            onKeyDown={(event) => handleMobileKeyDown(event, index)}
                            disabled={hasSubmitted}
                            className={`flex flex-col items-center gap-2 text-[11px] font-semibold transition ${
                              isSelected ? "text-brand-600" : "text-neutral-400"
                            } ${hasSubmitted ? "opacity-60" : ""}`}
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
                  <div className="space-y-2">
                    {options.map((option) => {
                      const isSelected = selectedOptionIds.includes(option.id)
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleOptionSelect(option.id)}
                          disabled={hasSubmitted}
                          className={`w-full rounded-full border px-4 py-2.5 text-left text-sm font-semibold transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                            isSelected
                              ? "border-brand-500 bg-brand-500/10 text-brand-700"
                              : "border-neutral-200/80 text-neutral-600"
                          } ${hasSubmitted ? "opacity-60" : ""}`}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="hidden gap-2 sm:grid">
                {options.map((option) => {
                  const isSelected = selectedOptionIds.includes(option.id)
                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand-500 hover:border-brand-500/50 hover:bg-brand-500/5 ${
                        isSelected ? "border-brand-500 bg-brand-500/10 ring-4 ring-brand-500/10" : "border-neutral-200/80 bg-neutral-50"
                      } ${hasSubmitted ? "opacity-60" : ""}`}
                    >
                      <input
                        type={isMultiple ? "checkbox" : "radio"}
                        name="weekly-vote-option"
                        value={option.id}
                        checked={isSelected}
                        disabled={hasSubmitted}
                        onChange={() => handleOptionSelect(option.id)}
                        className="mt-1.5 h-4 w-4 border-neutral-300 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-neutral-900">{option.label}</p>
                        <p className="text-sm text-neutral-600">{option.description}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </fieldset>
            {selectedOptionDetails.length > 0 ? (
              <div className="space-y-2 text-sm leading-6 text-neutral-600">
                {hasSubmitted ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">投票した意見</p>
                ) : null}
                <ul className="space-y-2">
                  {selectedOptionDetails.map((option) => (
                    <li key={option.id}>
                      <p className="text-sm font-semibold text-neutral-900">{option.label}</p>
                      <p className="text-sm text-neutral-600">{option.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="sm:hidden">{renderCommentField(commentFieldMobileId, commentCounterMobileId)}</div>
            <div className="hidden sm:block">{renderCommentField(commentFieldDesktopId, commentCounterDesktopId)}</div>
            {formError ? (
              <p role="alert" className="text-sm font-medium text-red-600">
                {formError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitDisabled}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400"
            >
              {hasSubmitted ? "投票ありがとうございました" : isSubmitting ? "送信中..." : "この意見で投票する"}
            </button>
            <p className="text-[11px] leading-5 text-neutral-500 sm:text-xs">
              {hasSubmitted
                ? "集計ページであなたの投票が反映されています。"
                : voteWindow.isActive
                  ? "投票すると、集計ページで現在の結果と論点を確認できます。"
                  : "投票期間外のため、集計ページで最新の結果のみご確認いただけます。"}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
