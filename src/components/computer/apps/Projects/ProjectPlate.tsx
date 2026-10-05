import React from 'react'
import type { Project } from '../../../../types/projects'
import LiveDsaArchive from './LiveDsaArchive'

interface ProjectPlateProps {
  project: Project
  /** Position on the whole sheet, used for the printed index. */
  index: number
  /** True when this project's detail sheet is the open window. */
  isActive: boolean
  /** Lead plates sit above the fold, so they load eagerly. */
  eager?: boolean
  /** Threaded through to the live archive artifact. */
  reducedMotion?: boolean
  onOpen: (projectId: string) => void
}

/**
 * One project on the workbench.
 *
 * The plate is the interface: the title, caption and repository link sit
 * around a real capture, and the capture itself is the button. Nothing is
 * drawn over the image, so no part of a UI screenshot is ever cropped or
 * covered by the page's own furniture.
 *
 * A project whose repository holds no photograph gets the live archive
 * artifact instead of a dead empty slot. That artifact reads its own numbers
 * and folder names out of the repository manifest, so the plate is honest
 * about the project being an archive rather than about a screenshot having
 * been forgotten.
 *
 * Images keep their intrinsic size (`width`/`height` attributes plus
 * `height: auto`), so a plate is never stretched to fill a box and the
 * composition does not reflow as files decode.
 */
const ProjectPlate: React.FC<ProjectPlateProps> = ({
  project,
  index,
  isActive,
  eager = false,
  reducedMotion = false,
  onOpen,
}) => {
  const titleId = `project-${project.id}-title`
  const captionId = `project-${project.id}-caption`
  const indexLabel = String(index + 1).padStart(2, '0')

  const showSummary = project.tier === 'lead' || project.tier === 'supporting'

  return (
    <article
      className="project"
      id={`project-${project.id}`}
      data-treatment={project.treatment}
      data-tier={project.tier}
    >
      <header className="project__head">
        <p className="project__index" aria-hidden="true">
          {indexLabel}
        </p>
        <h3 className="project__title" id={titleId}>
          {project.title}
        </h3>
        <p className="project__category">{project.category}</p>
      </header>

      <button
        type="button"
        className="project__plate"
        aria-labelledby={titleId}
        aria-describedby={captionId}
        data-active={isActive || undefined}
        onClick={() => onOpen(project.id)}
      >
        {project.hero ? (
          <img
            className="project__image"
            src={project.hero.src}
            alt={project.hero.alt}
            width={project.hero.width}
            height={project.hero.height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        ) : (
          // No capture exists for this project, and none is invented. The slot
          // is filled by the live archive artifact, which is drawn entirely
          // from the repository's own contents.
          <LiveDsaArchive reducedMotion={reducedMotion} />
        )}
      </button>

      <p className="project__caption" id={captionId}>
        {project.hero ? project.hero.caption : project.note}
      </p>

      {showSummary && <p className="project__summary">{project.summary}</p>}

      <footer className="project__foot">
        <p className="project__tech">{project.technologies.join(' · ')}</p>
        <p className="project__links">
          <a
            className="project__link"
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Repository
            <span className="visually-hidden"> for {project.title} (opens in a new tab)</span>
          </a>
          {project.liveUrl && (
            <a
              className="project__link"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live
              <span className="visually-hidden"> {project.title} (opens in a new tab)</span>
            </a>
          )}
        </p>
      </footer>
    </article>
  )
}

export default ProjectPlate