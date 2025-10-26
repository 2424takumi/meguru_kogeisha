import type { VoteStatus, VoteType } from "./votes/types"

export type VoteOptionBase = {
  id: string
  label: string
  description: string
  supporters: number
  valueKey?: string
  numericValue?: number
}

export type VoteOptionDetail = VoteOptionBase & {
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

type VoteHomeSummary = {
  title?: string
  description: string[]
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
  status: VoteStatus
  startAt: string
  endAt: string
  voteType: VoteType
  allowComment: boolean
  commentRequired?: boolean
  commentLabel?: string
  minChoices?: number
  maxChoices?: number
  initialBallots?: number
  options: VoteOptionDetail[]
  home?: VoteHomeSummary
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
    status: "open",
    startAt: "2024-05-20T00:00:00+09:00",
    endAt: "2024-07-31T23:59:59+09:00",
    voteType: "likert5",
    allowComment: true,
    commentLabel: "コメント (任意)",
    minChoices: 1,
    maxChoices: 1,
    home: {
      title: "今週の投票",
      description: [
        "国際的に動物福祉への関心が高まり、三味線皮革の調達は注目を集めています。",
        "輸出入規制の強化で舞台や練習現場の運営にも影響が出始めています。",
        "職人と奏者が素材の切り替えをどう捉えるか、地域でも議論が加速しています。",
      ],
    },
    options: [
      {
        id: "strongly-disagree",
        label: "強く反対",
        description: "犬・猫といった動物の皮を使わない代替素材へ、直ちに移行すべきだと思う。",
        supporters: 42,
        valueKey: "-2",
        numericValue: -2,
        narrative: "動物福祉や国際世論を重視する声が中心。音色変化より社会的責任を優先すべきという意見が目立ちました。",
      },
      {
        id: "disagree",
        label: "やや反対",
        description: "伝統を尊重しつつも、可能な限り動物以外の選択肢を広げてほしい。",
        supporters: 61,
        valueKey: "-1",
        numericValue: -1,
        narrative: "品質維持との両立を模索する層。演奏会の場数を踏んだ奏者からは、素材ごとの蓄積データがほしいという要望が上がりました。",
      },
      {
        id: "neutral",
        label: "どちらとも言えない",
        description: "状況をもう少し知りたい。産地と利用者の双方の声を聞いて考えたい。",
        supporters: 33,
        valueKey: "0",
        numericValue: 0,
        narrative: "素材や流通事情の情報不足が主な理由。実験データや音の比較試聴の場づくりが求められています。",
      },
      {
        id: "agree",
        label: "やや賛成",
        description: "現場が抱える実情を理解し、段階的な検討が進むなら使用を認めたい。",
        supporters: 54,
        valueKey: "+1",
        numericValue: 1,
        narrative: "皮の張替え頻度やコストを踏まえ、現状維持を支持する声。代替素材研究を前向きに捉える意見も多く寄せられました。",
      },
      {
        id: "strongly-agree",
        label: "強く賛成",
        description: "品質維持のため従来素材を使い続けてほしい。適切に流通が管理されるなら賛成。",
        supporters: 76,
        valueKey: "+2",
        numericValue: 2,
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
  {
    slug: "echizen-market-night",
    title: "越前和紙マルシェの夜間開催を検討する投票結果",
    question: "越前和紙の週末マルシェを夜まで延長する案に賛成しますか？",
    description:
      "来訪者の滞在時間を伸ばすため、照明演出と夜間プログラムを加えたマルシェ案が検討されています。地域住民と観光客の双方に配慮できるかを探りました。",
    updatedAt: "2024-05-28T09:00:00+09:00",
    status: "open",
    startAt: "2024-05-10T08:00:00+09:00",
    endAt: "2024-06-30T23:59:59+09:00",
    voteType: "yesno",
    allowComment: false,
    minChoices: 1,
    maxChoices: 1,
    options: [
      {
        id: "yes",
        label: "賛成",
        description: "夜の和紙工房見学やライトアップを通じて、滞在価値を高めたい。",
        supporters: 48,
        valueKey: "yes",
        numericValue: 1,
        narrative: "来訪者の回遊が増え、宿泊につながると期待する声が多く集まりました。安全面の順路設計を前提に賛成する意見です。",
      },
      {
        id: "no",
        label: "反対",
        description: "近隣住民の生活リズムや騒音が心配なので慎重に進めたい。",
        supporters: 32,
        valueKey: "no",
        numericValue: 0,
        narrative: "地域の高齢世帯や子育て世帯から、夜間交通と防犯に対する懸念が寄せられました。",
      },
    ],
    insights: [
      {
        title: "夜間照明と動線設計が安全性の鍵",
        description:
          "提灯やLEDで和紙を照らす演出が注目されていますが、安全基準を満たす導線整備が必要です。",
        points: [
          {
            label: "歩車分離",
            detail: "駐車場から会場までの導線に仮設照明と警備員を配置する案が検討されています。",
          },
          {
            label: "地域合意",
            detail: "自治会との合意形成を重ね、月1回から試験導入するプランが有力です。",
          },
        ],
      },
    ],
    voices: [
      {
        segment: "産地の声",
        summary: "若手職人は作品の見せ方が広がると期待しつつ、準備コストを懸念しています。",
        quotes: [
          {
            speaker: "和紙スタジオ灯-en",
            role: "ディレクター",
            comment: "夜にしか出せない透過光で魅せたい。片付け体制まで含めて検証中です。",
          },
        ],
      },
    ],
    area: {
      name: "越前和紙の里",
      slug: "echizen-washi",
      overview: "手漉き和紙と紙漉き神事で知られる越前市五箇地区。観光と生活の調和が課題です。",
      background: [
        {
          heading: "夜の賑わい創出",
          body: "和紙蔵を使ったプロジェクションや、紙漉き体験を夜に行う構想が進んでいます。",
        },
      ],
      challenges: [
        {
          title: "騒音と光害対策",
          description: "工房周辺の集落に配慮し、点灯時間と照度を抑える必要があります。",
        },
      ],
      registerLink: {
        href: "/areas/register",
        label: "産地・工房を登録する",
        description: "地域での取り組みを掲載したい場合はこちらからお知らせください。",
      },
    },
  },
  {
    slug: "kurume-weaving-school",
    title: "久留米絣の研修カリキュラムに関する投票結果",
    question: "久留米絣の研修プログラムを半年制に短縮する案について、どの方針が現実的だと思いますか？",
    description:
      "後継者育成のスピードを上げるため、座学と実技の比率を見直す案が出ています。職人・受講生・企業のバランスを探りました。",
    updatedAt: "2024-05-18T15:00:00+09:00",
    status: "open",
    startAt: "2024-04-25T09:00:00+09:00",
    endAt: "2024-07-15T23:59:59+09:00",
    voteType: "single",
    allowComment: true,
    commentLabel: "現場の声 (任意)",
    minChoices: 1,
    maxChoices: 1,
    options: [
      {
        id: "focus-weaving",
        label: "織り中心で短期集中",
        description: "座学を最小限にして、織りの反復練習に比重を置く。",
        supporters: 21,
        valueKey: "focus-weaving",
        narrative: "即戦力を求める工房から支持が集まりました。織機の操作に早く慣れる狙いです。",
      },
      {
        id: "balanced",
        label: "座学と実技を均等に",
        description: "伝統と市場背景を理解しつつ、染色と織りを段階的に学ぶ。",
        supporters: 34,
        valueKey: "balanced",
        narrative: "学習者と地域企業から、基礎理論を押さえた上で現場に入る案が最も支持されました。",
      },
      {
        id: "mentorship",
        label: "師匠制度で個別指導",
        description: "半年間は師匠の工房に入り、伴走指導を受ける。",
        supporters: 12,
        valueKey: "mentorship",
        narrative: "細やかな技術伝承を重視する声が中心ですが、指導側の負担が課題として挙がりました。",
      },
    ],
    insights: [
      {
        title: "染色工程の理解が離職率を下げる",
        description: "織りの前段階である染色を体系的に学ぶことで、配色ミスや材料ロスが減るという調査結果が共有されました。",
        points: [
          {
            label: "基礎教材の刷新",
            detail: "動画教材とオンライン質問箱を併用する案が検討されています。",
          },
        ],
      },
    ],
    voices: [
      {
        segment: "研修受講生の声",
        summary: "仕事と両立する受講生からは、濃密でも休憩を確保したスケジュールを求める声が上がりました。",
        quotes: [
          {
            speaker: "藤本 彩",
            role: "会社員／研修3期生",
            comment: "半年で織れるようになるのは魅力ですが、織りと染めの理解をバランスよく深めたいです。",
          },
        ],
      },
    ],
    area: {
      name: "久留米絣産地",
      slug: "kurume-gasuri",
      overview: "機械化と手仕事が混在する久留米の織物産地。後継者育成と働き方の両立がテーマです。",
      background: [
        {
          heading: "研修制度の再設計",
          body: "市と産地が共同で研修カリキュラムを設計し、企業派遣と個人参加を受け入れています。",
        },
      ],
      challenges: [
        {
          title: "生活保障と学習時間",
          description: "在職中に通う人が増え、柔軟な時間割と奨学制度が求められています。",
        },
      ],
      registerLink: {
        href: "/areas/register",
        label: "産地・工房を登録する",
        description: "地域でのプログラム情報を掲載したい場合はこちらからお知らせください。",
      },
    },
  },
  {
    slug: "takaoka-foundry-tour",
    title: "高岡銅器の鋳造見学ツアー構成に関する投票結果",
    question: "高岡銅器の見学ツアーで取り入れたい体験をすべて選んでください。",
    description:
      "来訪者向けツアーを刷新するにあたり、複数の体験コンテンツを組み合わせる案が検討されています。複数選択で優先度を調べました。",
    updatedAt: "2024-05-30T11:30:00+09:00",
    status: "open",
    startAt: "2024-05-01T09:00:00+09:00",
    endAt: "2024-07-31T23:59:59+09:00",
    voteType: "multiple",
    allowComment: true,
    commentLabel: "提案・補足 (任意)",
    commentRequired: false,
    minChoices: 1,
    maxChoices: 3,
    initialBallots: 64,
    options: [
      {
        id: "sand-casting",
        label: "砂型づくり体験",
        description: "職人監修のもと、小さな鋳物を型から作る体験を行う。",
        supporters: 44,
        valueKey: "sand-casting",
        narrative: "小学生から参加できるプログラムとして人気。安全講習を合わせる案が出ています。",
      },
      {
        id: "patina-workshop",
        label: "色付けワークショップ",
        description: "銅器の発色技法を学びながら、仕上げの着色を体験する。",
        supporters: 37,
        valueKey: "patina",
        narrative: "完成品に愛着が湧くとして、観光事業者から採用要望が多数寄せられました。",
      },
      {
        id: "foundry-tour",
        label: "大型炉の見学",
        description: "大型鋳造炉の迫力ある工程をガイド付きで見学する。",
        supporters: 51,
        valueKey: "foundry",
        narrative: "職人の作業を間近で見たいという声が最も多く、参加人数コントロールが課題です。",
      },
      {
        id: "design-talk",
        label: "デザイナーとの対話",
        description: "現代デザインとのコラボ事例を学ぶトークセッション。",
        supporters: 29,
        valueKey: "design",
        narrative: "企業の研修利用を想定したニーズ。オンライン連携の要望も挙がりました。",
      },
    ],
    insights: [
      {
        title: "安全と体験価値の両立が重要",
        description:
          "大人数での炉見学には安全管理が欠かせません。事前レクチャー動画や少人数制の導入が提案されています。",
        points: [
          {
            label: "回遊時間の最適化",
            detail: "90分コースに収める場合、体験は2つまでが現実的という試算が出ています。",
          },
        ],
      },
    ],
    voices: [
      {
        segment: "旅行会社の声",
        summary: "団体ツアーでは複数体験の組み合わせが好評。安全説明をスムーズにする仕組みが求められています。",
        quotes: [
          {
            speaker: "北陸クラフトツアーズ",
            role: "商品企画担当",
            comment: "色付け体験と炉見学のセットが人気です。予約枠を調整しやすい仕組みも欲しいです。",
          },
        ],
      },
    ],
    area: {
      name: "高岡銅器",
      slug: "takaoka-douki",
      overview: "仏具からインテリアまで幅広い製品を生み出す高岡の鋳物産地。",
      background: [
        {
          heading: "産地ツーリズムの強化",
          body: "鋳物製作の迫力を体験してもらい、販路拡大につなげる取り組みが進んでいます。",
        },
      ],
      challenges: [
        {
          title: "安全配慮と回転率",
          description: "炉周辺の温度管理や保険対応など、受け入れ体制の整備が求められています。",
        },
      ],
      registerLink: {
        href: "/areas/register",
        label: "産地・工房を登録する",
        description: "見学プログラムを掲載したい場合はこちらからお知らせください。",
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
