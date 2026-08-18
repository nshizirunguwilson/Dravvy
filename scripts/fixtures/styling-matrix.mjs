/**
 * The complete list of styling options the app offers, and one resume fixture
 * rich enough that every option has something to act on.
 *
 * This is the single source of truth for the proof scripts. If someone adds an
 * option to the styling form without adding it here, `scripts/styling-proof.mjs`
 * fails, because it cross-checks this matrix against the form itself.
 */

export const fixture = {
  contact: {
    fullName: 'Avery Lin',
    email: 'avery@example.com',
    phone: '+1 555 010 1010',
    location: 'Brooklyn, NY',
    website: 'https://avery.dev',
    linkedin: 'https://linkedin.com/in/averylin',
    github: 'https://github.com/averylin',
  },
  summary:
    'Senior product designer with eight years building consumer fintech products. Comfortable owning research, design and delivery across cross-functional teams.',
  experience: [
    {
      id: 'e1',
      company: 'Holloway Financial',
      position: 'Lead Product Designer',
      startDate: '2022-04-01',
      endDate: '',
      current: true,
      description: [
        'Owned end-to-end design for the merchant dashboard, raising activation 38%.',
        'Coached three designers and ran a quarterly research cadence.',
      ],
    },
    {
      id: 'e2',
      company: 'Northwind',
      position: 'Senior Product Designer',
      startDate: '2019-08-01',
      endDate: '2022-03-15',
      current: false,
      description: [
        'Led the design system migration to Figma libraries.',
        'Shipped a payments redesign that reduced support tickets 22%.',
      ],
    },
  ],
  education: [
    {
      id: 'd1',
      school: 'Rhode Island School of Design',
      degree: 'B.A.',
      field: 'Graphic Design',
      startDate: '2014-09-01',
      endDate: '2018-05-30',
      gpa: '3.8',
    },
  ],
  skills: [
    { id: 's1', category: 'Design', skills: ['Figma', 'Prototyping', 'Design Systems'] },
    { id: 's2', category: 'Research', skills: ['Interviews', 'Usability Testing'] },
  ],
  projects: [
    {
      id: 'p1',
      name: 'Open Pay',
      description: [
        'Open-source toolkit for embedding pay-by-link flows.',
        'Cited by 4 fintech publications.',
      ],
      technologies: ['React', 'Stripe', 'Tailwind CSS'],
      link: 'https://openpay.example',
    },
  ],
  certifications: [
    {
      id: 'c1',
      name: 'Google UX Design Certificate',
      issuer: 'Coursera',
      date: '2021-08-01',
      link: '',
    },
  ],
  awards: [
    {
      id: 'a1',
      title: 'IxDA Awards Finalist',
      issuer: 'Interaction Design Association',
      date: '2023-02-04',
      description: 'Recognized for the Holloway merchant onboarding flow.',
    },
  ],
  languages: [
    { id: 'l1', language: 'English', proficiency: 'native' },
    { id: 'l2', language: 'Mandarin', proficiency: 'fluent' },
  ],
  references: [
    {
      id: 'r1',
      name: 'Priya Nair',
      relationship: 'Former Manager',
      email: 'priya@example.com',
      phone: '+1 555 222 3333',
    },
  ],
  referencesMode: 'include',
  style: {
    theme: 'modern',
    fontSize: 'medium',
    spacing: 'medium',
    color: '#2563eb',
    font: 'helvetica',
    separator: 'line',
    dateFormat: 'MM/YYYY',
    showLinks: true,
    showSkillProficiency: true,
  },
}

/**
 * Every option group, every value. `field` is the key on `style`.
 *
 * `baseline` is the value the rest of the resume is held at while this group is
 * being swept, chosen so the group's effect is visible (for example the accent
 * sweep runs on the modern theme, whose section headings take the accent).
 */
