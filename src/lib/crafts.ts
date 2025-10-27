import craftsData from "@/data/traditional-crafts.json"
import prefecturesData from "@/data/prefectures.json"

export type Prefecture = {
  prefCode: string
  prefName: string
  prefNameEn: string
  region: string
}

export type Craft = {
  id: string
  name_ja: string
  name_en: string
  category: string
  prefCode: string
  prefName: string
  prefNameEn: string
  region: string
  tags?: string[]
}

export const prefectures: Prefecture[] = prefecturesData

export const crafts: Craft[] = craftsData

export type CraftFilters = {
  prefCode?: string | null
  category?: string | null
  search?: string | null
}

const normalizePrefCode = (prefCode?: string | null) => {
  if (!prefCode) {
    return null
  }
  return prefCode.padStart(2, "0")
}

export const countsByPref = (items: Craft[]) => {
  const base = Object.fromEntries(prefectures.map((pref) => [pref.prefCode, 0]))

  for (const craft of items) {
    const code = normalizePrefCode(craft.prefCode)
    if (!code) {
      continue
    }
    base[code] = (base[code] ?? 0) + 1
  }

  return base as Record<string, number>
}

const matchSearch = (craft: Craft, query: string) => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return true
  }
  return (
    craft.name_ja.toLowerCase().includes(normalized) ||
    craft.name_en.toLowerCase().includes(normalized)
  )
}

const matchCategory = (craft: Craft, category: string | null | undefined) => {
  if (!category || category === "all") {
    return true
  }
  return craft.category === category
}

const matchPrefecture = (craft: Craft, prefCode: string | null | undefined) => {
  if (!prefCode) {
    return true
  }
  const normalized = normalizePrefCode(prefCode)
  return craft.prefCode === normalized
}

export const filterCrafts = (items: Craft[], filters: CraftFilters) => {
  const { prefCode, category, search } = filters
  return items.filter(
    (craft) =>
      matchPrefecture(craft, prefCode) && matchCategory(craft, category) && (!search || matchSearch(craft, search)),
  )
}
