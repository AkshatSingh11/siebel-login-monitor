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
    await page.goto('https://access.ex.indianoil.in/oam/server/obrareq.cgi?encquery%3DwuuojoyW8JsrnTFd6VYn%2F86v2WuU5YNS24cCYbV%2FEukwM%2F%2BpcrXRqswqGZuCm5ZLmYg9RizgjK1mZcTEZhh3ouLkN6D2%2Ft0CaGY4dGOHlNKLfQoslqp8oNOWRtEYFCXtNSb6ibktVMAmKP9LrrMOsYGzX85KLroHTuFB2MxXrAE8sKppgrWdCWC921BJN%2FBANy9QyWZFfzgqT6imyvVcD0PvqUQNlc5lc2IYP0N%2BvOWWbvlvUc6OkjgfG%2BkT0Js7kOPuy1IKCjv3Us8wYu5XfI4V5AVeve%2BGR3r0p4yT8jGSZaIwcaWDdUToyQgnJvVNrausz4jSUn72FAZ7964L%2BQ%3D%3D%20agentid%3DSIEBEL_IP24%20ver%3D1%20crmethod%3D2%26cksum%3D50d533f357b7c8942edd8314949c417ece6e08fa&ECID-Context=1.006JiuztxA8Bl3o5oVDCiY00CL8s001YT_%3BkXjE', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    console.log('Login page opened');

    await page.waitForTimeout(5000);

    const frames = page.frames();
    console.log(`Total frames found: ${frames.length}`);

    let loginContext = page;

    // Check main page first
    const mainInputCount = await page
      .locator('input[type="text"]')
      .count();

    if (mainInputCount > 0) {
      console.log('Textbox found in main page');
      loginContext = page;
    } else {
      // Search in frames
      for (const frame of frames) {
        const count = await frame
          .locator('input[type="text"]')
          .count();

        console.log(`Frame input count: ${count}`);

        if (count > 0) {
          console.log('Textbox found in frame');
          loginContext = frame;
          break;
        }
      }
    }

    await loginContext
      .locator('input[type="text"]')
      .first()
      .fill(process.env.SIEBEL_USERNAME);

    console.log('Username entered');

    await loginContext
      .locator('input[type="password"]')
      .fill(process.env.SIEBEL_PASSWORD);

    console.log('Password entered');

    await loginContext
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
