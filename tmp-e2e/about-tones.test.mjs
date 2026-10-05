import { test, expect } from '@playwright/test'

const URL = 'http://localhost:5174/'
const aboutDockButton = (page) => page.getByRole('button', { name: 'About', exact: true }).first()

test('measure the true artwork background tone', async ({ page }) => {
  await page.goto(URL)
  const enter = page.getByLabel("Enter Shine's computer")
  await enter.waitFor({ state: 'attached', timeout: 30000 })
  await enter.evaluate((el) => el.click())
  const btn = aboutDockButton(page)
  await btn.waitFor({ state: 'visible', timeout: 45000 })
  await btn.click({ force: true })
  const win = page.locator('[role="dialog"][aria-label="About"]')
  await win.waitFor({ state: 'visible', timeout: 15000 })

  const info = await win.locator('.about-illustration__image').evaluate(async (img) => {
    const res = await fetch(img.currentSrc)
    const bmp = await createImageBitmap(await res.blob())
    const c = document.createElement('canvas')
    c.width = bmp.width
    c.height = bmp.height
    const ctx = c.getContext('2d')
    ctx.drawImage(bmp, 0, 0)
    const d = ctx.getImageData(0, 0, bmp.width, bmp.height).data
    const px = (x, y) => {
      const i = (y * bmp.width + x) * 4
      return [d[i], d[i + 1], d[i + 2]]
    }
    const W = bmp.width
    const H = bmp.height
    const samples = {
      topLeft: px(0, 0),
      topRight: px(W - 1, 0),
      bottomLeft: px(0, H - 1),
      bottomRight: px(W - 1, H - 1),
      topMid: px(Math.floor(W / 2), 0),
      bottomMid: px(Math.floor(W / 2), H - 1),
      leftMid: px(0, Math.floor(H / 2)),
      rightMid: px(W - 1, Math.floor(H / 2)),
    }

    // Count the most common colour across a border ring, to find the real
    // dominant background of the artwork.
    const counts = new Map()
    const ring = 6
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (x < ring || y < ring || x >= W - ring || y >= H - ring) {
          const [r, g, b] = px(x, y)
          const k = `${r},${g},${b}`
          counts.set(k, (counts.get(k) || 0) + 1)
        }
      }
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
    return { size: [W, H], samples, dominantBorder: top }
  })

  console.log('SIZE', info.size.join('x'))
  console.log('SAMPLES', JSON.stringify(info.samples))
  console.log('DOMINANT BORDER COLOURS', JSON.stringify(info.dominantBorder))
  expect(info.size[0]).toBe(info.size[1])
})
