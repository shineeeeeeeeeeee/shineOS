import React, { useState, useCallback, useRef, useEffect } from 'react'
import './DesktopIcon.css'

export interface DesktopIconData {
  id: string
  label: string
  icon: React.ReactNode
  onOpen: () => void
  disabled?: boolean
}

interface DesktopIconProps {
  data: DesktopIconData
  isSelected?: boolean
  onSelect?: (id: string) => void
  reducedMotion?: boolean
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  data,
  isSelected = false,
  onSelect,
  reducedMotion = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const clickTimeoutRef = useRef<number | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        data.onOpen()
      }
    },
    [data]
  )

  const handleClick = useCallback(() => {
    if (data.disabled) return

    setClickCount((prev) => prev + 1)
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
    }
    clickTimeoutRef.current = window.setTimeout(() => {
      if (clickCount + 1 === 1) {
        onSelect?.(data.id)
      } else if (clickCount + 1 >= 2) {
        data.onOpen()
      }
      setClickCount(0)
    }, 250)
  }, [data, clickCount, onSelect])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && !data.disabled) {
      setIsPressed(true)
      onSelect?.(data.id)
    }
  }, [data.disabled, data.id, onSelect])

  const handleMouseUp = useCallback(() => {
    setIsPressed(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false)
    setIsHovered(false)
  }, [])

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  if (data.disabled) {
    return (
      <div
        ref={elementRef}
        className={`desktop-icon desktop-icon--disabled ${reducedMotion ? 'desktop-icon--reduced-motion' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        tabIndex={0}
        role="button"
        aria-disabled="true"
        aria-label={`${data.label} (coming soon)`}
        onKeyDown={handleKeyDown}
      >
        <div className="desktop-icon__image" aria-hidden="true">{data.icon}</div>
        <span className="desktop-icon__label">{data.label}</span>
        <span className="desktop-icon__badge" aria-hidden="true">Soon</span>
      </div>
    )
  }

  return (
    <div
      ref={elementRef}
      className={`desktop-icon ${isSelected ? 'desktop-icon--selected' : ''} ${isHovered ? 'desktop-icon--hovered' : ''} ${isPressed ? 'desktop-icon--pressed' : ''} ${reducedMotion ? 'desktop-icon--reduced-motion' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`Open ${data.label}`}
      aria-pressed={isSelected}
      onKeyDown={handleKeyDown}
    >
      <div className="desktop-icon__image" aria-hidden="true">{data.icon}</div>
      <span className="desktop-icon__label">{data.label}</span>
    </div>
  )
}

export default DesktopIcon