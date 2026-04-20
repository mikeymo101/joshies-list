import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canonical warm ramp. Use `brand-*` everywhere going forward.
        // Amber family — matches existing landing usage; we are NOT migrating
        // to the orange-500 (#f97316) family from globals.css.
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // primary
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Grade ramp — used by ScoreCard. Aliased so component code doesn't
        // reach for raw emerald/blue/amber/red classes.
        grade: {
          a: '#10b981', // emerald
          b: '#3b82f6', // blue
          c: '#f59e0b', // brand-500
          d: '#f97316', // orange (kept as a distinct step between C and F)
          f: '#ef4444', // red
        },
        navy: {
          50:  '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1929',
        },
        // Surface tokens (canvas/card/line) — prefer these over `bg-[#0a0a0f]`.
        surface: {
          canvas: '#0a0a0f',
          raised: '#12121a',
          inset:  '#1a1a24',
          line:   'rgba(255,255,255,0.06)',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
