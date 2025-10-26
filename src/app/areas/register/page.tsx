import Link from "next/link"
import type { Metadata } from "next"

import SiteFooter from "@/components/layout/SiteFooter"

export const metadata: Metadata = {
  title: "産地・工房の登録 | めぐる工芸舎",
  description:
    "めぐる工芸舎に掲載したい産地や工房、コミュニティの情報をお寄せください。登録の流れと必要な項目をご案内します。",
}

export default function AreaRegisterPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main className="flex flex-col gap-6 pb-12">
        <section className="bg-white">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <nav className="text-xs font-medium text-neutral-600 sm:text-sm">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="transition hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    ホーム
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/areas"
                    className="transition hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                  >
                    産地を探す
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-neutral-900">産地・工房の登録</li>
              </ol>
            </nav>
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">JOIN</p>
              <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
                あなたの地域の工房やコミュニティを紹介しませんか？
              </h1>
              <p className="text-sm leading-6 text-neutral-600 sm:text-base">
                めぐる工芸舎では、日本各地で活動する工房・プロジェクト・市民チームの参加を歓迎しています。
                下記のフォームから基本情報を送信いただくと、編集チームがヒアリングを行い、掲載に向けてフォローアップします。
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="area-register-steps-heading"
          className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8"
        >
          <div className="space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">FLOW</p>
              <h2 id="area-register-steps-heading" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                登録の流れ
              </h2>
              <p className="text-sm leading-6 text-neutral-600 sm:text-base">
                フォームの送信から掲載までのステップです。オンライン面談や現地取材は状況に応じて調整します。
              </p>
            </div>
            <ol className="space-y-5 text-sm text-neutral-600 sm:text-base">
              <li className="rounded-2xl bg-neutral-50 p-4 shadow-sm">
                <p className="text-sm font-semibold text-neutral-900">1. フォームから基本情報を送信</p>
                <p className="mt-2 leading-6">
                  産地・工房名、活動エリア、連絡先、紹介文、掲載希望の写真や資料があれば添付してください。
                </p>
              </li>
              <li className="rounded-2xl bg-neutral-50 p-4 shadow-sm">
                <p className="text-sm font-semibold text-neutral-900">2. 編集チームによるヒアリング</p>
                <p className="mt-2 leading-6">
                  いただいた情報をもとに、オンラインまたは現地で追加インタビューを実施し、掲載内容を整えます。
                </p>
              </li>
              <li className="rounded-2xl bg-neutral-50 p-4 shadow-sm">
                <p className="text-sm font-semibold text-neutral-900">3. 掲載内容の確認・公開</p>
                <p className="mt-2 leading-6">
                  原稿のプレビューを共有し、最終確認後にサイトへ公開。公開後も更新依頼を受け付けます。
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="area-register-form-heading"
          className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8"
        >
          <div className="space-y-6 rounded-3xl border border-brand-200/70 bg-white p-6 shadow-md shadow-brand-500/10 sm:p-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">FORM</p>
              <h2 id="area-register-form-heading" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                登録フォームへ進む
              </h2>
              <p className="text-sm leading-6 text-neutral-600 sm:text-base">
                Googleフォームを使用しています。必要事項の入力後、記載していただいた連絡先に折り返しご連絡します。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://forms.gle/placeholder"
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
              >
                登録フォームを開く
              </Link>
              <Link
                href="mailto:hello@meguru-kogeisha.jp"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-brand-500/60 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:border-brand-500 hover:text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
              >
                メールで相談する
              </Link>
            </div>
            <p className="text-xs leading-5 text-neutral-500">
              ※ 現地取材や写真撮影が難しい場合は、既存の資料やオンライン取材で対応することも可能です。
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
