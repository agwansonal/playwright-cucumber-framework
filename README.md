#  Playwright Automation Framework

This is a **scalable Playwright + Page Object Model (POM)** automation framework supporting:
- **Multiple environments** (`dev`, `qa`, `stage`, `prod`)
- **Multiple test types** (POM, Codegen, BDD)
- **Dynamic environment configs via `.env.<env>`**
- **Allure + HTML reporting**, separated per environment
- **CI/CD-ready structure** for Jenkins, GitHub Actions, etc.

---

## Prerequisites & Installation

### 1. Install Node.js
- Install [Node.js ≥ 18](https://nodejs.org/)

### 2. Install dependencies
```bash
npm install
```
### 3. Install Playwright browsers
```bash
npx playwright install
```
### 4. Install Allure
# Install the CLI globally
```bash
npm install -g allure-commandline --save-dev
```

### Environment Setup
Environment files live at the root and control URLs, credentials, and timeout
.env.dev
.env.qa
.env.stage
.env.prod

Example – .env.qa
ENV=qa
BASE_URL=https://qa.myapp.com
USERNAME=qaUser
PASSWORD=qaPass123
API_URL=https://qa-api.myapp.com
TIMEOUT=15000

Each environment file is automatically loaded when you run
npx playwright test --project=<env>


### Run Commands
## Run Environment + Test Type

# QA Environment - POM Tests
npx playwright test --project="QA-POM"

# STAGE - Codegen
npx playwright test --project="STAGE-Codegen"

# DEV - BDD
npx playwright test --project="DEV-BDD"

# Run only POM tests
npx playwright test --project=QA-POM

# Run only Codegen tests
npx playwright test --project=QA-Codegen

# Run both POM + Codegen in QA environment
npx playwright test --project=QA-COMBINED


## Run All Environments for One Test Type
# Run all POM tests across all environments
npx playwright test --grep "POM"

## Run everything (all envs + both test types)
npx playwright test



### Reports & Results
After execution, reports are created as:

/reports
 ├── /allure-results
 │    ├── dev/
 │    │   ├── POM/
 │    │   └── Codegen/
 │    ├── qa/
 │    │   ├── POM/
 │    │   └── Codegen/
 │    └── stage/
 │        ├── POM/
 │        └── Codegen/
 └── /html-results
      ├── dev/
      │   ├── POM/
      │   └── Codegen/
      ├── qa/
      │   ├── POM/
      │   └── Codegen/
      └── stage/
          ├── POM/
          └── Codegen/




# View HTML Report
npx playwright show-report

# Generate Allure Report
# Generate report
allure generate reports/allure-results/qa --clean -o reports/allure-results/qa-report

# Open report
allure open reports/allure-results/qa-report





