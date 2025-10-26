import "server-only"

import { voteResultDetails } from "@/data/vote-details"
import type { VoteOptionDetail, VoteResultDetail } from "@/data/vote-details"
import type { VoteStatus, VoteType } from "@/data/votes/types"

type VoteBallotChoiceInput = {
  option_id?: string
  numeric_value?: number
  rank?: number
}

type VoteBallotInput = {
  choices?: VoteBallotChoiceInput[]
  comment?: string | null
}

type VoteDistributionPoint = {
  key: string
  label: string
  count: number
  percent: number
  optionId: string
}

type VoteResultsPayload = {
  voteType: VoteType
  status: VoteStatus
  total: number
  distribution: VoteDistributionPoint[]
  avg?: number
  totalSelections: number
  commentCount: number
}

class VoteError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

type VoteState = {
  definition: VoteResultDetail
  optionCounts: Map<string, number>
  totalBallots: number
  totalSelections: number
  numericSum: number
  commentCount: number
  initializedFromSeed: boolean
}

const voteStates = new Map<string, VoteState>()

const allowedLikertValues = new Set([-2, -1, 0, 1, 2])

function findVoteDefinition(slug: string) {
  return voteResultDetails.find((vote) => vote.slug === slug)
}

function ensureVoteState(slug: string) {
  const existing = voteStates.get(slug)
  if (existing) {
    return existing
  }

  const definition = findVoteDefinition(slug)

  if (!definition) {
    throw new VoteError("投票が見つかりませんでした。", 404)
  }

  const optionCounts = new Map<string, number>()
  let totalBallots = 0
  let totalSelections = 0
  let numericSum = 0

  definition.options.forEach((option) => {
    const supporters = option.supporters ?? 0
    optionCounts.set(option.id, supporters)
    if (definition.voteType === "multiple") {
      totalSelections += supporters
    } else {
      totalBallots += supporters
      totalSelections += supporters
    }
    if (typeof option.numericValue === "number") {
      numericSum += supporters * option.numericValue
    }
  })

  const state: VoteState = {
    definition,
    optionCounts,
    totalBallots: definition.initialBallots ?? totalBallots,
    totalSelections,
    numericSum,
    commentCount: 0,
    initializedFromSeed: true,
  }

  voteStates.set(slug, state)
  return state
}

function assertVoteIsOpen(vote: VoteResultDetail) {
  if (vote.status !== "open") {
    throw new VoteError("現在この投票には参加できません。", 403)
  }
  const now = Date.now()
  const starts = new Date(vote.startAt).getTime()
  const ends = new Date(vote.endAt).getTime()
  if (Number.isFinite(starts) && now < starts) {
    throw new VoteError("投票期間前です。開始までお待ちください。", 403)
  }
  if (Number.isFinite(ends) && now > ends) {
    throw new VoteError("この投票は終了しました。", 403)
  }
}

function normalizeComment(rawComment: string | null | undefined, allowComment: boolean) {
  if (!rawComment) {
    return null
  }
  const trimmed = rawComment.trim()
  if (!trimmed) {
    return null
  }
  if (!allowComment) {
    throw new VoteError("この投票ではコメントを受け付けていません。", 400)
  }
  if (trimmed.length > 2000) {
    throw new VoteError("コメントは2000文字以内で入力してください。", 400)
  }
  return trimmed
}

