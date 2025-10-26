# JapanCraftBrowser Component Specification

## Overview
- **Goal**: Provide an interactive browser that helps users explore traditional Japanese craft industries by prefecture.
- **Scope**: Client-side MVP component for `/areas` page within Meguru Kogeisha (Next.js 15 + React 19 + Tailwind CSS 4).
- **Primary data sources**:  
  - Japan Traditional Craft Products Association list (243 designated crafts, 2024-10-17).  
  - METI overview on Traditional Craft Products (243 designated).  
  - Open prefecture GeoJSON (e.g., SmartNews SMRI repository) for map geometry.

## Functional Requirements
- **Map Navigation**
  - SVG or canvas map segmented per prefecture (JIS codes `"01"`–`"47"`).
  - Hover state: subtle brand color; tooltip shows prefecture name + craft count.
  - Selection state: highlighted color; triggers craft list update.
  - Layout: desktop shows map left/list right; mobile stacks vertically (or tabbed).
  - Keyboard support: arrow navigation, `Enter` to select.
- **Craft List & Search**
  - Display crafts for the selected prefecture with Japanese name, optional English name, category, tags.
  - Free-text search (partial match on Japanese/English names; kana normalization deferred).
  - Category filters (e.g., `陶磁器`, `染織`, `木工`, `金工`, `漆器`, `和紙`, `仏壇・仏具`, `石工`, `革`, `人形`, `その他`).
  - Show total counts (e.g., `全国：243品目`, `東京都：7品目`).
- **Accessibility**
  - `<svg role="img" aria-label="日本地図">` with `<title>` / `<desc>`.
  - Each prefecture path includes `aria-label` and is keyboard reachable.
  - Ensure focus states are visible and screen readers announce prefecture names.
- **Performance**
  - Prefecture geometry served as lightweight TopoJSON (preprocessed, gzipped).
  - Craft data loaded as minimal JSON and segmented or indexed by prefecture.
  - Target Lighthouse ≥ 90 for Performance, Accessibility, Best Practices, SEO.

## Non-Functional Requirements
- Stack: Next.js 15 (App Router), React 19, Tailwind CSS 4, TypeScript, pnpm.
- MVP operates fully on the client; future Supabase integration planned.
- Respect data licensing: redistribute only factual fields (name, prefecture, category).

## Data Model
- `src/data/traditional_crafts.json`
  ```json
  [
    {
      "id": "aizu-nuri",
      "name_ja": "会津塗",
      "name_en": "Aizu Lacquerware",
      "category": "漆器",
      "prefCode": "07",
      "prefName": "福島県",
      "region": "東北"
    }
  ]
  ```
  - Use JIS prefecture codes.
  - Start with sample 10 entries; expand to all 243 crafts later.
- `src/data/prefectures.json`
  ```json
  [
    { "prefCode": "01", "prefName": "北海道", "region": "北海道・東北" }
  ]
  ```
  - Define all 47 prefectures.
- `src/data/japan-prefectures.topojson`
  - Prefecture polygons; optionally generated from public GeoJSON.

## Component Structure
```
src/components/areas/
├─ JapanMap.tsx              // client map component
├─ CraftList.tsx             // search, filters, list
├─ PrefectureLegend.tsx      // optional legend
└─ JapanCraftBrowser.tsx     // composition & state
```
- `JapanCraftBrowser.tsx`
  - `"use client"`; manages `selectedPrefCode`, `search`, `category`.
  - Uses `countsByPref` and `filterCrafts` utilities.
- `JapanMap.tsx`
  - Props: `selectedPrefCode`, `onSelect`, `countsByPrefCode`.
  - Emits `onSelect(prefCode)` on interaction.
- `CraftList.tsx`
  - Props: filtered craft array plus search/filter callbacks.
  - Renders counts, empty states, category badges.

## Utilities (`src/lib/crafts.ts`)
- `loadCrafts()` (optional) to read JSON.
- `countsByPref(crafts)` → `{ [prefCode]: number }`.
- `filterCrafts(crafts, { prefCode, search, category })` to combine filters (AND logic).

## Acceptance Criteria
- Prefecture selection works via mouse/touch/keyboard and updates list.
- Craft counts match between map tooltip, list heading, and dataset.
- Search filters by Japanese/English names (case-insensitive).
- Category filter applies jointly with prefecture and search filters.
- Responsive layout switches to vertical stacking on small viewports.
- Screen readers announce prefecture names while navigating the map.
- Initial load shows LCP < 2.5s (lazy-load geometry if necessary).

## Implementation Roadmap
1. **Data Setup**
   - Populate sample crafts and full prefecture roster.
   - Implement utility helpers in `src/lib/crafts.ts`.
2. **Map MVP**
   - Add TopoJSON asset and render SVG paths with interaction states.
3. **List & Search**
   - Build search input, category select, empty-state handling.
4. **Integration**
   - Compose in `JapanCraftBrowser.tsx`; add `/areas` route.
5. **Accessibility & Tests**
   - Confirm ARIA roles/labels and keyboard navigation.
   - Create tests for utility logic and map interaction.

## Future Enhancements
- Replace local JSON with Supabase tables (`crafts`, `prefectures`).
- Add craft detail pages with imagery and external links.
- Introduce heatmap shading based on craft density.
- Support multilingual UI (Japanese/English toggle).
- Implement kana/romaji search normalization.

## References
- Japan Traditional Craft Products Association: latest designated craft list (243 items, 2024-10-17).
- METI: Traditional Craft Products overview (243 designated).
- Prefecture GeoJSON sources (e.g., SmartNews SMRI Geo repository).
