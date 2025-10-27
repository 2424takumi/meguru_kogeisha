import "server-only";

import rawCrafts from "@/data/traditional_crafts.json";

export type Craft = {
  id: string;
  name_ja: string;
  name_en?: string;
  category: string;
  prefCode: string;
  prefName: string;
  region: string;
};

export type CraftFilterOptions = {
  prefCode?: string;
  search?: string;
  category?: string;
};

const craftsCache: Craft[] = (rawCrafts as Craft[]).map((craft) => ({
  ...craft,
}));

export function loadCrafts(): Craft[] {
  return craftsCache.map((craft) => ({ ...craft }));
}

export function filterCrafts(
  filters: CraftFilterOptions,
  source: readonly Craft[] = craftsCache,
): Craft[] {
  const { prefCode, category } = filters;
  const normalizedSearch = filters.search?.trim().toLowerCase();

  return source
    .filter((craft) => {
      if (prefCode && craft.prefCode !== prefCode) {
        return false;
      }

      if (category && craft.category !== category) {
        return false;
      }

      if (normalizedSearch) {
        const haystack = `${craft.name_ja}${craft.name_en ?? ""}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }

      return true;
    })
    .map((craft) => ({ ...craft }));
}

export function countsByPref(source: readonly Craft[] = craftsCache): Record<string, number> {
  return source.reduce<Record<string, number>>((acc, craft) => {
    acc[craft.prefCode] = (acc[craft.prefCode] ?? 0) + 1;
    return acc;
  }, {});
}
