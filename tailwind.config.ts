import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#0b0b0a", gold: "#c6a66b", ivory: "#f2eee6" }, fontFamily: { display: ["var(--font-display)"], sans: ["var(--font-sans)"] } } }, plugins: [] } satisfies Config;
