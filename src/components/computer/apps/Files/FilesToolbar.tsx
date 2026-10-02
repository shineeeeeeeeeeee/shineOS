import React from 'react'
import type { VirtualFile } from '../../../../types'

interface FilesToolbarProps {
  trail: VirtualFile[]
  /** Omitted when there is no history in that direction — the button renders disabled. */
  onBack?: () => void
  onForward?: () => void
  itemCount: number
  onNavigate: (id: string) => void
}

/**
 * Compact Finder-style toolbar: navigation controls, a clickable breadcrumb for
 * the current location, and a light view-control area on the right.
 */
const FilesToolbar: React.FC<FilesToolbarProps> = ({ trail, onBack, onForward, itemCount, onNavigate }) => {
  return (
    <div className="files-toolbar">
      <div className="files-toolbar__nav">
        <button
          type="button"
          className="files-toolbar__button"
          onClick={onBack}
          disabled={!onBack}
          aria-label="Back"
          title="Back"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
            <polyline points="10,3 5,8 10,13" />
          </svg>
        </button>
        <button
          type="button"
          className="files-toolbar__button"
          onClick={onForward}
          disabled={!onForward}
          aria-label="Forward"
          title="Forward"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
            <polyline points="6,3 11,8 6,13" />
          </svg>
        </button>
      </div>

      <nav className="files-toolbar__breadcrumb" aria-label="Current location">
        {trail.map((node, index) => {
          const isLast = index === trail.length - 1
          return (
            <span key={node.id} className="files-toolbar__crumb">
              {index > 0 && (
                <span className="files-toolbar__separator" aria-hidden="true">
                  ›
                </span>
              )}
              {isLast ? (
                <span className="files-toolbar__crumb files-toolbar__crumb--current" aria-current="page">
                  {node.name}
                </span>
              ) : (
                <button
                  type="button"
                  className="files-toolbar__crumb files-toolbar__crumb--link"
                  onClick={() => onNavigate(node.id)}
                >
                  {node.name}
                </button>
              )}
            </span>
          )
        })}
      </nav>

      <div className="files-toolbar__views">
        <span className="files-toolbar__view files-toolbar__view--active" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13">
            <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
            <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
            <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
            <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
          </svg>
        </span>
        <span className="files-toolbar__view" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" width="13" height="13">
            <line x1="2" y1="4" x2="14" y2="4" />
            <line x1="2" y1="8" x2="14" y2="8" />
            <line x1="2" y1="12" x2="14" y2="12" />
          </svg>
        </span>
        <span className="files-toolbar__count">{itemCount} items</span>
      </div>
    </div>
  )
}

export default FilesToolbar
