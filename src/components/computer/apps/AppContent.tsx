import React from 'react'
import PlaceholderWindow from '../PlaceholderWindow'
import FilesApp from './Files/FilesApp'
import AboutApp from './About/AboutApp'
import ProjectsApp from './Projects/ProjectsApp'

interface AppContentProps {
  applicationId: string
  title: string
  reducedMotion?: boolean
}

/**
 * Chooses the window body for an application.
 *
 * Applications without a dedicated implementation still render the shared
 * placeholder, so the window system stays untouched.
 */
const AppContent: React.FC<AppContentProps> = ({ applicationId, title, reducedMotion = false }) => {
  switch (applicationId) {
    case 'about':
      return <AboutApp reducedMotion={reducedMotion} />
    case 'projects':
      return <ProjectsApp reducedMotion={reducedMotion} />
    case 'files':
      return <FilesApp reducedMotion={reducedMotion} />
    default:
      return <PlaceholderWindow title={title} />
  }
}

export default AppContent
