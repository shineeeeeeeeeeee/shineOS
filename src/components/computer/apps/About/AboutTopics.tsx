import React from 'react'
import type { AboutTopic } from '../../../../data/about'

interface AboutTopicsProps {
  topics: AboutTopic[]
}

/**
 * Loose list of interests.
 *
 * Rendered as a definition list with small accent glyphs rather than tags or
 * chips — the document should read as writing, not as a skills widget.
 */
const AboutTopics: React.FC<AboutTopicsProps> = ({ topics }) => {
  return (
    <ul className="about-topics" data-motion="topics">
      {topics.map((topic) => (
        <li className="about-topics__item" key={topic.title} data-motion="topic">
          <p className="about-topics__title">
            <span className="about-topics__glyph" aria-hidden="true">
              ✳
            </span>
            {topic.title}
          </p>
          <p className="about-topics__note">{topic.note}</p>
        </li>
      ))}
    </ul>
  )
}

export default AboutTopics