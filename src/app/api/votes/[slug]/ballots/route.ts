import { NextResponse, type NextRequest } from "next/server"

import { submitBallot, VoteError, type VoteBallotInput } from "@/lib/votes/service"

type RouteParams = {
  params: {
    slug: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const slug = params.slug

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "リクエスト本文の解析に失敗しました。" }, { status: 400 })
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json({ error: "無効なリクエスト形式です。" }, { status: 400 })
  }

  try {
    const result = submitBallot(slug, payload as VoteBallotInput)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof VoteError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("Unexpected vote submission error", error)
    return NextResponse.json({ error: "予期しないエラーが発生しました。" }, { status: 500 })
  }
}
