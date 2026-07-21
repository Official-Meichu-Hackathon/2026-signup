import QuestionTitle from './QuestionTitle'

interface QuestionHeaderProps {
  title: string
  description?: string
  descriptionClassName?: string
}

const DEFAULT_DESCRIPTION_CLASS =
  'mx-4 mt-2 text-xs leading-snug whitespace-pre-line md:mt-3 md:text-xl md:leading-relaxed'

// Shared question header: the title <h3> plus an optional description <p>.
// descriptionClassName lets callers whose description styling differs (e.g.
// ChoiceQuestion adds text-white/80) pass the exact class string.
export default function QuestionHeader({
  title,
  description,
  descriptionClassName = DEFAULT_DESCRIPTION_CLASS,
}: QuestionHeaderProps) {
  return (
    <>
      <h3 className="text-sm leading-6 font-semibold text-white md:text-[1.5625rem] md:leading-10">
        <QuestionTitle title={title} />
      </h3>
      {description && <p className={descriptionClassName}>{description}</p>}
    </>
  )
}
