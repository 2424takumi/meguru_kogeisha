"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { useRouter } from "next/navigation"
import type { VoteOptionDetail } from "@/data/vote-details"
import type { VoteType } from "@/data/home"
import type { VoteStatus } from "@/data/votes/types"
import {
  COMMENT_MAX_LENGTH,
  useBallotForm,
} from "@/components/votes/useBallotForm"

type VoteSummaryPoint = {
  key: string
  label: string
  count: number
  percent: number
}

type VoteSummary = {
  total: number
  distribution: VoteSummaryPoint[]
}

const percentFormatter = new Intl.NumberFormat("ja-JP", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%"
  }
  return `${percentFormatter.format(value)}%`
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.min(100, Math.max(0, value))
}

function isAbortError(error: unknown) {
  if (error instanceof DOMException) {
    return error.name === "AbortError"
  }
  if (!error || typeof error !== "object") {
    return false
  }
  const name = (error as { name?: unknown }).name
  return typeof name === "string" && name === "AbortError"
}

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
  showOptionDescriptions?: boolean
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
  showOptionDescriptions = true,
}: VoteDetailFormProps) {
  const router = useRouter()
  const fieldsetLegendId = useId()
  const commentCounterId = useId()
  const isMultiple = voteType === "multiple"
  const isLikert = voteType === "likert5" && options.length === 5
  const commentLabelText =
    commentLabel ?? (commentRequired ? "コメント (必須)" : "コメント (任意)")
  const sizeClasses = ["h-12 w-12", "h-11 w-11", "h-10 w-10", "h-11 w-11", "h-12 w-12"] as const

  const [summary, setSummary] = useState<VoteSummary | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)

  const handleSubmitSuccess = useCallback(
    (selection: string[]) => {
      const selectedQuery = selection.join(",")
      router.replace(
        `/votes/${resultSlug}/results?selected=${encodeURIComponent(selectedQuery)}#vote-distribution`,
      )
    },
    [resultSlug, router],
  )

  const {
    selectedOptionIds,
    selectedOptions: selectedOptionDetails,
    hasSelection,
    hasSubmitted,
    comment,
    setComment,
    formError,
    isSubmitting,
    submitDisabled,
    voteWindow,
    startLabel,
    endLabel,
    handleOptionToggle,
    handleSubmit,
  } = useBallotForm<VoteOptionDetail>({
    resultSlug,
    options,
    voteType,
    status,
    startAt,
    endAt,
    minChoices,
    maxChoices,
    commentRequired,
    onSubmitSuccess: handleSubmitSuccess,
  })

  useEffect(() => {
    if (!hasSubmitted) {
      return
    }

    let isMounted = true
    const controller = new AbortController()

    setSummaryError(null)
    setIsSummaryLoading(true)

    fetch(`/api/votes/${resultSlug}/results`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load vote summary")
        }
        return response.json()
      })
      .then((data) => {
        if (!isMounted) {
          return
        }
        const distribution = Array.isArray(data?.distribution)
          ? data.distribution
              .map((rawPoint: unknown) => {
                if (!rawPoint || typeof rawPoint !== "object") {
                  return null
                }
                const point = rawPoint as Record<string, unknown>
                const label = typeof point.label === "string" ? point.label : ""
                if (!label) {
                  return null
                }
                const key = typeof point.key === "string" ? point.key : label
                const count = typeof point.count === "number" ? point.count : 0
                const percent = typeof point.percent === "number" ? point.percent : 0
                return { key, label, count, percent }
              })
              .filter((point): point is VoteSummaryPoint => point !== null)
          : []
        setSummary({
          total: typeof data?.total === "number" ? data.total : 0,
          distribution,
        })
        setIsSummaryLoading(false)
      })
      .catch((error) => {
        if (!isMounted || isAbortError(error)) {
          return
        }
        setSummaryError("集計の取得に失敗しました。しばらくしてから再度お試しください。")
        setIsSummaryLoading(false)
      })

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [hasSubmitted, resultSlug])

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
      {!hasSubmitted ? (
        <fieldset className="space-y-3" aria-labelledby={fieldsetLegendId}>
          <legend id={fieldsetLegendId} className="sr-only">
            投票先を選択
          </legend>
          {isLikert ? (
            <div className="space-y-3">
              <div className="flex items-end justify-between text-xs font-medium text-neutral-500 sm:text-sm">
                <span>強く反対</span>
                <span>強く賛成</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                {options.map((option, index) => {
                  const isSelected = selectedOptionIds.includes(option.id)
                  const optionInputId = `vote-detail-${option.id}`
                  const size = sizeClasses[index] ?? sizeClasses[sizeClasses.length - 1]
                  return (
                    <label
                      key={option.id}
                      htmlFor={optionInputId}
                      className="flex cursor-pointer flex-col items-center gap-2 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand-500 hover:text-brand-600"
                    >
                      <input
                        id={optionInputId}
                        type={isMultiple ? "checkbox" : "radio"}
                        name="vote-detail-option"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleOptionToggle(option.id)}
                        className="peer sr-only"
                        aria-label={option.label}
                      />
                      <span
                        aria-hidden="true"
                        className={`flex items-center justify-center rounded-full border transition ${size} ${
                          isSelected
                            ? "border-brand-500 bg-brand-500 shadow-[0_0_0_4px_rgba(159,53,58,0.18)]"
                            : "border-neutral-300 bg-neutral-50"
                        } peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full transition-transform ${
                            isSelected ? "scale-100 bg-white" : "scale-0 bg-transparent"
                          }`}
                        />
                      </span>
                      <span
                        className={`text-[11px] font-semibold sm:text-xs ${
                          isSelected ? "text-brand-600" : "text-neutral-500"
                        }`}
                      >
                        {option.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {options.map((option) => {
                const isSelected = selectedOptionIds.includes(option.id)
                const optionLabelId = `vote-detail-${option.id}-label`
                return (
                  <label
                    key={option.id}
                    className={`flex h-full cursor-pointer flex-col justify-between rounded-2xl border p-4 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand-500 hover:border-brand-500/50 hover:bg-brand-500/5 ${
                      isSelected ? "border-brand-500 bg-brand-500/10 ring-4 ring-brand-500/10" : "border-neutral-200/80 bg-neutral-50"
                    }`}
                  >
                    <div className="space-y-2">
                      <span id={optionLabelId} className="text-base font-semibold text-neutral-900">
                        {option.label}
                      </span>
                      {showOptionDescriptions ? (
                        <span className="text-sm text-neutral-600">{option.description}</span>
                      ) : null}
                    </div>
                    <input
                      type={isMultiple ? "checkbox" : "radio"}
                      name="vote-detail-option"
                      value={option.id}
                      checked={isSelected}
                      onChange={() => handleOptionToggle(option.id)}
                      className="sr-only"
                      aria-labelledby={optionLabelId}
                    />
                  </label>
                )
              })}
            </div>
          )}
        </fieldset>
      ) : null}
      {selectedOptionDetails.length > 0 ? (
        <div className="space-y-2 text-sm leading-6 text-neutral-600">
          {hasSubmitted ? (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">投票した意見</p>
          ) : null}
          <ul className="space-y-2">
            {selectedOptionDetails.map((option) => (
              <li key={option.id}>
                <p className="text-base font-semibold text-neutral-900">{option.label}</p>
                {showOptionDescriptions ? (
                  <p className="text-sm text-neutral-600">{option.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {hasSubmitted ? (
        <div className="space-y-4 rounded-2xl border border-brand-200/70 bg-brand-50/40 p-5 sm:p-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">現在の集計</p>
            <p className="text-sm text-neutral-600">投票総数 {summary?.total ?? 0} 件</p>
          </div>
          {isSummaryLoading ? (
            <p className="text-sm text-neutral-500">集計を読み込んでいます...</p>
          ) : summaryError ? (
            <p className="text-sm font-medium text-red-600">{summaryError}</p>
          ) : summary && summary.distribution.length > 0 ? (
            <ul className="space-y-3">
              {summary.distribution.map((point) => {
                const width = clampPercent(point.percent)
                return (
                  <li key={point.key} className="space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium text-neutral-700">{point.label}</span>
                      <span className="text-sm font-semibold text-neutral-900">{formatPercent(point.percent)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-200">
                      <div
                        className="h-2 rounded-full bg-brand-500"
                        style={{ width: `${width}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="block text-xs text-neutral-500">{point.count}票</span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">集計データを準備しています。</p>
          )}
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
      {!hasSubmitted ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitDisabled}
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400"
          >
            {isSubmitting ? "送信中..." : "この意見で投票する"}
          </button>
          <a
            href={`/votes/${resultSlug}/results#vote-distribution-heading`}
            className="inline-flex items-center text-sm font-semibold text-brand-600 transition hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
          >
            集計を見る
          </a>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/votes/${resultSlug}/results#vote-voices-heading`}
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
          >
            みんなの意見を見る
          </a>
          <a
            href={`/votes/${resultSlug}/results#vote-distribution-heading`}
            className="inline-flex items-center text-sm font-semibold text-brand-600 transition hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
          >
            詳しい集計を見る
          </a>
        </div>
      )}
      <p className="text-xs leading-5 text-neutral-500">
        {hasSubmitted
          ? "最新の集計と意見を集約ページで確認できます。"
          : voteWindow.isActive
            ? "投票すると、集計ページで現在の結果と論点を確認できます。"
            : "投票期間外のため、集計ページで最新の結果のみご確認いただけます。"}
      </p>
    </form>
  )
}
