import { getVoteResultDetail } from "./vote-details"
import type { VoteOptionBase } from "./vote-details"
import type { VoteStatus, VoteType } from "./votes/types"

export type CraftArea = {
  slug: string
  name: string
  region: string
  description: string
  highlight: string
  themeColor: string
}

export const craftAreas: CraftArea[] = [
  {
    slug: 'echizen-washi',
    name: '越前和紙',
    region: '福井県越前市',
    description:
      '1500年の歴史を持つ手漉き和紙の里。神事と共に受け継がれる「紙漉きの神様」を祀る文化が根付く。',
    highlight: '越前和紙の里で、伝統と最先端の紙づくりを体験。',
    themeColor: 'bg-brand-500/10',
  },
  {
    slug: 'takaoka-douki',
    name: '高岡銅器',
    region: '富山県高岡市',
    description:
      '鋳造の町として発展した高岡。仏具から現代アートまで、多彩な鋳物職人が活躍している。',
    highlight: '銅を溶かし、型に流し込むライブデモンストレーションを開催。',
    themeColor: 'bg-amber-500/10',
  },
  {
    slug: 'kurume-gasuri',
    name: '久留米絣',
    region: '福岡県久留米市',
    description:
      '木綿の素朴な風合いと、かすり模様が魅力の久留米絣。民藝の精神が息づく産地。',
    highlight: '職人と一緒に織機を体験し、オリジナルストールを仕立てるワークショップ。',
    themeColor: 'bg-sky-500/10',
  },
  {
    slug: 'tokyo-wagakki',
    name: '東京和楽器',
    region: '東京都荒川区',
    description:
      '三味線や鼓など邦楽器を手掛ける職人が集まる町工場エリア。演奏家と共創しながら素材の議論を重ねている。',
    highlight: '工房と稽古場を巡り、三味線の皮張り工程を体験できるスタディツアーを準備中。',
    themeColor: 'bg-rose-500/10',
  },
]

export type { VoteType }

export type WeeklyVoteOption = VoteOptionBase

export type WeeklyVote = {
  resultSlug: string
  title: string
  question: string
  description: string[]
  options: WeeklyVoteOption[]
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

const FEATURED_VOTE_SLUG = 'shamisen-skin-materials'

const weeklyVoteDetail = getVoteResultDetail(FEATURED_VOTE_SLUG)

if (!weeklyVoteDetail) {
  throw new Error(`Vote detail not found for slug "${FEATURED_VOTE_SLUG}"`)
}

const weeklyVoteOptions: WeeklyVoteOption[] = weeklyVoteDetail.options.map(
  ({ narrative: _narrative, ...option }) => option,
)

const weeklyVoteDescription =
  weeklyVoteDetail.home?.description ??
  (weeklyVoteDetail.description ? [weeklyVoteDetail.description] : [])

export const weeklyVote: WeeklyVote = {
  resultSlug: weeklyVoteDetail.slug,
  title: weeklyVoteDetail.home?.title ?? '今週の投票',
  question: weeklyVoteDetail.question,
  description: weeklyVoteDescription,
  options: weeklyVoteOptions,
  voteType: weeklyVoteDetail.voteType,
  allowComment: weeklyVoteDetail.allowComment,
  commentLabel: weeklyVoteDetail.commentLabel,
  commentRequired: weeklyVoteDetail.commentRequired,
  minChoices: weeklyVoteDetail.minChoices,
  maxChoices: weeklyVoteDetail.maxChoices,
  status: weeklyVoteDetail.status,
  startAt: weeklyVoteDetail.startAt,
  endAt: weeklyVoteDetail.endAt,
}
