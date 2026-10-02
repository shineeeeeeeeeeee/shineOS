import React, { useCallback, useMemo, useState } from 'react'
import type { VirtualFile } from '../../../../types'
import { getFileById, getFilesByParent, virtualFilesystem } from '../../../../data/filesystem'
import { getApplicationById } from '../../../../data/applications'
import { useOpenApplication } from '../useOpenApplication'
import FilesToolbar from './FilesToolbar'
import FilesSidebar from './FilesSidebar'
import FilesItemGrid from './FilesItemGrid'
import './FilesApp.css'

interface FilesAppProps {
  reducedMotion?: boolean
}

/** The filesystem entry flagged with `metadata.isHome`, falling back to the root entry. */
const homeFile =
  virtualFilesystem.find((f) => (f.metadata?.isHome as boolean | undefined) === true) ??
  virtualFilesystem.find((f) => f.parentId === null)

const HOME_ID = homeFile?.id ?? 'root'

function sortEntries(entries: VirtualFile[]): VirtualFile[] {
  return [...entries].sort((a, b) => {
    if ((a.type === 'folder') !== (b.type === 'folder')) {
      return a.type === 'folder' ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })
}

/**
 * Finder-like shell for the Files application.
 *
 * All displayed entries come straight from `src/data/filesystem.ts` — nothing
 * is duplicated here. Navigation (current location, back/forward history) is
 * application-local state; the window system only renders it as content.
 */
const FilesApp: React.FC<FilesAppProps> = ({ reducedMotion = false }) => {
  /**
   * Application-local navigation history, expressed as an array of location ids
   * plus a cursor. Navigating to a new location truncates anything ahead of the
   * cursor (clearing the forward history); moving the cursor never duplicates
   * entries. This is intentionally *not* the browser history API.
   */
  const [history, setHistory] = useState<string[]>([HOME_ID])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const currentId = history[historyIndex] ?? HOME_ID
  const current = getFileById(currentId) ?? homeFile

  const openApplication = useOpenApplication(reducedMotion)

  const entries = useMemo(() => sortEntries(getFilesByParent(currentId)), [currentId])

  /** Ancestor chain of the current location, root first — used for the breadcrumb. */
  const trail = useMemo(() => {
    const chain: VirtualFile[] = []
    const seen = new Set<string>()
    let node: VirtualFile | undefined = current
    while (node && !seen.has(node.id)) {
      seen.add(node.id)
      chain.unshift(node)
      node = node.parentId ? getFileById(node.parentId) : undefined
    }
    return chain
  }, [current])

  /** Sidebar groups, derived from the filesystem rather than hard-coded lists. */
  const sidebarGroups = useMemo(() => {
    const favorites = homeFile ? [homeFile, ...getFilesByParent(homeFile.id)] : []
    const groups: { label: string; items: VirtualFile[] }[] = []
    if (favorites.length > 0) groups.push({ label: 'Favorites', items: favorites })
    const locations = homeFile ? [homeFile] : []
    if (locations.length > 0) groups.push({ label: 'Locations', items: locations })
    return groups
  }, [])

  const canGoBack = historyIndex > 0
  const canGoForward = historyIndex < history.length - 1

  /** Single navigation entry point shared by the grid, the breadcrumb and the sidebar. */
  const handleNavigate = useCallback(
    (id: string) => {
      const target = getFileById(id)
      // Only real folders are locations — documents are opened, not entered.
      if (!target || target.type !== 'folder') return
      setSelectedId(null)
      setHistory((prev) => {
        if (prev[historyIndex] === id) return prev
        return [...prev.slice(0, historyIndex + 1), id]
      })
      setHistoryIndex((index) => {
        if (history[index] === id) return index
        return index + 1
      })
    },
    [history, historyIndex]
  )

  const handleBack = useCallback(() => {
    if (historyIndex <= 0) return
    setSelectedId(null)
    setHistoryIndex((index) => Math.max(0, index - 1))
  }, [historyIndex])

  const handleForward = useCallback(() => {
    if (historyIndex >= history.length - 1) return
    setSelectedId(null)
    setHistoryIndex((index) => Math.min(history.length - 1, index + 1))
  }, [history, historyIndex])

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  /**
   * Opening an entry: folders are entered as locations, app-backed files launch
   * their registered SHINE OS application through the shared window APIs.
   */
  const handleOpen = useCallback(
    (entry: VirtualFile) => {
      setSelectedId(entry.id)
      if (entry.type === 'folder') {
        handleNavigate(entry.id)
        return
      }
      const appId = entry.metadata?.appId as string | undefined
      if (appId && getApplicationById(appId)) {
        openApplication(appId)
      }
    },
    [handleNavigate, openApplication]
  )

  /** Sidebar clicks go through the exact same open logic as the content grid. */
  const handleSidebarOpen = useCallback(
    (id: string) => {
      const entry = getFileById(id)
      if (entry) handleOpen(entry)
    },
    [handleOpen]
  )

  return (
    <div className={`files-app ${reducedMotion ? 'files-app--reduced-motion' : ''}`}>
      <FilesToolbar
        trail={trail}
        itemCount={entries.length}
        onNavigate={handleNavigate}
        onBack={canGoBack ? handleBack : undefined}
        onForward={canGoForward ? handleForward : undefined}
      />
      <div className="files-app__body">
        <FilesSidebar
          groups={sidebarGroups}
          currentId={currentId}
          onSelect={handleSidebarOpen}
        />
        <FilesItemGrid
          entries={entries}
          selectedId={selectedId}
          onSelect={handleSelect}
          onOpen={handleOpen}
        />
      </div>
      <div className="files-app__status">
        <span className="files-app__status-location">{current?.name}</span>
        <span className="files-app__status-hint">
          {entries.length === 0
            ? 'Empty folder'
            : `${entries.length} item${entries.length === 1 ? '' : 's'}`}
        </span>
      </div>
    </div>
  )
}

export default FilesApp
