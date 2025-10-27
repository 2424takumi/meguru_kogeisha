"use client"

import { useId } from "react"
import type { Craft } from "@/lib/crafts"

type CraftListProps = {
  crafts: Craft[]
  categories: string[]
  search: string
  selectedCategory: string
  totalCount: number
  selectedPrefLabel?: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

export function CraftList({
  crafts,
  categories,
  search,
  selectedCategory,
  totalCount,
  selectedPrefLabel,
  onSearchChange,
  onCategoryChange,
}: CraftListProps) {
  const searchId = useId()
  const categoryId = useId()

  const visibleCount = crafts.length
  const countLabel =
    selectedPrefLabel != null && selectedPrefLabel.length > 0
      ? `${selectedPrefLabel}：${visibleCount}品目`
      : `全国：${visibleCount}品目（全${totalCount}品目）`

  return (
    <section
      aria-label="工芸品の検索結果"
      className="flex h-full flex-col gap-6 rounded-3xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-7"
    >
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Crafts</p>
        <h2 className="text-2xl font-semibold text-neutral-900">産地の工芸品一覧</h2>
        <p className="text-sm text-neutral-500">{countLabel}</p>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={searchId} className="block text-sm font-medium text-neutral-700">
            キーワードで検索
          </label>
          <input
            id={searchId}
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="例：和紙 / WASHI"
            className="mt-1 w-full rounded-2xl border border-neutral-200/80 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
        </div>

        <div className="w-full sm:w-56">
          <label htmlFor={categoryId} className="block text-sm font-medium text-neutral-700">
            カテゴリで絞り込む
          </label>
          <select
            id={categoryId}
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200/80 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          >
            <option value="all">すべてのカテゴリ</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {crafts.length === 0 ? (
        <div
          role="status"
          className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/60 p-8 text-center text-sm text-neutral-500"
        >
          <p>該当する工芸品が見つかりませんでした。</p>
          <p className="mt-1">検索語やカテゴリを変更して、再度お試しください。</p>
        </div>
      ) : (
        <ul className="flex-1 space-y-4 overflow-y-auto pr-1">
          {crafts.map((craft) => (
            <li
              key={craft.id}
              className="rounded-2xl border border-neutral-200/80 bg-white px-5 py-4 shadow-sm transition hover:border-brand-400/40 hover:shadow-brand-200/40 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand-500"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">
                    {craft.prefName}
                  </p>
                  <h3 className="text-xl font-semibold text-neutral-900">{craft.name_ja}</h3>
                  <p className="text-sm text-neutral-500">{craft.name_en}</p>
                </div>
                <span className="inline-flex shrink-0 items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  {craft.category}
                </span>
              </div>
              {craft.tags?.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {craft.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default CraftList
