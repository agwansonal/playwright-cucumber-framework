/**
 * codegenCleaner.js
 * -------------------
 * Cleans Playwright Codegen scripts to match the POM framework.
 *
 * Usage:
 *   node utils/codegenCleaner.js <inputFile>
 *
 * Example:
 *   node utils/codegenCleaner.js tests/codegen/login-codegen.spec.js
 *
 * Output:
 *   tests/codegen/cleaned/login-codegen-cleaned.spec.js
 */

const fs = require('fs');
const path = require('path');

const CLEANED_DIR = path.join(process.cwd(), 'tests', 'codegen', 'cleaned');

// Regex patterns to identify common Playwright commands
const patterns = {
  goto: /await page\.goto\(['"`](.*?)['"`]\);?/g,
  fill: /await page\.fill\(['"`](.*?)['"`],\s*['"`](.*?)['"`]\);?/g,
  click: /await page\.click\(['"`](.*?)['"`]\);?/g,
  expectURL: /await expect\(page\)\.toHaveURL\((.*?)\);?/g,
};

// Helper: ensure folder exists
function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanCodegenScript(filePath) {
  const rawCode = fs.readFileSync(filePath, 'utf8');
  let cleanedCode = rawCode;

  // --- Replace `page.goto` with comment using config URL reference ---
  cleanedCode = cleanedCode.replace(patterns.goto, (_, url) => {
    const urlName = url.replace(/https?:\/\//, '').replace(/[^\w]/g, '_');
    return `// Navigating to configured URL\nawait page.goto(config.urls.${urlName} || '${url}');`;
  });

  // --- Replace `page.fill` with BasePage.enterText ---
  cleanedCode = cleanedCode.replace(patterns.fill, (_, selector, value) => {
    return `await base.enterText(page.locator('${selector}'), '${value}');`;
  });

  // --- Replace `page.click` with BasePage.click ---
  cleanedCode = cleanedCode.replace(patterns.click, (_, selector) => {
    return `await base.click(page.locator('${selector}'));`;
  });

  // --- Replace URL assertions ---
  cleanedCode = cleanedCode.replace(patterns.expectURL, (_, urlMatch) => {
    return `await expect(page).toHaveURL(${urlMatch});`;
  });

  // --- Insert imports and BasePage setup ---
  if (!cleanedCode.includes('BasePage')) {
    cleanedCode = cleanedCode.replace(
      /(import\s+\{?\s*test[^\n]*\n)/,
      `$1import { BasePage } from '../../pages/BasePage';\nimport * as config from '../../config/urls';\n\n`
    );
  }

  // --- Add BasePage initialization after test start ---
  cleanedCode = cleanedCode.replace(
    /(async\s*\(\{\s*page\s*\}\)\s*=>\s*\{)/,
    `$1\n  const base = new BasePage(page);`
  );

  // --- Add header comment ---
  const headerComment = `/**
 * AUTO-GENERATED CLEAN TEST
 * This file was cleaned using utils/codegenCleaner.js
 * Original: ${path.basename(filePath)}
 * Generated on: ${new Date().toLocaleString()}
 */\n\n`;
  cleanedCode = headerComment + cleanedCode;

  // --- Save cleaned file ---
  ensureDirExists(CLEANED_DIR);
  const fileName = path.basename(filePath).replace('.spec.js', '-cleaned.spec.js');
  const outputFilePath = path.join(CLEANED_DIR, fileName);
  fs.writeFileSync(outputFilePath, cleanedCode, 'utf8');

  console.log(`Cleaned test created at: ${outputFilePath}`);
}

// CLI runner
const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Please provide a Codegen test file path.\nExample: node utils/codegenCleaner.js tests/codegen/login-codegen.spec.js');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`File not found: ${inputFile}`);
  process.exit(1);
}

cleanCodegenScript(inputFile);
