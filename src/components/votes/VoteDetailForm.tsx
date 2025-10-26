"use client"

import type { FormEvent } from "react"
import { useEffect, useId, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { VoteOptionDetail } from "@/data/vote-details"
import type { VoteType } from "@/data/home"

type VoteDetailFormProps = {
  question: string
  options: VoteOptionDetail[]
  resultSlug: string
  voteType: VoteType
  allowComment: boolean
  commentLabel?: string
  minChoices?: number
  maxChoices?: number
  initialSelectedOptionIds?: string[]
}

export default function VoteDetailForm({
  question,
  options,
  resultSlug,
  voteType,
  allowComment,
  commentLabel,
  minChoices,
  maxChoices,
  initialSelectedOptionIds = [],
}: VoteDetailFormProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(initialSelectedOptionIds)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(initialSelectedOptionIds.length > 0)
  const [comment, setComment] = useState("")
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const router = useRouter()
  const fieldsetLegendId = useId()
  const commentCounterId = useId()

  const isMultiple = voteType === "multiple"
  const minimumRequired = minChoices ?? (isMultiple ? 1 : 1)
  const maximumAllowed = maxChoices ?? (isMultiple ? options.length : 1)
  const commentMaxLength = 2000

  useEffect(() => {
    setSelectedOptionIds(initialSelectedOptionIds)
    setHasSubmitted(initialSelectedOptionIds.length > 0)
  }, [initialSelectedOptionIds])

  const selectedOptionDetails = useMemo(
    () =>
      selectedOptionIds
        .map((optionId) => options.find((option) => option.id === optionId))
        .filter((option): option is VoteOptionDetail => Boolean(option)),
    [options, selectedOptionIds],
  )

  const hasSelection = selectedOptionIds.length > 0
  const formattedCommentLabel = commentLabel ?? "コメント (任意)"

  const handleOptionChange = (optionId: string) => {
    setValidationMessage(null)
    if (isMultiple) {
      setSelectedOptionIds((previous) => {
        if (previous.includes(optionId)) {
          return previous.filter((id) => id !== optionId)
        }
        if (previous.length >= maximumAllowed) {
          setValidationMessage(`選択できるのは最大で${maximumAllowed}件までです。`)
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
    if (selectedOptionIds.length < minimumRequired) {
      setValidationMessage(`少なくとも${minimumRequired}件選択してください。`)
      return
    }
    const selectedQuery = selectedOptionIds.join(",")
    setHasSubmitted(true)
    router.replace(`/votes/${resultSlug}/results?selected=${encodeURIComponent(selectedQuery)}#vote-distribution`)
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
                }`}
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
                  onChange={() => handleOptionChange(option.id)}
                  className="sr-only"
                  aria-labelledby={optionLabelId}
                />
              </label>
            )
          })}
        </div>
      </fieldset>
      {selectedOptionDetails.length > 0 && !hasSubmitted ? (
        <div className="space-y-2 rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            選択中の意見{isMultiple ? `（${selectedOptionDetails.length}件）` : ""}
          </p>
          <ul className="space-y-2">
            {selectedOptionDetails.map((option) => (
              <li key={option?.id ?? ""}>
                <p className="text-base font-semibold text-neutral-900">{option?.label}</p>
                <p className="text-sm text-neutral-600">{option?.description}</p>
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
            {formattedCommentLabel}
          </label>
          <textarea
            id="vote-detail-comment"
            name="vote-detail-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="素材選びに関する考えや現場で感じていることを教えてください。"
            rows={4}
            maxLength={commentMaxLength}
            aria-describedby={commentCounterId}
            className="w-full rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 text-sm text-neutral-700 placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span id={commentCounterId}>任意入力・{comment.length}/{commentMaxLength}</span>
            <span>2000文字まで</span>
          </div>
        </div>
      ) : null}
      {validationMessage ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {validationMessage}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!hasSelection || hasSubmitted}
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
