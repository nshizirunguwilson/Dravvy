/// <reference types="@testing-library/jest-dom" />

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module 'html-to-docx' {
  const htmlToDocx: any // eslint-disable-line @typescript-eslint/no-explicit-any
  export default htmlToDocx
}

interface Window {
  matchMedia: (query: string) => {
    matches: boolean
    media: string
    onchange: null
    addListener: (listener: () => void) => void
    removeListener: (listener: () => void) => void
    addEventListener: (type: string, listener: () => void) => void
    removeEventListener: (type: string, listener: () => void) => void
    dispatchEvent: (event: Event) => boolean
  }
} 