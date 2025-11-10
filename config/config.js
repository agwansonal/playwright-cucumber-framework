// config/config.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function loadEnv() {
  const envName = process.env.PLAYWRIGHT_PROJECT_NAME || 'dev'; // Auto from Playwright project
  const envFile = path.resolve(process.cwd(), `.env.${envName}`);

  console.log(`Loading environment: ${envName}`);
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  } else {
    console.warn(`No .env.${envName} found. Falling back to .env`);
    dotenv.config();
  }

  return envName;
}

const env = loadEnv();

const config = {
  env,
  urls: {
    base: process.env.BASE_URL,
    login: '/login',
    dashboard: '/dashboard',
  },
  credentials: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  api: {
    base: process.env.API_URL,
  },
  timeouts: {
    default: parseInt(process.env.TIMEOUT || '10000'),
  },
  reportsDir: path.resolve(`reports/${env}`),
};

module.exports = config;
