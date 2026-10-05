/**
 * Projects Application — Data Model
 *
 * The Projects app is an archive of real work, so the model is shaped around
 * what a plate on a workbench actually needs: an image, a caption, a place on
 * the sheet, and enough provenance to go back to the repository it came from.
 *
 * Two rules govern this file:
 *
 * 1. Nothing here invents a fact. Every URL, technology name and summary is
 *    traceable to a repository README or package manifest. A project with no
 *    usable visual says so through `hero: undefined` and `awaitingVisual`,
 *    rather than being given a placeholder image.
 * 2. Layout never reads project content out of JSX. The composition is driven
 *    by `tier` and `treatment`, so the next phase can add a long-form project
 *    sheet without touching the workbench.
 */

// ============================================
// Assets
// ============================================

/**
 * A single real image belonging to a project.
 *
 * `width`/`height` are the intrinsic pixel size of the file in the repository
 * as it was captured, recorded here so the sheet can reserve the correct box
 * before the file decodes and so no plate ever reflows as it arrives.
 */
export interface ProjectAsset {
  /** Stable key, unique inside the project. */
  id: string
  /** Resolved URL of the copied asset. */
  src: string
  /** Meaningful description of what is actually visible in the frame. */
  alt: string
  /** Short caption printed on the workbench under the plate. */
  caption: string
  /** Intrinsic pixel width of the source file. */
  width: number
  /** Intrinsic pixel height of the source file. */
  height: number
  /** Where the file came from, so the choice stays auditable. */
  source: string
  /** 'hero' plates are the primary visual; 'detail' plates sit in the sheet. */
  role: 'hero' | 'detail'
}

// ============================================
// Projects
// ============================================

/**
 * Where a project sits on the sheet.
 *
 * This is the single field the composition reads, and it is the reason the
 * projects are not six equal tiles.
 */
export type ProjectTier =
  /** Carries the sheet: full-width plate, largest type. */
  | 'lead'
  /** Second visual weight: offset, smaller plate. */
  | 'supporting'
  /** Third weight: one strong screenshot. */
  | 'secondary'
  /** Archive shelf: small contact-sheet cells, quietest treatment. */
  | 'archive'

/**
 * How a project's plate is drawn.
 *
 * Kept separate from `tier` on purpose: tier says how much weight a project
 * carries, treatment says what shape its plate takes on the sheet.
 */
export type ProjectTreatment =
  /** Wide plate, full column width. Landscape captures. */
  | 'plate-wide'
  /** Portrait plate in a narrow column. Phone captures. */
  | 'plate-tall'
  /** Small contact-sheet cell. Archive captures. */
  | 'plate-contact'
  /**
   * No photograph on record. The slot is filled by the live archive artifact
   * rather than left dead, and the artifact draws itself from repository data
   * instead of standing in for a screenshot that does not exist.
   */
  | 'plate-archive'

/**
 * How a project sheet is composed when it is opened.
 *
 * Most projects are an application, so their sheet reads as a document: identity,
 * the strongest capture, then the reasoning underneath. An archive has no
 * application to screenshot, so its sheet is drawn as a notebook instead of
 * pretending to be a product.
 */
export type ProjectSheetForm =
  /** Editorial document: hero capture, then why/how, then links. */
  | 'document'
  /** Notebook: a repository index rather than a product case study. */
  | 'archive'

export interface Project {
  /** URL-safe identifier. Also the in-page anchor for the project. */
  id: string
  /** Display name. */
  title: string
  /** What kind of work this is. Short, factual. */
  category: string
  /** Weight on the sheet. */
  tier: ProjectTier
  /** Convenience flag: true for the two projects given lead treatment. */
  featured: boolean
  /** One line. What it is and what it does. No adjectives. */
  summary: string
  /** Real technologies, taken from the repository's own manifest or README. */
  technologies: string[]
  /** Source repository. */
  githubUrl: string
  /** Deployed instance, only when the repository documents one. */
  liveUrl?: string
  /** Primary visual. Absent when the repository holds no usable capture. */
  hero?: ProjectAsset
  /** Supporting visuals, for the project sheet in the next phase. */
  assets: ProjectAsset[]
  /** Shape of this project's plate. */
  treatment: ProjectTreatment
  /** How the opened sheet is composed. */
  sheetForm: ProjectSheetForm
  /**
   * True when `hero` is missing because the repository has no photograph on
   * record. The plate is filled by the live archive artifact instead of by
   * stand-in artwork, and the project is never hidden.
   */
  awaitingVisual?: boolean
  /** Line printed in the project caption block. One sentence, factual. */
  note: string
  /**
   * "Why I built it", one or two sentences.
   *
   * Optional on purpose: it is only written where the repository or the author's
   * stated intent supports it, so a project without a recorded reason is left
   * without one rather than given a plausible invention.
   */
  why?: string
  /**
   * "How it works", as short numbered lines rather than a paragraph.
   *
   * An array because the sheet prints it as a compact list under a rule; a block
   * of prose here is what turns a sheet into a case-study essay.
   */
  how?: string[]
  /**
   * Printed verbatim under a visual that is not what it superficially appears to
   * be — used by Shadow Tag, whose only asset is a capture of the source file
   * rather than of the running game.
   */
  assetDisclaimer?: string
}

/**
 * A band of the sheet. Groups exist so the composition is described in the data
 * rather than in the JSX, and so navigation labels have somewhere to come from.
 */
export interface ProjectGroup {
  id: 'lead' | 'secondary' | 'archive'
  /** Short uppercase band label. */
  label: string
  /** Single quiet line under the band label. */
  note: string
  /** Project ids in this band, in display order. */
  projectIds: string[]
}

/** Shell-level copy. Tiny by design. */
export interface ProjectsContent {
  /** Masthead title. */
  title: string
  /** Masthead qualifier. */
  subtitle: string
  /** One short line under the masthead. */
  standfirst: string
  /** Band labels and project order. */
  groups: ProjectGroup[]
}