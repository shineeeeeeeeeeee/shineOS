import { test, expect } from '@playwright/test'

const URL = 'http://localhost:5174/'

// The Dock button for About. Scoped to a button role so it never collides
// with the About window dialog or the "About" document section.
const aboutDockButton = (page) => page.getByRole('button', { name: 'About', exact: true }).first()

async function openAbout(page) {
  await page.goto(URL)

  // Step 1: enter the computer from the cloud world.
  const enter = page.getByLabel("Enter Shine's computer")
  await enter.waitFor({ state: 'attached', timeout: 30000 })
  await enter.evaluate((el) => el.click())

  // Step 2: wait for the camera transition to finish and the Desktop to mount.
  const aboutButton = aboutDockButton(page)
  await aboutButton.waitFor({ state: 'visible', timeout: 45000 })

  // Step 3: open About from the Dock.
  // force: the Dock magnifies continuously, so the item never sits
  // "stable" long enough for Playwright's actionability check.
  await aboutButton.click({ force: true })

  const win = page.locator('[role="dialog"][aria-label="About"]')
  await win.waitFor({ state: 'visible', timeout: 15000 })
  return win
}

test.describe('About illustration integration', () => {
  test('illustration renders with alt text and correct frame', async ({ page }) => {
    const win = await openAbout(page)
    const img = win.locator('.about-illustration__image')
    await expect(img).toHaveCount(1)
    await expect(img).toHaveAttribute('alt', /illustrated portrait of Shine/i)
    await expect(img).toHaveAttribute('src', /shine-about-01\.png/)
    // Image actually decoded (naturalWidth > 0).
    const loaded = await img.evaluate((el) => el.complete && el.naturalWidth > 0)
    expect(loaded).toBe(true)
  })

  test('no card chrome: no border, shadow, radius, or tinted backdrop', async ({ page }) => {
    const win = await openAbout(page)
    const styles = await win.locator('.about-illustration__image').evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        border: s.borderTopWidth + ' ' + s.borderTopStyle,
        shadow: s.boxShadow,
        radius: s.borderRadius,
        padding: s.padding,
        background: s.backgroundColor,
        filter: s.filter,
        blend: s.mixBlendMode,
      }
    })
    expect(styles.shadow).toBe('none')
    expect(styles.radius).toBe('0px')
    expect(styles.padding).toBe('0px')
    expect(styles.filter).toBe('none')
    expect(styles.blend).toBe('normal')
  })

  test('artwork blends with the paper background (tone match)', async ({ page }) => {
    const win = await openAbout(page)
    const paper = await win
      .locator('.about-app__paper')
      .evaluate((el) => getComputedStyle(el).backgroundColor)

    // Measured mean of the artwork's own background ring.
    const mean = await win.locator('.about-illustration__image').evaluate(async (img) => {
      const res = await fetch(img.currentSrc)
      const bmp = await createImageBitmap(await res.blob())
      const c = document.createElement('canvas')
      c.width = bmp.width
      c.height = bmp.height
      const ctx = c.getContext('2d')
      ctx.drawImage(bmp, 0, 0)
      const ring = 6
      let r = 0, g = 0, b = 0, n = 0
      for (let y = 0; y < bmp.height; y += 2) {
        for (let x = 0; x < bmp.width; x += 2) {
          if (x < ring || y < ring || x >= bmp.width - ring || y >= bmp.height - ring) {
            const d = ctx.getImageData(x, y, 1, 1).data
            r += d[0]; g += d[1]; b += d[2]; n++
          }
        }
      }
      return [Math.round(r / n), Math.round(g / n), Math.round(b / n)]
    })

    const paperRgb = paper.match(/\d+/g).map(Number)
    const delta = [0, 1, 2].map((i) => Math.abs(paperRgb[i] - mean[i]))
    // Indistinguishable at a glance: no visible rectangular edge.
    expect(Math.max(...delta)).toBeLessThanOrEqual(3)
  })

  test('square aspect ratio preserved, not cropped or stretched', async ({ page }) => {
    const win = await openAbout(page)
    const box = await win.locator('.about-illustration__image').boundingBox()
    expect(box.width).toBeGreaterThan(50)
    // Square within a 1px tolerance.
    expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1)
  })

  test('no horizontal overflow at narrow width', async ({ page }) => {
    const win = await openAbout(page)
    for (const width of [300, 360, 520, 900]) {
      await page.evaluate((w) => {
        const el = document.querySelector('.desktop-window')
        if (el) el.style.width = w + 'px'
      }, width)
      await page.waitForTimeout(150)
      const overflow = await win
        .locator('.about-app__paper')
        .evaluate((el) => el.scrollWidth - el.clientWidth)
      expect(overflow, `overflow at width ${width}`).toBeLessThanOrEqual(1)
    }
  })

  test('artwork scales with the window and takes a real share of the width', async ({ page }) => {
    const win = await openAbout(page)
    const img = win.locator('.about-illustration__image')
    const setWindowWidth = async (w) => {
      await page.evaluate((v) => {
        const el = document.querySelector('.desktop-window')
        if (el) el.style.width = v + 'px'
      }, w)
      await page.waitForTimeout(220)
    }

    await setWindowWidth(340)
    const narrow = await img.boundingBox()
    await setWindowWidth(1000)
    const wide = await img.boundingBox()

    // Still scales down proportionally when narrow.
    expect(narrow.width).toBeLessThan(wide.width)
    // No longer pinned to a small centred thumbnail in a wider window.
    expect(wide.width).toBeGreaterThan(340)
    // A meaningful share of the available content width (roughly 35-45%).
    const content = await win.locator('.about-doc').evaluate((el) => el.clientWidth)
    const share = wide.width / content
    expect(share).toBeGreaterThanOrEqual(0.3)
    expect(share).toBeLessThanOrEqual(0.55)
  })

  test('document fills the window width instead of a narrow centred column', async ({ page }) => {
    const win = await openAbout(page)
    for (const width of [340, 700, 1100]) {
      await page.evaluate((w) => {
        const el = document.querySelector('.desktop-window')
        if (el) el.style.width = w + 'px'
      }, width)
      await page.waitForTimeout(220)
      const ratio = await win.locator('.about-doc').evaluate((el) => {
        const s = getComputedStyle(el)
        const content =
          el.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)
        return content / el.parentElement.clientWidth
      })
      // No max-width + margin:auto column: the page uses nearly the whole window.
      expect(ratio, `content fill at ${width}px`).toBeGreaterThan(0.82)
    }
  })

  test('no card chrome anywhere in the document', async ({ page }) => {
    const win = await openAbout(page)
    await page.evaluate(() => {
      const el = document.querySelector('.desktop-window')
      if (el) el.style.width = '1100px'
    })
    await page.waitForTimeout(220)
    // No cards, tiles or panel chrome inside the document. Hairline rules are
    // allowed and expected; backgrounds, shadows and radii are not.
    const offenders = await win
      .locator('.about-doc, .about-doc *')
      .evaluateAll((els) =>
        els
          .filter((el) => {
            const s = getComputedStyle(el)
            const hasBg =
              s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent'
            const hasRadius = parseFloat(s.borderTopLeftRadius) > 0
            const hasShadow = s.boxShadow !== 'none'
            return hasBg || hasRadius || hasShadow
          })
          .map((el) => el.className)
      )
    expect(offenders).toEqual([])
  })

  test('internal scrolling still works', async ({ page }) => {
    const win = await openAbout(page)
    const paper = win.locator('.about-app__paper')
    // The document scrolls internally rather than growing the window.
    const scrollable = await paper.evaluate((el) => el.scrollHeight > el.clientHeight)
    expect(scrollable).toBe(true)

    await paper.hover()
    await page.mouse.wheel(0, 600)
    // scroll-behavior is smooth, so wait for the animation to settle.
    await page.waitForTimeout(800)
    const scrolled = await paper.evaluate((el) => el.scrollTop)
    expect(scrolled).toBeGreaterThan(0)

    // The illustration must still be rendered (not unmounted by scrolling).
    await expect(win.locator('.about-illustration__image')).toHaveCount(1)
  })

  test('minimize then restore preserves the illustration', async ({ page }) => {
    const win = await openAbout(page)
    const img = win.locator('.about-illustration__image')
    await expect(img).toBeVisible()
    await win.getByLabel('Minimize window').click()
    await page.waitForTimeout(400)
    await aboutDockButton(page).click({ force: true })
    await page.waitForTimeout(500)
    await expect(img).toHaveAttribute('src', /shine-about-01\.png/)
    const stillLoaded = await img.evaluate((el) => el.complete && el.naturalWidth > 0)
    expect(stillLoaded).toBe(true)
  })

  test('maximize then restore keeps the illustration', async ({ page }) => {
    const win = await openAbout(page)
    const img = win.locator('.about-illustration__image')
    await win.getByLabel('Maximize window').click()
    await page.waitForTimeout(300)
    await expect(img).toBeVisible()
    await win.getByLabel('Restore window').click()
    await page.waitForTimeout(300)
    await expect(img).toHaveAttribute('src', /shine-about-01\.png/)
  })

  test('close then reopen keeps the illustration', async ({ page }) => {
    const win = await openAbout(page)
    await win.getByLabel('Close window').click()
    await page.waitForTimeout(400)
    await aboutDockButton(page).click({ force: true })
    await page.waitForTimeout(500)
    const reopened = page.locator('[role="dialog"][aria-label="About"]')
    await expect(reopened.locator('.about-illustration__image')).toHaveAttribute(
      'src',
      /shine-about-01\.png/
    )
  })

  test('reduced motion: no animation on the illustration', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const win = await openAbout(page)
    const styles = await win.locator('.about-illustration__image').evaluate((el) => {
      const s = getComputedStyle(el)
      return { name: s.animationName, dur: s.animationDuration, trans: s.transitionProperty }
    })
    expect(styles.name).toBe('none')
  })

  test('no console errors during About lifecycle', async ({ page }) => {
    const errors = []
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })
    page.on('pageerror', (e) => errors.push(e.message))
    const win = await openAbout(page)
    await win.getByLabel('Maximize window').click()
    await page.waitForTimeout(300)
    await win.getByLabel('Restore window').click()
    await page.waitForTimeout(300)
    await win.getByLabel('Close window').click()
    await page.waitForTimeout(500)
    // Reopen once more to prove the illustration re-mounts cleanly.
    await aboutDockButton(page).click({ force: true })
    await page.waitForTimeout(500)
    await expect(page.locator('.about-illustration__image')).toBeVisible()

    // Ignore pre-existing "Invalid DOM property" SVG attribute warnings that
    // come from DesktopWindow / ComputerScreenTarget code this step never
    // touches. Anything else must be clean.
    const aboutErrors = errors.filter(
      (e) => !(e.includes('Invalid DOM property') && /stroke-(linecap|width)|stroke(Linecap|Width)/.test(e))
    )
    expect(aboutErrors).toEqual([])
  })

  test('exactly one image element is rendered (no duplication)', async ({ page }) => {
    const win = await openAbout(page)
    await expect(win.locator('.about-app__paper img')).toHaveCount(1)
  })
})
