// Import Playwright
const { chromium } = require('playwright');

// Start async function
(async () => {
  // Start timer
  const startTime = Date.now();

  // 30 second threshold
  const threshold = 30000;

  // Launch headless browser
  const browser = await chromium.launch({
    headless: true
  });

  // Create page
  const page = await browser.newPage({
    ignoreHTTPSErrors: true
  });

  try {
    // Open Siebel login page
    await page.goto(
      'https://access.ex.indianoil.in/oam/server/obrareq.cgi?encquery%3DpyBU%2BFw3MEIMiKdjRu57HREaQDngwcZmCLiSbnCJkjOhe%2BDpcLjES3UytJmECA%2BmXe6%2FoRrbMJDDzuOintSMHMd0hlZzKFYjyUsNCVpYodRUHT3%2BKryHBcKjPotEDjBdqMykgJEIhWN4IDS0xQ9s0Ecim8QJviw2t4ftDocuY1Lln%2Fvi8jYdrno0SIzmz0Q6vrdHrpJYpTbshjHa4YTPGusC7K5LEEIUN96%2B611%2FQBRzeJxDk49bn2CgsQEWHlgreSJqDS9Zsq1%2BhbTMKdtXS8tNGJN6gQ4qvswwGgD2YIb8ivVL1yotQWnq0XbrClj0zWSvO7Tj9QY8%2Fu4VvjPqGA%3D%3D',
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      }
    );

    // Wait for username field
    await page.waitForSelector('input[type="text"]', {
      timeout: 30000
    });

    // Fill username
    await page
      .locator('input[type="text"]')
      .first()
      .fill(process.env.SIEBEL_USERNAME);

    console.log('Username entered successfully');

    // Click Continue
    await page
      .getByRole('button', { name: /continue/i })
      .click();

    console.log('Continue clicked');

    // Wait for password field
    await page.waitForSelector('input[type="password"]', {
      timeout: 30000
    });

    // Fill password
    await page
      .locator('input[type="password"]')
      .fill(process.env.SIEBEL_PASSWORD);

    console.log('Password entered successfully');

    // Click Submit
    await page
      .getByRole('button', { name: /submit/i })
      .click();

    console.log('Login submitted');

    // Wait for post-login page to load
    await page.waitForLoadState('networkidle', {
      timeout: 30000
    });

    // Measure total login time
    const loginTime = Date.now() - startTime;

    console.log(`Login successful in ${loginTime} ms`);

    // Threshold check
    if (loginTime > threshold) {
      throw new Error(
        `Threshold exceeded: ${loginTime} ms`
      );
    }

    // Logout logic
    try {
      await page
        .getByRole('menuitem', { name: /settings/i })
        .click({ timeout: 10000 });

      await page
        .getByRole('button', { name: /logout/i })
        .click({ timeout: 10000 });

      console.log('Logout successful');
    } catch (logoutError) {
      console.log(
        'Login successful but logout button not found'
      );
    }

    // Close browser
    await browser.close();

    process.exit(0);

  } catch (error) {
    console.error('LOGIN FAILED:', error.message);

    // Take screenshot for debugging
    await page.screenshot({
      path: 'login-failure.png'
    });

    await browser.close();

    process.exit(1);
  }
})();
