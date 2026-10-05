import { test } from '@playwright/test'

const URL = 'http://localhost:5174/'
const aboutDockButton = (page) => page.getByRole('button', { name: 'About', exact: true }).first()

async function openAbout(page, width, height) {
  await page.setViewportSize({ width, height })
  await page.goto(URL)
  const enter = page.getByLabel("Enter Shine's computer")
  await enter.waitFor({ state: 'attached', timeout: 30000 })
  await enter.evaluate((el) => el.click())
  const btn = aboutDockButton(page)
  await btn.waitFor({ state: 'visible', timeout: 45000 })
  await btn.click({ force: true })
  const win = page.locator('[role="dialog"][aria-label="About"]')
  await win.waitFor({ state: 'visible', timeout: 15000 })
  return win
}

test('capture About at several window sizes', async ({ page }) => {
  const win = await openAbout(page, 1280, 900)
  await page.waitForTimeout(1200)
  await win.screenshot({ path: 'shots/about-default.png' })

  // Report the tone immediately around the image edges to prove the merge.
  const report = await win.locator('.about-illustration__image').evaluate((el) => {
    const r = el.getBoundingClientRect()
    return {
      img: { w: Math.round(r.width), h: Math.round(r.height) },
      natural: { w: el.naturalWidth, h: el.naturalHeight },
      figureMargin: getComputedStyle(el.parentElement).margin,
    }
  })
  console.log('LAYOUT', JSON.stringify(report))

  // Narrow window: shrink the window shell, not the viewport.
  await page.evaluate(() => {
    const el = document.querySelector('.desktop-window')
    if (el) {
      el.style.width = '340px'
      el.style.height = '620px'
    }
  })
  await page.waitForTimeout(600)
  await win.screenshot({ path: 'shots/about-narrow.png' })

  // Wide window.
  await page.evaluate(() => {
    const el = document.querySelector('.desktop-window')
    if (el) {
      el.style.width = '980px'
      el.style.height = '700px'
    }
  })
  await page.waitForTimeout(600)
  await win.screenshot({ path: 'shots/about-wide.png' })
})
