import { chromium } from 'playwright'

const URL = 'http://localhost:5173/'

const aboutDockButton = (page) => page.getByRole('button', { name: 'About', exact: true }).first()

async function openAbout(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  const enter = page.getByLabel("Enter Shine's computer")
  await enter.waitFor({ state: 'attached', timeout: 45000 })
  await enter.evaluate((el) => el.click())
  const aboutButton = aboutDockButton(page)
  await aboutButton.waitFor({ state: 'visible', timeout: 60000 })
  await aboutButton.click({ force: true })
  const win = page.locator('[role="dialog"][aria-label="About"]')
  await win.waitFor({ state: 'visible', timeout: 15000 })
  await page.evaluate(() => {
    const el = document.querySelector('.desktop-window')
    if (el) {
      el.style.width = '1240px'
      el.style.height = '860px'
    }
  })
  await page.waitForTimeout(500)
  return win
}

const geometry = (page) =>
  page.evaluate(() => {
    const doc = document.querySelector('.about-doc')
    const ds = getComputedStyle(doc)
    const docBox = doc.getBoundingClientRect()
    const padL = parseFloat(ds.paddingLeft)
    const padR = parseFloat(ds.paddingRight)
    const left = docBox.left + padL
    const right = docBox.right - padR
    const box = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const b = el.getBoundingClientRect()
      return {
        x: Math.round(b.left - left),
        right: Math.round(right - b.right),
        w: Math.round(b.width),
        y: Math.round(b.top - docBox.top),
        h: Math.round(b.height),
      }
    }
    const boxes = (sel) =>
      [...document.querySelectorAll(sel)].map((el) => {
        const b = el.getBoundingClientRect()
        return {
          x: Math.round(b.left - left),
          y: Math.round(b.top - docBox.top),
          w: Math.round(b.width),
          h: Math.round(b.height),
        }
      })

    const fs = (sel) => {
      const el = document.querySelector(sel)
      return el ? getComputedStyle(el).fontSize : null
    }

    return {
      pageWidth: Math.round(right - left),
      marginLeft: Math.round(padL),
      marginRight: Math.round(padR),
      docHeight: Math.round(docBox.height),
      hero: box('.about-hero'),
      heroText: box('.about-hero__text'),
      heroFigure: box('.about-hero__figure'),
      illustration: box('.about-illustration__image'),
      split: box('.about-split'),
      splitSections: boxes('.about-split > .about-section'),
      prose: boxes('.about-prose'),
      rows: boxes('.about-rows__row'),
      interests: boxes('.about-section[data-motion-id="interests"]'),
      topics: boxes('.about-topics__item'),
      footer: box('.about-footer'),
      footerRows: boxes('.about-footer__row'),
      type: {
        eyebrow: fs('.about-doc__eyebrow'),
        greeting: fs('.about-doc__greeting'),
        intro: fs('.about-doc__intro'),
        signoff: fs('.about-doc__signoff'),
        sectionLabel: fs('.about-section__label'),
        sectionLead: fs('.about-section__lead'),
        prose: fs('.about-prose'),
        topicTitle: fs('.about-topics__title'),
        topicNote: fs('.about-topics__note'),
      },
    }
  })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1512, height: 900 } })
try {
  await openAbout(page)
  const g = await geometry(page)
  console.log(JSON.stringify(g, null, 2))
} finally {
  await browser.close()
}