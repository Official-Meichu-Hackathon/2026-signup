import { Fragment } from 'react'

interface QuestionTitleProps {
  title: string
}

// Renders a question title; a leading ★ is split into its own Noto Sans span.
export default function QuestionTitle({ title }: QuestionTitleProps) {
  if (title.startsWith('★')) {
    return (
      <Fragment>
        <span className="font-noto">★</span>
        {title.slice(1)}
      </Fragment>
    )
  }
  return <Fragment>{title}</Fragment>
}
