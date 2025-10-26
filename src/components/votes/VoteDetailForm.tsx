"use client"

import type { FormEvent } from "react"
import { useEffect, useId, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { VoteOptionDetail } from "@/data/vote-details"
import type { VoteType } from "@/data/home"
import type { VoteStatus } from "@/data/votes/types"

type VoteDetailFormProps = {
  question: string
  options: VoteOptionDetail[]
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
  return { isActive, beforeStart, afterEnd, reason }
}

function formatPeriodLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return periodFormatter.format(date)
}

export default function VoteDetailForm({
  question,
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
}: VoteDetailFormProps) {
  const router = useRouter()
  const fieldsetLegendId = useId()
  const commentCounterId = useId()
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [comment, setComment] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ballotStorageKey = useMemo(() => `ballot:${resultSlug}`, [resultSlug])
  const trimmedComment = comment.trim()
  const isMultiple = voteType === "multiple"
  const minimumRequired = minChoices ?? (isMultiple ? 1 : 1)
  const maximumAllowed = maxChoices ?? (isMultiple ? options.length : 1)
  const commentLabelText =
    commentLabel ?? (commentRequired ? "コメント (必須)" : "コメント (任意)")

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
        setSelectedOptionIds(
          stored.choices.filter((value): value is string => typeof value === "string"),
        )
        setHasSubmitted(true)
      }
    } catch {
      // ローカルストレージの値が壊れていても無視する
    }
  }, [ballotStorageKey])

  const selectedOptionDetails = useMemo(
    () =>
      selectedOptionIds
        .map((optionId) => options.find((option) => option.id === optionId))
        .filter((option): option is VoteOptionDetail => Boolean(option)),
    [options, selectedOptionIds],
  )

  const hasSelection = selectedOptionIds.length > 0

  const handleOptionChange = (optionId: string) => {
    if (hasSubmitted) {
      return
    }
    setFormError(null)
    if (isMultiple) {
      setSelectedOptionIds((previous) => {
        if (previous.includes(optionId)) {
          return previous.filter((id) => id !== optionId)
        }
        if (previous.length >= maximumAllowed) {
          setFormError(`選択できるのは最大で${maximumAllowed}件までです。`)
          return previous
        }
        return [...previous, optionId]
      })
      return
    }
    setSelectedOptionIds([optionId])
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (!voteWindow.isActive) {
      setFormError(voteWindow.reason ?? "現在この投票には参加できません。")
      return
    }

    if (selectedOptionIds.length < minimumRequired) {
      setFormError(`少なくとも${minimumRequired}件選択してください。`)
      return
    }
    if (isMultiple && selectedOptionIds.length > maximumAllowed) {
      setFormError(`選択できるのは最大で${maximumAllowed}件までです。`)
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
      router.replace(
        `/votes/${resultSlug}/results?selected=${encodeURIComponent(selectedQuery)}#vote-distribution`,
      )
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
    selectedOptionIds.length < minimumRequired ||
    (isMultiple && selectedOptionIds.length > maximumAllowed) ||
    (commentRequired && trimmedComment.length === 0)

  const startEndBadges = (
    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 sm:text-sm">
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
  )

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
        {startEndBadges}
      </div>
      <fieldset className="space-y-3" aria-labelledby={fieldsetLegendId}>
        <legend id={fieldsetLegendId} className="sr-only">
          投票先を選択
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = selectedOptionIds.includes(option.id)
            const optionLabelId = `vote-detail-${option.id}-label`
            return (
              <label
                key={option.id}
                className={`flex h-full flex-col justify-between rounded-2xl border p-4 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand-500 hover:border-brand-500/50 hover:bg-brand-500/5 ${
                  isSelected ? "border-brand-500 bg-brand-500/10 ring-4 ring-brand-500/10" : "border-neutral-200/80 bg-neutral-50"
                } ${hasSubmitted ? "opacity-80" : ""}`}
              >
                <div className="space-y-2">
                  <span id={optionLabelId} className="text-base font-semibold text-neutral-900">
                    {option.label}
                  </span>
                  <span className="text-sm text-neutral-600">{option.description}</span>
                </div>
                <input
                  type={isMultiple ? "checkbox" : "radio"}
                  name="vote-detail-option"
                  value={option.id}
                  checked={isSelected}
                  disabled={hasSubmitted}
                  onChange={() => handleOptionChange(option.id)}
                  className="sr-only"
                  aria-labelledby={optionLabelId}
                />
              </label>
            )
          })}
        </div>
      </fieldset>
      {selectedOptionDetails.length > 0 ? (
        <div className="space-y-2 rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            {hasSubmitted
              ? "投票した意見"
              : `選択中の意見${isMultiple ? `（${selectedOptionDetails.length}件）` : ""}`}
          </p>
          <ul className="space-y-2">
            {selectedOptionDetails.map((option) => (
              <li key={option.id}>
                <p className="text-base font-semibold text-neutral-900">{option.label}</p>
                <p className="text-sm text-neutral-600">{option.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {!hasSubmitted && allowComment && hasSelection ? (
        <div className="space-y-2">
          <label
            htmlFor="vote-detail-comment"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
          >
            {commentLabelText}
          </label>
          <textarea
            id="vote-detail-comment"
            name="vote-detail-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="素材選びに関する考えや現場で感じていることを教えてください。"
            rows={4}
            maxLength={COMMENT_MAX_LENGTH}
            aria-describedby={commentCounterId}
            required={commentRequired}
            className="w-full rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 text-sm text-neutral-700 placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span id={commentCounterId}>
              {commentRequired ? "必須入力" : "任意入力"}・{comment.length}/{COMMENT_MAX_LENGTH}
            </span>
            <span>2000文字まで</span>
          </div>
        </div>
      ) : null}
      {formError ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {formError}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitDisabled}
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400"
        >
          {hasSubmitted ? "投票ありがとうございました" : isSubmitting ? "送信中..." : "この意見で投票する"}
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
          : voteWindow.isActive
            ? "投票すると、集計ページで現在の結果と論点を確認できます。"
            : "投票期間外のため、集計ページで最新の結果のみご確認いただけます。"}
      </p>
    </form>
  )
}
