/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Editorial scale — explicit tracking per size
        'micro': ['10.5px', { lineHeight: '14px', letterSpacing: '0.08em' }],
        'spec': ['11px', { lineHeight: '16px', letterSpacing: '0.06em' }],
        'caption': ['12.5px', { lineHeight: '18px', letterSpacing: '0.005em' }],
        'body': ['15px', { lineHeight: '24px', letterSpacing: '-0.003em' }],
        'lead': ['18px', { lineHeight: '28px', letterSpacing: '-0.008em' }],
        'h4': ['22px', { lineHeight: '28px', letterSpacing: '-0.012em' }],
        'h3': ['28px', { lineHeight: '34px', letterSpacing: '-0.018em' }],
        'h2': ['40px', { lineHeight: '46px', letterSpacing: '-0.022em' }],
        'h1': ['56px', { lineHeight: '60px', letterSpacing: '-0.028em' }],
        'display': ['80px', { lineHeight: '80px', letterSpacing: '-0.032em' }],
      },
      colors: {
        paper: 'hsl(var(--paper))',
        'paper-deep': 'hsl(var(--paper-deep))',
        page: 'hsl(var(--page))',
        ink: {
          DEFAULT: 'hsl(var(--ink-12))',
          12: 'hsl(var(--ink-12))',
          11: 'hsl(var(--ink-11))',
          9: 'hsl(var(--ink-9))',
          7: 'hsl(var(--ink-7))',
          6: 'hsl(var(--ink-6))',
          5: 'hsl(var(--ink-5))',
          3: 'hsl(var(--ink-3))',
        },
        rule: {
          DEFAULT: 'hsl(var(--rule))',
          strong: 'hsl(var(--rule-strong))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          soft: 'hsl(var(--accent-soft))',
        },
        positive: 'hsl(var(--positive))',
        negative: 'hsl(var(--negative))',

        // shadcn-compat (so existing Radix primitives keep working)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        paper: 'var(--shadow-paper)',
        page: 'var(--shadow-page)',
        lift: 'var(--shadow-paper-lift)',
      },
      keyframes: {
        'sweep-in': {
          '0%': { transform: 'scaleX(0)', opacity: '1' },
          '60%': { transform: 'scaleX(1)', opacity: '1' },
          '100%': { transform: 'scaleX(1)', opacity: '0' },
        },
        'rise': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'tick': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'sweep-in': 'sweep-in 720ms cubic-bezier(.2,.7,.2,1) forwards',
        'rise': 'rise 320ms cubic-bezier(.2,.7,.2,1) forwards',
        'tick': 'tick 220ms cubic-bezier(.4,1.4,.5,1) forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
