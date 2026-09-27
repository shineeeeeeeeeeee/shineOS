import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useWindowManager } from './WindowManager'
import { useDesktopState } from './DesktopState'
import AboutDialog from './AboutDialog'
import './SystemBar.css'

interface SystemBarProps {
  reducedMotion?: boolean
  onExit?: () => void
}

type MenuItem = string | { divider: true } | { label: string; checked: boolean }

interface MenuProps {
  label: string
  items: MenuItem[]
  onAction: (action: string) => void
  onClose: () => void
  reducedMotion?: boolean
}

const SystemBar: React.FC<SystemBarProps> = ({ reducedMotion = false, onExit }) => {
  const { minimizeAll, closeAll, bringAllToFront } = useWindowManager()
  const { toggleDesktopIcons, desktopIconsVisible } = useDesktopState()
  const [time, setTime] = useState('')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [showAbout, setShowAbout] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Close menu on Escape
  useEffect(() => {
    if (!openMenu) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openMenu])

  // Close menu on click outside
  useEffect(() => {
    if (!openMenu) return
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenu])

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'home':
      case 'desktop':
        setOpenMenu(null)
        break
      case 'return-to-world':
        setOpenMenu(null)
        onExit?.()
        break
      case 'minimize-all':
        minimizeAll()
        setOpenMenu(null)
        break
      case 'close-all':
        closeAll()
        setOpenMenu(null)
        break
      case 'bring-all-to-front':
        bringAllToFront()
        setOpenMenu(null)
        break
      case 'show-desktop-icons':
        // Already visible, no action needed
        setOpenMenu(null)
        break
      case 'hide-desktop-icons':
        toggleDesktopIcons()
        setOpenMenu(null)
        break
      case 'about':
        setOpenMenu(null)
        setShowAbout(true)
        break
      default:
        setOpenMenu(null)
    }
  }, [minimizeAll, closeAll, bringAllToFront, toggleDesktopIcons, onExit])

  const closeAbout = useCallback(() => {
    setShowAbout(false)
  }, [])

  const viewItems: MenuItem[] = desktopIconsVisible
    ? [{ label: 'Hide Desktop Icons', checked: true }]
    : [{ label: 'Show Desktop Icons', checked: true }]

  const menus: { label: string; items: MenuItem[] }[] = [
    { label: 'SHINE', items: ['About Shine', 'Preferences', { divider: true }, 'Quit'] },
    { label: 'File', items: ['New Window', 'Close Window', { divider: true }, 'Save'] },
    { label: 'View', items: viewItems },
    { label: 'Go', items: ['Desktop', { divider: true }, 'Return to World'] },
    { label: 'Window', items: ['Minimize All', 'Close All', 'Bring All to Front'] },
    { label: 'Help', items: ['About Shine OS'] },
  ]

  return (
    <>
      <div
        ref={barRef}
        className={`system-bar ${reducedMotion ? 'system-bar--reduced-motion' : ''}`}
        role="menubar"
      >
        <div className="system-bar__left">
          <div className="system-bar__logo" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
              <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="8" cy="8" r="2"/>
            </svg>
          </div>
          <div className="system-bar__menus" role="group" aria-label="Application menus">
            {menus.map((menu) => (
              <Menu
                key={menu.label}
                label={menu.label}
                items={menu.items}
                isOpen={openMenu === menu.label}
                onToggle={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
                onAction={handleAction}
                onClose={() => setOpenMenu(null)}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
        <div className="system-bar__center" />
        <div className="system-bar__right">
          <div className="system-bar__status" aria-hidden="true">
            <span className="system-bar__status-item system-bar__status-item--wifi" title="Network">
              <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                <path d="M8 12l-4-4a4 4 0 0 1 8 0l-4 4zm0-2l-2-2a2 2 0 0 1 4 0l-2 2z" fillOpacity="0.7"/>
              </svg>
            </span>
            <span className="system-bar__status-item system-bar__status-item--sound" title="Sound">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
                <polygon points="4,4 8,4 11,7 11,9 8,12 4,12"/>
                <path d="M12 5a4 4 0 0 1 0 6" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="system-bar__status-item system-bar__status-item--power" title="Power">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
                <path d="M8 2v6" strokeLinecap="round"/>
                <path d="M5 4a5 5 0 1 0 6 0" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
          <time className="system-bar__time" dateTime={new Date().toISOString()} aria-live="polite">{time}</time>
        </div>
      </div>

      {showAbout && (
        <div className="about-dialog-overlay" onClick={closeAbout} role="dialog" aria-modal="true" aria-label="About Shine OS">
          <div className="about-dialog-container" onClick={(e) => e.stopPropagation()}>
            <AboutDialog reducedMotion={reducedMotion} />
          </div>
        </div>
      )}
    </>
  )
}

// Menu component
interface MenuProps {
  label: string
  items: MenuItem[]
  isOpen: boolean
  onToggle: () => void
  onAction: (action: string) => void
  onClose: () => void
  reducedMotion?: boolean
}

const Menu: React.FC<MenuProps> = ({ label, items, isOpen, onToggle, onAction, onClose, reducedMotion }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMenuItemClick = (item: MenuItem) => {
    if (typeof item === 'string') {
      onAction(item)
    } else if ('label' in item) {
      onAction(item.label)
    }
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="system-bar__menu" ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        className={`system-bar__menu-trigger ${isOpen ? 'system-bar__menu-trigger--open' : ''}`}
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={label}
      >
        {label}
      </button>
      {isOpen && (
        <ul className={`system-bar__menu-dropdown ${reducedMotion ? 'system-bar__menu-dropdown--reduced-motion' : ''}`} role="menu">
          {items.map((item, i) => {
            if (typeof item === 'object' && 'divider' in item) {
              return <li key={`divider-${i}`} className="system-bar__menu-divider" role="separator" />
            }
            if (typeof item === 'object' && 'checked' in item) {
              return (
                <li key={item.label} role="menuitem">
                  <button
                    type="button"
                    className="system-bar__menu-item"
                    onClick={() => handleMenuItemClick(item)}
                    role="menuitem"
                  >
                    <span className="system-bar__menu-item-check" aria-hidden="true">✓</span>
                    {item.label}
                  </button>
                </li>
              )
            }
            return (
              <li key={item} role="menuitem">
                <button
                  type="button"
                  className="system-bar__menu-item"
                  onClick={() => handleMenuItemClick(item)}
                  role="menuitem"
                >
                  {item}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default SystemBar
