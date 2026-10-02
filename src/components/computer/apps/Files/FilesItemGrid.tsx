import React from 'react'
import type { VirtualFile } from '../../../../types'
import { getApplicationById } from '../../../../data/applications'
import { getAppIcon } from '../appIcons'

interface FilesItemGridProps {
  entries: VirtualFile[]
  selectedId: string | null
  onSelect: (id: string) => void
  onOpen: (entry: VirtualFile) => void
}

function formatSize(bytes?: number): string {
  if (bytes === undefined) return ''
  if (bytes < 1000) return `${bytes} bytes`
  return `${Math.round(bytes / 1000)} KB`
}

/**
 * Main content area. Folders and documents are visually distinct; entries that
 * map to a SHINE OS application borrow that application's icon.
 */
const FilesItemGrid: React.FC<FilesItemGridProps> = ({ entries, selectedId, onSelect, onOpen }) => {
  if (entries.length === 0) {
    return (
      <div className="files-content files-content--empty">
        <p className="files-content__empty-text">This folder is empty.</p>
      </div>
    )
  }

  return (
    <div className="files-content">
      <div className="files-content__grid" role="group" aria-label="Files">
        {entries.map((entry) => {
          const isSelected = entry.id === selectedId
          const appId = entry.metadata?.appId as string | undefined
          const app = appId ? getApplicationById(appId) : undefined
          const appIcon = app ? getAppIcon(app.icon) : null
          const size = formatSize(entry.size)
          const kind = app ? 'Application' : entry.type === 'folder' ? 'Folder' : 'Document'

          return (
            <button
              key={entry.id}
              type="button"
              aria-pressed={isSelected}
              className={`files-item ${isSelected ? 'files-item--selected' : ''}`}
              onClick={() => onSelect(entry.id)}
              onDoubleClick={() => onOpen(entry)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  onOpen(entry)
                }
              }}
              title={`${entry.name} — ${kind}`}
            >
              <span className="files-item__icon" aria-hidden="true">
                {entry.type === 'folder' ? (
                  <svg viewBox="0 0 32 32" width="30" height="30">
                    <path
                      d="M2.5 9.2c0-1.3 1-2.3 2.3-2.3h6.1l2.9 3.3h13.4c1.3 0 2.3 1 2.3 2.3v11.6c0 1.3-1 2.3-2.3 2.3H4.8c-1.3 0-2.3-1-2.3-2.3V9.2z"
                      fill="#e6bd74"
                      stroke="#b8873a"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <path d="M2.5 12.6h25" stroke="#c99a4a" strokeWidth="1.2" />
                  </svg>
                ) : appIcon ? (
                  <span className="files-item__appicon">{appIcon}</span>
                ) : (
                  <svg viewBox="0 0 32 32" width="30" height="30">
                    <path
                      d="M7 3.5h11l7 7v18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 7 28.5v-23A1.5 1.5 0 0 1 8.5 4z"
                      fill="#fbf7ef"
                      stroke="#b9ad99"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <polyline points="18,4 18,10.5 25,10.5" fill="none" stroke="#b9ad99" strokeWidth="1.4" strokeLinejoin="round" />
                    <line x1="11" y1="17" x2="21" y2="17" stroke="#c3b8a5" strokeWidth="1.3" strokeLinecap="round" />
                    <line x1="11" y1="21" x2="21" y2="21" stroke="#c3b8a5" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                )}
              </span>
              <span className="files-item__name">{entry.name}</span>
              <span className="files-item__meta">
                {size && <span className="files-item__size">{size}</span>}
                <span className="files-item__kind">{kind}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FilesItemGrid
