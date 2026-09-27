import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { DesktopState, SortBy } from '../../types'

interface DesktopStateContextValue extends DesktopState {
  setActiveApplication: (id: string | null) => void
  setFocusedWindow: (id: string | null) => void
  setDesktopIconsVisible: (visible: boolean) => void
  toggleDesktopIcons: () => void
  setDesktopIconPosition: (id: string, x: number, y: number) => void
  setSortBy: (sort: SortBy) => void
  setWallpaper: (id: string) => void
}

const DesktopStateContext = createContext<DesktopStateContextValue | null>(null)

const initialState: DesktopState = {
  activeApplicationId: null,
  focusedWindowId: null,
  desktopIconsVisible: false,
  desktopIconPositions: {},
  sortBy: 'name',
  wallpaperId: 'shine-default',
}

export const DesktopStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DesktopState>(initialState)

  const setActiveApplication = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, activeApplicationId: id }))
  }, [])

  const setFocusedWindow = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, focusedWindowId: id }))
  }, [])

  const setDesktopIconsVisible = useCallback((visible: boolean) => {
    setState((prev) => ({ ...prev, desktopIconsVisible: visible }))
  }, [])

  const toggleDesktopIcons = useCallback(() => {
    setState((prev) => ({ ...prev, desktopIconsVisible: !prev.desktopIconsVisible }))
  }, [])

  const setDesktopIconPosition = useCallback((id: string, x: number, y: number) => {
    setState((prev) => ({
      ...prev,
      desktopIconPositions: { ...prev.desktopIconPositions, [id]: { x, y } },
    }))
  }, [])

  const setSortBy = useCallback((sort: SortBy) => {
    setState((prev) => ({ ...prev, sortBy: sort }))
  }, [])

  const setWallpaper = useCallback((id: string) => {
    setState((prev) => ({ ...prev, wallpaperId: id }))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      setActiveApplication,
      setFocusedWindow,
      setDesktopIconsVisible,
      toggleDesktopIcons,
      setDesktopIconPosition,
      setSortBy,
      setWallpaper,
    }),
    [
      state,
      setActiveApplication,
      setFocusedWindow,
      setDesktopIconsVisible,
      toggleDesktopIcons,
      setDesktopIconPosition,
      setSortBy,
      setWallpaper,
    ],
  )

  return <DesktopStateContext.Provider value={value}>{children}</DesktopStateContext.Provider>
}

export function useDesktopState(): DesktopStateContextValue {
  const context = useContext(DesktopStateContext)
  if (!context) {
    throw new Error('useDesktopState must be used within a DesktopStateProvider')
  }
  return context
}
