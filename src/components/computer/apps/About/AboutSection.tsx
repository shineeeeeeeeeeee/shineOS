import React from 'react'

interface AboutSectionProps {
  /** Small letterspaced kicker used as the section heading. */
  label: string
  /** Optional sentence-sized lead under the label. */
  lead?: string
  /** Stable id used for the section's accessible name. */
  id: string
  children: React.ReactNode
}

/**
 * Generic document section.
 *
 * Hierarchy comes from the label, the lead line and a hairline rule — the
 * section deliberately has no card, border or shadow of its own.
 *
 * The section element itself is only a grouping hook: the label and the lead are
 * what settle into place, one after the other, so a section reads as a heading
 * arriving just ahead of the sentence under it. The body is left alone so the
 * rows, topics or paragraphs inside it can reveal on their own schedule.
 */
const AboutSection: React.FC<AboutSectionProps> = ({ label, lead, id, children }) => {
  return (
    <section
      className="about-section"
      data-motion="section"
      data-motion-id={id}
      aria-labelledby={`${id}-label`}>
      <div className="about-section__head" data-motion="section-head">
        <span className="about-section__rule" aria-hidden="true" />
        <h2 className="about-section__label" id={`${id}-label`}>
          {label}
        </h2>
      </div>
      {lead && (
        <p className="about-section__lead" data-motion="section-lead">
          {lead}
        </p>
      )}
      <div className="about-section__body">{children}</div>
    </section>
  )
}

export default AboutSection