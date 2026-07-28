import QuestionTitle from './QuestionTitle'

interface QuestionHeaderProps {
  title: string
  description?: string
}

const DESCRIPTION_CLASS =
  'mx-4 mt-1.5 text-[0.5625rem] leading-snug whitespace-pre-line md:mt-3 md:text-xl md:leading-relaxed'

// Shared question header: the title <h3> plus an optional description <p>.
// ChoiceQuestion renders its own description so a PDF can sit between the two.
export default function QuestionHeader({
  title,
  description,
}: QuestionHeaderProps) {
  return (
    <>
      <h3 className="text-[0.6875rem] leading-6 font-semibold text-white md:text-[1.5625rem] md:leading-10">
        <QuestionTitle title={title} />
      </h3>
      {description && <p className={DESCRIPTION_CLASS}>{description}</p>}
    </>
  )
}
