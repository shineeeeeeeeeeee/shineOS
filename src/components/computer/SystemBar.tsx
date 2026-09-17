import React, { useState, useEffect, useRef } from 'react'
import './SystemBar.css'

interface SystemBarProps {
  reducedMotion?: boolean
}

type MenuItem = string | { divider: true }

interface MenuProps {
  label: string
  items: MenuItem[]
}

const SystemBar: React.FC<SystemBarProps> = ({ reducedMotion = false }) => {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const menus: { label: string; items: MenuItem[] }[] = [
    { label: 'SHINE', items: ['About Shine', 'Preferences', { divider: true }, 'Quit'] },
    { label: 'File', items: ['New Window', 'Close Window', { divider: true }, 'Save'] },
    { label: 'View', items: ['Zoom In', 'Zoom Out', 'Actual Size'] },
    { label: 'Go', items: ['Desktop', 'Applications', 'Documents'] },
    { label: 'Window', items: ['Minimize', 'Zoom', 'Bring All to Front'] },
    { label: 'Help', items: ['Documentation', 'Report Issue'] },
  ]

  return (
    <div className={`system-bar ${reducedMotion ? 'system-bar--reduced-motion' : ''}`} role="menubar">
      <div className="system-bar__left">
        <div className="system-bar__apple" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
            <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 12.5c-3 0-5.5-2.5-5.5-5.5S5 2.5 8 2.5s5.5 2.5 5.5 5.5-2.5 5.5-5.5 5.5z"/>
          </svg>
        </div>
        <div className="system-bar__menus" role="group" aria-label="Application menus">
          {menus.map((menu) => (
            <Menu key={menu.label} label={menu.label} items={menu.items} />
          ))}
        </div>
      </div>
      <div className="system-bar__center" />
      <div className="system-bar__right">
        <div className="system-bar__status" aria-hidden="true">
          <span className="system-bar__status-item">●</span>
          <span className="system-bar__status-item">◆</span>
        </div>
        <time className="system-bar__time" dateTime={new Date().toISOString()} aria-live="polite">{time}</time>
      </div>
    </div>
  )
}

// Simple menu component
const Menu: React.FC<MenuProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="system-bar__menu" ref={menuRef}>
      <button
        type="button"
        className={`system-bar__menu-trigger ${isOpen ? 'system-bar__menu-trigger--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={label}
      >
        {label}
      </button>
      {isOpen && (
        <ul className="system-bar__menu-dropdown" role="menu">
          {items.map((item, i) => {
            if (typeof item === 'object' && 'divider' in item) {
              return <li key={`divider-${i}`} className="system-bar__menu-divider" role="separator" />
            }
            return (
              <li key={item} role="menuitem">
                <button type="button" className="system-bar__menu-item">{item}</button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default SystemBar