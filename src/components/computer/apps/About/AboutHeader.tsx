import React from 'react'
import type { AboutContent } from '../../../../data/about'

interface AboutHeaderProps {
  content: AboutContent
}

/**
 * Opening block of the About document.
 *
 * Handwritten greeting (Caveat, already a project display token) over a short
 * introduction, closed by a thin rule and a signature line — the shape of the
 * first page of a letter rather than a hero banner.
 *
 * The four blocks carry their own `data-motion` hooks so the document can settle
 * in reading order — label, then greeting, then introduction, then signature —
 * instead of the whole column arriving as one slab. They are inert attributes
 * until the motion pass reveals them; the text itself is never split up,
 * re-wrapped or animated per letter.
 */
const AboutHeader: React.FC<AboutHeaderProps> = ({ content }) => {
  return (
    <header className="about-doc__header">
      <p className="about-doc__eyebrow" data-motion="hero-eyebrow">
        <span className="about-doc__eyebrow-mark" aria-hidden="true" />
        {content.eyebrow}
      </p>
      <h1 className="about-doc__greeting" data-motion="hero-greeting">
        {content.greeting}
      </h1>
      <p className="about-doc__intro" data-motion="hero-intro">
        {content.intro}
      </p>
      <p className="about-doc__signoff" data-motion="hero-signoff">
        {content.signoff}
      </p>
    </header>
  )
}

export default AboutHeader