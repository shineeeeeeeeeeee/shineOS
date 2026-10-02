import { useCallback } from 'react'
import { generateWindowId, useWindowManager } from '../WindowManager'
import { getApplicationById } from '../../../data/applications'
import AppContent from './AppContent'

/**
 * Opens a registered SHINE OS application through the existing WindowManager APIs.
 *
 * Behaviour matches how the Dock and Desktop icons launch applications:
 * - an existing visible window is focused, never duplicated
 * - an existing minimized window is restored and then focused
 * - otherwise a single new window is created from the shared `AppContent` renderer
 *
 * The hook adds no Files-specific window logic and does not mutate the registry.
 */
export function useOpenApplication(reducedMotion = false): (appId: string) => void {
  const { windows, openWindow, focusWindow, restoreWindow } = useWindowManager()

  return useCallback(
    (appId: string) => {
      const appWindows = windows.filter((w) => w.applicationId === appId)
      if (appWindows.length > 0) {
        const visible = appWindows.find((w) => !w.isMinimized)
        if (visible) {
          focusWindow(visible.id)
          return
        }
        // Every window for this app is minimized — restore and focus the most recent.
        const mostRecent = appWindows.reduce((latest, w) =>
          w.zIndex > latest.zIndex ? w : latest
        )
        restoreWindow(mostRecent.id)
        focusWindow(mostRecent.id)
        return
      }

      const app = getApplicationById(appId)
      const newWindowId = generateWindowId(appId)
      openWindow({
        id: newWindowId,
        applicationId: appId,
        title: app?.name || appId,
        content: (
          <AppContent
            applicationId={appId}
            title={app?.name || appId}
            reducedMotion={reducedMotion}
          />
        ),
        x: 150,
        y: 150,
        width: app?.defaultWidth || 480,
        height: app?.defaultHeight || 360,
        isMinimized: false,
        isMaximized: false,
      })
    },
    [windows, openWindow, focusWindow, restoreWindow, reducedMotion]
  )
}

export default useOpenApplication