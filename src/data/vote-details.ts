import type { WeeklyVoteOption } from "./home"

export type VoteOptionDetail = WeeklyVoteOption & {
  narrative: string
}

type VoteInsight = {
  title: string
  description: string
  points: {
    label: string
    detail: string
  }[]
}

type VoteVoice = {
  segment: string
  summary: string
  quotes: {
    speaker: string
    role: string
    comment: string
  }[]
}

type VoteAreaContext = {
  name: string
  slug: string
  overview: string
  background: {
    heading: string
    body: string
  }[]
  challenges: {
    title: string
    description: string
  }[]
  registerLink: {
    href: string
    label: string
    description: string
  }
}

export type VoteResultDetail = {
  slug: string
  title: string
  question: string
  description: string
  updatedAt: string
  options: VoteOptionDetail[]
  insights: VoteInsight[]
  voices: VoteVoice[]
  area: VoteAreaContext
}

export const voteResultDetails: VoteResultDetail[] = [
  {
    slug: "shamisen-skin-materials",
    title: "三味線皮革のこれからを考える投票結果",
    question: "三味線の皮に動物由来の素材を使い続けることについて、あなたはどう考えますか？",
    description:
      "素材転換の議論が進むなかで、演奏家・製作職人・調律師・鑑賞者から寄せられた意見の分布と背景です。票数はテストデータであり、今後の調査で更新予定です。",
    updatedAt: "2024-06-02T12:00:00+09:00",
    options: [
      {
        id: "strongly-disagree",
        label: "強く反対",
        description: "犬・猫といった動物の皮を使わない代替素材へ、直ちに移行すべきだと思う。",
        supporters: 42,
        narrative: "動物福祉や国際世論を重視する声が中心。音色変化より社会的責任を優先すべきという意見が目立ちました。",
      },
      {
        id: "disagree",
        label: "やや反対",
        description: "伝統を尊重しつつも、可能な限り動物以外の選択肢を広げてほしい。",
        supporters: 61,
        narrative: "品質維持との両立を模索する層。演奏会の場数を踏んだ奏者からは、素材ごとの蓄積データがほしいという要望が上がりました。",
      },
      {
        id: "neutral",
        label: "どちらとも言えない",
        description: "状況をもう少し知りたい。産地と利用者の双方の声を聞いて考えたい。",
        supporters: 33,
        narrative: "素材や流通事情の情報不足が主な理由。実験データや音の比較試聴の場づくりが求められています。",
      },
      {
        id: "agree",
        label: "やや賛成",
        description: "現場が抱える実情を理解し、段階的な検討が進むなら使用を認めたい。",
        supporters: 54,
        narrative: "皮の張替え頻度やコストを踏まえ、現状維持を支持する声。代替素材研究を前向きに捉える意見も多く寄せられました。",
      },
      {
        id: "strongly-agree",
        label: "強く賛成",
        description: "品質維持のため従来素材を使い続けてほしい。適切に流通が管理されるなら賛成。",
        supporters: 76,
        narrative: "舞台での安定性や音の張りを評価し、伝統的な皮革の継続利用を強く願う声。狩猟・畜産副産物としての活用を提案する意見もありました。",
      },
    ],
    insights: [
      {
        title: "代替素材は「性能と調達」の両軸で評価が必要",
        description:
          "音の鳴り・持続性・メンテナンスコストなど、奏者と職人の評価軸が整理されつつあります。調査では以下の観点が重要とされました。",
        points: [
          {
            label: "音色テストの透明性",
            detail: "奏者ごとの演奏データを可視化し、素材ごとの差異を共有したいという要望が多数。",
          },
          {
            label: "調達ルートのトレーサビリティ",
            detail: "合法的に確保された皮革の証明や、廃棄素材のアップサイクルを求める声が集まりました。",
          },
          {
            label: "海外公演での持ち込みリスク",
            detail: "国際的な規制強化に備え、代替素材の選択肢を準備しておきたいという意見が目立ちました。",
          },
        ],
      },
      {
        title: "情報格差を埋める対話の場が不足",
        description:
          "製作現場では試作品が生まれているものの、演奏家や学習者へ十分に伝わっていません。知見を循環させる仕組みづくりが求められています。",
        points: [
          {
            label: "工房見学の受け皿",
            detail: "皮の張替え工程を公開し、実際の難しさを理解してもらいたいという職人の声。",
          },
          {
            label: "学習者向けのガイド",
            detail: "代替素材で練習を始める際の注意点をまとめた教材が欲しいという音楽教室からの意見。",
          },
          {
            label: "オンライン対話のアーカイブ",
            detail: "議論がイベント単位で流れてしまうという課題が共有され、記事や動画の蓄積が期待されています。",
          },
        ],
      },
    ],
    voices: [
      {
        segment: "演奏家の声",
        summary: "舞台経験を重ねた奏者は、音の立ち上がりと張りの微細な違いを指摘。一方で若手はメンテナンス負担の軽い代替素材に期待を寄せています。",
        quotes: [
          {
            speaker: "上野 玲子",
            role: "長唄三味線奏者",
            comment: "舞台袖で破れたときのリスクは大きい。代替素材の耐久データがあれば挑戦しやすいです。",
          },
          {
            speaker: "佐伯 悠斗",
            role: "津軽三味線ユニット",
            comment: "海外公演では検疫の書類が増えて大変。ノンアニマル素材の試奏機会を増やしてほしい。",
          },
        ],
      },
      {
        segment: "製作・修理職人の声",
        summary: "素材ごとの張り具合や乾燥スピードで作業工程が大きく変わるため、現場では安全に扱える素材研究への投資が必要とされています。",
        quotes: [
          {
            speaker: "株式会社東京和楽器・張師",
            role: "工房代表",
            comment: "湿度や温度で音が変わる。代替素材はまだ手触りが掴みづらく、安定した供給体制が鍵です。",
          },
          {
            speaker: "谷口 楓",
            role: "修理専門職人",
            comment: "素材の裏打ちに使う糊や和紙も見直しが必要。関連する職種全体で情報共有したい。",
          },
        ],
      },
      {
        segment: "聴き手・学習者の声",
        summary: "音色の違いに気づく人は少ない一方、伝統を尊重しつつ動物福祉にも配慮した選択を望む声が多数を占めました。",
        quotes: [
          {
            speaker: "落語会主催者",
            role: "定期公演スタッフ",
            comment: "公演の解説で素材の話題が出た際に説明できる資料があれば助かる。",
          },
          {
            speaker: "学生サークル代表",
            role: "大学津軽三味線部",
            comment: "練習用は代替素材でも良いが、公式戦は音量が課題。実証データを見ながら判断したい。",
          },
        ],
      },
    ],
    area: {
      name: "東京和楽器",
      slug: "tokyo-wagakki",
      overview:
        "東京・荒川区や台東区を中心に、三味線・鼓・笛など邦楽器を支える職人が集積しています。三味線皮革の調達を巡る課題はこの地域の工房に直結するテーマです。",
      background: [
        {
          heading: "皮革を扱う下町のネットワーク",
          body: "戦後から続く革問屋と張師のネットワークに支えられ、舞台に合わせた音づくりが磨かれてきました。現在は野生動物由来の皮だけでなく、養殖・畜産の副産物も試験導入が進んでいます。",
        },
        {
          heading: "国際規制と輸出入手続き",
          body: "一部の皮革はワシントン条約の管理対象となり、海外公演時の書類対応が重荷になっています。輸出時の代替証明が求められるケースが増加しています。",
        },
        {
          heading: "若手育成と後継者問題",
          body: "皮の張り替え技術は感覚の伝承が中心で、設備や素材が変わると教育方法の刷新が必要です。道具の共同利用や研修制度づくりが課題に挙がっています。",
        },
      ],
      challenges: [
        {
          title: "代替素材の実証環境づくり",
          description: "演奏会場・録音スタジオを巻き込み、条件を変えながら音質と耐久性を測定するプロジェクトを企画中です。",
        },
        {
          title: "倫理的調達とトレーサビリティ",
          description: "皮革問屋と連携し、捕獲方法や処理工程を記録する仕組みを整備。第三者監査の導入も検討されています。",
        },
        {
          title: "地域工房の連携強化",
          description: "荒川・台東エリアの工房が共同で見学会やワークショップを開催し、学習者や観客に素材の背景を伝える準備を進めています。",
        },
      ],
      registerLink: {
        href: "/areas/register",
        label: "産地・工房を登録する",
        description: "あなたの地域で活動する工房やコミュニティを掲載したい場合はこちらからお知らせください。",
      },
    },
  },
]

export function listVoteResultSlugs() {
  return voteResultDetails.map((vote) => vote.slug)
}

export function getVoteResultDetail(slug: string) {
  return voteResultDetails.find((vote) => vote.slug === slug)
}
