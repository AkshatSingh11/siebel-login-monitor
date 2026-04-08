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
    await page.goto(
      'YOUR_LONG_URL_HERE',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );

    console.log('Login page opened');

    await page.waitForTimeout(5000);

    const frame = page.frameLocator('iframe');

    // Fill first textbox = username
    await frame
      .locator('input[type="text"]')
      .first()
      .fill(process.env.SIEBEL_USERNAME);

    console.log('Username entered');

    // Fill password
    await frame
      .locator('input[type="password"]')
      .fill(process.env.SIEBEL_PASSWORD);

    console.log('Password entered');

    // Click first button
    await frame
      .locator('button')
      .first()
      .click();

    console.log('Continue clicked');

    await page.waitForLoadState('networkidle', {
      timeout: 60000
    });

    const loginTime = Date.now() - startTime;

    console.log(`Login successful in ${loginTime} ms`);

    if (loginTime > threshold) {
      throw new Error(
        `Threshold exceeded: ${loginTime} ms`
      );
    }

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
      path: 'login-failure.png',
      fullPage: true
    });

    await browser.close();
    process.exit(1);
  }
})();
