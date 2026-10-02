import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { WindowManagerProvider, useWindowManager, generateWindowId } from './WindowManager'
import { DesktopStateProvider, useDesktopState } from './DesktopState'
import DesktopBackground from './DesktopBackground'
import SystemBar from './SystemBar'
import DesktopIcon from './DesktopIcon'
import DesktopWindow from './DesktopWindow'
import Dock from './Dock'
import CRTEffects from './CRTEffects'
import AppContent from './apps/AppContent'
import type { SortBy } from '../../types'
import type { DesktopIconData } from './DesktopIcon'
import { getApplicationById } from '../../data/applications'
import './Desktop.css'

const GRID_CELL_W = 80
const GRID_CELL_H = 80
const GRID_START_X = 20
const GRID_START_Y = 40
const GRID_MARGIN_RIGHT = 20
const GRID_MARGIN_BOTTOM = 72

const IconMap: Record<string, React.ReactNode> = {
  about: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  projects: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  experience: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  skills: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  resume: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  contact: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  files: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  browser: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 14.68 15a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

const DESKTOP_ICONS: DesktopIconData[] = [
  { id: 'about', label: 'ABOUT', icon: IconMap.about, onOpen: () => {} },
  { id: 'projects', label: 'PROJECTS', icon: IconMap.projects, onOpen: () => {} },
  { id: 'experience', label: 'EXPERIENCE', icon: IconMap.experience, onOpen: () => {} },
  { id: 'skills', label: 'SKILLS', icon: IconMap.skills, onOpen: () => {} },
  { id: 'resume', label: 'RESUME', icon: IconMap.resume, onOpen: () => {} },
  { id: 'contact', label: 'CONTACT', icon: IconMap.contact, onOpen: () => {} },
  { id: 'files', label: 'FILES', icon: IconMap.files, onOpen: () => {} },
  { id: 'browser', label: 'SHINE BROWSER', icon: IconMap.browser, onOpen: () => {} },
  { id: 'settings', label: 'SETTINGS', icon: IconMap.settings, onOpen: () => {} },
]

function getGridCols(vw: number): number {
  return Math.max(1, Math.floor((vw - GRID_MARGIN_RIGHT - GRID_START_X + GRID_CELL_W) / GRID_CELL_W))
}

function getGridPos(index: number, vw: number): { x: number; y: number } {
  const cols = getGridCols(vw)
  return { x: GRID_START_X + (index % cols) * GRID_CELL_W, y: GRID_START_Y + Math.floor(index / cols) * GRID_CELL_H }
}

function sortIcons(icons: DesktopIconData[], positions: Record<string, { x: number; y: number }>, sortBy: SortBy): DesktopIconData[] {
  const s = [...icons]
  if (sortBy === 'name') {
    s.sort((a, b) => a.label.localeCompare(b.label))
  } else if (sortBy === 'kind') {
    s.sort((a, b) => {
      const at = getApplicationById(a.id) ? 'application' : 'folder'
      const bt = getApplicationById(b.id) ? 'application' : 'folder'
      return at.localeCompare(bt)
    })
  } else if (sortBy === 'date-modified') {
    s.sort((a, b) => {
      const ap = positions[a.id], bp = positions[b.id]
      if (!ap && !bp) return 0
      if (!ap) return 1
      if (!bp) return -1
      return ap.y - bp.y || ap.x - bp.x
    })
  }
  return s
}

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  onAction: (a: string) => void
  reducedMotion?: boolean
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAction, reducedMotion }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [sortOpen, setSortOpen] = useState(false)
  const sortTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', h)
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => { document.removeEventListener('mousedown', h); window.removeEventListener('keydown', k) }
  }, [onClose])

  const cx = Math.min(x, window.innerWidth - 220)
  const cy = Math.min(y, window.innerHeight - 340)

  const onSortEnter = () => {
    if (sortTimerRef.current) clearTimeout(sortTimerRef.current)
    setSortOpen(true)
  }
  const onSortLeave = () => {
    sortTimerRef.current = setTimeout(() => setSortOpen(false), 150)
  }

  return (
    <div ref={ref} className={`context-menu ${reducedMotion ? 'context-menu--reduced-motion' : ''}`} style={{ left: cx, top: cy }} role="menu">
      <button type="button" className="context-menu__item" onClick={() => { onAction('new-folder'); onClose() }} role="menuitem">New Folder</button>
      <div className="context-menu__divider" role="separator" />
      <div
        className="context-menu__item context-menu__item--submenu"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={sortOpen}
        onMouseEnter={onSortEnter}
        onMouseLeave={onSortLeave}
        onClick={() => setSortOpen((v) => !v)}
      >
        Sort By
        <span className="context-menu__submenu-arrow" aria-hidden="true">▸</span>
        {sortOpen && (
          <div className="context-menu context-menu--submenu" role="menu" style={{ left: '100%', top: 0, marginLeft: 4 }}>
            <button type="button" className="context-menu__item" onClick={() => { onAction('sort-name'); onClose() }} role="menuitem">Name</button>
            <button type="button" className="context-menu__item" onClick={() => { onAction('sort-kind'); onClose() }} role="menuitem">Kind</button>
            <button type="button" className="context-menu__item" onClick={() => { onAction('sort-date-modified'); onClose() }} role="menuitem">Date Modified</button>
          </div>
        )}
      </div>
      <div className="context-menu__divider" role="separator" />
      <button type="button" className="context-menu__item" onClick={() => { onAction('align-to-grid'); onClose() }} role="menuitem">Align to Grid</button>
      <div className="context-menu__divider" role="separator" />
      <button type="button" className="context-menu__item" onClick={() => { onAction('show-desktop-icons'); onClose() }} role="menuitem">Show Desktop Icons</button>
      <button type="button" className="context-menu__item" onClick={() => { onAction('hide-desktop-icons'); onClose() }} role="menuitem">Hide Desktop Icons</button>
      <div className="context-menu__divider" role="separator" />
      <button type="button" className="context-menu__item" onClick={() => { onAction('change-wallpaper'); onClose() }} role="menuitem">Change Wallpaper</button>
    </div>
  )
}

