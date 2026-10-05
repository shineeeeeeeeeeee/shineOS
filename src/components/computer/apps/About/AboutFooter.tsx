import React from 'react'
import type { AboutContent } from '../../../../data/about'

interface AboutFooterProps {
  content: AboutContent
}

/**
 * Small SHINE OS-style metadata block closing the document.
 *
 * Reads like the "properties" panel of a 1990s desktop — quiet, monospaced
 * numbers, and a hint about scrolling.
 */
const AboutFooter: React.FC<AboutFooterProps> = ({ content }) => {
  return (
    <footer className="about-footer" data-motion="signoff">
      <p className="about-footer__note" data-motion="footer-note">
        <span className="about-footer__glyph" aria-hidden="true">
          ◼
        </span>
        {content.footer.note}
      </p>
      <dl className="about-footer__rows">
        {content.footer.rows.map((row) => (
          <div className="about-footer__row" key={row.label} data-motion="meta-row">
            <dt className="about-footer__label">{row.label}</dt>
            <dd className="about-footer__value">{row.value}</dd>
          </div>
        ))}
      </dl>
    </footer>
  )
}

export default AboutFooter