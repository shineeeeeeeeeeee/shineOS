import React, { useRef } from 'react'
import type { Project, ProjectAsset } from '../../../../types/projects'
import DsaArchiveSheet from './DsaArchiveSheet'
import './ProjectSheet.css'

interface ProjectSheetProps {
  project: Project
  reducedMotion?: boolean
}

/**
 * One project's document, opened in its own SHINE OS window.
 *
 * The sheet is ordered by what the eye needs first, not by what a case-study
 * template asks for:
 *
 *   1. identity    index, title, category — the smallest block on the sheet
 *   2. the visual  the project's own capture, at the largest size it is given
 *   3. what it is  the one-line summary, then the repository links
 *   4. the reasoning — why it exists, then how it works, well below the fold
 *
 * That order is the whole point. A sheet that opened with four paragraphs of
 * context would bury the only thing that makes a project legible: what it
 * actually looks like. So the visual comes before the prose, and the prose is
 * short enough to read in one go when it does arrive.
 *
 * WHAT IS DELIBERATELY NOT HERE
 * No cards, no grid of equal boxes, no section-per-card, no technology pills and
 * no repeated "View project" buttons. Sectioning is done with hairlines and
 * whitespace; the technologies are one quiet line of text, exactly as they are
 * on the workbench. Where a project has one capture rather than a screen, the
 * sheet is honest about that and keeps the page short instead of padding it out.
 *
 * Nothing scrolls horizontally and nothing animates in. The sheet reflows
 * through its own container queries, so resizing the window re-composes it the
 * same way a narrower screen would — and at narrow widths the order stays
 * visual-led rather than collapsing into a single column of text.
 */
const ProjectSheet: React.FC<ProjectSheetProps> = ({ project, reducedMotion = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const titleId = `sheet-${project.id}-title`

  // The hero is whatever the data says is the hero, never a re-ordered guess.
  const hero = project.hero
  const supporting = project.assets.filter((asset) => asset !== hero)

  return (
    <div
      className="sheet-app"
      data-project={project.id}
      data-tier={project.tier}
      data-treatment={project.treatment}
      data-reduced-motion={reducedMotion || undefined}
    >
      <div
        ref={scrollRef}
        className="sheet"
        tabIndex={0}
        aria-label={`${project.title} — project sheet, scrollable`}
      >
        <article className="sheet__doc" aria-labelledby={titleId}>
          {/* --- 1. Identity --- */}
          <header className="sheet__head">
            <p className="sheet__eyebrow">
              <span className="sheet__category">{project.category}</span>
            </p>
            <h1 className="sheet__title" id={titleId}>
              {project.title}
            </h1>
            <p className="sheet__summary">{project.summary}</p>
          </header>

          {project.sheetForm === 'archive' ? (
            <DsaArchiveSheet project={project} reducedMotion={reducedMotion} />
          ) : (
            <>
              {/* --- 2. The strongest visual ---
                  Deliberately the largest single object on the sheet. Everything
                  after it is smaller than it. */}
              {hero && (
                <figure className="sheet__hero">
                  <img
                    className="sheet__hero-image"
                    src={hero.src}
                    alt={hero.alt}
                    width={hero.width}
                    height={hero.height}
                    // A sheet is opened deliberately, so its hero is worth
                    // fetching immediately rather than after a scroll.
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                  <figcaption className="sheet__caption">
                    <span className="sheet__caption-text">{hero.caption}</span>
                    <span className="sheet__caption-source">{hero.source}</span>
                  </figcaption>
                </figure>
              )}

              {/* Shadow Tag's only capture is of the source file. The correction
                  is printed with the image, in the same voice, every time the
                  image appears — never left to the caption alone. */}
              {project.assetDisclaimer && (
                <p className="sheet__disclaimer" role="note">
                  {project.assetDisclaimer}
                </p>
              )}

              {/* --- 3. Where to explore it ---
                  Quiet inline links rather than buttons. A repository link is
                  not a call to action, it is a citation. */}
              <nav className="sheet__links" aria-label={`${project.title} links`}>
                <a
                  className="sheet__link"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Repository
                  <span className="sheet__link-hint">GitHub, opens in a new tab</span>
                </a>
                {project.liveUrl && (
                  <a
                    className="sheet__link"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live
                    <span className="sheet__link-hint">running instance, opens in a new tab</span>
                  </a>
                )}
              </nav>

              {/* --- 4. Reasoning, below the fold --- */}
              {project.why && (
                <section className="sheet__section" aria-labelledby={`${titleId}-why`}>
                  <h2 className="sheet__section-label" id={`${titleId}-why`}>
                    Why I built it
                  </h2>
                  <p className="sheet__prose">{project.why}</p>
                </section>
              )}

              {project.how && project.how.length > 0 && (
                <section className="sheet__section" aria-labelledby={`${titleId}-how`}>
                  <h2 className="sheet__section-label" id={`${titleId}-how`}>
                    How it works
                  </h2>
                  <ol className="sheet__steps">
                    {project.how.map((step, index) => (
                      <li className="sheet__step" key={step}>
                        <span className="sheet__step-mark" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="sheet__step-text">{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* --- Supporting visuals ---
                  Atlas has three. They are stacked, captioned and spaced well
                  below the hero rather than tiled beside it, so the graph
                  explorer stays the primary image and the sheet never shows the
                  whole set of captures at once. */}
              {supporting.length > 0 && (
                <section className="sheet__section" aria-labelledby={`${titleId}-more`}>
                  <h2 className="sheet__section-label" id={`${titleId}-more`}>
                    Also in the repository
                  </h2>
                  <div className="sheet__gallery">
                    {supporting.map((asset: ProjectAsset) => (
                      <figure className="sheet__figure" key={asset.id}>
                        <img
                          className="sheet__figure-image"
                          src={asset.src}
                          alt={asset.alt}
                          width={asset.width}
                          height={asset.height}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                        />
                        <figcaption className="sheet__caption">
                          <span className="sheet__caption-text">{asset.caption}</span>
                          <span className="sheet__caption-source">{asset.source}</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              {/* Technologies as a line of text, not a wall of pills. Same
                  treatment the workbench uses, so the two surfaces agree. */}
              {project.technologies.length > 0 && (
                <section className="sheet__section" aria-labelledby={`${titleId}-tech`}>
                  <h2 className="sheet__section-label" id={`${titleId}-tech`}>
                    Built with
                  </h2>
                  <p className="sheet__tech">{project.technologies.join(' · ')}</p>
                </section>
              )}
            </>
          )}
        </article>

        <footer className="sheet__colophon">
          <span>Shine OS</span>
          <span aria-hidden="true">·</span>
          <span>Projects / {project.title}</span>
          <span aria-hidden="true">·</span>
          <span>Captures from the repository</span>
        </footer>
      </div>
    </div>
  )
}

export default ProjectSheet