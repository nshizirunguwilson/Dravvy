/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        canvas: 'hsl(var(--canvas))',
        surface: 'hsl(var(--surface))',
        'surface-2': 'hsl(var(--surface-2))',
        slate: {
          12: 'hsl(var(--slate-12))',
          11: 'hsl(var(--slate-11))',
          9: 'hsl(var(--slate-9))',
          7: 'hsl(var(--slate-7))',
          6: 'hsl(var(--slate-6))',
          5: 'hsl(var(--slate-5))',
          3: 'hsl(var(--slate-3))',
        },
        line: {
          DEFAULT: 'hsl(var(--border))',
          strong: 'hsl(var(--border-strong))',
          soft: 'hsl(var(--divider))',
        },
        brand: {
          DEFAULT: 'hsl(var(--accent))',
          hover: 'hsl(var(--accent-hover))',
          soft: 'hsl(var(--accent-soft))',
          ink: 'hsl(var(--accent-ink))',
        },
        positive: {
          DEFAULT: 'hsl(var(--positive))',
          soft: 'hsl(var(--positive-soft))',
        },
        negative: {
          DEFAULT: 'hsl(var(--negative))',
          soft: 'hsl(var(--negative-soft))',
        },

        // shadcn-compat (so Radix primitives still resolve)
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
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
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
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        pop: 'var(--shadow-pop)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        tick: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        rise: 'rise 320ms cubic-bezier(.2,.7,.2,1) forwards',
        tick: 'tick 220ms cubic-bezier(.4,1.4,.5,1) forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
