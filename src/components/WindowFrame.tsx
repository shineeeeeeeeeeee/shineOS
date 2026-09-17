import React from 'react'
import './WindowFrame.css'

interface WindowFrameProps {
  children: React.ReactNode
  title?: string
  width?: number | string
  height?: number | string
  onClose?: () => void
  className?: string
}

const WindowFrame: React.FC<WindowFrameProps> = ({
  children,
  title = 'Window',
  width = 400,
  height = 'auto',
  onClose,
  className = '',
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div className={`window-frame ${className}`} style={style}>
      <div className="window-frame__titlebar">
        <div className="window-frame__traffic-lights">
          <span className="window-frame__dot window-frame__dot--red" />
          <span className="window-frame__dot window-frame__dot--yellow" />
          <span className="window-frame__dot window-frame__dot--green" />
        </div>
        <span className="window-frame__title">{title}</span>
        <div className="window-frame__actions">
          {onClose && (
            <button
              type="button"
              className="window-frame__close"
              onClick={onClose}
              aria-label="Close window"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="window-frame__content">{children}</div>
    </div>
  )
}

export default WindowFrame
