/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Bioluminescent color palette
        "bio-blue": "#00E5FF",
        "bio-green": "#76FF03",
        "bio-pink": "#E91E63",
        "bio-cyan": "#00BCD4",
        "bio-purple": "#9C27B0",
        "deep-sea": "#0B1426",
        "abyss": "#1a2332",
        "ocean-deep": "#0d1b2a",
        "ocean-mid": "#1b263b",
        "ocean-surface": "#415a77",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      animation: {
        "bio-pulse": "bio-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bio-glow": "bio-glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "wave": "wave 4s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "bio-pulse": {
          "0%, 100%": { 
            opacity: "1",
            boxShadow: "0 0 20px currentColor"
          },
          "50%": { 
            opacity: "0.7",
            boxShadow: "0 0 40px currentColor"
          },
        },
        "bio-glow": {
          "0%, 100%": { 
            textShadow: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor"
          },
          "50%": { 
            textShadow: "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor"
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "wave": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(5px)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(180deg, #0B1426 0%, #1a2332 50%, #0d1b2a 100%)',
        'bio-gradient': 'linear-gradient(45deg, #00E5FF 0%, #76FF03 50%, #E91E63 100%)',
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
};
