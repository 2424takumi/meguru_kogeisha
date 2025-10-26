import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <main className="flex flex-1 flex-col">
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Signup
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-neutral-900 sm:text-4xl">
              コミュニティ先行登録
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              公開前のベータ版に参加し、工芸コミュニティの発展を一緒に検証してくださるメンバーを募集しています。
              下記フォームを記入いただくと、招待が可能になり次第メールでご案内します。
            </p>
          </div>
        </section>

        <section className="bg-brand-50/40">
          <div className="mx-auto w-full max-w-2xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
            <form className="space-y-6 rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-neutral-800">
                  登録情報
                </legend>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold uppercase tracking-wide text-neutral-600"
                  >
                    お名前
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="例: 山田 太郎"
                    disabled
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-600 shadow-sm disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wide text-neutral-600"
                  >
                    メールアドレス
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    disabled
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-600 shadow-sm disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="interest"
                    className="block text-xs font-semibold uppercase tracking-wide text-neutral-600"
                  >
                    関心のあるテーマ
                  </label>
                  <textarea
                    id="interest"
                    name="interest"
                    rows={4}
                    placeholder="例: 越前和紙のオンライン見学会に参加したい"
                    disabled
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm text-neutral-600 shadow-sm disabled:cursor-not-allowed"
                  />
                </div>
              </fieldset>
              <button
                type="button"
                disabled
                className="w-full rounded-full bg-brand-300 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                先行登録は準備中です
              </button>
              <p className="text-xs leading-relaxed text-neutral-500">
                認証と会員機能は順次公開予定です。正式受付が始まりましたら、入力いただいた情報を守秘した上でご案内いたします。
              </p>
            </form>

            <div className="rounded-3xl border border-brand-100 bg-white p-6 text-sm leading-relaxed text-neutral-600 shadow-sm">
              <h2 className="text-base font-semibold text-neutral-900">
                プロジェクトに興味がある方へ
              </h2>
              <p className="mt-3">
                産地紹介の追加、イベント共催、取材の相談などは専用窓口で承っています。
                すぐに連絡したい場合はメールまたはお問い合わせフォームをご利用ください。
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <a
                  href="mailto:contact@meguru-kogeisha.jp"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                >
                  contact@meguru-kogeisha.jp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-400 hover:text-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                >
                  お問い合わせページへ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
