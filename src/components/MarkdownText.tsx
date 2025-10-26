import ReactMarkdown from "react-markdown"

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
  if (!content) {
    return null
  }

  const baseTextClass = baseVariantClasses[variant]

  return (
    <div className={mergeClasses("space-y-2", className)}>
      <ReactMarkdown
        components={{
          p: ({ className: paragraphClassName, ...props }) => (
            <p {...props} className={mergeClasses(baseTextClass, paragraphClassName)} />
          ),
          strong: ({ className: strongClassName, ...props }) => (
            <strong {...props} className={mergeClasses("font-semibold text-neutral-800", strongClassName)} />
          ),
          em: ({ className: emphasisClassName, ...props }) => (
            <em {...props} className={mergeClasses("italic", emphasisClassName)} />
          ),
          ul: ({ className: listClassName, ...props }) => (
            <ul {...props} className={mergeClasses("ml-4 list-disc space-y-1", baseTextClass, listClassName)} />
          ),
          ol: ({ className: listClassName, ...props }) => (
            <ol {...props} className={mergeClasses("ml-4 list-decimal space-y-1", baseTextClass, listClassName)} />
          ),
          li: ({ className: listItemClassName, ...props }) => (
            <li {...props} className={mergeClasses(baseTextClass, listItemClassName)} />
          ),
          a: ({ className: anchorClassName, ...props }) => (
            <a
              {...props}
              className={mergeClasses(
                "font-medium text-brand-600 underline decoration-brand-200 underline-offset-4 transition hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500",
                anchorClassName,
              )}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
