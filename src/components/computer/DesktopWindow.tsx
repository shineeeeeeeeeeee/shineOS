import React, { useRef, useEffect, useCallback, useState } from 'react'
import './DesktopWindow.css'

export interface WindowState {
  id: string
  applicationId: string
  title: string
  content: React.ReactNode
  x: number
  y: number
  width: number
  height: number
  isMinimized: boolean
  isMaximized: boolean
  previousPosition?: { x: number; y: number; width: number; height: number }
  zIndex: number
}

interface DesktopWindowProps {
  windowState: WindowState
  isActive: boolean
  onClose: (id: string) => void
  onFocus: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
  onResize?: (id: string, width: number, height: number) => void
  onMinimize?: (id: string) => void
  onMaximize?: (id: string) => void
  onRestore?: (id: string) => void
  reducedMotion?: boolean
}

const DesktopWindow: React.FC<DesktopWindowProps> = ({
  windowState,
  isActive,
  onClose,
  onFocus,
  onMove,
  onResize,
  onMinimize,
  onMaximize,
  onRestore,
  reducedMotion = false,
}) => {
  const titlebarRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, windowX: 0, windowY: 0 })
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 })

  // Focus window on mount and when clicking content
  useEffect(() => {
    if (isActive) {
      onFocus(windowState.id)
    }
  }, [isActive, windowState.id, onFocus])

  const handleTitlebarPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Don't drag if clicking on traffic-light controls or other interactive elements
      if ((e.target as HTMLElement).closest('.desktop-window__control')) return
      if (windowState.isMaximized) return
      if (e.button !== 0) return

      e.preventDefault()
      setIsDragging(true)
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        windowX: windowState.x,
        windowY: windowState.y,
      }
      // Set pointer capture for reliable drag tracking
      if (titlebarRef.current) {
        titlebarRef.current.setPointerCapture(e.pointerId)
      }
      onFocus(windowState.id)
    },
    [windowState, onFocus],
  )

  const handleTitlebarPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      const newX = Math.max(0, Math.min(globalThis.innerWidth - 100, dragStartRef.current.windowX + dx))
      const newY = Math.max(24, Math.min(globalThis.innerHeight - 100, dragStartRef.current.windowY + dy))
      onMove(windowState.id, newX, newY)
    },
    [isDragging, windowState.id, onMove],
  )

  const handleTitlebarPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      setIsDragging(false)
      if (titlebarRef.current) {
        try {
          titlebarRef.current.releasePointerCapture(e.pointerId)
        } catch {
          // Pointer may have been captured by a different element
        }
      }
    },
    [isDragging],
  )

  // Global pointer listeners keep the drag alive even when the pointer leaves the titlebar.
  // These run on the window so they never fight the React synthetic handlers.
  useEffect(() => {
    if (!isDragging) return

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      const margin = 100
      const newX = Math.max(0, Math.min(globalThis.innerWidth - margin, dragStartRef.current.windowX + dx))
      const newY = Math.max(24, Math.min(globalThis.innerHeight - margin, dragStartRef.current.windowY + dy))
      onMove(windowState.id, newX, newY)
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      if (titlebarRef.current) {
        try {
          titlebarRef.current.releasePointerCapture(-1)
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [isDragging, windowState.id, onMove])

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (windowState.isMaximized) return

      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: windowState.width,
        height: windowState.height,
      }
      onFocus(windowState.id)
      if (resizeHandleRef.current) {
        resizeHandleRef.current.setPointerCapture(e.pointerId)
      }
    },
    [windowState, onFocus],
  )

  useEffect(() => {
    if (!isResizing) return

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - resizeStartRef.current.x
      const dy = e.clientY - resizeStartRef.current.y
      const newWidth = Math.max(300, resizeStartRef.current.width + dx)
      const newHeight = Math.max(200, resizeStartRef.current.height + dy)
      onResize?.(windowState.id, newWidth, newHeight)
    }

    const handlePointerUp = () => {
      setIsResizing(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [isResizing, windowState.id, onResize])

  return (
    <div
      // A minimized window stays mounted and is taken out of the desktop with the
      // native `hidden` attribute, which removes it from layout, hit-testing and
      // the accessibility tree. Unmounting instead would destroy the window's
      // React subtree, so restoring would remount the app from scratch and lose
      // whatever state it held (e.g. the Files location).
      hidden={windowState.isMinimized}
      className={`desktop-window ${isActive ? 'desktop-window--active' : ''} ${windowState.isMaximized ? 'desktop-window--maximized' : ''} ${isDragging ? 'desktop-window--dragging' : ''} ${reducedMotion ? 'desktop-window--reduced-motion' : ''}`}
      style={{
        left: windowState.isMaximized ? 0 : windowState.x,
        top: windowState.isMaximized ? 24 : windowState.y,
        width: windowState.isMaximized ? '100vw' : windowState.width,
        height: windowState.isMaximized ? `calc(100vh - 24px)` : windowState.height,
        zIndex: windowState.zIndex,
      } as React.CSSProperties}
      role="dialog"
      aria-label={windowState.title}
      tabIndex={0}
    >
      <div
        ref={titlebarRef}
        className="desktop-window__titlebar"
        onPointerDown={handleTitlebarPointerDown}
        onPointerMove={handleTitlebarPointerMove}
        onPointerUp={handleTitlebarPointerUp}
        onPointerCancel={handleTitlebarPointerUp}
        onClick={() => onFocus(windowState.id)}
      >
        <div className="desktop-window__controls">
          <button
            type="button"
            className="desktop-window__control desktop-window__control--close"
            onPointerDown={(e) => { e.stopPropagation(); }}
            onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
            aria-label="Close window"
            tabIndex={0}
          >
            <svg viewBox="0 0 12 12" fill="none" width="12" height="12" aria-hidden="true">
              <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button
            type="button"
            className="desktop-window__control desktop-window__control--minimize"
            onPointerDown={(e) => { e.stopPropagation(); }}
            onClick={(e) => { e.stopPropagation(); onMinimize?.(windowState.id); }}
            aria-label="Minimize window"
            tabIndex={0}
          >
            <svg viewBox="0 0 12 12" fill="none" width="12" height="12" aria-hidden="true">
              <path d="M3 6H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button
            type="button"
            className="desktop-window__control desktop-window__control--maximize"
            onPointerDown={(e) => { e.stopPropagation(); }}
            onClick={(e) => {
              e.stopPropagation()
              if (windowState.isMaximized) {
                onRestore?.(windowState.id)
              } else {
                onMaximize?.(windowState.id)
              }
            }}
            aria-label={windowState.isMaximized ? 'Restore window' : 'Maximize window'}
            tabIndex={0}
          >
            <svg viewBox="0 0 12 12" fill="none" width="12" height="12" aria-hidden="true">
              <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
        </div>
        <span className="desktop-window__title">{windowState.title}</span>
      </div>
      <div
        ref={contentRef}
        className="desktop-window__content"
        tabIndex={0}
        onClick={() => onFocus(windowState.id)}
      >
        {windowState.content}
      </div>
      <div
        ref={resizeHandleRef}
        className="desktop-window__resize-handle"
        onPointerDown={handleResizePointerDown}
        aria-label="Resize window"
        role="slider"
        tabIndex={0}
        aria-orientation="horizontal"
      />
    </div>
  )
}

export default DesktopWindow
