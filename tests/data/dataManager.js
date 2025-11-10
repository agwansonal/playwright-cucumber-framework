// tests/data/dataManager.js
const path = require('path');
const fs = require('fs');
const config = require('../../config/config'); // gets environment info

/**
 * Dynamically loads environment-specific test data file
 * Example: testData.qa.js, testData.stage.js, etc.
 */
function loadEnvTestData() {
  const env = config.env || 'dev';
  const fileName = `testData.${env}.js`;
  const filePath = path.join(__dirname, fileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`No environment-specific data file found for "${env}". Using default "testData.dev.js".`);
    return require(path.join(__dirname, 'testData.dev.js'));
  }

  console.log(`Loaded test data for environment: ${env}`);
  return require(filePath);
}

const { testData } = loadEnvTestData();

module.exports = { testData };
