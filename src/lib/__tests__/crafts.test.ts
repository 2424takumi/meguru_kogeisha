import { describe, expect, it } from "vitest"
import { countsByPref, filterCrafts, crafts } from "@/lib/crafts"

describe("countsByPref", () => {
  it("returns the number of crafts per prefecture", () => {
    const counts = countsByPref(crafts)

    expect(counts["07"]).toBe(1) // 福島県（会津塗）
    expect(counts["26"]).toBe(2) // 京都府（西陣織・京仏壇）
    expect(counts["40"]).toBe(1) // 福岡県（博多織）
    expect(counts["01"]).toBe(0) // 北海道はサンプル未登録
  })
})

describe("filterCrafts", () => {
  it("filters by prefecture and category", () => {
    const results = filterCrafts(crafts, {
      prefCode: "26",
      category: "染織",
    })

    expect(results).toHaveLength(1)
    expect(results[0].name_ja).toBe("西陣織")
  })

  it("filters by search query across Japanese and English names", () => {
    const results = filterCrafts(crafts, {
      search: "glass",
    })

    const ids = results.map((craft) => craft.id)
    expect(ids).toContain("edo-kiriko")
    expect(ids).toContain("okinawa-ryukyu-glass")
    expect(results.every((craft) => craft.name_en.toLowerCase().includes("glass"))).toBe(true)
  })

  it("combines filters together", () => {
    const results = filterCrafts(crafts, {
      prefCode: "16",
      category: "金工",
      search: "takaoka",
    })

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe("takaoka-douki")
  })
})
