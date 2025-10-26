import SiteFooter from "@/components/layout/SiteFooter";

const pillars = [
  {
    title: "つなぐ",
    description:
      "産地で活動する職人やプロジェクトを可視化し、訪問したい人との接点を増やします。アクセス情報だけでなく、背景となる関係性も丁寧に紹介します。",
  },
  {
    title: "記録する",
    description:
      "工芸に関わる人々の声をアーカイブし、次世代に共有できる知の基盤をつくります。音声、写真、テキストを組み合わせた記録を整備中です。",
  },
  {
    title: "ひらく",
    description:
      "地域の取り組みをオープンにし、誰もが参加できる企画や学びの場をデザインします。オンライン／オフライン双方で連携の機会を広げます。",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <main className="flex flex-1 flex-col">
        <section className="border-b border-neutral-200 bg-brand-50/40">
          <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              About
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-neutral-900 sm:text-4xl">
              めぐる工芸舎について
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
              めぐる工芸舎は、日本各地の工芸コミュニティを可視化し、地域を横断した共感と実践の循環を生み出すことを目指すプロジェクトです。
              取材や編集、展示づくりを通じて、工芸を取り巻く人と場所を連ねる「デジタル・コモンズ」を構築しています。
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:gap-10 lg:px-8">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="flex flex-col rounded-3xl border border-brand-100 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-neutral-900">
                  {pillar.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-white py-12 sm:py-16">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                運営チームについて
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
                ONDO Project を中心に、リサーチャー、編集者、デザイナーが横断的に関わりながら、
                工芸に携わる方々の声を拾い上げています。将来的には、各地域のハブとなる活動者に運営を委ねるモデルを構築予定です。
              </p>
            </div>
            <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6 text-sm leading-relaxed text-brand-700">
              <p>
                2024年はプレローンチ期間として、掲載産地の拡充とユーザーテストを進めています。プロジェクトに参加したい方は
                <strong className="font-semibold text-brand-800"> contact@meguru-kogeisha.jp </strong>
                までご連絡ください。
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
