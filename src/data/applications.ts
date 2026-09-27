import type { ApplicationDefinition } from '../types'

export const applications: ApplicationDefinition[] = [
  { id: 'about', name: 'About', icon: 'about', defaultWidth: 480, defaultHeight: 380 },
  { id: 'projects', name: 'Projects', icon: 'projects', defaultWidth: 480, defaultHeight: 360 },
  { id: 'experience', name: 'Experience', icon: 'experience', defaultWidth: 480, defaultHeight: 360 },
  { id: 'skills', name: 'Skills', icon: 'skills', defaultWidth: 480, defaultHeight: 360 },
  { id: 'resume', name: 'Resume', icon: 'resume', defaultWidth: 480, defaultHeight: 360 },
  { id: 'contact', name: 'Contact', icon: 'contact', defaultWidth: 480, defaultHeight: 360 },
  { id: 'files', name: 'Files', icon: 'files', defaultWidth: 520, defaultHeight: 380 },
  { id: 'browser', name: 'Shine Browser', icon: 'browser', defaultWidth: 560, defaultHeight: 400 },
  { id: 'settings', name: 'Settings', icon: 'settings', defaultWidth: 480, defaultHeight: 360 },
]

export function getApplicationById(id: string): ApplicationDefinition | undefined {
  return applications.find((app) => app.id === id)
}
