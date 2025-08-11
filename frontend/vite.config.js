import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteFonts({
      custom: {
        families: [
          {
            name: "Lato",
            local: "Lato",
            // Explicitly list only the fonts you want
            src: ["./src/assets/fonts/Lato/*.ttf"],
          },
        ],
        display: "swap", // ensures text shows immediately with fallback font
      },
    }),
  ],
});
