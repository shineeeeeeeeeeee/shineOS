import type { ApplicationDefinition } from '../types'

export const applications: ApplicationDefinition[] = [
  // `about` is a full-window editorial document, so it opens wide enough for the
  // approved two-column composition (text | artwork) to land immediately instead of
  // waiting for a manual resize. The window is still an ordinary draggable, resizable
  // window — it is just wider than the placeholder apps, and every band still reflows
  // through the About container queries at narrow widths.
  { id: 'about', name: 'About', icon: 'about', defaultWidth: 860, defaultHeight: 460 },
  // Projects is image-first: the lead plate only reads at a size where a real
  // application screenshot is legible, so the window opens tall enough to land
  // the Atlas and Kindness Map plates immediately rather than after a resize.
  // Every band still reflows through the Projects container queries.
  { id: 'projects', name: 'Projects', icon: 'projects', defaultWidth: 880, defaultHeight: 620 },
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
