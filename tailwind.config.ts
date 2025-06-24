import type { Config } from "tailwindcss";
import tailwindcss_animate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
        "./app/**/*.{ts,tsx,js,jsx}",
        "./components/**/*.{ts,tsx,js,jsx}",
        "./pages/**/*.{ts,tsx,js,jsx}",
        "./src/**/*.{ts,tsx,js,jsx}",
    ],
    theme: {
    	extend: {
    		colors: {
				border: "var(--border)",
				background: "var(--background)",
				foreground: "var(--foreground)",
    			primary: {
    				DEFAULT: 'var(--primary-default)',
    				light: 'var(--primary-ligth)',
    				dark: 'var(--primary-dark)',
    				hover: 'var(--primary-hover)',
    				pressed: 'var(--primary-pressed)',
    				disabled: 'var(--primary-disabled)'
    			},
    			secondary: {
    				DEFAULT: 'var(--secondary-default)',
    				light: 'var(--secondary-ligth)',
    				dark: 'var(--secondary-dark)',
    				hover: 'var(--secondary-hover)',
    				pressed: 'var(--secondary-pressed)',
    				disabled: 'var(--secondary-disabled)'
    			},
    			tertiary: {
    				DEFAULT: 'var(--tertiary-default)',
    				light: 'var(--tertiary-ligth)',
    				dark: 'var(--tertiary-dark)',
    				hover: 'var(--tertiary-hover)',
    				pressed: 'var(--tertiary-pressed)',
    				disabled: 'var(--tertiary-disabled)'
    			},
    			success: {
    				DEFAULT: 'var(--success-default)',
    				light: 'var(--success-ligth)',
    				dark: 'var(--success-dark)',
    				hover: 'var(--success-hover)',
    				pressed: 'var(--success-pressed)',
    				disabled: 'var(--success-disabled)'
    			},
    			error: {
    				DEFAULT: 'var(--error-default)',
    				light: 'var(--error-ligth)',
    				dark: 'var(--error-dark)',
    				hover: 'var(--error-hover)',
    				pressed: 'var(--error-pressed)',
    				disabled: 'var(--error-disabled)'
    			},
    			warning: {
    				DEFAULT: 'var(--warning-default)',
    				light: 'var(--warning-ligth)',
    				dark: 'var(--warning-dark)',
    				hover: 'var(--warning-hover)',
    				pressed: 'var(--warning-pressed)',
    				disabled: 'var(--warning-disabled)'
    			},
    			neutral: {
    				'100': 'var(--neutral-100)',
    				'200': 'var(--neutral-200)',
    				'300': 'var(--neutral-300)',
    				'400': 'var(--neutral-400)',
    				'500': 'var(--neutral-500)',
    				'600': 'var(--neutral-600)',
    				'700': 'var(--neutral-700)',
    				'800': 'var(--neutral-800)',
    				'900': 'var(--neutral-900)'
    			},
				sidebar: {
					DEFAULT: 'var(--primary-dark)',
					foreground: 'var(--neutral-100)',
					accent: 'var(--secondary-default)',
					'accent-foreground': 'white',
					border: 'var(--primary-hover)',
					ring: 'var(--secondary-hover)',
				},
    		},
    		fontFamily: {
    			sans: [
    				'Work Sans',
    				'sans-serif'
    			],
    			display: [
    				'Space Grotesk',
    				'sans-serif'
    			]
    		}
    	}
    },
    plugins: [tailwindcss_animate],
} satisfies Config;
