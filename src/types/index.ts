// ============================================
// Core Type Definitions for Shine OS
// ============================================

import type { ReactNode } from 'react'

export type FileType = 'folder' | 'document' | 'image' | 'link' | 'application'

export interface VirtualFile {
  id: string
  name: string
  type: FileType
  parentId: string | null
  size?: number
  modified?: string
  metadata?: Record<string, unknown>
}

export interface ApplicationDefinition {
  id: string
  name: string
  icon: string // key into icon map or SVG component reference name
  defaultWidth: number
  defaultHeight: number
}

export type SortBy = 'name' | 'kind' | 'date-modified'

export interface DesktopState {
  activeApplicationId: string | null
  focusedWindowId: string | null
  desktopIconsVisible: boolean
  desktopIconPositions: Record<string, { x: number; y: number }>
  sortBy: SortBy
  wallpaperId: string
}

export interface WindowState {
  id: string
  title: string
  content: ReactNode
  x: number
  y: number
  width: number
  height: number
  isMinimized: boolean
  isMaximized: boolean
  previousPosition?: { x: number; y: number; width: number; height: number }
  zIndex: number
}
