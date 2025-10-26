import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <main className="flex flex-1 flex-col">
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Login
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-neutral-900 sm:text-4xl">
              メンバーサインイン
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              コミュニティ機能は現在準備中です。立ち上げ前のテスト参加者には、メールにてログイン情報をご案内します。
            </p>
          </div>
        </section>

        <section className="bg-brand-50/40">
          <div className="mx-auto w-full max-w-md space-y-8 px-4 py-12 sm:px-6 lg:px-8">
            <form className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-neutral-800"
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
                  htmlFor="password"
                  className="block text-sm font-semibold text-neutral-800"
                >
                  パスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  disabled
                  className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-600 shadow-sm disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="button"
                disabled
                className="w-full rounded-full bg-brand-300 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                機能準備中
              </button>
              <p className="text-xs leading-relaxed text-neutral-500">
                認証基盤（Supabase）を導入次第、正式なログイン機能を提供します。公開時にお知らせを希望される場合は、以下のリンクから申し込みください。
              </p>
            </form>
            <div className="rounded-3xl border border-brand-100 bg-white p-6 text-sm leading-relaxed text-neutral-600 shadow-sm">
              <p>
                まだアカウントをお持ちでない方は、先行登録フォームから参加をリクエストできます。
              </p>
              <Link
                href="/signup"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
              >
                新規登録の案内を見る
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
