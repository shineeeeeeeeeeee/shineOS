import React from 'react'
import './Panel.css'

interface PanelProps {
  children: React.ReactNode
  title?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

const Panel: React.FC<PanelProps> = ({
  children,
  title,
  padding = 'md',
  className = '',
}) => {
  return (
    <div className={`panel panel--padding-${padding} ${className}`.trim()}>
      {title && (
        <div className="panel__header">
          <h3 className="panel__title">{title}</h3>
        </div>
      )}
      <div className="panel__body">{children}</div>
    </div>
  )
}

export default Panel