interface DesktopProps {
  reducedMotion?: boolean
  onExit?: () => void
}

const DesktopInner: React.FC<DesktopProps> = ({ reducedMotion = false, onExit }) => {
  const { windows, activeWindowId, openWindow, closeWindow, focusWindow, moveWindow, resizeWindow, minimizeWindow, maximizeWindow, restoreWindow } = useWindowManager()
  const { desktopIconsVisible, desktopIconPositions, sortBy, setDesktopIconsVisible, setDesktopIconPosition, setSortBy } = useDesktopState()
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const h = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const sortedIcons = useMemo(() => sortIcons(DESKTOP_ICONS, desktopIconPositions, sortBy), [sortBy, desktopIconPositions])

  const getIconPos = useCallback((iconId: string, index: number) => {
    if (desktopIconPositions[iconId]) return desktopIconPositions[iconId]
    return getGridPos(index, viewportSize.width)
  }, [desktopIconPositions, viewportSize.width])

  const handleContextAction = useCallback((action: string) => {
    if (action === 'show-desktop-icons') setDesktopIconsVisible(true)
    else if (action === 'hide-desktop-icons') setDesktopIconsVisible(false)
    else if (action === 'align-to-grid') {
      DESKTOP_ICONS.forEach((icon, index) => {
        const pos = getGridPos(index, viewportSize.width)
        setDesktopIconPosition(icon.id, pos.x, pos.y)
      })
    } else if (action === 'sort-name') {
      setSortBy('name')
    } else if (action === 'sort-kind') {
      setSortBy('kind')
    } else if (action === 'sort-date-modified') {
      setSortBy('date-modified')
    }
  }, [setDesktopIconsVisible, setDesktopIconPosition, setSortBy, viewportSize.width])

  const handleDesktopContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleIconMouseDown = useCallback((e: React.MouseEvent, iconId: string, currentPos: { x: number; y: number }) => {
    if (e.button !== 0) return
    if (!desktopIconsVisible) return
    e.preventDefault()
    dragOffsetRef.current = { x: e.clientX - currentPos.x, y: e.clientY - currentPos.y }
    setDraggingId(iconId)
  }, [desktopIconsVisible])

  const iconClickCountRef = useRef<Record<string, number>>({})
  const iconClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleIconOpen = useCallback((appId: string) => {
    const appWindows = windows.filter((w) => w.applicationId === appId)
    if (appWindows.length > 0) {
      const nonMinimized = appWindows.find((w) => !w.isMinimized)
      if (nonMinimized) {
        focusWindow(nonMinimized.id)
      } else {
        // All windows for this app are minimized — restore the most recent.
        const mostRecent = appWindows.reduce((latest, w) =>
          w.zIndex > latest.zIndex ? w : latest
        )
        restoreWindow(mostRecent.id)
        focusWindow(mostRecent.id)
      }
    } else {
      const app = getApplicationById(appId)
      const newWindowId = generateWindowId(appId)
      openWindow({
        id: newWindowId,
        applicationId: appId,
        title: app?.name || appId,
        content: (
          <AppContent applicationId={appId} title={app?.name || appId} reducedMotion={reducedMotion} />
        ),
        x: 150,
        y: 150,
        width: app?.defaultWidth || 480,
        height: app?.defaultHeight || 360,
        isMinimized: false,
        isMaximized: false,
      })
    }
  }, [windows, openWindow, focusWindow, restoreWindow, reducedMotion])

  const handleIconClick = useCallback((appId: string) => {
    iconClickCountRef.current[appId] = (iconClickCountRef.current[appId] || 0) + 1
    const count = iconClickCountRef.current[appId]
    if (iconClickTimerRef.current) {
      clearTimeout(iconClickTimerRef.current)
    }
    iconClickTimerRef.current = window.setTimeout(() => {
      if (count === 2) {
        handleIconOpen(appId)
      }
      iconClickCountRef.current[appId] = 0
      iconClickTimerRef.current = null
    }, 250)
  }, [handleIconOpen])

  useEffect(() => {
    if (!draggingId) return
    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(GRID_START_X, Math.min(window.innerWidth - GRID_CELL_W - GRID_MARGIN_RIGHT, e.clientX - dragOffsetRef.current.x))
      const newY = Math.max(GRID_START_Y, Math.min(window.innerHeight - GRID_CELL_H - GRID_MARGIN_BOTTOM, e.clientY - dragOffsetRef.current.y))
      setDesktopIconPosition(draggingId, newX, newY)
    }
    const handleMouseUp = () => setDraggingId(null)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp) }
  }, [draggingId, setDesktopIconPosition])

  const handleClose = useCallback((id: string) => { closeWindow(id) }, [closeWindow])
  const handleFocus = useCallback((id: string) => { focusWindow(id) }, [focusWindow])
  const handleMove = useCallback((id: string, x: number, y: number) => { moveWindow(id, x, y) }, [moveWindow])
  const handleResize = useCallback((id: string, width: number, height: number) => { resizeWindow(id, width, height) }, [resizeWindow])
  const handleMinimize = useCallback((id: string) => { minimizeWindow(id) }, [minimizeWindow])
  const handleMaximize = useCallback((id: string) => { maximizeWindow(id) }, [maximizeWindow])
  const handleRestore = useCallback((id: string) => { restoreWindow(id) }, [restoreWindow])

  const handleIconSelect = useCallback((appId: string) => {
    const window = windows.find((w) => w.applicationId === appId && !w.isMinimized)
    if (window) focusWindow(window.id)
  }, [windows, focusWindow])

  return (
    <div className="desktop" onContextMenu={handleDesktopContextMenu}>
      <DesktopBackground reducedMotion={reducedMotion} />
      <SystemBar reducedMotion={reducedMotion} onExit={onExit} />
      {desktopIconsVisible && (
        <div className="desktop__icons" role="list" aria-label="Desktop icons">
          {sortedIcons.map((icon, index) => {
            const pos = getIconPos(icon.id, index)
            const isDragging = draggingId === icon.id
            return (
              <div
                key={icon.id}
                className="desktop-icon-wrapper"
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  zIndex: isDragging ? 100 : 10,
                }}
                onMouseDown={(e) => handleIconMouseDown(e, icon.id, pos)}
                onClick={() => handleIconClick(icon.id)}
              >
                <DesktopIcon
                  data={icon}
                  isSelected={windows.some((w) => w.id === activeWindowId && w.applicationId === icon.id)}
                  onSelect={handleIconSelect}
                  reducedMotion={reducedMotion}
                />
              </div>
            )
          })}
        </div>
      )}
      {windows.map((window) => (
        <DesktopWindow
          key={window.id}
          windowState={window}
          isActive={activeWindowId === window.id}
          onClose={handleClose}
          onFocus={handleFocus}
          onMove={handleMove}
          onResize={handleResize}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onRestore={handleRestore}
          reducedMotion={reducedMotion}
        />
      ))}
      <Dock reducedMotion={reducedMotion} />
      <CRTEffects reducedMotion={reducedMotion} intensity={0.7} />
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
          reducedMotion={reducedMotion}
        />
      )}
    </div>
  )
}

const Desktop: React.FC<DesktopProps> = ({ reducedMotion = false, onExit }) => {
  return (
    <DesktopStateProvider>
      <WindowManagerProvider>
        <DesktopInner reducedMotion={reducedMotion} onExit={onExit} />
      </WindowManagerProvider>
    </DesktopStateProvider>
  )
}

export default Desktop
