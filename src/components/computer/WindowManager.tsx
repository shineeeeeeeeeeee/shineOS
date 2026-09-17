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
  getNextZIndex: () => number
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

let zIndexCounter = 100

const WindowManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)

  const getNextZIndex = useCallback(() => {
    return ++zIndexCounter
  }, [])

  const openWindow = useCallback((windowData: Omit<WindowState, 'zIndex'>) => {
    setWindows((prev) => {
      // Check if window already exists
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
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    )
    setActiveWindowId((prev) => (prev === id ? null : prev))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    )
  }, [])

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