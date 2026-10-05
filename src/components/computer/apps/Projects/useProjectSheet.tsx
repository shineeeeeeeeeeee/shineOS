import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWindowManager } from '../../WindowManager'
import { getProjectById } from '../../../../data/projects'
import ProjectSheet from './ProjectSheet'

/**
 * Opens a project's detail sheet as a second, ordinary SHINE OS window.
 *
 * A sheet is not a route change and not an overlay inside the workbench: it is a
 * focused document that opens beside the Projects window and behaves like every
 * other window in the OS — draggable, resizable, minimizable, maximizable and
 * closable, with the same three window controls and the same titlebar. Closing it
 * returns the eye to the workbench, which is still there, untouched, exactly where
 * it was left.
 *
 * WHY A DETERMINISTIC WINDOW ID
 * The id is derived from the project id rather than drawn from the shared counter,
 * so a project's sheet is one window that is reopened rather than a family of
 * near-identical windows. Re-selecting a project whose sheet is already open
 * focuses that window instead of stacking a second copy of it, and re-selecting
 * one that was minimized brings the same window back. The Dock treats a
 * minimized sheet as its own entry, so it is always restorable even though it
 * shares the Projects `applicationId`.
 *
 * WHY NOTHING IS DUPLICATED FROM THE WINDOW MANAGER
 * The duplicate-check, the restore-from-minimized path and the z-index raise are
 * all `openWindow`'s existing behaviour for an id that already exists — the same
 * path `useOpenApplication` relies on. This hook only decides *which* id to open
 * and *where* to put it, so there is no second copy of that logic to drift.
 */

export interface ProjectSheetController {
  /** Id of the project whose sheet is currently the frontmost open sheet. */
  activeProjectId: string | null
  /** Opens a project's sheet, or focuses the sheet already showing it. */
  openProject: (projectId: string) => void
  /** Closes a project's sheet. No-op when it is not open. */
  closeProject: (projectId: string) => void
}

/** Prefix that marks a window as a project sheet rather than an application. */
const SHEET_PREFIX = 'project-sheet:'

/**
 * Stable identity for a project's sheet. The same project always resolves to the
 * same window, which is what keeps duplicates out.
 */
export function projectSheetWindowId(projectId: string): string {
  return `${SHEET_PREFIX}${projectId}`
}

/** Recovers the project id from a sheet window id. */
export function projectIdFromSheetWindowId(windowId: string): string | null {
  return windowId.startsWith(SHEET_PREFIX) ? windowId.slice(SHEET_PREFIX.length) : null
}

/** Default geometry. Sized so a landscape capture is legible without a resize. */
const SHEET_WIDTH = 760
const SHEET_HEIGHT = 560

/** Cascade step, so a second sheet does not land exactly on the first. */
const CASCADE_STEP = 34

/** Where the first sheet opens, relative to the workbench's own default spot. */
const CASCADE_ORIGIN = { x: 196, y: 188 }

export function useProjectSheet(reducedMotion = false): ProjectSheetController {
  const { windows, openWindow, focusWindow, closeWindow } = useWindowManager()

  /**
   * The sheet waiting to be brought to the front.
   *
   * WHY THIS IS DEFERRED TO AN EFFECT
   * A plate lives inside the Projects window's content, and `DesktopWindow`
   * focuses whichever window the pointer went down on. That focus fires on the
   * way *up* the event, after the plate's own handler has already opened the
   * sheet — so raising the sheet inside the handler was not enough: the
   * workbench was raised straight back over it, and the new document opened
   * hidden behind the window the reader was looking at.
   *
   * An effect runs once the whole event has settled, so the sheet is raised last
   * and lands in front. Nothing is re-implemented here — this is the same
   * `focusWindow` every other window in the OS uses; only the timing is ours.
   */
  const [pendingFocus, setPendingFocus] = useState<string | null>(null)

  useEffect(() => {
    if (pendingFocus === null) return
    setPendingFocus(null)
    const target = windows.find((window) => window.id === pendingFocus)
    if (target && !target.isMinimized) focusWindow(pendingFocus)
  }, [pendingFocus, windows, focusWindow])

  // Derived from the window list rather than held in local state, so the workbench
  // can never believe a sheet is open after it has been closed or minimised.
  const activeProjectId = useMemo(() => {
    const sheets = windows.filter(
      (window) => !window.isMinimized && projectIdFromSheetWindowId(window.id) !== null
    )
    if (sheets.length === 0) return null
    const frontmost = sheets.reduce((latest, window) => (window.zIndex > latest.zIndex ? window : latest))
    return projectIdFromSheetWindowId(frontmost.id)
  }, [windows])

  const openProject = useCallback(
    (projectId: string) => {
      const project = getProjectById(projectId)
      if (!project) return

      const windowId = projectSheetWindowId(projectId)

      // Already open — hand the existing window back rather than making another.
      // openWindow raises the z-index and lifts a minimized window at the same
      // time, which is exactly the restore-and-focus behaviour wanted here.
      if (windows.some((window) => window.id === windowId)) {
        openWindow({
          id: windowId,
          applicationId: 'projects',
          title: `${project.title} · Projects`,
          content: <ProjectSheet project={project} reducedMotion={reducedMotion} />,
          x: CASCADE_ORIGIN.x,
          y: CASCADE_ORIGIN.y,
          width: SHEET_WIDTH,
          height: SHEET_HEIGHT,
          isMinimized: false,
          isMaximized: false,
        })
        setPendingFocus(windowId)
        return
      }

      // A new sheet. Cascade past any sheets already on the desktop, then keep
      // the whole frame inside the viewport so it never opens off-screen.
      const openSheets = windows.filter(
        (window) => projectIdFromSheetWindowId(window.id) !== null
      ).length

      const margin = 100
      const maxX = Math.max(0, globalThis.innerWidth - SHEET_WIDTH - margin)
      const maxY = Math.max(24, globalThis.innerHeight - SHEET_HEIGHT - margin)

      const x = Math.min(CASCADE_ORIGIN.x + openSheets * CASCADE_STEP, maxX)
      const y = Math.min(CASCADE_ORIGIN.y + openSheets * CASCADE_STEP, maxY)

      openWindow({
        id: windowId,
        applicationId: 'projects',
        title: `${project.title} · Projects`,
        content: <ProjectSheet project={project} reducedMotion={reducedMotion} />,
        x,
        y,
        width: SHEET_WIDTH,
        height: SHEET_HEIGHT,
        isMinimized: false,
        isMaximized: false,
      })
      setPendingFocus(windowId)
    },
    [windows, openWindow, reducedMotion]
  )

  const closeProject = useCallback(
    (projectId: string) => {
      const windowId = projectSheetWindowId(projectId)
      if (windows.some((window) => window.id === windowId)) closeWindow(windowId)
    },
    [windows, closeWindow]
  )

  return useMemo(
    () => ({ activeProjectId, openProject, closeProject }),
    [activeProjectId, openProject, closeProject]
  )
}

export default useProjectSheet