// tailwind.config.js (ESM)
import forms from '@tailwindcss/forms'

export default {
  // (Optional) content paths are fine to include; v4 works without them too.
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [forms],
}
