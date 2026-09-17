import React, { useRef, useEffect, useCallback, useState } from 'react'
import './DesktopWindow.css'

export interface WindowState {
  id: string
  title: string
  content: React.ReactNode
  x: number
  y: number
  width: number
  height: number
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

interface DesktopWindowProps {
  windowState: WindowState
  isActive: boolean
  onClose: (id: string) => void
  onFocus: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
  onResize?: (id: string, width: number, height: number) => void
  reducedMotion?: boolean
}

const DesktopWindow: React.FC<DesktopWindowProps> = ({
  windowState,
  isActive,
  onClose,
  onFocus,
  onMove,
  onResize,
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

  const handleTitlebarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) return
      if (windowState.isMaximized) return

      setIsDragging(true)
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        windowX: windowState.x,
        windowY: windowState.y,
      }
      onFocus(windowState.id)
      e.preventDefault()
    },
    [windowState, onFocus]
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (windowState.isMaximized) return

      setIsResizing(true)
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: windowState.width,
        height: windowState.height,
      }
      onFocus(windowState.id)
      e.preventDefault()
      e.stopPropagation()
    },
    [windowState, onFocus]
  )

  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.x
        const dy = e.clientY - dragStartRef.current.y
        const newX = Math.max(0, Math.min(globalThis.innerWidth - 100, dragStartRef.current.windowX + dx))
        const newY = Math.max(24, Math.min(globalThis.innerHeight - 100, dragStartRef.current.windowY + dy))
        onMove(windowState.id, newX, newY)
      }

      if (isResizing) {
        const dx = e.clientX - resizeStartRef.current.x
        const dy = e.clientY - resizeStartRef.current.y
        const newWidth = Math.max(300, resizeStartRef.current.width + dx)
        const newHeight = Math.max(200, resizeStartRef.current.height + dy)
        onResize?.(windowState.id, newWidth, newHeight)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    globalThis.addEventListener('mousemove', handleMouseMove)
    globalThis.addEventListener('mouseup', handleMouseUp)

    return () => {
      globalThis.removeEventListener('mousemove', handleMouseMove)
      globalThis.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, windowState.id, onMove, onResize])

  if (windowState.isMinimized) return null

  return (
    <div
      className={`desktop-window ${isActive ? 'desktop-window--active' : ''} ${windowState.isMaximized ? 'desktop-window--maximized' : ''} ${reducedMotion ? 'desktop-window--reduced-motion' : ''}`}
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
        onMouseDown={handleTitlebarMouseDown}
        onClick={() => onFocus(windowState.id)}
      >
        <div className="desktop-window__controls">
          <button
            type="button"
            className="desktop-window__control desktop-window__control--close"
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
            onClick={(e) => { e.stopPropagation(); }}
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
            onClick={(e) => { e.stopPropagation(); }}
            aria-label="Maximize window"
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
        onMouseDown={handleResizeMouseDown}
        aria-label="Resize window"
        role="slider"
        tabIndex={0}
        aria-orientation="horizontal"
      />
    </div>
  )
}

export default DesktopWindow