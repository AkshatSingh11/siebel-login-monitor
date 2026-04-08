// Import Playwright
const { chromium } = require('playwright');

(async () => {
  const startTime = Date.now();

  // Business SLA threshold
  const threshold = 30000;

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    ignoreHTTPSErrors: true
  });

  try {
    // Open the long Oracle OAM login URL
    await page.goto(
      'https://access.ex.indianoil.in/oam/server/obrareq.cgi?encquery%3DwuuojoyW8JsrnTFd6VYn%2F86v2WuU5YNS24cCYbV%2FEukwM%2F%2BpcrXRqswqGZuCm5ZLmYg9RizgjK1mZcTEZhh3ouLkN6D2%2Ft0CaGY4dGOHlNKLfQoslqp8oNOWRtEYFCXtNSb6ibktVMAmKP9LrrMOsYGzX85KLroHTuFB2MxXrAE8sKppgrWdCWC921BJN%2FBANy9QyWZFfzgqT6imyvVcD0PvqUQNlc5lc2IYP0N%2BvOWWbvlvUc6OkjgfG%2BkT0Js7kOPuy1IKCjv3Us8wYu5XfI4V5AVeve%2BGR3r0p4yT8jGSZaIwcaWDdUToyQgnJvVNrausz4jSUn72FAZ7964L%2BQ%3D%3D%20agentid%3DSIEBEL_IP24%20ver%3D1%20crmethod%3D2%26cksum%3D50d533f357b7c8942edd8314949c417ece6e08fa&ECID-Context=1.006JiuztxA8Bl3o5oVDCiY00CL8s001YT_%3BkXjE',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );

    console.log('Login page opened');

    // Wait for iframe / login UI to render
    await page.waitForTimeout(5000);

    // Access iframe
    const frame = page.frameLocator('iframe');

    // Fill username
    await frame
      .getByRole('textbox', { name: 'User ID' })
      .fill(process.env.SIEBEL_USERNAME);

    console.log('Username entered');

    // Fill password
    await frame
      .getByRole('textbox', { name: 'Password' })
      .fill(process.env.SIEBEL_PASSWORD);

    console.log('Password entered');

    // Click Continue
    await frame
      .getByRole('button', { name: 'Continue' })
      .click();

    console.log('Continue clicked');

    // Wait for post-login page
    await page.waitForLoadState('networkidle', {
      timeout: 60000
    });

    const loginTime = Date.now() - startTime;

    console.log(`Login successful in ${loginTime} ms`);

    // SLA threshold check
    if (loginTime > threshold) {
      throw new Error(
        `Threshold exceeded: ${loginTime} ms`
      );
    }

    // Logout
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

    // Capture screenshot for debugging
    await page.screenshot({
      path: 'login-failure.png',
      fullPage: true
    });

    await browser.close();
    process.exit(1);
  }
})();
