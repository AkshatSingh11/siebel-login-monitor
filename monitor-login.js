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
      'https://access.ex.indianoil.in/oam/server/obrareq.cgi?encquery%3DpyBU%2BFw3MEIMiKdjRu57HREaQDngwcZmCLiSbnCJkjOhe%2BDpcLjES3UytJmECA%2BmXe6%2FoRrbMJDDzuOintSMHMd0hlZzKFYjyUsNCVpYodRUHT3%2BKryHBcKjPotEDjBdqMykgJEIhWN4IDS0xQ9s0Ecim8QJviw2t4ftDocuY1Lln%2Fvi8jYdrno0SIzmz0Q6vrdHrpJYpTbshjHa4YTPGusC7K5LEEIUN96%2B611%2FQBRzeJxDk49bn2CgsQEWHlgreSJqDS9Zsq1%2BhbTMKdtXS8tNGJN6gQ4qvswwGgD2YIb8ivVL1yotQWnq0XbrClj0zWSvO7Tj9QY8%2Fu4VvjPqGA%3D%3D%20agentid%3DSIEBEL_IP24%20ver%3D1%20crmethod%3D2%26cksum%3Dd60496c9c242a96d875c1ccf816c10e211295c3c&ECID-Context=1.006Jin1%5E%5EYOBl3o5oVG7yY0069nh0005bT%3BkXjE',
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
