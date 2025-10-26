import AreaGrid from "@/components/home/AreaGrid";
import SiteFooter from "@/components/layout/SiteFooter";
import { craftAreas } from "@/data/home";
import Link from "next/link";

export default function AreasPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <main className="flex flex-1 flex-col">
        <section className="border-b border-neutral-200 bg-brand-50/40">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-16 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                Areas
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-neutral-900 sm:text-4xl">
                産地をめぐる
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                越前和紙から東京和楽器まで、日本各地の工芸が生まれる土地を取材し、職人や工房との関係性を記録しています。
                気になるカードを選んで、ストーリーや訪問のヒントに触れてください。
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 text-sm text-neutral-600 sm:flex-row sm:items-center">
              <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
                現在 {craftAreas.length} 産地を掲載
              </span>
              <Link
                href="/areas/register"
                className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
              >
                産地情報を登録する
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <AreaGrid areas={craftAreas} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
