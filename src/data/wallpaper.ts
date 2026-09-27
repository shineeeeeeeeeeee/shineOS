export interface WallpaperConfig {
  id: string
  name: string
  description: string
  wallpaper: {
    background: string
  }
}

export const defaultWallpaper: WallpaperConfig = {
  id: 'shine-default',
  name: 'Shine Default',
  description: 'The classic Shine OS desktop — deep teal with subtle warmth.',
  wallpaper: {
    background: '#1a2a2e',
  },
}

export const availableWallpapers: WallpaperConfig[] = [defaultWallpaper]

export function getWallpaperById(id: string): WallpaperConfig | undefined {
  return availableWallpapers.find((w) => w.id === id)
}
