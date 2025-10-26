export default function AboutMeguruSection() {
  return (
    <section
      aria-labelledby="about-meguru-heading"
      className="mx-auto w-full max-w-[60rem] px-4 sm:px-6 lg:px-8"
    >
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-[--brand-600] text-center">
        めぐる工芸舎について
      </p>
      <h2
        id="about-meguru-heading"
        className="mt-6 text-center font-serif text-[2.25rem] font-semibold text-[--neu-900] sm:text-[2.5rem]"
      >
        文化の生態系をめぐるためのデジタル・コモンズ
      </h2>
      <div className="mt-8 space-y-6 rounded-[6px] border border-[--neu-200] bg-white/90 p-8 text-base leading-8 text-[--neu-700] sm:text-lg">
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
