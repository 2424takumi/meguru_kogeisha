export default function AboutMeguruSection() {
  return (
    <section
      aria-labelledby="about-meguru-heading"
      className="mx-auto mt-6 w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">めぐる工芸舎について</p>
      <h2 id="about-meguru-heading" className="mt-4 text-3xl font-semibold text-neutral-900 sm:text-4xl">
        めぐる工芸舎の紹介
      </h2>
      <div className="mt-6 space-y-5 text-left text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
        <p>
          めぐる工芸舎は、全国の工芸に携わる人々の営みと、そこに惹かれる来訪者をつなぐオンラインプラットフォームです。
          取材記事や映像、イベント情報を一箇所に集約し、訪れた人が次のアクションを起こしやすくすることを目指しています。
        </p>
        <p>
          現地の職人・キュレーターと協力しながら、産地ごとの文化的背景や最新ニュースを整理して発信しています。
          将来的には、体験予約やクラウドファンディング、研究者のアーカイブとも連携し、工芸の持続可能な循環を支える仕組みを構築します。
        </p>
        <p>
          MVP
          では、まず「見る・知る」体験を充実させるべく、産地情報やストーリーを丁寧に編集しています。ご意見・ご提案はいつでも歓迎です。
        </p>
      </div>
    </section>
  )
}
