import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";

const upcomingTopics = [
  {
    title: "越前和紙を受け継ぐ若手職人たち",
    area: "福井県越前市",
    description:
      "手漉き和紙の未来を見据え、素材の調達から製品開発までを担う職人の連携を追いかける連載を準備中です。",
  },
  {
    title: "高岡銅器の工房周遊記",
    area: "富山県高岡市",
    description:
      "鋳物のまちを訪ね歩き、仏具からインテリアまで広がる「共同制作」の現場を取材しています。",
  },
  {
    title: "邦楽器の素材転換に向き合う",
    area: "東京都荒川区",
    description:
      "三味線職人と演奏家の対話を記録し、環境変化とどう向き合うのか、意見が交錯する様子をまとめています。",
  },
];

export default function StoriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <main className="flex flex-1 flex-col">
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Stories
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-neutral-900 sm:text-4xl">
              工芸にまつわるストーリー
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
              各産地の営みを記録し、職人や研究者、訪れる人の視点をまとめた記事を公開していきます。
              現在は編集作業中のため、下記のテーマを先行してお知らせしています。
            </p>
          </div>
        </section>

        <section className="bg-brand-50/40 py-12 sm:py-16">
          <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:gap-10 lg:px-8">
            {upcomingTopics.map((topic) => (
              <article
                key={topic.title}
                className="flex h-full flex-col rounded-3xl border border-brand-100 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                  予告
                </p>
                <h2 className="mt-3 text-xl font-semibold text-neutral-900">
                  {topic.title}
                </h2>
                <p className="mt-2 inline-flex w-fit items-center rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  {topic.area}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {topic.description}
                </p>
                <p className="mt-auto pt-6 text-sm text-neutral-500">
                  公開は2024年夏ごろを予定しています。
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-neutral-200 py-12 sm:py-16">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                取材に参加したい方へ
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                ストーリー制作に協力いただける職人や、地域メディア・研究者の皆さまからのご連絡をお待ちしています。
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
            >
              取材の相談をする
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
