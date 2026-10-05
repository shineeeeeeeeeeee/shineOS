import React, { useEffect, useState } from 'react'
import {
  dsaFolderWindow,
  dsaRepositoryPath,
  foldersWithExtraNotes,
  languageBreakdown,
  problemNumberRange,
  pythonFolderCount,
  repositoryFileCount,
  solutionFolderCount,
} from '../../../../data/leetcodeArchive'
import './LiveDsaArchive.css'

interface LiveDsaArchiveProps {
  /** When true the artifact never moves: no caret blink, no index cycling. */
  reducedMotion?: boolean
}

/** How many folder lines the index shows at once. */
const INDEX_LINES = 4

/** Milliseconds between index steps. Slow enough to read as a document, not a feed. */
const INDEX_INTERVAL = 4200

/**
 * Live read of the OS reduced-motion preference.
 *
 * The prop alone is not enough here. A window's content is built once, when the
 * window opens, so a prop captured at that moment goes stale if the preference is
 * changed while the window is still open. The index cycling is driven by
 * JavaScript and CSS cannot switch it off for us, so it subscribes to the media
 * query directly and stops the moment the preference flips — whether that
 * happens before or after the artifact mounts.
 */
function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false)

  useEffect(() => {
    const query = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return
    setPrefers(query.matches)
    const onChange = (event: MediaQueryListEvent) => setPrefers(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return prefers
}

/**
 * The LeetcodeDSA plate.
 *
 * This project has no screenshot because the repository contains no images at
 * all — so the plate is not artwork and is not an empty box either. It is a small
 * editor artifact whose contents are read out of the repository manifest at build
 * time: the folder count, the file breakdown, the problem-number range and the
 * folder names themselves all come from `data/leetcodeArchive.ts`.
 *
 * The intent is a notebook left open on the workbench, not a dashboard. There are
 * no chart types, no percentage bars, no donut, no trend line and no invented
 * activity history — a submission chart would require a dataset that does not
 * exist here, and drawing one anyway is the single easiest way for this page to
 * start lying.
 *
 * WHAT MOVES, AND HOW LITTLE
 * Two things, both optional:
 *   - a caret that blinks on the entry line, in CSS only
 *   - the index window, which advances by one real folder every few seconds
 * Both are switched off entirely under reduced motion, where the artifact
 * renders exactly the same content and simply stops. There is no bouncing, no
 * counting animation, no number that changes, and nothing that moves when the
 * window is not being looked at.
 *
 * ACCESSIBILITY
 * The whole artifact sits inside the plate button, which carries its own label
 * and description. The decorative parts are hidden from assistive technology and
 * the figures that matter are exposed once, as text, in a single readable run —
 * so a screen reader hears "131 solutions, 129 Java files" rather than five
 * interleaved decorative lines.
 */
const LiveDsaArchive: React.FC<LiveDsaArchiveProps> = ({ reducedMotion = false }) => {
  const [indexStart, setIndexStart] = useState(0)
  const prefersReduced = usePrefersReducedMotion()

  // Either signal stops the cycling. The prop covers the OS-level toggle the
  // shell threads through; the media query covers the browser-level preference.
  const still = reducedMotion || prefersReduced

  useEffect(() => {
    if (still) return
    const timer = globalThis.setInterval(() => {
      setIndexStart((current) => (current + 1) % solutionFolderCount)
    }, INDEX_INTERVAL)
    return () => globalThis.clearInterval(timer)
  }, [still])

  // Real folders, straight out of the manifest. Never invented, never renamed.
  const visibleFolders = dsaFolderWindow(indexStart, INDEX_LINES)

  const solutionFiles = languageBreakdown.filter((entry) => entry.extension !== 'md')
  const markdown = languageBreakdown.find((entry) => entry.extension === 'md')

  // One sentence carrying every figure on the artifact, for assistive tech.
  const spokenSummary = [
    `${solutionFolderCount} solution folders.`,
    `${repositoryFileCount} files.`,
    solutionFiles.map((entry) => `${entry.count} ${entry.extension} files`).join(', ') + '.',
    markdown ? `${markdown.count} markdown files.` : '',
    `Problem numbers ${problemNumberRange.min} to ${problemNumberRange.max}.`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="dsa" data-reduced-motion={still || undefined}>
      <p className="dsa__spoken visually-hidden">{spokenSummary}</p>

      {/* Masthead. The title, and the repository the numbers came from. */}
      <div className="dsa__bar">
        <span className="dsa__title">Leetcode DSA</span>
        <span className="dsa__label">{dsaRepositoryPath}</span>
      </div>

      {/* The entry line. This is the whole claim the plate makes, and every
          number in it is derived from the manifest. */}
      <p className="dsa__entry">
        <span className="dsa__entry-count">{solutionFolderCount}</span>
        <span className="dsa__entry-text">solutions archived</span>
        <span className="dsa__caret" aria-hidden="true" />
      </p>

      {/* The listing. Real folder names, in real repository order. */}
      <ul className="dsa__index" aria-hidden="true">
        {visibleFolders.map((entry, offset) => (
          <li className="dsa__index-line" key={entry.folder} data-fresh={offset === 0 || undefined}>
            <span className="dsa__index-mark">{String(indexStart + offset + 1).padStart(3, '0')}</span>
            <span className="dsa__index-name">{entry.folder}</span>
          </li>
        ))}
      </ul>

      {/* File breakdown, counted from the manifest. */}
      <dl className="dsa__files" aria-hidden="true">
        {solutionFiles.map((entry) => (
          <React.Fragment key={entry.extension}>
            <dt className="dsa__file-ext">.{entry.extension}</dt>
            <dd className="dsa__file-count">{entry.count}</dd>
          </React.Fragment>
        ))}
        {markdown && (
          <>
            <dt className="dsa__file-ext">.{markdown.extension}</dt>
            <dd className="dsa__file-count">{markdown.count}</dd>
          </>
        )}
      </dl>

      {/* Two facts that only exist because the manifest was read rather than
          summarised: the spread of problem numbers, and the two Python folders. */}
      <p className="dsa__foot" aria-hidden="true">
        <span>
          No. {problemNumberRange.min}–{problemNumberRange.max}
        </span>
        <span className="dsa__foot-sep" />
        <span>
          {pythonFolderCount} in Python · {foldersWithExtraNotes} with extra notes
        </span>
      </p>
    </div>
  )
}

export default LiveDsaArchive