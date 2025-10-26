"use client"

import { useCallback, useId } from "react"
import { useRouter } from "next/navigation"
import type { VoteOptionDetail } from "@/data/vote-details"
import type { VoteType } from "@/data/home"
import type { VoteStatus } from "@/data/votes/types"
import {
  COMMENT_MAX_LENGTH,
  useBallotForm,
} from "@/components/votes/useBallotForm"

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
                    className={`flex flex-col items-center gap-2 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand-500 ${
                      hasSubmitted ? "cursor-default opacity-70" : "cursor-pointer"
                    }`}
                  >
                    <input
                      id={optionInputId}
                      type={isMultiple ? "checkbox" : "radio"}
                      name="vote-detail-option"
                      value={option.id}
                      checked={isSelected}
                      disabled={hasSubmitted}
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
                  className={`flex h-full flex-col justify-between rounded-2xl border p-4 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand-500 hover:border-brand-500/50 hover:bg-brand-500/5 ${
                    isSelected ? "border-brand-500 bg-brand-500/10 ring-4 ring-brand-500/10" : "border-neutral-200/80 bg-neutral-50"
                  } ${hasSubmitted ? "opacity-80" : ""}`}
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
                    disabled={hasSubmitted}
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
