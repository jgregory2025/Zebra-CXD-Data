import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
 base: '/Zebra-CXD-Data/',   // 👈 EXACT repo name
 plugins: [react()],
})