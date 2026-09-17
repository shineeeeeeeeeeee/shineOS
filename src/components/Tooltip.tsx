import React, { useState, useRef, useEffect } from 'react'
import './Tooltip.css'

interface TooltipProps {
  text: string
  children: React.ReactNode
  delay?: number
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, delay = 300 }) => {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<number | null>(null)
  const triggerRef = useRef<HTMLElement>(null)

  const show = () => {
    timerRef.current = window.setTimeout(() => setVisible(true), delay)
  }

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <span
      className="tooltip-wrapper"
      ref={triggerRef as any}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span className="tooltip" role="tooltip">
          {text}
        </span>
      )}
    </span>
  )
}

export default Tooltip
