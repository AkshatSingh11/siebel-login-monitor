// Import Playwright browser automation library
const { chromium } = require('playwright');

// Immediately invoked async function
// This starts the script execution
(async () => {

  // Capture start time to measure total login response time
  const startTime = Date.now();

  // Define max allowed login time = 30 seconds
  // If login takes more than this, script will fail
  const threshold = 30000;

  // Launch Chrome browser in headless mode
  // headless: true means browser runs in background (invisible)
  const browser = await chromium.launch({
    headless: true
  });

  // Create a new browser page/tab
  // ignoreHTTPSErrors is needed because SIT/UAT cert may be invalid
  const page = await browser.newPage({
    ignoreHTTPSErrors: true
  });

  try {
    // Open Siebel login page
    // waitUntil: networkidle means wait until page fully loads
    await page.goto(
      'https://access.ex.indianoil.in/oam/server/obrareq.cgi?encquery%3DpyBU%2BFw3MEIMiKdjRu57HREaQDngwcZmCLiSbnCJkjOhe%2BDpcLjES3UytJmECA%2BmXe6%2FoRrbMJDDzuOintSMHMd0hlZzKFYjyUsNCVpYodRUHT3%2BKryHBcKjPotEDjBdqMykgJEIhWN4IDS0xQ9s0Ecim8QJviw2t4ftDocuY1Lln%2Fvi8jYdrno0SIzmz0Q6vrdHrpJYpTbshjHa4YTPGusC7K5LEEIUN96%2B611%2FQBRzeJxDk49bn2CgsQEWHlgreSJqDS9Zsq1%2BhbTMKdtXS8tNGJN6gQ4qvswwGgD2YIb8ivVL1yotQWnq0XbrClj0zWSvO7Tj9QY8%2Fu4VvjPqGA%3D%3D%20agentid%3DSIEBEL_IP24%20ver%3D1%20crmethod%3D2%26cksum%3Dd60496c9c242a96d875c1ccf816c10e211295c3c&ECID-Context=1.006Jin1%5E%5EYOBl3o5oVG7yY0069nh0005bT%3BkXjE',
      {
        waitUntil: 'networkidle',
        timeout: 30000
      }
    );

    // Fill User ID field from GitHub secret / environment variable
    await page
      .getByRole('textbox', { name: 'User ID' })
      .fill(process.env.SIEBEL_USERNAME);

    // Click Continue button
    await page
      .getByRole('button', { name: 'Continue' })
      .click();

    // Fill password field from secret / environment variable
    await page
      .getByRole('textbox', { name: 'Enter your Password' })
      .fill(process.env.SIEBEL_PASSWORD);

    // Click Submit button to login
    await page
      .getByRole('button', { name: 'Submit' })
      .click();

    // Calculate total login time
    const loginTime = Date.now() - startTime;

    // Print login time in logs
    console.log(`Login successful in ${loginTime} ms`);

    // Check if login exceeded threshold
    if (loginTime > threshold) {
      throw new Error(
        `Login time exceeded threshold: ${loginTime} ms`
      );
    }

    // Click Settings menu after successful login
    await page
      .getByRole('menuitem', { name: 'Settings' })
      .click({ timeout: 10000 });

    // Click Logout button
    await page
      .getByRole('button', { name: 'Logout' })
      .click({ timeout: 10000 });

    // Close browser after successful logout
    await browser.close();

    // Exit with success code
    // GitHub will treat this as PASS
    process.exit(0);

  } catch (error) {

    // Print failure reason in logs
    console.error('LOGIN FAILED:', error.message);

    // Close browser even in failure case
    await browser.close();

    // Exit with failure code
    // GitHub workflow will use this to trigger email
    process.exit(1);
  }
})();
