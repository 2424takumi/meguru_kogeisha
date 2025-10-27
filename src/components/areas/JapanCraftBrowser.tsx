"use client"

import { useMemo, useState } from "react"
import CraftList from "./CraftList"
import JapanMap from "./JapanMap"
import { crafts, countsByPref, filterCrafts, prefectures } from "@/lib/crafts"

const CATEGORY_ORDER = [
  "陶磁器",
  "染織",
  "木工",
  "金工",
  "漆器",
  "和紙",
  "仏壇・仏具",
  "人形",
  "その他",
]

const baseCounts = countsByPref(crafts)

const categories = (() => {
  const unique = new Set(crafts.map((craft) => craft.category))
  const ordered = CATEGORY_ORDER.filter((category) => unique.has(category))
  for (const category of unique) {
    if (!ordered.includes(category)) {
      ordered.push(category)
    }
  }
  return ordered
})()

export default function JapanCraftBrowser() {
  const [selectedPrefCode, setSelectedPrefCode] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")

  const filteredCrafts = useMemo(
    () =>
      filterCrafts(crafts, {
        prefCode: selectedPrefCode,
        category,
        search,
      }),
    [selectedPrefCode, category, search],
  )

  const selectedPrefecture = useMemo(
    () => prefectures.find((pref) => pref.prefCode === selectedPrefCode) ?? null,
    [selectedPrefCode],
  )

  const handleSelectPrefecture = (prefCode: string) => {
    setSelectedPrefCode((current) => (current === prefCode ? null : prefCode))
  }

  return (
    <section
      aria-label="日本地図から工芸品を探す"
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div className="lg:sticky lg:top-24">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Map Browser</p>
            <h2 className="mt-3 text-3xl font-semibold text-neutral-900 sm:text-[2.2rem] sm:leading-[1.1]">
              都道府県から工芸品をめぐる
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              地図上の都道府県を選ぶと、指定伝統的工芸品の一覧が右側に表示されます。カテゴリやキーワードでさらに絞り込みできます。
            </p>
          </div>

          <div className="mt-6 lg:mt-10">
            <JapanMap
              selectedPrefCode={selectedPrefCode}
              countsByPrefCode={baseCounts}
              onSelect={handleSelectPrefecture}
            />
          </div>
        </div>

        <CraftList
          crafts={filteredCrafts}
          categories={categories}
          search={search}
          selectedCategory={category}
          totalCount={crafts.length}
          selectedPrefLabel={selectedPrefecture?.prefName}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
        />
      </div>
    </section>
  )
}
