// Import Playwright
const { chromium } = require('playwright');

(async () => {
  const startTime = Date.now();
  const threshold = 30000;

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    ignoreHTTPSErrors: true
  });

  try {
    // Open login page
    await page.goto(
      'https://sdms.px.indianoil.in/',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );

    // Fill username
    await page
      .getByRole('textbox', { name: 'User ID' })
      .fill(process.env.SIEBEL_USERNAME);

    console.log('Username entered');

    // Fill password
    await page
      .getByRole('textbox', { name: 'Password' })
      .fill(process.env.SIEBEL_PASSWORD);

    console.log('Password entered');

    // Click Continue
    await page
      .getByRole('button', { name: 'Continue' })
      .click();

    console.log('Continue clicked');

    // Wait for home page
    await page.waitForLoadState('networkidle', {
      timeout: 30000
    });

    const loginTime = Date.now() - startTime;

    console.log(`Login successful in ${loginTime} ms`);

    // Threshold validation
    if (loginTime > threshold) {
      throw new Error(
        `Threshold exceeded: ${loginTime} ms`
      );
    }

    // Logout flow
    await page
      .getByRole('menuitem', { name: 'Settings' })
      .click({ timeout: 10000 });

    await page
      .getByRole('button', { name: 'Logout' })
      .click({ timeout: 10000 });

    console.log('Logout successful');

    await browser.close();
    process.exit(0);

  } catch (error) {
    console.error('LOGIN FAILED:', error.message);

    await page.screenshot({
      path: 'login-failure.png'
    });

    await browser.close();
    process.exit(1);
  }
})();
