import React, { useLayoutEffect, useRef } from 'react'
import { aboutContent } from '../../../../data/about'
import AboutHeader from './AboutHeader'
import AboutIllustration from './AboutIllustration'
import AboutSection from './AboutSection'
import AboutRows from './AboutRows'
import AboutTopics from './AboutTopics'
import AboutFooter from './AboutFooter'
import './AboutApp.css'

interface AboutAppProps {
  reducedMotion?: boolean
}

/**
 * Elements that carry a `data-motion` hook.
 *
 * Every major group in the document already carries one. They are all observed:
 * revealing a group is a no-op for the pure layout wrappers, and it is what lets
 * the real content blocks inside them settle. The selectors in AboutApp.css only
 * act on hooks that have no `data-motion` descendant of their own, so a wrapper
 * never fades on top of the children already fading inside it.
 */
const MOTION_HOOK_SELECTOR = '[data-motion]'

/**
 * About — a personal document living inside a SHINE OS window.
 *
 * The window is the canvas. Instead of a narrow centred article, the document
 * is composed as a full-width editorial spread:
 *
 *   HERO      text (label / greeting / intro / sign-off)  |  approved artwork
 *   SPLIT     ABOUT prose                                   |  CURRENTLY rows
 *   FULL      A FEW THINGS ABOUT ME — topic columns
 *   CLOSING   one quiet personal sentence
 *   SIGN-OFF  small SHINE OS metadata
 *
 * Structure comes from whitespace, typography, hairlines and alignment only.
 * There are no cards, no grid of tiles and no dashboard framing.
 *
 * MOTION
 * The document settles into place once, and then it is still.
 *
 *  - Each `data-motion` block starts slightly low and faint and rises into its
 *    resting position. Nothing bounces, scales, rotates or blurs.
 *  - The sequence is deliberately unhurried: label, then greeting, then the
 *    introduction, then the signature, with the drawing arriving alongside the
 *    text but taking its time.
 *  - Reveal is one-way. A block is marked once, when it first appears, and stays
 *    marked — scrolling back up never replays anything, and resizing the window
 *    never re-hides what has already been read.
 *  - An IntersectionObserver rooted on the document's own scroll container does
 *    that work, so a band further down the page waits until it is actually read
 *    rather than animating off-screen.
 *
 * Reduced motion is a real off switch: the hooks are never marked, the
 * `about-app--motion` class is never applied, the illustration runs no timer,
 * and the document is simply present.
 *
 * Scrolling happens on an internal element so the window never has to grow.
 * The scroll container is focusable so it can be reached and scrolled with the
 * keyboard alone.
 */
const AboutApp: React.FC<AboutAppProps> = ({ reducedMotion = false }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return

    const root = rootRef.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>(MOTION_HOOK_SELECTOR))
    if (targets.length === 0) return

    // Written straight to the DOM: revealing is a one-off marker, not state the
    // rest of the tree needs to re-render for.
    const reveal = (element: Element) => element.setAttribute('data-revealed', 'true')

    // Without an observer the document must still be readable, so fall back to
    // showing everything at once rather than leaving it stuck at opacity 0.
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach(reveal)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal(entry.target)
          observer.unobserve(entry.target)
        })
      },
      {
        // The About scroll container, not the viewport: a block counts as seen
        // when it is actually visible on the sheet, even if the window itself
        // is partly covered or dragged off the side of the screen.
        root: paperRef.current,
        // Blocks reveal just as they come into view rather than the instant
        // their first pixel touches the bottom edge.
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.01,
      },
    )

    targets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <div
      ref={rootRef}
      className={`about-app ${reducedMotion ? 'about-app--reduced-motion' : 'about-app--motion'}`}
    >
      <article
        ref={paperRef}
        className="about-app__paper"
        tabIndex={0}
        aria-label="About Shine — scrollable document"
      >
        <div className="about-doc">
          {/* --- Opening composition: text and artwork share the full width --- */}
          <header className="about-hero" data-motion="hero">
            <div className="about-hero__text" data-motion="hero-text">
              <AboutHeader content={aboutContent} />
            </div>

            <div className="about-hero__figure" data-motion="hero-illustration">
              <AboutIllustration reducedMotion={reducedMotion} />
            </div>
          </header>

          {/* --- ABOUT and CURRENTLY sit side by side when there is room --- */}
          <div className="about-split" data-motion="split">
            <AboutSection id="about" label={aboutContent.about.label} lead={aboutContent.about.lead}>
              {aboutContent.about.paragraphs.map((paragraph) => (
                <p className="about-prose" data-motion="prose" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </AboutSection>

            <AboutSection
              id="currently"
              label={aboutContent.currently.label}
              lead={aboutContent.currently.lead}
            >
              <AboutRows rows={aboutContent.currently.rows} />
            </AboutSection>
          </div>

          {/* --- A FEW THINGS ABOUT ME — full width, arranged in columns --- */}
          <AboutSection
            id="interests"
            label={aboutContent.interests.label}
            lead={aboutContent.interests.lead}
          >
            <AboutTopics topics={aboutContent.interests.topics} />
          </AboutSection>

          {/* --- CLOSING — the honest sentence, deliberately small and quiet --- */}
          <AboutSection id="closing" label={aboutContent.closing.label}>
            <div className="about-closing">
              {aboutContent.closing.paragraphs.map((paragraph) => (
                <p className="about-prose about-closing__line" data-motion="prose" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </AboutSection>

          <AboutFooter content={aboutContent} />
        </div>
      </article>
    </div>
  )
}

export default AboutApp
