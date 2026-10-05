import React from 'react'
import type { Project } from '../../../../types/projects'
import {
  dsaArchive,
  dsaRepositoryPath,
  documentationOnlyFolders,
  foldersWithExtraNotes,
  javaFileCount,
  javaFolderCount,
  languageBreakdown,
  notesFileCount,
  problemNumberRange,
  pythonFileCount,
  pythonFolderCount,
  repositoryFileCount,
  solutionFolderCount,
} from '../../../../data/leetcodeArchive'
import './DsaArchiveSheet.css'

interface DsaArchiveSheetProps {
  project: Project
  reducedMotion?: boolean
}

/**
 * The LeetcodeDSA sheet, drawn as a notebook rather than a case study.
 *
 * Every other project in this workbench is an application with a screen to show,
 * so its sheet is an editorial document. This one is not an application at all —
 * it is a folder of solutions — so putting it through the same template would
 * mean inventing a hero image, a "challenge" and an "outcome" for a repository
 * that contains none of those things. Instead the sheet is the archive itself:
 * what is in it, how much of it, and the real names of a representative slice of
 * the folders.
 *
 * Every figure on this page comes from the manifest in `data/leetcodeArchive.ts`
 * and is computed from it. The folder index below is not a sample chosen to look
 * good — it is all 131 folders, in repository order, with the real filenames. If
 * a folder were invented here it would not exist in the manifest at all.
 */
const DsaArchiveSheet: React.FC<DsaArchiveSheetProps> = ({ project, reducedMotion = false }) => {
  const titleId = `sheet-${project.id}-facts`

  return (
    <div className="dsa-sheet" data-reduced-motion={reducedMotion || undefined}>
      {/* --- The archive itself, at sheet scale ---
          The same ruled-paper object as the workbench plate, drawn larger and
          carrying the repository's own accounting of itself. */}
      <section className="dsa-sheet__page" aria-labelledby={titleId}>
        <div className="dsa-sheet__bar">
          <span className="dsa-sheet__title">Leetcode DSA</span>
          <span className="dsa-sheet__repo">{dsaRepositoryPath}</span>
        </div>

        <p className="dsa-sheet__entry">
          <span className="dsa-sheet__entry-count">{solutionFolderCount}</span>
          <span className="dsa-sheet__entry-text">solutions archived</span>
          <span className="dsa-sheet__caret" aria-hidden="true" />
        </p>

        {/* The accounting, as a real description list so the pairs are
            meaningful to assistive technology rather than being a visual row. */}
        <dl className="dsa-sheet__facts" id={titleId}>
          <div className="dsa-sheet__fact">
            <dt>Folders</dt>
            <dd>{solutionFolderCount}</dd>
          </div>
          <div className="dsa-sheet__fact">
            <dt>Files</dt>
            <dd>{repositoryFileCount}</dd>
          </div>
          <div className="dsa-sheet__fact">
            <dt>Problem range</dt>
            <dd>
              {problemNumberRange.min}–{problemNumberRange.max}
            </dd>
          </div>
          <div className="dsa-sheet__fact">
            <dt>Java</dt>
            <dd>
              {javaFileCount} in {javaFolderCount} folders
            </dd>
          </div>
          <div className="dsa-sheet__fact">
            <dt>Python</dt>
            <dd>
              {pythonFileCount} in {pythonFolderCount} folders
            </dd>
          </div>
          <div className="dsa-sheet__fact">
            <dt>Markdown</dt>
            <dd>
              {languageBreakdown.find((entry) => entry.extension === 'md')?.count ?? 0} files
            </dd>
          </div>
          <div className="dsa-sheet__fact">
            <dt>Extra notes</dt>
            <dd>
              {foldersWithExtraNotes} folders add a Notes.md
            </dd>
          </div>
          <div className="dsa-sheet__fact">
            <dt>Write-up only</dt>
            <dd>
              {documentationOnlyFolders.length} folders hold a README and no solution
            </dd>
          </div>
        </dl>
      </section>

      {/* --- Why, stated as a notebook entry rather than a section heading --- */}
      {project.why && (
        <section className="sheet__section" aria-labelledby={`${titleId}-why`}>
          <h2 className="sheet__section-label" id={`${titleId}-why`}>
            What this is
          </h2>
          <p className="sheet__prose">{project.why}</p>
        </section>
      )}

      {project.how && project.how.length > 0 && (
        <section className="sheet__section" aria-labelledby={`${titleId}-how`}>
          <h2 className="sheet__section-label" id={`${titleId}-how`}>
            How it is organised
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

      {/* --- The real index ---
          All 131 folders, exactly as the repository names them. This is the
          project's substance, so it is printed in full rather than teased. */}
      <section className="sheet__section" aria-labelledby={`${titleId}-index`}>
        <h2 className="sheet__section-label" id={`${titleId}-index`}>
          Folder index
        </h2>
        <p className="dsa-sheet__index-note">
          Every folder in the repository, in problem order. Each holds a README.md write-up
          {notesFileCount > 0 && `, and ${foldersWithExtraNotes} of them a second Notes.md as well`}.
        </p>
        <ol className="dsa-sheet__index">
          {dsaArchive.map((entry) => (
            <li className="dsa-sheet__index-row" key={entry.folder}>
              <span className="dsa-sheet__index-no">{entry.number}</span>
              <span className="dsa-sheet__index-name">{entry.folder}</span>
            </li>
          ))}
        </ol>
      </section>

      {project.technologies.length > 0 && (
        <section className="sheet__section" aria-labelledby={`${titleId}-tech`}>
          <h2 className="sheet__section-label" id={`${titleId}-tech`}>
            Languages
          </h2>
          <p className="sheet__tech">{project.technologies.join(' · ')}</p>
        </section>
      )}

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
      </nav>
    </div>
  )
}

export default DsaArchiveSheet