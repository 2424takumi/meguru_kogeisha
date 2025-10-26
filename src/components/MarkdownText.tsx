import type { ReactNode } from "react"

type MarkdownTextProps = {
  content: string
  variant?: "default" | "muted"
  className?: string
}

const baseVariantClasses: Record<Required<MarkdownTextProps>["variant"], string> = {
  default: "text-sm leading-6 text-neutral-600 sm:text-base",
  muted: "text-sm leading-6 text-neutral-500 sm:text-base",
}

function mergeClasses(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function MarkdownText({ content, variant = "default", className }: MarkdownTextProps) {
  const trimmedContent = content.trim()

  if (!trimmedContent) {
    return null
  }

  const baseTextClass = baseVariantClasses[variant]
  const blocks = parseBlocks(trimmedContent)

  return (
    <div className={mergeClasses("space-y-2", className)}>
      {blocks.map((block, index) => (
        <MarkdownBlock key={index} block={block} baseTextClass={baseTextClass} />
      ))}
    </div>
  )
}

type MarkdownBlock =
  | { type: "paragraph"; lines: string[] }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }

function parseBlocks(content: string): MarkdownBlock[] {
  return content.split(/\r?\n\r?\n+/).reduce<MarkdownBlock[]>((acc, rawBlock) => {
    const block = rawBlock.trim()
    if (!block) {
      return acc
    }

    const lines = block.split(/\r?\n/).map((line) => line.trim())
    const isUnorderedList = lines.every((line) => /^[-*+]\s+/.test(line))
    if (isUnorderedList) {
      acc.push({
        type: "unordered-list",
        items: lines.map((line) => line.replace(/^[-*+]\s+/, "").trim()),
      })
      return acc
    }

    const isOrderedList = lines.every((line) => /^\d+[.)]\s+/.test(line))
    if (isOrderedList) {
      acc.push({
        type: "ordered-list",
        items: lines.map((line) => line.replace(/^\d+[.)]\s+/, "").trim()),
      })
      return acc
    }

    acc.push({
      type: "paragraph",
      lines,
    })
    return acc
  }, [])
}

function MarkdownBlock({
  block,
  baseTextClass,
}: {
  block: MarkdownBlock
  baseTextClass: string
}) {
  if (block.type === "paragraph") {
    return (
      <p className={baseTextClass}>
        {block.lines.map((line, index) => (
          <InlineText key={index} text={line} addLineBreak={index < block.lines.length - 1} />
        ))}
      </p>
    )
  }

  const listClassName = mergeClasses(
    block.type === "unordered-list" ? "ml-4 list-disc space-y-1" : "ml-4 list-decimal space-y-1",
    baseTextClass,
  )
  const ListTag = block.type === "unordered-list" ? "ul" : "ol"

  return (
    <ListTag className={listClassName}>
      {block.items.map((item, index) => (
        <li key={index} className={baseTextClass}>
          <InlineText text={item} />
        </li>
      ))}
    </ListTag>
  )
}

function InlineText({ text, addLineBreak = false }: { text: string; addLineBreak?: boolean }) {
  const content = applyInlineFormatting(text)

  return (
    <>
      {content}
      {addLineBreak ? <br /> : null}
    </>
  )
}

function applyInlineFormatting(text: string): ReactNode[] {
  const boldSegments = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)

  return boldSegments.flatMap<ReactNode>((segment, segmentIndex) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      const boldText = segment.slice(2, -2)
      return (
        <strong key={`bold-${segmentIndex}`} className="font-semibold text-neutral-800">
          {applyItalicFormatting(boldText)}
        </strong>
      )
    }
    return applyItalicFormatting(segment)
  })
}

function applyItalicFormatting(text: string): ReactNode[] {
  const italicSegments = text.split(/(\*[^*]+\*)/g).filter(Boolean)

  return italicSegments.map<ReactNode>((segment, segmentIndex) => {
    if (segment.startsWith("*") && segment.endsWith("*")) {
      const italicText = segment.slice(1, -1)
      return (
        <em key={`italic-${segmentIndex}`} className="italic">
          {italicText}
        </em>
      )
    }
    return segment
  })
}
