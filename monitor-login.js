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
      'https://access.ex.indianoil.in/oam/server/obrareq.cgi?encquery%3Dle5JmcaeHHAzivRts8AZRYEA3%2BUAhvgNTRLVryBl5KytzBg2IjeDZF%2BC1AOVj2YFNEfqIm8y2chIRiHDNs9ZR3WOeqqvXeddIfpQLkrkJ21eBgYu65cN0%2BBkePVAZYg5eD9g8cG1LMXJCDWBxmVVlK3h6X5cwCKHpCdIzkosFR4OCFllTRULH2LFWVIF3z7POgtD2BN1ZdzoNjjjcDm4OmTh2w6NyuOg%2BkvVrTgiA%2Bw5JoQBfi6iJmzia%2B%2Fo0AHLczgNf%2B6IH2jMK%2FXT6ohFEOZd2MxnR3UJs9YKMLOVaSMmEKBsvffS4lA%2Fays%2BIgVT3gBgxT9hYK6h2mNgEU51Gg%3D%3D',
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000
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
