import React from 'react'

interface PlaceholderWindowProps {
  title: string
  description?: string
}

const PlaceholderWindow: React.FC<PlaceholderWindowProps> = ({ title, description }) => {
  return (
    <div className="placeholder-window">
      <div className="placeholder-window__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
        </svg>
      </div>
      <p className="placeholder-window__message">{title}</p>
      {description && <p className="placeholder-window__hint">{description}</p>}
      <p className="placeholder-window__hint">This feature will be implemented in a future phase.</p>
    </div>
  )
}

export default PlaceholderWindow
