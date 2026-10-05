// Harness shim only — no product code.
//
// This environment has no Playwright browser bundle cached, so the older
// verification scripts' bare `chromium.launch()` cannot find an executable.
// This preload points them at the system Chrome install without editing them,
// so their assertions still run exactly as they were written in STEP 11C.
//
// Usage: node --import ./tmp-e2e/use-system-chrome.mjs <script.mjs>
import { chromium } from 'playwright'

if (!chromium.launch.__systemChromePatched) {
  const original = chromium.launch.bind(chromium)
  const patched = (options = {}) => original({ channel: 'chrome', ...options })
  patched.__systemChromePatched = true
  chromium.launch = patched
}