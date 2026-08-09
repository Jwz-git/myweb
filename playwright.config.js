import { defineConfig } from '@playwright/test'
export default defineConfig({ testDir:'./e2e', use:{baseURL:'http://127.0.0.1:4173'}, webServer:{command:'npm run build:vps && npm run preview -w @jwz/web -- --host 127.0.0.1',port:4173,reuseExistingServer:true} })
