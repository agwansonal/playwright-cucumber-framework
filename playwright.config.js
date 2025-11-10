const { defineConfig } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// --- Create folders only for the active project ------------------------------
const activeProject = process.env.PLAYWRIGHT_PROJECT || 'DEV-POM';
const [env, type] = activeProject.split('-');
const envDir = (env || 'dev').toLowerCase();
const typeDir = (type || 'pom').toLowerCase();

// Load correct .env
const envFile = path.resolve(`.env.${envDir}`);
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile, override: true });
  console.log(`Loaded environment: ${envDir}`);
} else {
  dotenv.config({ override: true });
  console.warn(`No .env.${envDir} found; using defaults.`);
}

// Define report folders
const allureDir = path.resolve(`reports/allure-results/${envDir}/${typeDir}`);
const htmlDir = path.resolve(`reports/html-results/${envDir}/${typeDir}`);
[allureDir, htmlDir].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

console.log(`[${activeProject}] Allure → ${allureDir}`);
console.log(`[${activeProject}] HTML   → ${htmlDir}`);

// --- Determine which tests to run -------------------------------------------
function getTestMatch(t) {
  const tt = t.toUpperCase();
  if (tt === 'COMBINED')
    return ['**/spec/**/*.spec.js', '**/codegen/**/*.spec.js'];
  if (tt === 'CODEGEN') return '**/codegen/**/*.spec.js';
  if (tt === 'BDD') return '**/BDD/**/*.feature';
  return '**/spec/**/*.spec.js';
}

// --- Final export ------------------------------------------------------------
module.exports = defineConfig({
  testDir: './tests',
  testMatch: getTestMatch(typeDir),
  timeout: 30000,
  retries: 1,
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: allureDir }],
    ['html', { outputFolder: htmlDir, open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
