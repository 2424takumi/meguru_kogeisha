"use client"

import { useMemo } from "react"
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import type { Geometry, FeatureCollection } from "geojson"
import topology from "@/data/japan-prefectures.topojson"

type PrefectureProperties = {
  id: number | string
  nam?: string
  nam_ja?: string
}

type PrefectureShape = {
  prefCode: string
  name: string
  path: string
}

type PrefectureGeometry = {
  type: string
  properties?: PrefectureProperties
  [key: string]: unknown
}

type PrefectureGeometryCollection = {
  type: "GeometryCollection"
  geometries: PrefectureGeometry[]
  [key: string]: unknown
}

type PrefectureTopology = {
  type: "Topology"
  objects: Record<string, PrefectureGeometryCollection>
  [key: string]: unknown
}

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 700

const normalizePrefCode = (value: number | string | undefined) => {
  if (value == null) {
    return null
  }
  const asNumber = typeof value === "number" ? value : Number.parseInt(value, 10)
  if (Number.isNaN(asNumber)) {
    return null
  }
  return String(asNumber).padStart(2, "0")
}

const buildPrefectureShapes = (): PrefectureShape[] => {
  const topologyData = topology as PrefectureTopology
  const objectName = Object.keys(topologyData.objects)[0]
  const topologyObject = topologyData.objects[objectName]

  const collection = feature(
    topologyData as unknown as Parameters<typeof feature>[0],
    topologyObject as unknown as Parameters<typeof feature>[1],
  ) as FeatureCollection<Geometry, PrefectureProperties>

  const projection = geoMercator()
  projection.fitSize([VIEWBOX_WIDTH, VIEWBOX_HEIGHT], collection)
  const pathGenerator = geoPath(projection)

  return collection.features
    .map<PrefectureShape | null>((pref) => {
      const prefCode = normalizePrefCode(pref.properties?.id)
      if (!prefCode) {
        return null
      }
      const name = pref.properties?.nam_ja ?? pref.properties?.nam ?? `不明（${prefCode}）`
      const path = pathGenerator(pref)
      if (!path) {
        return null
      }
      return {
        prefCode,
        name,
        path,
      }
    })
    .filter((shape): shape is PrefectureShape => Boolean(shape))
    .sort((a, b) => a.prefCode.localeCompare(b.prefCode))
}

const PREFECTURE_SHAPES = buildPrefectureShapes()

type JapanMapProps = {
  selectedPrefCode?: string | null
  countsByPrefCode?: Record<string, number>
  onSelect?: (prefCode: string) => void
}

export function JapanMap({ selectedPrefCode, countsByPrefCode, onSelect }: JapanMapProps) {
  const shapes = useMemo(() => PREFECTURE_SHAPES, [])

  return (
    <figure className="relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white shadow-sm">
      <svg
        role="img"
        aria-label="日本地図"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="h-auto w-full"
      >
        <title>日本地図</title>
        <desc>各都道府県をクリックまたはキーボードで選択できます。</desc>
        <g>
          {shapes.map((shape) => {
            const isSelected = selectedPrefCode === shape.prefCode
            const count = countsByPrefCode?.[shape.prefCode] ?? 0
            const hasCrafts = count > 0
            const label = `${shape.name}${hasCrafts ? `：${count}件` : ""}`

            return (
              <path
                key={shape.prefCode}
                d={shape.path}
                role="button"
                tabIndex={0}
                aria-label={label}
                aria-pressed={isSelected}
                data-pref-code={shape.prefCode}
                data-has-crafts={hasCrafts ? "true" : "false"}
                className={[
                  "cursor-pointer stroke-white stroke-[0.6] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
                  isSelected
                    ? "fill-brand-500"
                    : hasCrafts
                      ? "fill-brand-200 hover:fill-brand-300"
                      : "fill-neutral-200 hover:fill-brand-100",
                ].join(" ")}
                onClick={() => onSelect?.(shape.prefCode)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onSelect?.(shape.prefCode)
                  }
                }}
              >
                <title>{label}</title>
              </path>
            )
          })}
        </g>
      </svg>
    </figure>
  )
}

export default JapanMap