function validateAndPrepareChoices(
  vote: VoteResultDetail,
  choices: VoteBallotChoiceInput[] | undefined,
): { option: VoteOptionDetail; numericValue?: number; rank?: number }[] {
  if (!choices || choices.length === 0) {
    throw new VoteError("少なくとも1件の選択肢を送信してください。", 400)
  }

  const uniqueOptionIds = new Set<string>()
  const prepared = choices.map((choice) => {
    const optionId = choice.option_id
    if (!optionId) {
      throw new VoteError("選択肢のIDが指定されていません。", 400)
    }
    const option = vote.options.find((candidate) => candidate.id === optionId)
    if (!option) {
      throw new VoteError("不正な選択肢が含まれています。", 400)
    }
    if (uniqueOptionIds.has(optionId)) {
      throw new VoteError("同じ選択肢が複数回含まれています。", 400)
    }
    uniqueOptionIds.add(optionId)
    return { option, numericValue: choice.numeric_value, rank: choice.rank }
  })

  const { voteType, minChoices, maxChoices } = vote
  const minimum = minChoices ?? (voteType === "multiple" ? 1 : 1)
  const maximum = maxChoices ?? (voteType === "multiple" ? vote.options.length : 1)

  switch (voteType) {
    case "likert5": {
      if (prepared.length !== 1) {
        throw new VoteError("リッカート方式は1つだけ選択してください。", 400)
      }
      const numericValue = prepared[0]?.numericValue
      const optionValue = prepared[0]?.option.numericValue
      if (typeof numericValue !== "number") {
        throw new VoteError("数値評価が見つかりませんでした。", 400)
      }
      if (!allowedLikertValues.has(numericValue)) {
        throw new VoteError("無効な数値評価です。", 400)
      }
      if (typeof optionValue === "number" && optionValue !== numericValue) {
        throw new VoteError("選択肢と数値評価が一致しません。", 400)
      }
      break
    }
    case "yesno":
    case "single": {
      if (prepared.length !== 1) {
        throw new VoteError("この投票では1つだけ選択してください。", 400)
      }
      break
    }
    case "multiple": {
      if (prepared.length < minimum || prepared.length > maximum) {
        throw new VoteError(`選択肢は${minimum}件以上${maximum}件以下で選択してください。`, 400)
      }
      break
    }
    default: {
      throw new VoteError("現在この投票方式には対応していません。", 400)
    }
  }

  return prepared
}

export function getVoteResults(slug: string): VoteResultsPayload {
  const state = ensureVoteState(slug)
  const { definition } = state

  const totalBallots = state.totalBallots
  const totalSelections = state.totalSelections

  const percentBase =
    definition.voteType === "multiple" ? Math.max(totalSelections, 0) : Math.max(totalBallots, 0)

  const distribution = definition.options.map((option, index) => {
    const count = state.optionCounts.get(option.id) ?? 0
    const key = option.valueKey ?? option.id ?? String(index + 1)
    const percent =
      percentBase > 0 ? Number(((count / percentBase) * 100).toFixed(1)) : 0
    return {
      key,
      label: option.label,
      count,
      percent,
      optionId: option.id,
    }
  })

  const hasNumericValues = definition.options.some(
    (option) => typeof option.numericValue === "number",
  )

  const avg =
    hasNumericValues && totalBallots > 0 ? Number((state.numericSum / totalBallots).toFixed(2)) : undefined

  return {
    voteType: definition.voteType,
    status: definition.status,
    total: totalBallots,
    distribution,
    avg,
    totalSelections,
    commentCount: state.commentCount,
  }
}

export function submitBallot(slug: string, input: VoteBallotInput) {
  const state = ensureVoteState(slug)
  const { definition } = state

  assertVoteIsOpen(definition)

  const comment = normalizeComment(input.comment ?? null, definition.allowComment)
  const preparedChoices = validateAndPrepareChoices(definition, input.choices)

  state.totalBallots += 1

  preparedChoices.forEach(({ option, numericValue }) => {
    const current = state.optionCounts.get(option.id) ?? 0
    state.optionCounts.set(option.id, current + 1)
    state.totalSelections += 1
    const valueToUse = typeof numericValue === "number" ? numericValue : option.numericValue
    if (typeof valueToUse === "number") {
      state.numericSum += valueToUse
    }
  })

  if (comment) {
    state.commentCount += 1
  }

  return { ok: true }
}

export function listVoteSlugs() {
  return voteResultDetails.map((vote) => vote.slug)
}

export function getVoteDefinition(slug: string) {
  const definition = findVoteDefinition(slug)
  if (!definition) {
    throw new VoteError("投票が見つかりませんでした。", 404)
  }
  return definition
}

export { VoteError }

export type { VoteResultsPayload, VoteDistributionPoint, VoteBallotInput }
