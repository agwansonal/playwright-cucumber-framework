##  Codegen Tests Folder

This folder contains **Playwright tests** recorded using the built-in Codegen tool.

> Playwright Codegen helps teams quickly record UI flows as runnable test scripts. This framework supports both raw recorded tests and auto-cleaned **Page Object Model (POM)** compliant versions.

-----

### Codegen Test Creation

#### **How to Use**

1.  **Record your flow** by running the following command in your terminal, replacing the URL with your application's starting point:

    ```bash
    npx playwright codegen https://your-app-url
    ```

2.  **Save the generated test file** under the `tests/codegen/` directory.

      * **Naming Convention:** Give it a clear, descriptive name (e.g., `login-codegen.spec.js`).

3.  **Optional Post-Recording Cleanup:**

      * **i.** Replace direct selectors with **Page Object Model (POM)** methods.
      * **ii.** Move hard-coded URLs to the central configuration file at `/config/urls.js`.
      * **iii.** Use explicit assertions like `expect(page).toHaveURL()` for validations.

4.  **Run your recorded tests** using the designated project configuration:

    ```bash
    npx playwright test --project="Codegen Tests"
    ```

-----

## Codegen Test Cleaner

Playwright’s Codegen feature allows teams to record user flows as runnable tests. However, recorded scripts are often verbose, repetitive, and not aligned with the best-practice **Page Object Model (POM)** structure.

This framework includes a built-in cleaner utility that automatically converts recorded tests into **POM-compliant, maintainable scripts**.

#### **How to Use the Cleaner**

1.  **Record your test** using Playwright Codegen (as shown above):

    ```bash
    npx playwright codegen https://your-app-url
    ```

2.  **Save the generated file** to the codegen folder, for example:
    `/tests/codegen/login-codegen.spec.js`

3.  **Run the cleaner script** by specifying the path to the raw codegen file:

      * **Direct Node command:**
        ```bash
        node utils/codegenCleaner.js tests/codegen/login-codegen.spec.js
        ```
      * **Using the npm script (recommended):**
        ```bash
        npm run clean:codegen -- tests/codegen/login-codegen.spec.js
        ```

4.  **Find the cleaned version** in the dedicated subdirectory:

      * The cleaned file will be located here: `/tests/codegen/cleaned/login-codegen-cleaned.spec.js`