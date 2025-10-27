import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import JapanMap from "../JapanMap"
import { countsByPref, crafts } from "@/lib/crafts"

describe("JapanMap", () => {
  it("calls onSelect when a prefecture is clicked", () => {
    const handleSelect = vi.fn()
    render(
      <JapanMap
        selectedPrefCode={null}
        countsByPrefCode={countsByPref(crafts)}
        onSelect={handleSelect}
      />,
    )

    const kyoto = screen.getByRole("button", { name: /京都府/ })
    fireEvent.click(kyoto)

    expect(handleSelect).toHaveBeenCalledWith("26")
  })
})
