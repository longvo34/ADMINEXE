import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 👈 Đổi port tại đây
    proxy: {
      "/api": {
        target: "https://loopus.nguyenhoangan.site",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
