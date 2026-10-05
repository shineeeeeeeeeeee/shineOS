import type { VirtualFile } from '../types'

export const virtualFilesystem: VirtualFile[] = [
  // Root
  {
    id: 'root',
    name: 'Home',
    type: 'folder',
    parentId: null,
    modified: new Date().toISOString(),
    metadata: { isHome: true },
  },
  // Home children
  {
    // A document (not a folder) so Files launches the About application,
    // the same way it launches the app-backed Resume and Contact documents.
    id: 'about',
    name: 'About',
    type: 'document',
    parentId: 'root',
    size: 8400,
    modified: new Date().toISOString(),
    metadata: { appId: 'about' },
  },
  {
    id: 'projects',
    name: 'Projects',
    type: 'folder',
    parentId: 'root',
    modified: new Date().toISOString(),
    metadata: { appId: 'projects' },
  },
  {
    id: 'experience',
    name: 'Experience',
    type: 'folder',
    parentId: 'root',
    modified: new Date().toISOString(),
    metadata: { appId: 'experience' },
  },
  {
    id: 'skills',
    name: 'Skills',
    type: 'folder',
    parentId: 'root',
    modified: new Date().toISOString(),
    metadata: { appId: 'skills' },
  },
  {
    id: 'resume',
    name: 'Resume',
    type: 'document',
    parentId: 'root',
    size: 245000,
    modified: new Date().toISOString(),
    metadata: { appId: 'resume' },
  },
  {
    id: 'contact',
    name: 'Contact',
    type: 'document',
    parentId: 'root',
    size: 12000,
    modified: new Date().toISOString(),
    metadata: { appId: 'contact' },
  },
]

export function getFilesByParent(parentId: string): VirtualFile[] {
  return virtualFilesystem.filter((f) => f.parentId === parentId)
}

export function getFileById(id: string): VirtualFile | undefined {
  return virtualFilesystem.find((f) => f.id === id)
}
