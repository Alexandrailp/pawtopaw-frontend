/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pawPrimary: '#2D5A27',   /* Verde oscuro */
        pawSecondary: '#F8F3ED', /* Beige cálido */
        pawAccent: '#E66A45',    /* Naranja/Óxido */
        pawLight: '#FAFAFA',     /* Fondo claro */
      },
    },
  },
  plugins: [],
}