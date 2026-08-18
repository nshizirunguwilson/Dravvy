# Testing Dravvy

Everything here runs on your machine. No accounts, no services, no secrets.

## Contents

1. [One-time setup](#one-time-setup)
2. [The short version](#the-short-version)
3. [What each command actually checks](#what-each-command-actually-checks)
4. [Testing by hand](#testing-by-hand)
5. [Reading the proof reports](#reading-the-proof-reports)
6. [When something fails](#when-something-fails)

---

## One-time setup

```bash
git clone https://github.com/nshizirunguwilson/Dravvy.git
cd Dravvy
npm install
npx playwright install chromium webkit
```

The last line downloads the two browser engines. Chromium stands in for Chrome
and Edge, WebKit for Safari, which is what every iPhone and iPad actually runs.

---

## The short version

Two terminals. In the first:

```bash
npm run dev -- -p 3100
```

In the second, once it says ready:

```bash
npm run verify
```

That runs every automated check in order and stops at the first failure. It
takes roughly fifteen minutes, most of it the device sweep.

If you only have a minute, `npm run verify:quick` skips the two sweeps and
finishes in about two.

---

## What each command actually checks

| Command | Time | What it proves |
| ------- | ---- | -------------- |
| `npm run lint` | ~10s | No ESLint violations. |
| `npm run lint:dashes` | ~1s | Not one em dash or en dash in any tracked file. |
| `npm run typecheck` | ~15s | TypeScript is clean in strict mode. |
| `npm run test` | ~30s | Unit and component tests. |
| `npm run test:coverage` | ~40s | Same, plus the coverage gate. |
| `npm run test:e2e` | ~2m | The real app in Chromium and WebKit. |
| `npm run test:export` | ~15s | A real PDF and DOCX come out valid. |
| `npm run proof:styling` | ~2m | Every styling option changes the preview. |
| `npm run proof:exports` | ~1m | Every styling option reaches the PDF and DOCX. |
| `npm run proof:responsive` | ~9m | Every screen on 14 devices, 2 themes, 2 engines. |
| `npm run build` | ~40s | It compiles for production. |

### The two that need the dev server

`proof:styling` and `proof:responsive` drive a real browser against a running
app, so they need `npm run dev -- -p 3100` in another terminal first. The rest
are self-contained.

### The coverage gate

`npm run test:coverage` fails if statements, lines or functions drop below 90%,
or branches below 85%, across every file in `src/lib`, `src/hooks`, `src/store`
and `src/components`. Route files are excluded because Playwright covers them
end to end, and the PDF and DOCX pipelines because they cannot run under jsdom.
Those have their own checks: `test:export` and `proof:exports`.

---

## Testing by hand

Automation misses how something feels. These are the paths worth walking.

### Build a resume start to finish

1. Open <http://localhost:3100> and click **Build your resume**.
2. Fill in Basic information. Leave one field empty and press **Save section**:
   the empty field should turn red, show a message underneath it, and a summary
   should appear at the top saying how many fields need attention. It should
   *not* be a toast that vanishes.
3. Fill it in properly and save. Move through all nine sections.
4. In Work experience, add two roles. Use the **up** and **down** arrows on a
   card to reorder them. Watch the numbering follow.
5. Press **Remove** on a role. A toast offers **Undo**. Press it. The role comes
   back in its original position, not at the end.
6. Go to **Style & export**.

### Check the styling actually does something

On the Styling tab, change one option at a time and watch the Preview tab:

- **Theme**: Modern centres the header with accent headings and a rule above
  each one. Classic centres it, sets the name in capitals, uses ink headings and
  puts the rule underneath. Minimal is left aligned with small grey headings and
  a short rule.
- **Typeface**: all twelve should look different from one another.
- **Body size**, **Section spacing**: the page gets denser or airier.
- **Separator**: single, double, bold, or none.
- **Date format**: `04/2022`, `Apr 2022`, `April 2022`.
- **Accent colour**: headings and rules take the colour, including a custom hex.
- **Show profile links**: turn it off and LinkedIn, GitHub and Portfolio vanish
  from the contact line.
- **Show language proficiency**: turn it off and languages lose their levels.

Then export a PDF and a DOCX and confirm the same choices survived. Open the
DOCX in Word or Pages and check the font name in the ribbon.

### Save and resume

1. On **Save file**, press **Save progress file**. A `.json` downloads.
2. Open devtools, clear the site's Local Storage, and reload. The draft is gone.
3. Import the file you saved. Everything comes back, *and you land on the step
   you were on when you saved*.
4. Try importing some other JSON file. It should refuse with a plain explanation
   and leave your draft untouched.

### Start over

On **Save file**, press **Start over**. It should ask first. Cancel, and nothing
happens. Confirm, and the draft empties.

### Offline

This is the one that used to be a false claim.

1. Run a production build, because the service worker is disabled in dev:
   ```bash
   npm run build && npm start
   ```
2. Open <http://localhost:3000>, visit `/create` and `/settings`.
3. In devtools, Network tab, tick **Offline**. Or turn off your wifi.
4. Reload. The app still loads and you can keep editing and exporting.
5. On a phone, browser menu, **Add to Home Screen**. It installs and opens
   without browser chrome.

### Dark mode

Press the toggle in the header. Then:

- Reload the page. It should stay dark with **no white flash**.
- Go to Preview. The A4 page stays white with dark ink, because that is what
  exports. Everything around it is dark.
- On the Styling tab, set the theme to **System** and change your OS appearance.
  The app follows without a reload.

### Keyboard only

Put the mouse away.

1. Load `/create` and press **Tab** once. In Chrome the first stop is
   **Skip to main content**. Press Enter and focus jumps past the header.
   *(Safari hides links from the tab order by default unless you turn on
   Settings, Advanced, "Press Tab to highlight each item". This is a browser
   setting, not something the page controls.)*
2. Tab through the whole form. Every stop should have a visible focus ring.
3. Fill a field, Tab to the next, and save, without touching the mouse.
4. On Settings, focus a tab and use the arrow keys.

### Small screens

Open devtools, device toolbar, and pick iPhone SE (375x667). Then:

- Nothing should scroll sideways at any point.
- The A4 preview scrolls inside its own tray, not the page.
- Every button should be comfortable to hit with a thumb.
- Rotate to landscape. The header stays usable at 325px of height.

### Screen reader

macOS: **Cmd + F5** for VoiceOver. Windows: NVDA.

- Tab into a form field. It should read the label, for example
  "Full name, required, edit text".
- Save with an empty field. It should read the error along with the field.
- Reach the section rail. It should read "Resume 44% complete, progress bar".

---

## Reading the proof reports

Two reports are generated from real runs, not written by hand.

```bash
npm run dev -- -p 3100        # terminal one

npm run proof:styling          # terminal two
npm run proof:exports
npm run proof:report           # builds docs/styling-proof/report.html

npm run proof:responsive
npm run proof:responsive:report  # builds docs/responsive-proof/report.html
```

Open either `report.html` in a browser. Each shows a screenshot per case with
the measurement behind it.

The screenshots and the reports are not committed, because they are generated.
CI rebuilds them on every push and uploads them as build artifacts. Only the
measurements, `manifest.json` and `exports.json`, are versioned.

---

## When something fails

**A proof script says `ECONNREFUSED`.** The dev server is not running on 3100.

**A sweep hangs or the results look stale.** A dev server left over from an
earlier run is serving old code:

```bash
pkill -f "next dev"; lsof -ti:3100 | xargs kill -9
```

**Playwright fails only when run with everything else.** Run that file alone.
If it passes, it is contention, not a real break:

```bash
npx playwright test e2e/keyboard.spec.ts --workers=1
```

**Coverage fails.** The report names the file and the uncovered lines. Open
`coverage/index.html` for a line-by-line view.

**A styling option "renders identically" to another.** That is the sweep doing
its job. Two options are producing the same output, which is the exact bug this
harness exists to catch.

**A device combination fails.** `docs/responsive-proof/manifest.json` records
the failing element, its size and the reason, next to the screenshot.