export const groups = [
  {
    id: 'theme',
    label: 'Theme',
    field: 'theme',
    options: [
      { value: 'modern', label: 'Modern' },
      { value: 'classic', label: 'Classic' },
      { value: 'minimal', label: 'Minimal' },
    ],
  },
  {
    id: 'typeface',
    label: 'Typeface',
    field: 'font',
    // A PDF can only rely on the 14 fonts every reader is required to have.
    // @react-pdf embeds those, so the twelve choices resolve to Times for the
    // four serifs and Helvetica for the eight sans faces. The contract the PDF
    // does keep is the serif/sans decision, and that is what gets asserted.
    // The preview and the DOCX carry all twelve distinctly.
    pdfDistinct: false,
    pdfNote:
      'PDF embeds the standard base-14 fonts: the four serif choices become Times, the eight sans choices become Helvetica. The serif or sans decision is preserved. The DOCX carries the exact typeface name, and the live preview renders all twelve distinctly.',
    options: [
      { value: 'times new roman', label: 'Times New Roman', genre: 'serif' },
      { value: 'georgia', label: 'Georgia', genre: 'serif' },
      { value: 'cambria', label: 'Cambria', genre: 'serif' },
      { value: 'garamond', label: 'Garamond', genre: 'serif' },
      { value: 'calibri', label: 'Calibri', genre: 'sans' },
      { value: 'helvetica', label: 'Helvetica', genre: 'sans' },
      { value: 'arial', label: 'Arial', genre: 'sans' },
      { value: 'roboto', label: 'Roboto', genre: 'sans' },
      { value: 'lato', label: 'Lato', genre: 'sans' },
      { value: 'open sans', label: 'Open Sans', genre: 'sans' },
      { value: 'montserrat', label: 'Montserrat', genre: 'sans' },
      { value: 'outfit', label: 'Outfit', genre: 'sans' },
    ],
  },
  {
    id: 'body-size',
    label: 'Body size',
    field: 'fontSize',
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
    ],
  },
  {
    id: 'section-spacing',
    label: 'Section spacing',
    field: 'spacing',
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
    ],
  },
  {
    id: 'separator',
    label: 'Separator',
    field: 'separator',
    options: [
      { value: 'line', label: 'Single line' },
      { value: 'double line', label: 'Double line' },
      { value: 'bold line', label: 'Bold line' },
      { value: 'no separator', label: 'No separator' },
    ],
  },
  {
    id: 'date-format',
    label: 'Date format',
    field: 'dateFormat',
    options: [
      { value: 'MM/YYYY', label: '01/2026', expect: /^\d{2}\/\d{4}$/ },
      { value: 'MMM YYYY', label: 'Jan 2026', expect: /^[A-Z][a-z]{2} \d{4}$/ },
      { value: 'MMMM YYYY', label: 'January 2026', expect: /^[A-Z][a-z]{3,8} \d{4}$/ },
    ],
  },
  {
    id: 'profile-links',
    label: 'Show profile links',
    field: 'showLinks',
    options: [
      { value: true, label: 'Links shown' },
      { value: false, label: 'Links hidden' },
    ],
  },
  {
    id: 'language-proficiency',
    label: 'Show language proficiency',
    field: 'showSkillProficiency',
    // Languages sit near the foot of the page, past the default crop, so this
    // group is captured tall enough for the difference to be visible.
    captureHeight: 1180,
    options: [
      { value: true, label: 'Proficiency shown' },
      { value: false, label: 'Proficiency hidden' },
    ],
  },
  {
    id: 'accent-colour',
    label: 'Accent colour',
    field: 'color',
    options: [
      { value: '#0F172A', label: 'Slate' },
      { value: '#1f2937', label: 'Graphite' },
      { value: '#1e3a8a', label: 'Indigo' },
      { value: '#2563EB', label: 'Blue' },
      { value: '#0e7490', label: 'Teal' },
      { value: '#15803d', label: 'Forest' },
      { value: '#9a3412', label: 'Sienna' },
      { value: '#7c2d12', label: 'Burgundy' },
      { value: '#7c3aed', label: 'Violet' },
      { value: '#B45309', label: 'Custom hex', custom: true },
    ],
  },
]

export const totalOptions = groups.reduce((sum, group) => sum + group.options.length, 0)
