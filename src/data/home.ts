import type { VoteStatus, VoteType } from "./votes/types"

export type { VoteType }

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

export type WeeklyVoteOption = {
  id: string
  label: string
  description: string
  supporters: number
  valueKey?: string
  numericValue?: number
}

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

export const weeklyVote: WeeklyVote = {
  resultSlug: 'shamisen-skin-materials',
  title: '今週の投票',
  question: '三味線の皮に動物由来の素材を使い続けることについて、あなたはどう考えますか？',
  description: [
    '国際的に動物福祉への関心が高まり、三味線皮革の調達は注目を集めています。',
    '輸出入規制の強化で舞台や練習現場の運営にも影響が出始めています。',
    '職人と奏者が素材の切り替えをどう捉えるか、地域でも議論が加速しています。',
  ],
  options: [
    {
      id: 'strongly-disagree',
      label: '強く反対',
      description: '犬・猫といった動物の皮を使わない代替素材へ、直ちに移行すべきだと思う。',
      supporters: 42,
      valueKey: '-2',
      numericValue: -2,
    },
    {
      id: 'disagree',
      label: 'やや反対',
      description: '伝統を尊重しつつも、可能な限り動物以外の選択肢を広げてほしい。',
      supporters: 61,
      valueKey: '-1',
      numericValue: -1,
    },
    {
      id: 'neutral',
      label: 'どちらとも言えない',
      description: '状況をもう少し知りたい。産地と利用者の双方の声を聞いて考えたい。',
      supporters: 33,
      valueKey: '0',
      numericValue: 0,
    },
    {
      id: 'agree',
      label: 'やや賛成',
      description: '現場が抱える実情を理解し、段階的な検討が進むなら使用を認めたい。',
      supporters: 54,
      valueKey: '+1',
      numericValue: 1,
    },
    {
      id: 'strongly-agree',
      label: '強く賛成',
      description: '品質維持のため従来素材を使い続けてほしい。適切に流通が管理されるなら賛成。',
      supporters: 76,
      valueKey: '+2',
      numericValue: 2,
    },
  ] satisfies WeeklyVoteOption[],
  voteType: 'likert5',
  allowComment: true,
  commentLabel: 'コメント (任意)',
  commentRequired: false,
  minChoices: 1,
  maxChoices: 1,
  status: 'open',
  startAt: '2025-01-01T00:00:00+09:00',
  endAt: '2025-12-31T23:59:59+09:00',
}
