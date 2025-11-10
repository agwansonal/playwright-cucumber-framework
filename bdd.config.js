// bdd.config.js
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// ===================================================================
// 1️Detect selected Playwright project (like DEV-BDD, QA-BDD, etc.)
// ===================================================================
const activeProject = process.env.PLAYWRIGHT_PROJECT || 'DEV-BDD';
const [envName] = activeProject.split('-');
const env = envName?.toLowerCase() || 'dev';

// ===================================================================
// Load environment variables dynamically (.env.dev, .env.qa, etc.)
// ===================================================================
const envFile = path.resolve(`.env.${env}`);
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile, override: true });
  console.log(`✅ Loaded environment file: ${envFile}`);
} else {
  dotenv.config({ override: true });
  console.warn(`⚠️ No .env.${env} found. Using default .env file.`);
}

// ===================================================================
// Setup consistent Allure report folder (like reports/allure-results/dev/bdd)
// ===================================================================
const allureBDDPath = path.resolve(`reports/allure-results/${env}/bdd`);
fs.mkdirSync(allureBDDPath, { recursive: true });

// ===================================================================
//  Export cucumber config
// ===================================================================
module.exports = {
  default: {
    require: ['tests/bdd/step-definitions/*.js'], // path to BDD steps
    format: [
      'progress',
      `json:${path.join(allureBDDPath, 'results.json')}`
    ],
    parallel: 1,
    timeout: 60000,
    worldParameters: {
      BASE_URL: process.env.BASE_URL,
      HEADLESS: process.env.HEADLESS,
    },
  },
};
