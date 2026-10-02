import React from 'react'
import type { VirtualFile } from '../../../../types'
import { getAppIcon } from '../appIcons'

interface FilesSidebarGroup {
  label: string
  items: VirtualFile[]
}

interface FilesSidebarProps {
  groups: FilesSidebarGroup[]
  currentId: string
  onSelect: (id: string) => void
}

/** Renders a folder glyph for locations, or the app glyph for app-backed entries. */
function SidebarIcon({ item }: { item: VirtualFile }) {
  const appId = item.metadata?.appId as string | undefined
  if (appId && item.type !== 'folder') {
    return <span className="files-sidebar__appicon">{getAppIcon(appId)}</span>
  }
  return (
    <span className="files-sidebar__icon" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="14" height="14">
        <path d="M1.5 4.2c0-.6.5-1.1 1.1-1.1h3l1.3 1.5h6.5c.6 0 1.1.5 1.1 1.1v6.2c0 .6-.5 1.1-1.1 1.1H2.6c-.6 0-1.1-.5-1.1-1.1V4.2z" fill="#e2b768" stroke="#b8873a" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

const FilesSidebar: React.FC<FilesSidebarProps> = ({ groups, currentId, onSelect }) => {
  return (
    <aside className="files-sidebar" aria-label="Places">
      <div className="files-sidebar__scroll">
        {groups.map((group) => (
          <section key={group.label} className="files-sidebar__group">
            <h2 className="files-sidebar__heading">{group.label}</h2>
            <ul className="files-sidebar__list">
              {group.items.map((item) => {
                const isCurrent = item.id === currentId
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`files-sidebar__item ${isCurrent ? 'files-sidebar__item--current' : ''}`}
                      onClick={() => onSelect(item.id)}
                      aria-current={isCurrent ? 'true' : undefined}
                    >
                      <SidebarIcon item={item} />
                      <span className="files-sidebar__label">{item.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  )
}

export default FilesSidebar
