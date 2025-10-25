import type { CraftArea } from "./home"

export type CraftAreaDetail = CraftArea & {
  hero: {
    tagline: string
    narrative: string
    keywords: string[]
    stats: {
      label: string
      value: string
      note?: string
    }[]
  }
  story: {
    title: string
    highlights: {
      title: string
      description: string
    }[]
    timeline: {
      period: string
      title: string
      description: string
    }[]
  }
  workshops: {
    title: string
    description: string
    duration: string
    capacity: string
    reservation: string
  }[]
  projects: {
    title: string
    status: string
    description: string
    partner?: string
  }[]
  artisans: {
    name: string
    role: string
    bio: string
    specialty: string
  }[]
  visiting: {
    bestSeason: string
    travelTips: string[]
    access: string
  }
  support: {
    website?: string
    instagram?: string
    contactEmail?: string
    note?: string
  }
}

export const craftAreaDetails: CraftAreaDetail[] = [
  {
    slug: "echizen-washi",
    name: "越前和紙",
    region: "福井県越前市",
    description:
      "1500年の歴史を持つ手漉き和紙の里。神事と共に受け継がれる「紙漉きの神様」を祀る文化が根付く。",
    highlight: "越前和紙の里で、伝統と最先端の紙づくりを体験。",
    themeColor: "from-brand-500/10 to-brand-500/20",
    hero: {
      tagline: "紙の神様と暮らす、越前五箇の里。",
      narrative:
        "山から湧く清水と紙祖神・川上御前を祀る信仰が、越前の人びとの暮らしと紙づくりを結び付けてきました。職人たちは今も里山を守りながら、伝統技法と最新技術の両輪で紙の可能性を広げています。",
      keywords: ["手漉き和紙", "里山文化", "神と紙の祭礼"],
      stats: [
        {
          label: "継承年数",
          value: "約1500年",
          note: "大瀧神社の記録に残る紙祖神の故事",
        },
        {
          label: "職人戸数",
          value: "68戸",
          note: "五箇地区の組合員数（2023年度）",
        },
        {
          label: "主な製品",
          value: "越前奉書・越前鳥の子・和紙照明",
        },
      ],
    },
    story: {
      title: "水と紙のむすび目を次代へ",
      highlights: [
        {
          title: "川上御前への朝拝",
          description:
            "紙漉きの前に行われる祈りは、山の水に手を合わせる所作。ものづくりは自然への感謝から始まるという姿勢が脈々と受け継がれています。",
        },
        {
          title: "紙の見本市『PAPER LAB』",
          description:
            "全国のクリエイターと共に、和紙の新たな用途を探る実験プロジェクト。海外ブランドとの共同開発も進んでいます。",
        },
        {
          title: "里山の保全活動",
          description:
            "コウゾやミツマタを育てるための植林・下草刈りを地域全体で実施。里山の景観を守ることが紙づくりの継承に直結しています。",
        },
      ],
      timeline: [
        {
          period: "西暦1505",
          title: "紙祖神が里に鎮座",
          description:
            "奈良時代の紙作り伝承をもとに、紙祖神・川上御前を大瀧神社に祀り、地域ぐるみで紙づくりが発展。",
        },
        {
          period: "1890年代",
          title: "海外輸出の拡大",
          description:
            "越前奉書が欧米市場で評価され、里に製紙工場が設立。和紙が世界へ渡る契機となりました。",
        },
        {
          period: "2015年",
          title: "越前和紙の里リニューアル",
          description:
            "体験工房や資料館を含む複合施設が生まれ、観光と学びを両立する拠点として再始動。",
        },
      ],
    },
    workshops: [
      {
        title: "楮から漉く一日和紙づくり",
        description:
          "楮の皮はぎから紙漉き、乾燥までを職人と一緒に体験。完成した和紙は持ち帰り可能。",
        duration: "6時間（ランチ休憩含む）",
        capacity: "6名まで",
        reservation: "2週間前までにメールで要予約",
      },
      {
        title: "和紙と光のランプシェード制作",
        description:
          "透け感の異なる和紙を組み合わせ、灯りのデザインを学ぶワークショップ。夜のライトアップ見学付き。",
        duration: "3時間",
        capacity: "8名まで",
        reservation: "オンラインフォームから随時受付",
      },
    ],
    projects: [
      {
        title: "未来の卒業証書を和紙で",
        status: "進行中",
        description:
          "地域の高校生と協働し、循環素材で作る卒業証書の開発を進めています。回収・再生の仕組みも検討中。",
        partner: "福井県立武生高等学校",
      },
      {
        title: "和紙デジタルアーカイブ",
        status: "支援募集中",
        description:
          "職人の紙見本と語りを記録し、オンライン上で閲覧できるプラットフォームを構築。撮影・編集を担うサポーターを募集中。",
      },
    ],
    artisans: [
      {
        name: "山岸 彩乃",
        role: "紙漉き職人 / 越前奉書の継承者",
        bio: "地域で三代続く紙屋に生まれ、東京でデザインを学んだのち家業へ。伝統紙の質を守りながら、現代の書家とのコラボレーションを行う。",
        specialty: "紙質調整と水流管理",
      },
      {
        name: "吉岡 大志",
        role: "和紙照明作家",
        bio: "インダストリアルデザイン出身。和紙の透過率を生かした照明ブランドを展開し、ホテルや旅館の特注照明を手掛ける。",
        specialty: "和紙と竹の複合加工",
      },
    ],
    visiting: {
      bestSeason: "春から初夏（里山の新緑と川祭り）",
      travelTips: [
        "毎月23日の朝に行われる紙祖神への朝拝は見学可能。静かな祈りの時間を尊重して参加を。",
        "漉き場は冬場冷えるため、足元が濡れても良い防寒具の持参がおすすめです。",
      ],
      access: "JR福井駅より越前鉄道・バスで約45分。越前和紙の里バス停下車徒歩5分。",
    },
    support: {
      website: "https://echizenwashi.jp",
      instagram: "https://www.instagram.com/echizenwashi_official",
      contactEmail: "info@echizenwashi.jp",
      note: "職人への取材・撮影は事前連絡をお願いします。",
    },
  },
  {
    slug: "takaoka-douki",
    name: "高岡銅器",
    region: "富山県高岡市",
    description:
      "鋳造の町として発展した高岡。仏具から現代アートまで、多彩な鋳物職人が活躍している。",
    highlight: "銅を溶かし、型に流し込むライブデモンストレーションを開催。",
    themeColor: "from-amber-500/10 to-amber-500/20",
    hero: {
      tagline: "炎と金属が織りなす、まちぐるみの鋳物文化。",
      narrative:
        "400年以上続く鋳造の歴史を背景に、高岡は“ものづくりのまち”として進化を続けています。仏具や茶道具で培った技術は、今や建築金物やアートワークに広がり、若手とベテランが協働する新しい工房が次々と生まれています。",
      keywords: ["鋳造", "協業ネットワーク", "まちづくり"],
      stats: [
        {
          label: "創業年",
          value: "1609年",
          note: "加賀藩二代藩主 前田利長の町立て",
        },
        {
          label: "事業所数",
          value: "約200社",
          note: "高岡地域地場産業センター調べ",
        },
        {
          label: "主な製品",
          value: "仏具・茶道具・クラフトオブジェ",
        },
      ],
    },
    story: {
      title: "鋳物職人の手がつなぐ古今東西",
      highlights: [
        {
          title: "路地に点在する協業工場",
          description:
            "型づくり、鋳造、仕上げ、着色。専門ごとに工房が連携することで、多様なオーダーに柔軟に応えられる仕組みが整っています。",
        },
        {
          title: "クラフトとアートの越境",
          description:
            "世界のデザイナーとコラボしたプロダクトラインが次々と発表。ミラノ・デザインウィークでも注目を集めています。",
        },
        {
          title: "まち歩きと鋳物体験",
          description:
            "旧町家を改修した拠点『高岡鋳物発祥の地・金屋町』では、鋳物の歴史展示と体験をセットで楽しめます。",
        },
      ],
      timeline: [
        {
          period: "江戸時代",
          title: "加賀藩の殖産興業",
          description:
            "前田利長が砲術と仏具製造のために鋳物師を招き、金屋町に工場が集積。",
        },
        {
          period: "1970年代",
          title: "鋳造デザインの革新期",
          description:
            "着色技法の研究が進み、銅器の色彩表現が飛躍。美術工芸の分野でも評価が高まる。",
        },
        {
          period: "2012年",
          title: "クラフトツーリズムの推進",
          description:
            "高岡市が工房見学やワークショップを体系化し、産地ツーリズムのモデルケースに。",
        },
      ],
    },
    workshops: [
      {
        title: "砂型づくりと小物鋳造体験",
        description:
          "職人と一緒に木型から砂型を組み、オリジナルの文鎮や風鈴を鋳造。磨き上げまでサポートします。",
        duration: "4時間",
        capacity: "10名まで",
        reservation: "公式サイトから1週間前までに予約",
      },
      {
        title: "着色仕上げマスタークラス",
        description:
          "銅器特有の色彩表現を学ぶ少人数講座。薬品調合から火入れまでを体験し、自分だけのカラーパターンを作成。",
        duration: "2時間30分",
        capacity: "4名まで",
        reservation: "職人のスケジュールに合わせて随時調整",
      },
    ],
    projects: [
      {
        title: "銅と都市のランドスケープ計画",
        status: "進行中",
        description:
          "高岡駅周辺の公共空間に銅板を使ったサインやベンチを設置し、歴史と現代のデザインを融合させるプロジェクト。",
        partner: "高岡市都市整備課",
      },
      {
        title: "メタルリサイクル実験室",
        status: "共創パートナー募集中",
        description:
          "廃材を再鋳造する循環ラインを構築するため、素材提供企業や研究者との連携を模索中。",
      },
    ],
    artisans: [
      {
        name: "石倉 俊也",
        role: "鋳物師 / 型づくり職人",
        bio: "職人歴30年。伝統的な木型からデジタルモデリングまで幅広い技術を使い分け、難易度の高い注文を支える。",
        specialty: "大型仏具の砂型設計",
      },
      {
        name: "小林 みのり",
        role: "着色師 / 銅器仕上げ",
        bio: "化学メーカー勤務を経てUターン。薬品の知見を生かした独自の着色レシピで、国内外のデザイナーと協業。",
        specialty: "青銅の発色コントロール",
      },
    ],
    visiting: {
      bestSeason: "秋（銅器祭・気候が穏やかな季節）",
      travelTips: [
        "工房は高温になるため、夏季は午前中の見学が快適です。",
        "金屋町の石畳は滑りやすいので、歩きやすい靴での来訪がおすすめ。",
      ],
      access: "あいの風とやま鉄道 高岡駅より徒歩15分。城端線『越中中川駅』からも徒歩圏。",
    },
    support: {
      website: "https://takaoka-douki.jp",
      instagram: "https://www.instagram.com/takaoka_douki",
      note: "金属の粉が舞うため、未就学児の体験参加は安全上お断りしています。",
    },
  },
  {
    slug: "kurume-gasuri",
    name: "久留米絣",
    region: "福岡県久留米市",
    description:
      "木綿の素朴な風合いと、かすり模様が魅力の久留米絣。民藝の精神が息づく産地。",
    highlight: "職人と一緒に織機を体験し、オリジナルストールを仕立てるワークショップ。",
    themeColor: "from-sky-500/10 to-sky-500/20",
    hero: {
      tagline: "糸と人が織りなす、生活に寄り添う布づくり。",
      narrative:
        "藍染めの糸を括り、模様を描く久留米絣。延べ30以上の工程を担う職人たちが、暮らしに寄り添う衣服と布を生み出しています。地域の暮らしや祭りとも密接に結びついた産地です。",
      keywords: ["藍染", "括り模様", "暮らしの布"],
      stats: [
        {
          label: "誕生",
          value: "江戸後期",
          note: "井上伝が考案した括り染織から発展",
        },
        {
          label: "職人チーム",
          value: "染・括り・織で計21工房",
        },
        {
          label: "主な製品",
          value: "着物地・日常着・インテリアファブリック",
        },
      ],
    },
    story: {
      title: "藍の香りが満ちる路地から",
      highlights: [
        {
          title: "括り職人の手仕事",
          description:
            "図案に合わせて糸を括り、染料を弾くことで模様を描く。一本の糸に込められる手間が、やわらかな柄を生み出します。",
        },
        {
          title: "若手織師のシェア工房",
          description:
            "空き家を改修した工房に織機を持ち込み、時間で使い分ける新しい働き方が広がっています。",
        },
        {
          title: "藍のある暮らしを提案",
          description:
            "日常着ブランドやホテル向けインテリアなど、生活に溶け込むプロダクトが増えています。",
        },
      ],
      timeline: [
        {
          period: "1788年頃",
          title: "井上伝が括りを発明",
          description:
            "藍染めの技法を応用し、糸を括ることで模様を生み出す技術が確立。",
        },
        {
          period: "1957年",
          title: "国の重要無形文化財に指定",
          description:
            "工程ごとに職人が分業する体制と、伝統的な藍染めが評価され保存へ。",
        },
        {
          period: "2018年",
          title: "国際見本市へ出展",
          description:
            "ファッションとインテリアの合同展示で海外バイヤーとの取引がスタート。",
        },
      ],
    },
    workshops: [
      {
        title: "藍染の括り体験とストール制作",
        description:
          "下絵を描き、糸を括って藍に染める工程を体験。完成した糸でストールを織り上げます。",
        duration: "2日間（各4時間）",
        capacity: "5名まで",
        reservation: "1ヶ月前までに公式フォームで申込",
      },
      {
        title: "織機オープンラボ",
        description:
          "織機の基本操作を学びながら、テーブルランナーを制作する短期講座。初心者歓迎。",
        duration: "3時間",
        capacity: "6名まで",
        reservation: "開催日の3日前まで受付",
      },
    ],
    projects: [
      {
        title: "久留米町家の暮らし提案",
        status: "進行中",
        description:
          "古民家を改修し、久留米絣の家具やファブリックでコーディネートした宿泊施設をオープン予定。",
        partner: "久留米まち旅協議会",
      },
      {
        title: "藍畑の再生プログラム",
        status: "ボランティア募集中",
        description:
          "耕作放棄地を活用した藍の栽培プロジェクト。植付け・収穫を地域と来訪者で協働します。",
      },
    ],
    artisans: [
      {
        name: "林 まどか",
        role: "括り職人",
        bio: "染織工科を卒業後、祖母の工房を継ぐ。模様のにじみを生かした現代的な図案づくりに挑戦している。",
        specialty: "立体的な括り模様",
      },
      {
        name: "大原 啓介",
        role: "織師 / プロダクトデザイナー",
        bio: "家具メーカーでの勤務経験を活かし、インテリア向けのテキスタイル開発を行う。海外展示会での受賞歴あり。",
        specialty: "藍の濃淡を活かしたグラデーション織",
      },
    ],
    visiting: {
      bestSeason: "初夏〜秋（藍の刈り取り・天日干しの季節）",
      travelTips: [
        "藍染体験は手が染まるため、使い捨て手袋とタオルの持参がおすすめ。",
        "路地が入り組んでいるので、時間に余裕をもって散策を。",
      ],
      access: "JR久留米駅からバスで15分。『草野駅』からレンタサイクルでのアクセスも人気。",
    },
    support: {
      website: "https://kurumegasuri.jp",
      instagram: "https://www.instagram.com/kurume_gasuri",
      contactEmail: "visit@kurumegasuri.jp",
    },
  },
]

export const craftAreaDetailMap = new Map(craftAreaDetails.map((area) => [area.slug, area]))

export function getCraftAreaDetail(slug: string) {
  return craftAreaDetailMap.get(slug)
}

export function listCraftAreaSlugs() {
  return craftAreaDetails.map((area) => area.slug)
}
