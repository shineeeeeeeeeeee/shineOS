import { test, expect } from '@playwright/test'

const URL = 'http://localhost:5174/'
const aboutDockButton = (page) => page.getByRole('button', { name: 'About', exact: true }).first()

test('document paper sits within a couple of RGB units of the artwork background', async ({ page }) => {
  await page.goto(URL)
  const enter = page.getByLabel("Enter Shine's computer")
  await enter.waitFor({ state: 'attached', timeout: 30000 })
  await enter.evaluate((el) => el.click())
  const btn = aboutDockButton(page)
  await btn.waitFor({ state: 'visible', timeout: 45000 })
  await btn.click({ force: true })
  const win = page.locator('[role="dialog"][aria-label="About"]')
  await win.waitFor({ state: 'visible', timeout: 15000 })

  const paperTone = await win
    .locator('.about-app__paper')
    .evaluate((el) => getComputedStyle(el).backgroundColor)

  // Measure the mean of the artwork's own background ring.
  const mean = await win.locator('.about-illustration__image').evaluate(async (img) => {
    const res = await fetch(img.currentSrc)
    const bmp = await createImageBitmap(await res.blob())
    const c = document.createElement('canvas')
    c.width = bmp.width
    c.height = bmp.height
    const ctx = c.getContext('2d')
    ctx.drawImage(bmp, 0, 0)
    const ring = 6
    let r = 0
    let g = 0
    let b = 0
    let n = 0
    for (let y = 0; y < bmp.height; y += 2) {
      for (let x = 0; x < bmp.width; x += 2) {
        if (x < ring || y < ring || x >= bmp.width - ring || y >= bmp.height - ring) {
          const d = ctx.getImageData(x, y, 1, 1).data
          r += d[0]
          g += d[1]
          b += d[2]
          n++
        }
      }
    }
    return [Math.round(r / n), Math.round(g / n), Math.round(b / n)]
  })

  const paper = paperTone.match(/\d+/g).map(Number)
  console.log('PAPER', paperTone, '| ARTWORK BORDER MEAN', mean.join(','))

  // The paper must be visually indistinguishable from the artwork background.
  const delta = [0, 1, 2].map((i) => Math.abs(paper[i] - mean[i]))
  console.log('DELTA', delta.join(','))
  expect(Math.max(...delta)).toBeLessThanOrEqual(3)
})
