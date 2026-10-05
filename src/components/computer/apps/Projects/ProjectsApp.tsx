import React, { useCallback, useRef } from 'react'
import {
  getArchiveProjects,
  getGroupProjects,
  projectsContent,
} from '../../../../data/projects'
import ProjectPlate from './ProjectPlate'
import useProjectSheet from './useProjectSheet'
import './ProjectsApp.css'

interface ProjectsAppProps {
  reducedMotion?: boolean
}

/**
 * Projects — a workbench, not a portfolio grid.
 *
 * The About app answers "who is Shine?" by reading. This one answers "what
 * does Shine actually make?" by showing. So the window is composed like a
 * contact sheet on a desk:
 *
 *   MASTHEAD    a few lines of metadata and three band links, nothing more
 *   LEADS       Atlas on a full-width plate, Kindness Map indented and smaller
 *   SECONDARY   RN Wallet as a narrow phone plate beside a wider chat capture
 *   ARCHIVE     Shadow Tag's capture beside the LeetcodeDSA live artifact
 *
 * Every plate is a real capture taken from the project's own repository, and
 * the hierarchy comes from column widths, type sizes and whitespace. There are
 * no cards, no gradients, no glass, and no equal-sized tile grid — the six
 * projects are deliberately six different weights.
 *
 * MOTION
 * There is no motion. A plate settles the moment it is painted and then stays
 * exactly where it is; the only change in the whole app is a border, a rule and
 * an opacity step when the pointer or keyboard focus reaches a project. Nothing
 * floats, rotates, autoplays or loops, and `reducedMotion` removes even that.
 *
 * Scrolling happens on an internal element so the window never grows, and that
 * element is focusable so the sheet can be reached with the keyboard alone.
 */
const ProjectsApp: React.FC<ProjectsAppProps> = ({ reducedMotion = false }) => {
  const sheetRef = useRef<HTMLDivElement>(null)
  const { activeProjectId, openProject } = useProjectSheet(reducedMotion)

  const handleOpen = useCallback((projectId: string) => openProject(projectId), [openProject])

  const archiveCount = getArchiveProjects().length
  const plateCount = projectsContent.groups
    .flatMap((group) => getGroupProjects(group))
    .filter((project) => project.hero !== undefined).length
  const projectCount = projectsContent.groups.reduce(
    (total, group) => total + getGroupProjects(group).length,
    0
  )

  let runningIndex = 0

  return (
    <div className="projects-app" data-reduced-motion={reducedMotion || undefined}>
      <div
        ref={sheetRef}
        className="projects-sheet"
        tabIndex={0}
        aria-label="Projects — workbench, scrollable"
      >
        <header className="projects-masthead">
          <div className="projects-masthead__rule" aria-hidden="true" />

          <div className="projects-masthead__body">
            <h1 className="projects-masthead__title">
              {projectsContent.title}
              <span className="projects-masthead__slash" aria-hidden="true">
                /
              </span>
              <span className="projects-masthead__subtitle">{projectsContent.subtitle}</span>
            </h1>

            <p className="projects-masthead__standfirst">{projectsContent.standfirst}</p>
          </div>

          <nav className="projects-masthead__nav" aria-label="Project bands">
            <ul className="projects-masthead__nav-list">
              {projectsContent.groups.map((group) => (
                <li key={group.id}>
                  <a className="projects-masthead__nav-link" href={`#band-${group.id}`}>
                    {group.label}
                  </a>
                </li>
              ))}
            </ul>
            {/* A truthful count of the sheet, not a project statistic: how many
                entries carry a real capture, and how many are drawn from their
                own repository contents instead. */}
            <p className="projects-masthead__count">
              {projectCount} projects · {plateCount} plated
              {archiveCount > 0 && (
                <span className="projects-masthead__count-open"> · {archiveCount} live archive</span>
              )}
            </p>
          </nav>
        </header>

        {projectsContent.groups.map((group) => {
          const groupProjects = getGroupProjects(group)

          return (
            <section
              key={group.id}
              className={`projects-band projects-band--${group.id}`}
              aria-labelledby={`band-${group.id}`}
            >
              <div className="projects-band__head">
                <h2 className="projects-band__label" id={`band-${group.id}`}>
                  {group.label}
                </h2>
                <p className="projects-band__note">{group.note}</p>
              </div>

              <div className="projects-band__grid">
                {groupProjects.map((project) => {
                  const index = runningIndex
                  runningIndex += 1

                  return (
                    <ProjectPlate
                      key={project.id}
                      project={project}
                      index={index}
                      isActive={activeProjectId === project.id}
                      eager={index === 0}
                      reducedMotion={reducedMotion}
                      onOpen={handleOpen}
                    />
                  )
                })}
              </div>
            </section>
          )
        })}

        <footer className="projects-colophon">
          <span>Shine OS</span>
          <span aria-hidden="true">·</span>
          <span>Projects / Workbench</span>
          <span aria-hidden="true">·</span>
          <span>Captures from the repositories</span>
        </footer>
      </div>
    </div>
  )
}

export default ProjectsApp