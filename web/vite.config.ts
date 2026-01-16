import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

const ENV_DIR_PATH = path.resolve(__dirname, "..");

export default defineConfig({
  plugins: [react()],
  envDir: ENV_DIR_PATH
})
