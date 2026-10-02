import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import { WindowState } from './DesktopWindow'

interface WindowManagerContextValue {
  windows: WindowState[]
  activeWindowId: string | null
  openWindow: (window: Omit<WindowState, 'zIndex'>) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, x: number, y: number) => void
  resizeWindow: (id: string, width: number, height: number) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  minimizeAll: () => void
  closeAll: () => void
  bringAllToFront: () => void
  getNextZIndex: () => number
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

let zIndexCounter = 100
let windowIdCounter = 0

/**
 * Generates a unique window ID that never collides with an application ID.
 * Format: window-<appId>-<n>
 */
export const generateWindowId = (appId: string): string =>
  `window-${appId}-${++windowIdCounter}`

const WindowManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)

  const getNextZIndex = useCallback(() => {
    return ++zIndexCounter
  }, [])

  const openWindow = useCallback((windowData: Omit<WindowState, 'zIndex'>) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === windowData.id)
      if (existing) {
        return prev.map((w) =>
          w.id === windowData.id
            ? { ...w, isMinimized: false, zIndex: getNextZIndex() }
            : w
        )
      }
      return [...prev, { ...windowData, zIndex: getNextZIndex() }]
    })
    setActiveWindowId(windowData.id)
  }, [getNextZIndex])

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
    setActiveWindowId((prev) => (prev === id ? null : prev))
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, zIndex: getNextZIndex() } : w
      )
    )
    setActiveWindowId(id)
  }, [getNextZIndex])

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    )
  }, [])

  const resizeWindow = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width, height } : w))
    )
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        // Snapshot the live geometry on EVERY minimize so a Dock restore always
        // returns the window to where it actually was, not to a stale snapshot
        // left over from an earlier minimize/restore cycle.
        // Maximized windows keep their pre-maximize x/y/width/height in those
        // same fields (maximize never rewrites them), so the snapshot is
        // correct whether or not the window is maximized.
        return {
          ...w,
          isMinimized: true,
          previousPosition: { x: w.x, y: w.y, width: w.width, height: w.height },
        }
      })
    )
    setActiveWindowId((prev) => (prev === id ? null : prev))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        if (w.isMaximized) {
          const prevPos = w.previousPosition || { x: 100, y: 100, width: 480, height: 360 }
          return { ...w, isMaximized: false, x: prevPos.x, y: prevPos.y, width: prevPos.width, height: prevPos.height }
        }
        return {
          ...w,
          isMaximized: true,
          previousPosition: { x: w.x, y: w.y, width: w.width, height: w.height },
        }
      })
    )
  }, [])

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        if (!w.isMinimized && !w.isMaximized) return w
        // Both flags are cleared in a single pass. Handling them separately let a
        // window that was maximized when it got minimized return from its first
        // restore un-maximized but STILL minimized, so the Dock entry stayed and
        // the window stayed invisible.
        // previousPosition is rewritten on every minimize (and on maximize), so
        // it always holds the geometry this window should come back to.
        const prevPos = w.previousPosition ?? { x: w.x, y: w.y, width: w.width, height: w.height }
        return {
          ...w,
          isMinimized: false,
          isMaximized: false,
          x: prevPos.x,
          y: prevPos.y,
          width: prevPos.width,
          height: prevPos.height,
        }
      })
    )
  }, [])

  const minimizeAll = useCallback(() => {
    setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })))
    setActiveWindowId(null)
  }, [])

  const closeAll = useCallback(() => {
    setWindows([])
    setActiveWindowId(null)
  }, [])

  const bringAllToFront = useCallback(() => {
    setWindows((prev) => prev.map((w) => ({ ...w, zIndex: getNextZIndex() })))
  }, [getNextZIndex])

  const value = useMemo(
    () => ({
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      focusWindow,
      moveWindow,
      resizeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      minimizeAll,
      closeAll,
      bringAllToFront,
      getNextZIndex,
    }),
    [
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      focusWindow,
      moveWindow,
      resizeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      minimizeAll,
      closeAll,
      bringAllToFront,
      getNextZIndex,
    ]
  )

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  )
}

const useWindowManager = (): WindowManagerContextValue => {
  const context = useContext(WindowManagerContext)
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider')
  }
  return context
}

export { WindowManagerProvider, useWindowManager }
export type { WindowManagerContextValue }
