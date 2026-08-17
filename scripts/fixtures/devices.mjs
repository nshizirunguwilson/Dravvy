/**
 * The device ladder the app is held to, from an iPhone 6s up to a 16 inch
 * MacBook Pro.
 *
 * Two sizes are recorded for each device and they are not the same thing:
 *
 *   screen   the device's logical (CSS) resolution, the number people quote
 *   viewport the space a page actually gets once browser chrome is subtracted
 *
 * Every check runs against `viewport`, because that is what a real person
 * builds a resume in. An iPhone 6s is a 375x667 device but Safari only hands
 * the page 375x553 of it, and in landscape barely 325px of height.
 */

export const devices = [
  // ---- Phones, portrait ----
  {
    id: 'iphone-6s',
    label: 'iPhone 6s / 7 / 8 / SE',
    class: 'phone',
    screen: [375, 667],
    viewport: [375, 553],
    dsf: 2,
    touch: true,
  },
  {
    id: 'iphone-12-mini',
    label: 'iPhone 12 mini',
    class: 'phone',
    screen: [360, 780],
    viewport: [360, 659],
    dsf: 3,
    touch: true,
  },
  {
    id: 'iphone-14',
    label: 'iPhone 13 / 14 / 15',
    class: 'phone',
    screen: [390, 844],
    viewport: [390, 724],
    dsf: 3,
    touch: true,
  },
  {
    id: 'iphone-15-pro-max',
    label: 'iPhone 15 Pro Max',
    class: 'phone',
    screen: [430, 932],
    viewport: [430, 814],
    dsf: 3,
    touch: true,
  },

  // ---- Phones, landscape ----
  {
    id: 'iphone-6s-landscape',
    label: 'iPhone 6s, landscape',
    class: 'phone',
    screen: [667, 375],
    viewport: [667, 325],
    dsf: 2,
    touch: true,
  },
  {
    id: 'iphone-15-pro-max-landscape',
    label: 'iPhone 15 Pro Max, landscape',
    class: 'phone',
    screen: [932, 430],
    viewport: [932, 380],
    dsf: 3,
    touch: true,
  },

  // ---- Tablets ----
  {
    id: 'ipad-mini',
    label: 'iPad mini',
    class: 'tablet',
    screen: [768, 1024],
    viewport: [768, 954],
    dsf: 2,
    touch: true,
  },
  {
    id: 'ipad-air',
    label: 'iPad Air 11 inch',
    class: 'tablet',
    screen: [820, 1180],
    viewport: [820, 1110],
    dsf: 2,
    touch: true,
  },
  {
    id: 'ipad-pro-13',
    label: 'iPad Pro 13 inch',
    class: 'tablet',
    screen: [1024, 1366],
    viewport: [1024, 1292],
    dsf: 2,
    touch: true,
  },
  {
    id: 'ipad-pro-13-landscape',
    label: 'iPad Pro 13 inch, landscape',
    class: 'tablet',
    screen: [1366, 1024],
    viewport: [1366, 950],
    dsf: 2,
    touch: true,
  },

  // ---- Laptops ----
  {
    id: 'laptop-1280',
    label: 'Laptop, 1280 wide',
    class: 'laptop',
    screen: [1280, 800],
    viewport: [1280, 680],
    dsf: 2,
    touch: false,
  },
  {
    id: 'macbook-air-13',
    label: 'MacBook Air 13 inch',
    class: 'laptop',
    screen: [1470, 956],
    viewport: [1470, 836],
    dsf: 2,
    touch: false,
  },
  {
    id: 'macbook-pro-14',
    label: 'MacBook Pro 14 inch',
    class: 'laptop',
    screen: [1512, 982],
    viewport: [1512, 862],
    dsf: 2,
    touch: false,
  },
  {
    id: 'macbook-pro-16',
    label: 'MacBook Pro 16 inch',
    class: 'laptop',
    screen: [1728, 1117],
    viewport: [1728, 997],
    dsf: 2,
    touch: false,
  },
]

/**
 * The screens a person passes through to build and export a resume. Each entry
 * knows how to put the app into that state before anything is measured.
 */
export const screens = [
  { id: 'landing', label: 'Landing page', path: '/' },
  { id: 'create-basic', label: 'Editor, basic information', path: '/create', builderStep: 0 },
  { id: 'create-work', label: 'Editor, work experience', path: '/create', builderStep: 1 },
  { id: 'create-skills', label: 'Editor, skills', path: '/create', builderStep: 3 },
  { id: 'create-references', label: 'Editor, references', path: '/create', builderStep: 8 },
  { id: 'settings-styling', label: 'Styling', path: '/settings', settingsStep: 0 },
  { id: 'settings-preview', label: 'A4 preview', path: '/settings', settingsStep: 1 },
  { id: 'settings-export', label: 'Export', path: '/settings', settingsStep: 2 },
  { id: 'settings-save', label: 'Save file', path: '/settings', settingsStep: 3 },
]

export const totalChecks = devices.length * screens.length
