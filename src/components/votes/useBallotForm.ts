"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { Dispatch, FormEvent, SetStateAction } from "react"
import type { VoteType } from "@/data/home"
import type { VoteStatus } from "@/data/votes/types"

type BallotOption = {
  id: string
  numericValue?: number
}

type StoredBallot = {
  choices?: string[]
  comment?: string | null
  submittedAt?: string
}

export const COMMENT_MAX_LENGTH = 2000

const periodFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeStyle: "short",
})

export type VoteWindow = {
  isActive: boolean
  beforeStart: boolean
  afterEnd: boolean
  reason: string | null
}

export function computeVoteWindow(status: VoteStatus, startAt: string, endAt: string): VoteWindow {
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

export function formatPeriodLabel(value: string) {
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

type UseBallotFormParams<OptionType extends BallotOption> = {
  resultSlug: string
  options: OptionType[]
  voteType: VoteType
  status: VoteStatus
  startAt: string
  endAt: string
  minChoices?: number
  maxChoices?: number
  commentRequired?: boolean
  onSubmitSuccess?: (selectedOptionIds: string[]) => void | Promise<void>
}

export type UseBallotFormResult<OptionType extends BallotOption> = {
  selectedOptionIds: string[]
  selectedOptions: OptionType[]
  hasSelection: boolean
  hasSubmitted: boolean
  comment: string
  setComment: Dispatch<SetStateAction<string>>
  trimmedComment: string
  formError: string | null
  isSubmitting: boolean
  submitDisabled: boolean
  voteWindow: VoteWindow
  startLabel: string | null
  endLabel: string | null
  handleOptionToggle: (optionId: string) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function useBallotForm<OptionType extends BallotOption>({
  resultSlug,
  options,
  voteType,
  status,
  startAt,
  endAt,
  minChoices,
  maxChoices,
  commentRequired = false,
  onSubmitSuccess,
}: UseBallotFormParams<OptionType>): UseBallotFormResult<OptionType> {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [comment, setComment] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ballotStorageKey = useMemo(() => `ballot:${resultSlug}`, [resultSlug])
  const trimmedComment = useMemo(() => comment.trim(), [comment])
  const isMultiple = voteType === "multiple"
  const minimumRequired = minChoices ?? (isMultiple ? 1 : 1)
  const maximumAllowed = maxChoices ?? (isMultiple ? options.length : 1)

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
        if (persistedChoices.length > 0) {
          setSelectedOptionIds((previous) =>
            haveSameMembers(previous, persistedChoices) ? previous : persistedChoices,
          )
          setHasSubmitted((previous) => previous || persistedChoices.length > 0)
        }
      }
      if (typeof stored.comment === "string") {
        setComment(stored.comment)
      }
    } catch {
      // 破損したデータは無視する
    }
  }, [ballotStorageKey])

  const selectedOptions = useMemo(
    () =>
      selectedOptionIds
        .map((optionId) => options.find((option) => option.id === optionId))
        .filter((option): option is OptionType => Boolean(option)),
    [options, selectedOptionIds],
  )

  const hasSelection = selectedOptionIds.length > 0

  const handleOptionToggle = useCallback(
    (optionId: string) => {
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
    },
    [hasSubmitted, isMultiple, maximumAllowed],
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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

      if (commentRequired && trimmedComment.length === 0) {
        setFormError("コメントを入力してください。")
        return
      }
      if (trimmedComment.length > COMMENT_MAX_LENGTH) {
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
        comment: trimmedComment.length > 0 ? trimmedComment : undefined,
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
            comment: trimmedComment.length > 0 ? trimmedComment : null,
            submittedAt: new Date().toISOString(),
          }
          window.localStorage.setItem(ballotStorageKey, JSON.stringify(storedBallot))
        }

        setHasSubmitted(true)
        if (onSubmitSuccess) {
          await onSubmitSuccess(selectedOptionIds)
        }
      } catch {
        setFormError("ネットワークエラーが発生しました。接続状況をご確認ください。")
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      ballotStorageKey,
      commentRequired,
      isMultiple,
      maximumAllowed,
      minimumRequired,
      onSubmitSuccess,
      options,
      resultSlug,
      selectedOptionIds,
      trimmedComment,
      voteWindow,
    ],
  )

  const submitDisabled =
    hasSubmitted ||
    isSubmitting ||
    !voteWindow.isActive ||
    selectedOptionIds.length < minimumRequired ||
    (isMultiple && selectedOptionIds.length > maximumAllowed) ||
    (commentRequired && trimmedComment.length === 0)

  return {
    selectedOptionIds,
    selectedOptions,
    hasSelection,
    hasSubmitted,
    comment,
    setComment,
    trimmedComment,
    formError,
    isSubmitting,
    submitDisabled,
    voteWindow,
    startLabel,
    endLabel,
    handleOptionToggle,
    handleSubmit,
  }
}
