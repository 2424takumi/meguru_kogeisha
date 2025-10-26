import { NextResponse } from "next/server"

import { getVoteResults, VoteError } from "@/lib/votes/service"

type RouteParams = {
  params: {
    slug: string
  }
}

export const revalidate = 30

export function GET(_request: Request, { params }: RouteParams) {
  try {
    const result = getVoteResults(params.slug)
    return NextResponse.json({
      vote_type: result.voteType,
      status: result.status,
      total: result.total,
      distribution: result.distribution.map((point) => ({
        key: point.key,
        label: point.label,
        count: point.count,
        percent: point.percent,
      })),
      avg: result.avg,
      comment_count: result.commentCount,
      total_selections: result.totalSelections,
    })
  } catch (error) {
    if (error instanceof VoteError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("Unexpected vote results error", error)
    return NextResponse.json({ error: "予期しないエラーが発生しました。" }, { status: 500 })
  }
}
